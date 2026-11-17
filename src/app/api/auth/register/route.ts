import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { registerSchema } from "@/lib/validation/auth";
import { checkRateLimit, clientIpFrom } from "@/lib/security/rate-limit";
import { auditLog } from "@/lib/security/audit";

export async function POST(req: NextRequest) {
  const ip = clientIpFrom(req);
  const rateLimit = checkRateLimit(`register:${ip}`, { max: 5, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many registration attempts. Try again shortly." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { fullName, email, password, phone } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      phone,
      passwordHash,
      role: "CITIZEN", // self-registration is always CITIZEN; other roles are provisioned by an admin
    },
  });

  const token = await createSession({
    userId: user.id,
    role: user.role,
    email: user.email,
  });
  await auditLog(user.id, "USER_REGISTERED", "User", user.id);

  return NextResponse.json(
    { id: user.id, email: user.email, role: user.role, token },
    { status: 201 }
  );
}
