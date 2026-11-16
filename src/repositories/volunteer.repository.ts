import { prisma } from "@/lib/db/prisma";
import type { UpsertVolunteerInput } from "@/lib/validation/volunteer";

export const volunteerRepository = {
  upsertForUser(userId: string, data: UpsertVolunteerInput) {
    return prisma.volunteer.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
  },

  findByUserId(userId: string) {
    return prisma.volunteer.findUnique({ where: { userId } });
  },

  findAll() {
    return prisma.volunteer.findMany({
      include: { user: { select: { fullName: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  findAvailable() {
    return prisma.volunteer.findMany({
      where: { isAvailable: true },
      include: { user: { select: { fullName: true, email: true } } },
    });
  },

  findById(id: string) {
    return prisma.volunteer.findUnique({ where: { id } });
  },
};
