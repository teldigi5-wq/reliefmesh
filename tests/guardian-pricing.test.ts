import { describe, expect, it } from "vitest";
import {
  estimatedContribution,
  formatLkr,
  guardianPricing,
  unitCostEstimate,
  VAT_ILLUSTRATION,
  PAYMENT_FEE_ILLUSTRATION,
} from "@/lib/guardian-pricing";

const expected = {
  "guardian-button": { price: 4990, unitCost: 3250, contribution: 829 },
  "ring-lite": { price: 8490, unitCost: 5500, contribution: 1440 },
  "ring-pro": { price: 17990, unitCost: 12000, contribution: 2706 },
  "guardian-remote": { price: 19990, unitCost: 13600, contribution: 2740 },
} as const;

describe("Guardian provisional retail pricing", () => {
  it("lists all four device concept variants with deterministic cost totals", () => {
    expect(Object.keys(guardianPricing).sort()).toEqual(Object.keys(expected).sort());
    for (const [key, row] of Object.entries(expected)) {
      const model = guardianPricing[key as keyof typeof guardianPricing];
      expect(model.targetRetailLkr).toBe(row.price);
      expect(unitCostEstimate(model)).toBe(row.unitCost);
      expect(estimatedContribution(model)).toBe(row.contribution);
    }
  });

  it("budgets a positive contribution after illustrative VAT and payment fees", () => {
    for (const entry of Object.values(guardianPricing)) {
      const netSaleBeforeFee = entry.targetRetailLkr / (1 + VAT_ILLUSTRATION);
      expect(estimatedContribution(entry)).toBeGreaterThan(0);
      expect(estimatedContribution(entry) / netSaleBeforeFee).toBeGreaterThan(0.15);
      expect(entry.targetRetailLkr * PAYMENT_FEE_ILLUSTRATION).toBeGreaterThan(0);
    }
  });

  it("displays LKR prices clearly without purchase claims", () => {
    expect(formatLkr(4990)).toBe("Rs. 4,990");
    expect(formatLkr(19990)).toBe("Rs. 19,990");
  });
});
