import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { notificationService } from "@/services/notification.service";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  await notificationService.markRead(params.id, session.userId);
  return NextResponse.json({ ok: true });
}
