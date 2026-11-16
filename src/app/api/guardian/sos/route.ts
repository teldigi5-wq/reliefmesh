import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { checkRateLimit, clientIpFrom } from "@/lib/security/rate-limit";
import { timingSafeEqualStrings } from "@/lib/security/timing-safe-equal";
import { auditLog } from "@/lib/security/audit";

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

const sosEventSchema = z.object({
  deviceSerial: z.string().min(3),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  batteryPct: z.number().min(0).max(100).optional(),
});

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
  const parsed = sosEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { deviceSerial, latitude, longitude, batteryPct } = parsed.data;

  const device = await prisma.guardianDevice.upsert({
    where: { deviceSerial },
    create: { deviceSerial, status: "ACTIVE", batteryPct, lastSeenAt: new Date() },
    update: { status: "ACTIVE", batteryPct, lastSeenAt: new Date() },
  });

  const sosEvent = await prisma.sOSEvent.create({
    data: {
      deviceId: device.id,
      latitude,
      longitude,
      isSimulated: true, // hard-coded: this route never produces a real event
    },
  });

  await auditLog(null, "GUARDIAN_SOS_SIMULATED", "SOSEvent", sosEvent.id, {
    deviceSerial,
  });

  return NextResponse.json(
    { ...sosEvent, notice: "SIMULATED TEST EVENT — no physical device involved" },
    { status: 201 }
  );
}
