import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { incidentService, InvalidTransitionError } from "@/services/incident.service";
import { assignVolunteerSchema } from "@/lib/validation/volunteer";
import { PermissionError } from "@/lib/permissions";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = assignVolunteerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const result = await incidentService.assignResponder(
      params.id,
      parsed.data.volunteerId,
      { id: session.userId, role: session.role }
    );
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof PermissionError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err instanceof InvalidTransitionError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    throw err;
  }
}
