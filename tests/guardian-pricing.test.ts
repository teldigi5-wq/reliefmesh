import { describe, expect, it } from "vitest";
import {
  estimatedContribution,
  contributionIfVatApplies,
  illustrativeVatInclusivePrice,
  proposedSupportGap,
  savingsVsPreviousTarget,
  formatLkr,
  guardianPricing,
  unitCostEstimate,
} from "@/lib/guardian-pricing";

const expected = {
  "guardian-button": { price: 1990, cost: 1400, vat: 2350, old: 2990 },
  "ring-lite": { price: 4490, cost: 3000, vat: 5300, old: 5490 },
  "ring-pro": { price: 11990, cost: 8000, vat: 14150, old: 11990 },
  "guardian-remote": { price: 8990, cost: 6400, vat: 10610, old: 14990 },
} as const;

describe("Guardian access-first concept pricing", () => {
  it("keeps every device target and modelled unit cost in sync", () => {
    expect(Object.keys(guardianPricing).sort()).toEqual(Object.keys(expected).sort());
    for (const [key, item] of Object.entries(expected)) {
      const model = guardianPricing[key as keyof typeof guardianPricing];
      expect(model.targetRetailLkr).toBe(item.price);
      expect(model.previousTargetLkr).toBe(item.old);
      expect(unitCostEstimate(model)).toBe(item.cost);
      expect(illustrativeVatInclusivePrice(model)).toBe(item.vat);
    }
  });

  it("maintains positive modelled coverage for full-price orders under either tax scenario", () => {
    for (const model of Object.values(guardianPricing)) {
      expect(estimatedContribution(model)).toBeGreaterThan(0);
      expect(contributionIfVatApplies(model)).toBeGreaterThan(0);
    }
    expect(estimatedContribution(guardianPricing["guardian-button"])).toBe(530);
    expect(estimatedContribution(guardianPricing["ring-lite"])).toBe(1355);
    expect(estimatedContribution(guardianPricing["guardian-remote"])).toBe(2320);
  });

  it("never presents a subsidised Remote contribution as full standalone cost coverage", () => {
    const remote = guardianPricing["guardian-remote"];
    expect(remote.communitySupportGoalLkr).toBe(3990);
    expect(proposedSupportGap(remote)).toBe(5000);
    expect(remote.communitySupportGoalLkr! - unitCostEstimate(remote)).toBeLessThan(0);
    expect(remote.communitySupportGoalLkr! + proposedSupportGap(remote)).toBe(remote.targetRetailLkr);
    expect(remote.communitySupportNote).toContain("no funding agreement");
    for (const key of ["guardian-button", "ring-lite", "ring-pro"] as const) {
      expect(guardianPricing[key].communitySupportGoalLkr).toBeUndefined();
    }
  });

  it("makes paired-phone limitations explicit", () => {
    expect(guardianPricing["guardian-button"].phoneRequired).toBe(true);
    expect(guardianPricing["ring-lite"].phoneRequired).toBe(true);
    expect(guardianPricing["ring-pro"].phoneRequired).toBe(true);
    expect(guardianPricing["guardian-remote"].phoneRequired).toBe(false);
    expect(guardianPricing["guardian-remote"].portability).toContain("design goal");
    expect(guardianPricing["guardian-remote"].networkCosts).toContain("SIM");
  });

  it("keeps savings and price formatting correct", () => {
    expect(savingsVsPreviousTarget(guardianPricing["ring-pro"])).toBe(0);
    expect(savingsVsPreviousTarget(guardianPricing["guardian-remote"])).toBe(40);
    expect(formatLkr(1990)).toBe("Rs. 1,990");
    expect(formatLkr(3990)).toBe("Rs. 3,990");
  });
});
