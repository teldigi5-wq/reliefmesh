import { volunteerRepository } from "@/repositories/volunteer.repository";
import { hasPermission, PermissionError } from "@/lib/permissions";
import type { Role } from "@prisma/client";
import type { UpsertVolunteerInput } from "@/lib/validation/volunteer";

export const volunteerService = {
  // Any authenticated user may register themselves as available to help —
  // this does not change their Role, it only creates/updates their
  // Volunteer profile. Operators decide who to assign based on this data.
  async registerSelf(input: UpsertVolunteerInput, actor: { id: string; role: Role }) {
    if (!hasPermission(actor.role, "volunteer:register")) {
      throw new PermissionError("Not permitted to register as a volunteer");
    }
    return volunteerRepository.upsertForUser(actor.id, input);
  },

  async getOwnProfile(actor: { id: string }) {
    return volunteerRepository.findByUserId(actor.id);
  },

  async listForAssignment(actor: { role: Role }) {
    if (!hasPermission(actor.role, "volunteer:manage")) {
      throw new PermissionError("Not permitted to view the volunteer roster");
    }
    return volunteerRepository.findAvailable();
  },

  async listAll(actor: { role: Role }) {
    if (!hasPermission(actor.role, "volunteer:manage")) {
      throw new PermissionError("Not permitted to view the volunteer roster");
    }
    return volunteerRepository.findAll();
  },
};
