import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/auth";
import { checkRateLimit, clientIpFrom } from "@/lib/security/rate-limit";
import { auditLog } from "@/lib/security/audit";

// A fixed, syntactically valid bcrypt hash that doesn't correspond to any
// real account or password. Comparing against it on the "no such user"
// path below costs roughly the same time as a real failed password check,
// so the login endpoint can't be used to enumerate registered emails by
// timing the response (an instant reply only on nonexistent accounts would
// leak that).
const DUMMY_HASH = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

export async function POST(req: NextRequest) {
  const ip = clientIpFrom(req);
  const rateLimit = checkRateLimit(`login:${ip}`, { max: 10, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again shortly." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  // Deliberately generic error message — never reveal whether the email exists.
  const genericError = NextResponse.json(
    { error: "Invalid email or password" },
    { status: 401 }
  );

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    await verifyPassword(password, DUMMY_HASH);
    await auditLog(null, "LOGIN_FAILED", "User", undefined, { email });
    return genericError;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    await auditLog(user.id, "LOGIN_FAILED", "User", user.id);
    return genericError;
  }

  await createSession({ userId: user.id, role: user.role, email: user.email });
  await auditLog(user.id, "LOGIN_SUCCEEDED", "User", user.id);

  return NextResponse.json({ id: user.id, email: user.email, role: user.role });
}
