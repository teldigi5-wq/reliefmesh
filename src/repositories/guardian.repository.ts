import { prisma } from "@/lib/db/prisma";

export const guardianRepository = {
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
