import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

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
  const providedSecret = req.headers.get("x-guardian-device-secret");
  const expectedSecret = process.env.GUARDIAN_DEVICE_API_SECRET;

  if (!expectedSecret || providedSecret !== expectedSecret) {
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

  return NextResponse.json(
    { ...sosEvent, notice: "SIMULATED TEST EVENT — no physical device involved" },
    { status: 201 }
  );
}
