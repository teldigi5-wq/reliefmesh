import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { pushTokenSchema, removePushTokenSchema } from "@/lib/validation/push-token";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const parsed = pushTokenSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid push token" }, { status: 400 });

  await prisma.pushToken.upsert({
    where: { token: parsed.data.token },
    update: { userId: session.userId, platform: parsed.data.platform },
    create: { userId: session.userId, ...parsed.data },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const parsed = removePushTokenSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid push token" }, { status: 400 });

  await prisma.pushToken.deleteMany({ where: { token: parsed.data.token, userId: session.userId } });
  return NextResponse.json({ ok: true });
}
