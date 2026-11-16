import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { incidentService } from "@/services/incident.service";
import { PermissionError } from "@/lib/permissions";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const incident = await incidentService.getById(params.id, {
      id: session.userId,
      role: session.role,
    });
    if (!incident) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(incident);
  } catch (err) {
    if (err instanceof PermissionError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    throw err;
  }
}
