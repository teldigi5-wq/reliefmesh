import { prisma } from "@/lib/db/prisma";
import type { IncidentStatus } from "@prisma/client";
import type { CreateIncidentInput } from "@/lib/validation/incident";

export const incidentRepository = {
  create(data: CreateIncidentInput, reportedById: string) {
    return prisma.incident.create({
      data: { ...data, reportedById },
    });
  },

  findById(id: string) {
    return prisma.incident.findUnique({
      where: { id },
      include: { reportedBy: true, verifiedBy: true, updates: true },
    });
  },

  findMany(filters: { status?: IncidentStatus; reportedById?: string }) {
    return prisma.incident.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
    });
  },

  updateStatus(
    id: string,
    toStatus: IncidentStatus,
    createdById: string,
    note?: string
  ) {
    return prisma.$transaction(async (tx) => {
      const current = await tx.incident.findUniqueOrThrow({ where: { id } });

      await tx.incidentUpdate.create({
        data: {
          incidentId: id,
          fromStatus: current.status,
          toStatus,
          note,
          createdById,
        },
      });

      return tx.incident.update({
        where: { id },
        data: {
          status: toStatus,
          ...(toStatus === "VERIFIED"
            ? { verifiedById: createdById, verifiedAt: new Date() }
            : {}),
        },
      });
    });
  },

  countByStatus() {
    return prisma.incident.groupBy({
      by: ["status"],
      _count: { _all: true },
    });
  },

  countBySeverity() {
    return prisma.incident.groupBy({
      by: ["severity"],
      _count: { _all: true },
    });
  },
};
