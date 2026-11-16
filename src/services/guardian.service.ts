import { guardianRepository } from "@/repositories/guardian.repository";
import { hasPermission, PermissionError } from "@/lib/permissions";
import type { Role } from "@prisma/client";

export const guardianService = {
  async getMonitoringData(actor: { role: Role }) {
    if (!hasPermission(actor.role, "guardian:view_locations")) {
      throw new PermissionError("Not permitted to view Guardian device data");
    }
    const [devices, sosEvents] = await Promise.all([
      guardianRepository.findAllDevices(),
      guardianRepository.findRecentSOSEvents(),
    ]);
    return { devices, sosEvents };
  },

  async getLocationHistory(deviceId: string, actor: { role: Role }) {
    if (!hasPermission(actor.role, "guardian:view_locations")) {
      throw new PermissionError("Not permitted to view Guardian device data");
    }
    return guardianRepository.findLocationHistory(deviceId);
  },
};
