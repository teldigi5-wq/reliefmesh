import { prisma } from "@/lib/db/prisma";
import type { IncidentStatus } from "@prisma/client";
import type { CreateIncidentInput } from "@/lib/validation/incident";

const detailInclude = {
  reportedBy: { select: { id: true, fullName: true, email: true } },
  verifiedBy: { select: { id: true, fullName: true, email: true } },
  updates: { orderBy: { createdAt: "asc" as const } },
  assignments: {
    include: {
      volunteer: {
        include: { user: { select: { id: true, fullName: true, email: true } } },
      },
    },
  },
};

export const incidentRepository = {
  create(data: CreateIncidentInput, reportedById: string) {
    return prisma.incident.create({
      data: { ...data, reportedById },
    });
  },

  findById(id: string) {
    return prisma.incident.findUnique({
      where: { id },
      include: detailInclude,
    });
  },

  findMany(filters: { status?: IncidentStatus; reportedById?: string }) {
    return prisma.incident.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
      include: {
        assignments: { select: { volunteerId: true, status: true } },
      },
    });
  },

  // Incidents a given volunteer (by userId) has been assigned to — used so
  // responders can see incidents even though they didn't report them.
  findAssignedToUser(userId: string) {
    return prisma.incident.findMany({
      where: { assignments: { some: { volunteer: { userId } } } },
      orderBy: { createdAt: "desc" },
      include: {
        assignments: { select: { volunteerId: true, status: true } },
      },
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
        include: detailInclude,
      });
    });
  },

  // Creates the assignment and moves the incident to ASSIGNED in one
  // transaction, with an audit row, so the two can never disagree.
  assignVolunteer(
    incidentId: string,
    volunteerId: string,
    assignedById: string
  ) {
    return prisma.$transaction(async (tx) => {
      const current = await tx.incident.findUniqueOrThrow({
        where: { id: incidentId },
      });

      const assignment = await tx.responderAssignment.create({
        data: { incidentId, volunteerId, assignedById, status: "PENDING" },
      });

      await tx.incidentUpdate.create({
        data: {
          incidentId,
          fromStatus: current.status,
          toStatus: "ASSIGNED",
          note: "Responder assigned",
          createdById: assignedById,
        },
      });

      const incident = await tx.incident.update({
        where: { id: incidentId },
        data: { status: "ASSIGNED" },
        include: detailInclude,
      });

      return { incident, assignment };
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
