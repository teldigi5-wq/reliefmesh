import { prisma } from "@/lib/db/prisma";
import type { NotificationType } from "@prisma/client";

export const notificationRepository = {
  create(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    relatedIncidentId?: string;
  }) {
    return prisma.notification.create({ data });
  },

  createMany(
    notifications: {
      userId: string;
      type: NotificationType;
      title: string;
      message: string;
      relatedIncidentId?: string;
    }[]
  ) {
    if (notifications.length === 0) return Promise.resolve({ count: 0 });
    return prisma.notification.createMany({ data: notifications });
  },

  findForUser(userId: string, limit = 20) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  countUnread(userId: string) {
    return prisma.notification.count({ where: { userId, isRead: false } });
  },

  markRead(id: string, userId: string) {
    // Scoped to userId so one user can never mark another's notification read.
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  },

  markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },
};
