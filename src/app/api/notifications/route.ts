import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { notificationService } from "@/services/notification.service";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const data = await notificationService.listForUser(session.userId);
  return NextResponse.json(data);
}
