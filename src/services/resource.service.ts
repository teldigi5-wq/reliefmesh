import { resourceRepository } from "@/repositories/resource.repository";
import { hasPermission, PermissionError } from "@/lib/permissions";
import { auditLog } from "@/lib/security/audit";
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
    const allocation = await resourceRepository.allocate(
      resourceId,
      input.incidentId,
      input.quantity,
      actor.id
    );
    await auditLog(actor.id, "RESOURCE_ALLOCATED", "Resource", resourceId, {
      incidentId: input.incidentId,
      quantity: input.quantity,
    });
    return allocation;
  },
};
