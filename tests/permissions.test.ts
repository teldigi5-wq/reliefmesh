import { describe, it, expect } from "vitest";
import { hasPermission } from "@/lib/permissions";

describe("role permissions", () => {
  it("allows citizens to report incidents but not verify them", () => {
    expect(hasPermission("CITIZEN", "incident:report")).toBe(true);
    expect(hasPermission("CITIZEN", "incident:verify")).toBe(false);
  });

  it("allows operators to verify and assign incidents", () => {
    expect(hasPermission("OPERATOR", "incident:verify")).toBe(true);
    expect(hasPermission("OPERATOR", "incident:assign")).toBe(true);
  });

  it("grants admins every permission operators have", () => {
    const operatorOnlyPermissions = [
      "incident:verify",
      "incident:assign",
      "resource:manage",
    ] as const;

    for (const permission of operatorOnlyPermissions) {
      expect(hasPermission("ADMIN", permission)).toBe(true);
    }
  });

  it("does not allow responders to verify incidents", () => {
    expect(hasPermission("RESPONDER", "incident:verify")).toBe(false);
  });
});
