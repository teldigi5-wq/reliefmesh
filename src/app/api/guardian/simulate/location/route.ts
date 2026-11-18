import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { guardianSimulatorLocationSchema } from "@/lib/validation/guardian";
import { guardianService } from "@/services/guardian.service";
import { PermissionError } from "@/lib/permissions";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const rateLimit = checkRateLimit(
    "guardian-live-location:" + session.userId,
    { max: 180, windowMs: 10 * 60_000 }
  );
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Live-location update limit reached" },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = guardianSimulatorLocationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid live-location telemetry", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const result = await guardianService.updateSimulatedLocation(parsed.data, {
      id: session.userId,
      role: session.role,
    });
    if (!result) {
      return NextResponse.json(
        { error: "The simulated SOS event was not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        ok: true,
        eventId: result.eventId,
        incidentId: result.incidentId,
        recordedAt: result.location.recordedAt,
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
