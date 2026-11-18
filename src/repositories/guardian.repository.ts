import { prisma } from "@/lib/db/prisma";
import type {
  GuardianSimulatorInput,
  GuardianSimulatorLocationInput,
} from "@/lib/validation/guardian";

export const guardianRepository = {
  createSimulatedSOSIncident(input: GuardianSimulatorInput, reportedById: string) {
    return prisma.$transaction(async (tx) => {
      const now = new Date();
      const device = await tx.guardianDevice.upsert({
        where: { deviceSerial: input.deviceSerial },
        create: {
          deviceSerial: input.deviceSerial,
          label: "Virtual Guardian remote",
          status: "ACTIVE",
          batteryPct: input.batteryPct,
          lastSeenAt: now,
        },
        update: {
          status: "ACTIVE",
          batteryPct: input.batteryPct,
          lastSeenAt: now,
        },
      });

      const incident = await tx.incident.create({
        data: {
          title: `Guardian SOS — ${input.deviceSerial}`,
          description:
            input.description ||
            `Simulated Guardian remote alert via ${input.networkType}. Location source: ${input.locationSource}.`,
          category: input.category,
          severity: "CRITICAL",
          latitude: input.latitude,
          longitude: input.longitude,
          address: `${input.locationSource.replace(/_/g, " ")} · simulated device telemetry`,
          reportedById,
        },
      });

      const sosEvent = await tx.sOSEvent.create({
        data: {
          deviceId: device.id,
          incidentId: incident.id,
          latitude: input.latitude,
          longitude: input.longitude,
          isSimulated: true,
        },
      });

      return { device, incident, sosEvent };
    });
  },

  updateSimulatedSOSLocation(
    input: GuardianSimulatorLocationInput,
    reportedById: string
  ) {
    return prisma.$transaction(async (tx) => {
      const event = await tx.sOSEvent.findFirst({
        where: {
          incidentId: input.incidentId,
          isSimulated: true,
          device: { deviceSerial: input.deviceSerial },
          incident: { reportedById },
        },
        select: { id: true, deviceId: true, incidentId: true },
      });
      if (!event?.incidentId) return null;

      const now = new Date();
      const [location] = await Promise.all([
        tx.locationUpdate.create({
          data: {
            deviceId: event.deviceId,
            latitude: input.latitude,
            longitude: input.longitude,
          },
        }),
        tx.guardianDevice.update({
          where: { id: event.deviceId },
          data: { lastSeenAt: now, batteryPct: input.batteryPct },
        }),
        tx.sOSEvent.update({
          where: { id: event.id },
          data: { latitude: input.latitude, longitude: input.longitude },
        }),
        tx.incident.update({
          where: { id: event.incidentId },
          data: {
            latitude: input.latitude,
            longitude: input.longitude,
            address: "LIVE PHONE GPS · simulated Guardian telemetry",
          },
        }),
      ]);

      return { eventId: event.id, incidentId: event.incidentId, location };
    });
  },

  async findSystemReporterId(preferredEmail?: string) {
    if (preferredEmail) {
      const preferred = await prisma.user.findFirst({
        where: {
          email: preferredEmail,
          role: { in: ["ADMIN", "OPERATOR"] },
          isActive: true,
        },
        select: { id: true },
      });
      if (preferred) return preferred.id;
    }

    const fallback = await prisma.user.findFirst({
      where: { role: { in: ["ADMIN", "OPERATOR"] }, isActive: true },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });
    return fallback?.id ?? null;
  },

  findAllDevices() {
    return prisma.guardianDevice.findMany({
      orderBy: { lastSeenAt: "desc" },
    });
  },

  findRecentSOSEvents(limit = 50) {
    return prisma.sOSEvent.findMany({
      orderBy: { triggeredAt: "desc" },
      take: limit,
      include: { device: true, incident: { select: { id: true, title: true } } },
    });
  },

  findLocationHistory(deviceId: string, limit = 100) {
    return prisma.locationUpdate.findMany({
      where: { deviceId },
      orderBy: { recordedAt: "desc" },
      take: limit,
    });
  },
};
