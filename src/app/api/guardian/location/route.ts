import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

// SIMULATED / TEST endpoint — see src/app/api/guardian/sos/route.ts for context.
// Appends a location-history row rather than overwriting the device's last
// position, per the requirement to retain history.

const locationUpdateSchema = z.object({
  deviceSerial: z.string().min(3),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export async function POST(req: NextRequest) {
  const providedSecret = req.headers.get("x-guardian-device-secret");
  const expectedSecret = process.env.GUARDIAN_DEVICE_API_SECRET;

  if (!expectedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized device" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = locationUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { deviceSerial, latitude, longitude } = parsed.data;

  const device = await prisma.guardianDevice.findUnique({
    where: { deviceSerial },
  });
  if (!device) {
    return NextResponse.json({ error: "Unknown device" }, { status: 404 });
  }

  const update = await prisma.locationUpdate.create({
    data: { deviceId: device.id, latitude, longitude },
  });

  await prisma.guardianDevice.update({
    where: { id: device.id },
    data: { lastSeenAt: new Date() },
  });

  return NextResponse.json(update, { status: 201 });
}
