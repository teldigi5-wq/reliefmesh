import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { volunteerService } from "@/services/volunteer.service";
import { upsertVolunteerSchema } from "@/lib/validation/volunteer";
import { PermissionError } from "@/lib/permissions";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const volunteers = await volunteerService.listAll({ role: session.role });
    return NextResponse.json(volunteers);
  } catch (err) {
    if (err instanceof PermissionError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    throw err;
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = upsertVolunteerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const volunteer = await volunteerService.registerSelf(parsed.data, {
      id: session.userId,
      role: session.role,
    });
    return NextResponse.json(volunteer, { status: 201 });
  } catch (err) {
    if (err instanceof PermissionError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    throw err;
  }
}
