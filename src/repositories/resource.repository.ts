import { prisma } from "@/lib/db/prisma";
import type { CreateResourceInput } from "@/lib/validation/resource";

export const resourceRepository = {
  create(data: CreateResourceInput) {
    return prisma.resource.create({ data });
  },

  findAll() {
    return prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
      include: { allocations: { select: { quantity: true, releasedAt: true } } },
    });
  },

  findById(id: string) {
    return prisma.resource.findUnique({ where: { id } });
  },

  // Allocates `quantity` of a resource to an incident, inside a transaction
  // so the resource's in-use count and the allocation history row can never
  // drift apart. Fails if there isn't enough free quantity.
  allocate(resourceId: string, incidentId: string, quantity: number, allocatedById: string) {
    return prisma.$transaction(async (tx) => {
      const resource = await tx.resource.findUniqueOrThrow({
        where: { id: resourceId },
      });

      const available = resource.quantityTotal - resource.quantityInUse;
      if (quantity > available) {
        throw new InsufficientQuantityError(
          `Only ${available} ${resource.unit} of "${resource.name}" available, requested ${quantity}`
        );
      }

      await tx.resource.update({
        where: { id: resourceId },
        data: { quantityInUse: { increment: quantity } },
      });

      return tx.resourceAllocation.create({
        data: { resourceId, incidentId, quantity, allocatedById },
      });
    });
  },

  // Releases a previously made allocation and frees the quantity back up.
  release(allocationId: string) {
    return prisma.$transaction(async (tx) => {
      const allocation = await tx.resourceAllocation.findUniqueOrThrow({
        where: { id: allocationId },
      });
      if (allocation.releasedAt) return allocation;

      await tx.resource.update({
        where: { id: allocation.resourceId },
        data: { quantityInUse: { decrement: allocation.quantity } },
      });

      return tx.resourceAllocation.update({
        where: { id: allocationId },
        data: { releasedAt: new Date() },
      });
    });
  },
};

export class InsufficientQuantityError extends Error {}
