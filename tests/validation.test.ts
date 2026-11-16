import { describe, it, expect } from "vitest";
import { transitionStatusSchema, assignVolunteerSchema } from "@/lib/validation/volunteer";
import { createIncidentSchema } from "@/lib/validation/incident";

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
});
