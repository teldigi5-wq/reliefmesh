/**
 * Preliminary Guardian concept pricing for the Sri Lankan market.
 * These values are PLANNING ASSUMPTIONS, not supplier quotes or live store prices.
 * Keep pricing targets and cost-model assumptions together to avoid discrepancies.
 */
export const VAT_ILLUSTRATION = 0.18;
export const PAYMENT_FEE_ILLUSTRATION = 0.03;
export const PRICING_REVIEW_DATE = "18 November 2026";

export type GuardianDeviceKey = "ring-lite" | "ring-pro" | "guardian-button" | "guardian-remote";

export type UnitCostEstimate = {
  electronicsAndPower: number;
  enclosure: number;
  assemblyAndTesting: number;
  packagingAndLogistics: number;
  warrantyToolingContingency: number;
};

export type GuardianPrice = {
  label: string;
  targetRetailLkr: number;
  unitCosts: UnitCostEstimate;
  connection: string;
  note: string;
};

export const guardianPricing: Record<GuardianDeviceKey, GuardianPrice> = {
  "guardian-button": {
    label: "Guardian Button",
    targetRetailLkr: 4990,
    unitCosts: {
      electronicsAndPower: 1150,
      enclosure: 450,
      assemblyAndTesting: 500,
      packagingAndLogistics: 400,
      warrantyToolingContingency: 750,
    },
    connection: "Bluetooth · paired phone required",
    note: "An SOS signal needs a compatible nearby phone or gateway.",
  },
  "ring-lite": {
    label: "Guardian Ring Lite",
    targetRetailLkr: 8490,
    unitCosts: {
      electronicsAndPower: 2050,
      enclosure: 1250,
      assemblyAndTesting: 900,
      packagingAndLogistics: 500,
      warrantyToolingContingency: 800,
    },
    connection: "Bluetooth · paired phone required",
    note: "The target assumes smartphone-assisted alerts, not standalone GPS or cellular.",
  },
  "ring-pro": {
    label: "Guardian Ring Pro",
    targetRetailLkr: 17990,
    unitCosts: {
      electronicsAndPower: 4850,
      enclosure: 2600,
      assemblyAndTesting: 1850,
      packagingAndLogistics: 700,
      warrantyToolingContingency: 2000,
    },
    connection: "Bluetooth · exploratory sensors",
    note: "SOS still requires a paired device; wellness sensing is experimental, not medical-grade.",
  },
  "guardian-remote": {
    label: "Guardian Remote",
    targetRetailLkr: 19990,
    unitCosts: {
      electronicsAndPower: 7700,
      enclosure: 1500,
      assemblyAndTesting: 1500,
      packagingAndLogistics: 800,
      warrantyToolingContingency: 2100,
    },
    connection: "Planned 4G/LTE + GPS · SIM required",
    note: "Mobile network/data charges are separate; modem/network compatibility requires validation.",
  },
};

export function formatLkr(value: number): string {
  return "Rs. " + Math.round(value).toLocaleString("en-US");
}

export function unitCostEstimate(pricing: GuardianPrice): number {
  return Object.values(pricing.unitCosts).reduce((sum, cost) => sum + cost, 0);
}

export function estimatedContribution(pricing: GuardianPrice): number {
  const saleExVat = pricing.targetRetailLkr / (1 + VAT_ILLUSTRATION);
  const paymentAllowance = pricing.targetRetailLkr * PAYMENT_FEE_ILLUSTRATION;
  return Math.floor(saleExVat - paymentAllowance - unitCostEstimate(pricing));
}
