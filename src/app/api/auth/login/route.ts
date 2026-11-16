import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/auth";

export async function POST(req: NextRequest) {
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
  if (!user || !user.isActive) return genericError;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return genericError;

  await createSession({ userId: user.id, role: user.role, email: user.email });

  return NextResponse.json({ id: user.id, email: user.email, role: user.role });
}
