import { describe, expect, it } from "vitest";
import {
  estimatedContribution,
  contributionIfVatApplies,
  illustrativeVatInclusivePrice,
  savingsVsPreviousTarget,
  formatLkr,
  guardianPricing,
  unitCostEstimate,
} from "@/lib/guardian-pricing";

const expected = {
  "guardian-button": { price: 2990, cost: 1900, vat: 3530, old: 4990 },
  "ring-lite": { price: 5490, cost: 3650, vat: 6480, old: 8490 },
  "ring-pro": { price: 11990, cost: 8000, vat: 14150, old: 17990 },
  "guardian-remote": { price: 14990, cost: 10000, vat: 17690, old: 19990 },
} as const;

describe("provisional Guardian bulk-sourcing price model", () => {
  it("covers all 4 concepts with consistent target cost breakdowns", () => {
    expect(Object.keys(guardianPricing).sort()).toEqual(Object.keys(expected).sort());
    for (const [key, item] of Object.entries(expected)) {
      const model = guardianPricing[key as keyof typeof guardianPricing];
      expect(model.targetRetailLkr).toBe(item.price);
      expect(model.previousTargetLkr).toBe(item.old);
      expect(unitCostEstimate(model)).toBe(item.cost);
      expect(illustrativeVatInclusivePrice(model)).toBe(item.vat);
      expect(savingsVsPreviousTarget(model)).toBeGreaterThanOrEqual(25);
    }
  });

  it("keeps a 15%+ target contribution under both VAT planning scenarios", () => {
    for (const model of Object.values(guardianPricing)) {
      expect(estimatedContribution(model)).toBeGreaterThan(model.targetRetailLkr * 0.15);
      expect(contributionIfVatApplies(model)).toBeGreaterThan(model.targetRetailLkr * 0.15);
    }
  });

  it("does not assume standalone SOS for inexpensive Bluetooth devices", () => {
    for (const key of ["guardian-button", "ring-lite", "ring-pro"] as const) {
      expect(guardianPricing[key].phoneRequired).toBe(true);
    }
    expect(guardianPricing["guardian-remote"].phoneRequired).toBe(false);
    expect(guardianPricing["guardian-remote"].networkCosts).toContain("SIM");
  });

  it("formats prices in Sri Lankan rupees", () => {
    expect(formatLkr(2990)).toBe("Rs. 2,990");
    expect(formatLkr(14990)).toBe("Rs. 14,990");
  });
});
