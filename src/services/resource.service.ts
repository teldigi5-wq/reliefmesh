import { resourceRepository } from "@/repositories/resource.repository";
import { hasPermission, PermissionError } from "@/lib/permissions";
import type { Role } from "@prisma/client";
import type { CreateResourceInput, AllocateResourceInput } from "@/lib/validation/resource";

type Actor = { id: string; role: Role };

export const resourceService = {
  async create(input: CreateResourceInput, actor: Actor) {
    if (!hasPermission(actor.role, "resource:manage")) {
      throw new PermissionError("Not permitted to manage resources");
    }
    return resourceRepository.create(input);
  },

  async listAll() {
    return resourceRepository.findAll();
  },

  async allocate(resourceId: string, input: AllocateResourceInput, actor: Actor) {
    if (!hasPermission(actor.role, "resource:allocate")) {
      throw new PermissionError("Not permitted to allocate resources");
    }
    return resourceRepository.allocate(
      resourceId,
      input.incidentId,
      input.quantity,
      actor.id
    );
  },
};
