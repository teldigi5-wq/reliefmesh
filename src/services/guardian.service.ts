import { guardianRepository } from "@/repositories/guardian.repository";
import { hasPermission, PermissionError } from "@/lib/permissions";
import type { Role } from "@prisma/client";
import type {
  GuardianSimulatorInput,
  GuardianSimulatorLocationInput,
} from "@/lib/validation/guardian";
import { notificationService } from "@/services/notification.service";
import { auditLog } from "@/lib/security/audit";

export const guardianService = {
  async triggerSimulatedSOS(
    input: GuardianSimulatorInput,
    actor: { id: string; role: Role }
  ) {
    if (!hasPermission(actor.role, "guardian:trigger_sos")) {
      throw new PermissionError("Not permitted to trigger the Guardian SOS remote");
    }

    const result = await guardianRepository.createSimulatedSOSIncident(input, actor.id);
    await Promise.allSettled([
      notificationService.forNewCriticalIncident(result.incident.id),
      auditLog(actor.id, "GUARDIAN_SOS_SIMULATED", "SOSEvent", result.sosEvent.id, {
        deviceSerial: input.deviceSerial,
        incidentId: result.incident.id,
        networkType: input.networkType,
        locationSource: input.locationSource,
      }),
    ]);
    return result;
  },

  async triggerDeviceSOS(input: GuardianSimulatorInput) {
    const reporterId = await guardianRepository.findSystemReporterId(
      process.env.GUARDIAN_REPORTER_EMAIL
    );
    if (!reporterId) {
      throw new Error(
        "No active admin/operator account is available to own Guardian incidents"
      );
    }

    const result = await guardianRepository.createSimulatedSOSIncident(
      input,
      reporterId
    );
    await Promise.allSettled([
      notificationService.forNewCriticalIncident(result.incident.id),
      auditLog(null, "GUARDIAN_SOS_SIMULATED", "SOSEvent", result.sosEvent.id, {
        deviceSerial: input.deviceSerial,
        incidentId: result.incident.id,
      }),
    ]);
    return result;
  },

  async updateSimulatedLocation(
    input: GuardianSimulatorLocationInput,
    actor: { id: string; role: Role }
  ) {
    if (!hasPermission(actor.role, "guardian:trigger_sos")) {
      throw new PermissionError("Not permitted to stream Guardian telemetry");
    }
    return guardianRepository.updateSimulatedSOSLocation(input, actor.id);
  },

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
