import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, clientIpFrom } from "@/lib/security/rate-limit";
import { timingSafeEqualStrings } from "@/lib/security/timing-safe-equal";
import { auditLog } from "@/lib/security/audit";
import { guardianSOSSchema } from "@/lib/validation/guardian";
import { guardianService } from "@/services/guardian.service";

/**
 * SIMULATED / TEST endpoint only.
 *
 * No physical Guardian SOS device exists yet. This route is the API contract
 * a future device would call, so the backend can be built against it now.
 * Every event created here is tagged isSimulated: true and the route
 * requires GUARDIAN_DEVICE_API_SECRET so it cannot be hit accidentally.
 *
 * Use scripts/simulate-sos.ts (or any HTTP client) to send a test event —
 * see docs/GUARDIAN.md.
 */

export async function POST(req: NextRequest) {
  const ip = clientIpFrom(req);
  const rateLimit = checkRateLimit(`guardian-sos:${ip}`, { max: 20, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const providedSecret = req.headers.get("x-guardian-device-secret") ?? "";
  const expectedSecret = process.env.GUARDIAN_DEVICE_API_SECRET ?? "";

  // Constant-time comparison — a naive !== leaks how many leading characters
  // matched via response timing, which matters for a bearer-secret endpoint
  // like this one (no per-device credentials yet, see docs/GUARDIAN.md).
  if (!expectedSecret || !timingSafeEqualStrings(providedSecret, expectedSecret)) {
    await auditLog(null, "GUARDIAN_AUTH_FAILED", "GuardianDevice", undefined, { ip });
    return NextResponse.json({ error: "Unauthorized device" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = guardianSOSSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const result = await guardianService.triggerDeviceSOS({
      ...parsed.data,
      category: "OTHER",
      description: "Emergency submitted by the simulated Guardian hardware API.",
      networkType: "GPRS",
      locationSource: "SIMULATED_GPS",
    });

    return NextResponse.json(
      {
        ...result.sosEvent,
        incidentId: result.incident.id,
        notice:
          "SIMULATED TEST EVENT — a genuine linked incident was created; no physical device involved",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Guardian SOS failed", error);
    return NextResponse.json(
      { error: "Guardian SOS could not create an incident" },
      { status: 503 }
    );
  }
}
