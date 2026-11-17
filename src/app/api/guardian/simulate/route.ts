import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { guardianSimulatorSchema } from "@/lib/validation/guardian";
import { guardianService } from "@/services/guardian.service";
import { PermissionError } from "@/lib/permissions";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const rateLimit = checkRateLimit(`guardian-simulator:${session.userId}`, {
    max: 12,
    windowMs: 10 * 60_000,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many simulated alerts. Wait a few minutes before retrying." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = guardianSimulatorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid simulator input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const result = await guardianService.triggerSimulatedSOS(parsed.data, {
      id: session.userId,
      role: session.role,
    });
    return NextResponse.json(
      {
        eventId: result.sosEvent.id,
        incidentId: result.incident.id,
        incidentStatus: result.incident.status,
        notice: "Simulated remote created a genuine ReliefMesh incident.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof PermissionError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }
}
