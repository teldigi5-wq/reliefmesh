import { incidentRepository } from "@/repositories/incident.repository";
import { hasPermission } from "@/lib/permissions";
import type { Role, IncidentStatus } from "@prisma/client";
import type { CreateIncidentInput } from "@/lib/validation/incident";
import { PermissionError } from "@/lib/permissions";

export const incidentService = {
  async reportIncident(
    input: CreateIncidentInput,
    actor: { id: string; role: Role }
  ) {
    if (!hasPermission(actor.role, "incident:report")) {
      throw new PermissionError("Not permitted to report incidents");
    }
    return incidentRepository.create(input, actor.id);
  },

  async listIncidents(actor: { id: string; role: Role }) {
    const canViewAll = hasPermission(actor.role, "incident:view_all");
    return incidentRepository.findMany(
      canViewAll ? {} : { reportedById: actor.id }
    );
  },

  async transitionStatus(
    incidentId: string,
    toStatus: IncidentStatus,
    actor: { id: string; role: Role },
    note?: string
  ) {
    if (
      toStatus === "VERIFIED" &&
      !hasPermission(actor.role, "incident:verify")
    ) {
      throw new PermissionError("Not permitted to verify incidents");
    }
    if (!hasPermission(actor.role, "incident:update_status")) {
      throw new PermissionError("Not permitted to update incident status");
    }
    return incidentRepository.updateStatus(
      incidentId,
      toStatus,
      actor.id,
      note
    );
  },

  async dashboardCounts() {
    const [byStatus, bySeverity] = await Promise.all([
      incidentRepository.countByStatus(),
      incidentRepository.countBySeverity(),
    ]);
    return { byStatus, bySeverity };
  },
};
