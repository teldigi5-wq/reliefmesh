import { notificationRepository } from "@/repositories/notification.repository";
import { prisma } from "@/lib/db/prisma";
import { pushService } from "@/services/push.service";
import type { IncidentStatus, NotificationType } from "@prisma/client";

type NotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedIncidentId?: string;
};

async function createWithPush(input: NotificationInput) {
  await notificationRepository.create(input);
  await pushService
    .sendToUser(input.userId, {
      title: input.title,
      message: input.message,
      incidentId: input.relatedIncidentId,
    })
    .catch((error) => console.error("Push notification delivery failed", error));
}

async function createManyWithPush(inputs: NotificationInput[]) {
  await notificationRepository.createMany(inputs);
  await Promise.allSettled(
    inputs.map((input) =>
      pushService.sendToUser(input.userId, {
        title: input.title,
        message: input.message,
        incidentId: input.relatedIncidentId,
      })
    )
  );
}

/**
 * Notification side-effects for incident events. Kept as its own service
 * (rather than inline in incident.service.ts) so the incident lifecycle
 * logic doesn't need to know about notification mechanics — it just calls
 * one of these after a successful transition.
 */
export const notificationService = {
  async forNewCriticalIncident(incidentId: string) {
    const incident = await prisma.incident.findUnique({
      where: { id: incidentId },
      select: { title: true, severity: true },
    });
    if (!incident || incident.severity !== "CRITICAL") return;

    const operators = await prisma.user.findMany({
      where: { role: { in: ["OPERATOR", "ADMIN"] }, isActive: true },
      select: { id: true },
    });
    await createManyWithPush(
      operators.map((operator) => ({
        userId: operator.id,
        type: "NEW_CRITICAL_INCIDENT" as const,
        title: `New critical SOS: ${incident.title}`,
        message: "Review the incident and assign the nearest available responder.",
        relatedIncidentId: incidentId,
      }))
    );
  },

  async forOwnStatusChange(incidentId: string, toStatus: IncidentStatus) {
    const incident = await prisma.incident.findUnique({
      where: { id: incidentId },
      select: { title: true, reportedById: true, severity: true },
    });
    if (!incident) return;

    await createWithPush({
      userId: incident.reportedById,
      type: "STATUS_CHANGED",
      title: `Incident update: ${incident.title}`,
      message: `Your report is now ${toStatus.replace(/_/g, " ")}.`,
      relatedIncidentId: incidentId,
    });

    if (toStatus === "VERIFIED") {
      await createWithPush({
        userId: incident.reportedById,
        type: "INCIDENT_VERIFIED",
        title: `Incident verified: ${incident.title}`,
        message: "An operator has verified your report and is coordinating a response.",
        relatedIncidentId: incidentId,
      });
    }

    // Fan out to every operator/admin when a CRITICAL incident first
    // appears, so no one has to be watching the dashboard to notice.
    if (toStatus === "VERIFIED" && incident.severity === "CRITICAL") {
      const operators = await prisma.user.findMany({
        where: { role: { in: ["OPERATOR", "ADMIN"] }, isActive: true },
        select: { id: true },
      });
      await createManyWithPush(
        operators.map((op) => ({
          userId: op.id,
          type: "NEW_CRITICAL_INCIDENT" as const,
          title: `Critical incident verified: ${incident.title}`,
          message: "A critical-severity incident needs a responder assigned.",
          relatedIncidentId: incidentId,
        }))
      );
    }
  },

  async forAssignment(incidentId: string, volunteerUserId: string) {
    const incident = await prisma.incident.findUnique({
      where: { id: incidentId },
      select: { title: true },
    });
    if (!incident) return;

    await createWithPush({
      userId: volunteerUserId,
      type: "RESPONDER_ASSIGNED",
      title: `You've been assigned: ${incident.title}`,
      message: "Open the incident to see details and start responding.",
      relatedIncidentId: incidentId,
    });
  },

  async listForUser(userId: string) {
    const [notifications, unreadCount] = await Promise.all([
      notificationRepository.findForUser(userId),
      notificationRepository.countUnread(userId),
    ]);
    return { notifications, unreadCount };
  },

  async markRead(id: string, userId: string) {
    return notificationRepository.markRead(id, userId);
  },

  async markAllRead(userId: string) {
    return notificationRepository.markAllRead(userId);
  },
};
