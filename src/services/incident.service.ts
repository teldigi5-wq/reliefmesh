import { incidentRepository } from "@/repositories/incident.repository";
import { volunteerRepository } from "@/repositories/volunteer.repository";
import { notificationService } from "@/services/notification.service";
import { hasPermission } from "@/lib/permissions";
import type { Role, IncidentStatus } from "@prisma/client";
import type { CreateIncidentInput } from "@/lib/validation/incident";
import { PermissionError } from "@/lib/permissions";

type Actor = { id: string; role: Role };

// Valid forward transitions. Keeps the lifecycle honest — you can't jump
// from REPORTED straight to RESOLVED, and nothing moves backwards.
const ALLOWED_TRANSITIONS: Record<IncidentStatus, IncidentStatus[]> = {
  REPORTED: ["UNDER_REVIEW", "VERIFIED"],
  UNDER_REVIEW: ["VERIFIED"],
  VERIFIED: ["ASSIGNED"],
  ASSIGNED: ["RESPONDING"],
  RESPONDING: ["RESOLVED"],
  RESOLVED: ["CLOSED"],
  CLOSED: [],
};

export class InvalidTransitionError extends Error {}

export const incidentService = {
  async reportIncident(input: CreateIncidentInput, actor: Actor) {
    if (!hasPermission(actor.role, "incident:report")) {
      throw new PermissionError("Not permitted to report incidents");
    }
    return incidentRepository.create(input, actor.id);
  },

  async listIncidents(actor: Actor) {
    if (hasPermission(actor.role, "incident:view_all")) {
      return incidentRepository.findMany({});
    }

    if (actor.role === "RESPONDER") {
      // Responders see incidents they reported *and* incidents they're
      // assigned to — merge and de-duplicate by id.
      const [own, assigned] = await Promise.all([
        incidentRepository.findMany({ reportedById: actor.id }),
        incidentRepository.findAssignedToUser(actor.id),
      ]);
      const byId = new Map([...own, ...assigned].map((i) => [i.id, i]));
      return Array.from(byId.values()).sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    }

    return incidentRepository.findMany({ reportedById: actor.id });
  },

  async getById(id: string, actor: Actor) {
    const incident = await incidentRepository.findById(id);
    if (!incident) return null;

    if (hasPermission(actor.role, "incident:view_all")) return incident;

    const isOwner = incident.reportedBy.id === actor.id;
    const isAssignedToActor = incident.assignments.some(
      (a) => a.volunteer.user.id === actor.id
    );

    if (isOwner || (actor.role === "RESPONDER" && isAssignedToActor)) {
      return incident;
    }

    throw new PermissionError("Not permitted to view this incident");
  },

  async transitionStatus(
    incidentId: string,
    toStatus: IncidentStatus,
    actor: Actor,
    note?: string
  ) {
    if (!hasPermission(actor.role, "incident:update_status")) {
      throw new PermissionError("Not permitted to update incident status");
    }
    if (
      toStatus === "VERIFIED" &&
      !hasPermission(actor.role, "incident:verify")
    ) {
      throw new PermissionError("Not permitted to verify incidents");
    }

    const current = await incidentRepository.findById(incidentId);
    if (!current) throw new Error("Incident not found");

    if (!ALLOWED_TRANSITIONS[current.status].includes(toStatus)) {
      throw new InvalidTransitionError(
        `Cannot move an incident from ${current.status} to ${toStatus}`
      );
    }

    const updated = await incidentRepository.updateStatus(
      incidentId,
      toStatus,
      actor.id,
      note
    );

    // Notification failures should never break the status update itself —
    // the transition already committed. Log and move on.
    try {
      await notificationService.forOwnStatusChange(incidentId, toStatus);
    } catch (notifyErr) {
      console.error("Failed to send status-change notification", notifyErr);
    }

    return updated;
  },

  async assignResponder(incidentId: string, volunteerId: string, actor: Actor) {
    if (!hasPermission(actor.role, "incident:assign")) {
      throw new PermissionError("Not permitted to assign responders");
    }

    const incident = await incidentRepository.findById(incidentId);
    if (!incident) throw new Error("Incident not found");
    if (incident.status !== "VERIFIED") {
      throw new InvalidTransitionError(
        "Only a verified incident can have a responder assigned"
      );
    }

    const volunteer = await volunteerRepository.findById(volunteerId);
    if (!volunteer) throw new Error("Volunteer not found");

    const result = await incidentRepository.assignVolunteer(
      incidentId,
      volunteerId,
      actor.id
    );

    try {
      await notificationService.forAssignment(incidentId, volunteer.userId);
    } catch (notifyErr) {
      console.error("Failed to send assignment notification", notifyErr);
    }

    return result;
  },

  async dashboardCounts() {
    const [byStatus, bySeverity, byCategory, recent, avgResolutionHours] =
      await Promise.all([
        incidentRepository.countByStatus(),
        incidentRepository.countBySeverity(),
        incidentRepository.countByCategory(),
        incidentRepository.findRecentForTimeSeries(14),
        incidentRepository.averageResolutionHours(),
      ]);
    return { byStatus, bySeverity, byCategory, recent, avgResolutionHours };
  },
};
