import { describe, it, expect } from "vitest";
import { transitionStatusSchema, assignVolunteerSchema } from "@/lib/validation/volunteer";
import { createIncidentSchema } from "@/lib/validation/incident";
import { createResourceSchema, allocateResourceSchema } from "@/lib/validation/resource";
import {
  guardianSimulatorLocationSchema,
  guardianSimulatorSchema,
} from "@/lib/validation/guardian";
import { pushTokenSchema } from "@/lib/validation/push-token";

describe("volunteer/incident validation schemas", () => {
  it("rejects an unknown status on a transition request", () => {
    const result = transitionStatusSchema.safeParse({ toStatus: "NOT_A_STATUS" });
    expect(result.success).toBe(false);
  });

  it("accepts a valid status transition with an optional note", () => {
    const result = transitionStatusSchema.safeParse({
      toStatus: "VERIFIED",
      note: "Confirmed via phone with reporter",
    });
    expect(result.success).toBe(true);
  });

  it("requires a volunteerId to assign a responder", () => {
    expect(assignVolunteerSchema.safeParse({}).success).toBe(false);
    expect(
      assignVolunteerSchema.safeParse({ volunteerId: "vol_123" }).success
    ).toBe(true);
  });

  it("rejects an incident report with out-of-range coordinates", () => {
    const result = createIncidentSchema.safeParse({
      title: "Flooded road",
      description: "Water is rising fast near the bridge.",
      category: "FLOOD",
      severity: "HIGH",
      latitude: 999,
      longitude: 79.86,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a resource with a negative quantity", () => {
    const result = createResourceSchema.safeParse({
      name: "Drinking water",
      category: "FOOD_AND_WATER",
      quantityTotal: -5,
      unit: "liters",
    });
    expect(result.success).toBe(false);
  });

  it("defaults a resource's unit to 'units' when omitted", () => {
    const result = createResourceSchema.safeParse({
      name: "Rescue boats",
      category: "RESCUE_EQUIPMENT",
      quantityTotal: 3,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.unit).toBe("units");
  });

  it("requires a positive quantity to allocate a resource", () => {
    expect(
      allocateResourceSchema.safeParse({ incidentId: "inc_1", quantity: 0 }).success
    ).toBe(false);
    expect(
      allocateResourceSchema.safeParse({ incidentId: "inc_1", quantity: 5 }).success
    ).toBe(true);
  });

  it("validates Guardian simulator telemetry and applies safe defaults", () => {
    const result = guardianSimulatorSchema.safeParse({
      deviceSerial: "SIM-REMOTE-001",
      latitude: 6.9271,
      longitude: 79.8612,
      batteryPct: 87,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.category).toBe("OTHER");
      expect(result.data.networkType).toBe("GPRS");
      expect(result.data.locationSource).toBe("SIMULATED_GPS");
    }
  });

  it("rejects impossible Guardian battery and GPS telemetry", () => {
    expect(
      guardianSimulatorSchema.safeParse({
        deviceSerial: "SIM-REMOTE-001",
        latitude: 95,
        longitude: 79.8612,
        batteryPct: 120,
      }).success
    ).toBe(false);
  });

  it("validates live Guardian location telemetry for an existing incident", () => {
    expect(
      guardianSimulatorLocationSchema.safeParse({
        deviceSerial: "SIM-REMOTE-DEMO",
        incidentId: "incident-123",
        latitude: 6.9271,
        longitude: 79.8612,
        accuracy: 8.4,
        batteryPct: 82,
      }).success
    ).toBe(true);
    expect(
      guardianSimulatorLocationSchema.safeParse({
        deviceSerial: "SIM-REMOTE-DEMO",
        incidentId: "incident-123",
        latitude: 120,
        longitude: 79.8612,
      }).success
    ).toBe(false);
  });

  it("accepts only supported mobile push-token platforms", () => {
    const token = "fcm-registration-token-that-is-long-enough";
    expect(pushTokenSchema.safeParse({ token, platform: "ANDROID" }).success).toBe(true);
    expect(pushTokenSchema.safeParse({ token, platform: "IOS" }).success).toBe(true);
    expect(pushTokenSchema.safeParse({ token, platform: "WEB" }).success).toBe(false);
  });
});
