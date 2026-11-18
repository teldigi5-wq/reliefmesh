/**
 * Guardian device bulk-procurement PRICE TARGETS, not published retail offers.
 * Assumes prospective procurement of ~500–1,000 devices, local assembly, and
 * achievement of estimated unit costs. No supplier or tax authority has
 * approved these amounts or VAT treatment.
 */
export const VAT_ILLUSTRATION = 0.18;
export const PAYMENT_FEE_ILLUSTRATION = 0.03;
export const PRICING_REVIEW_DATE = "18 November 2026";
export const ESTIMATED_ORDER_RANGE = "500–1,000 devices";

export type GuardianDeviceKey =
  | "guardian-button"
  | "ring-lite"
  | "ring-pro"
  | "guardian-remote";

export type UnitCostEstimate = {
  electronicsAndPower: number;
  enclosure: number;
  assemblyAndTesting: number;
  packagingAndLogistics: number;
  warrantyToolingContingency: number;
};

export type GuardianPrice = {
  label: string;
  targetRetailLkr: number; // proposed base price before VAT
  previousTargetLkr: number;
  unitCosts: UnitCostEstimate;
  connection: string;
  note: string;
  bestFor: string;
  location: string;
  wellness: string;
  phoneRequired: boolean;
  networkCosts: string;
};

export const guardianPricing: Record<GuardianDeviceKey, GuardianPrice> = {
  "guardian-button": {
    label: "Guardian Button",
    targetRetailLkr: 2990,
    previousTargetLkr: 4990,
    unitCosts: {
      electronicsAndPower: 800,
      enclosure: 240,
      assemblyAndTesting: 220,
      packagingAndLogistics: 170,
      warrantyToolingContingency: 470,
    },
    connection: "Bluetooth LE · smartphone required",
    note: "A compatible paired phone and connectivity are needed to forward an SOS alert.",
    bestFor: "Older adults, families",
    location: "Paired phone's location",
    wellness: "None",
    phoneRequired: true,
    networkCosts: "Phone data",
  },
  "ring-lite": {
    label: "Guardian Ring Lite",
    targetRetailLkr: 5490,
    previousTargetLkr: 8490,
    unitCosts: {
      electronicsAndPower: 1450,
      enclosure: 650,
      assemblyAndTesting: 480,
      packagingAndLogistics: 270,
      warrantyToolingContingency: 800,
    },
    connection: "Bluetooth LE · smartphone required",
    note: "Planned phone-assisted SOS; standalone GPS or mobile data is not included.",
    bestFor: "Everyday SOS wearable",
    location: "Paired phone's location",
    wellness: "None",
    phoneRequired: true,
    networkCosts: "Phone data",
  },
  "ring-pro": {
    label: "Guardian Ring Pro",
    targetRetailLkr: 11990,
    previousTargetLkr: 17990,
    unitCosts: {
      electronicsAndPower: 3550,
      enclosure: 1550,
      assemblyAndTesting: 1000,
      packagingAndLogistics: 400,
      warrantyToolingContingency: 1500,
    },
    connection: "Bluetooth LE · smartphone required",
    note: "Exploratory optical and temperature sensing is not medically validated.",
    bestFor: "Personal safety + wellness concept",
    location: "Paired phone's location",
    wellness: "Experimental PPG / temperature",
    phoneRequired: true,
    networkCosts: "Phone data",
  },
  "guardian-remote": {
    label: "Guardian Remote",
    targetRetailLkr: 14990,
    previousTargetLkr: 19990,
    unitCosts: {
      electronicsAndPower: 5700,
      enclosure: 1000,
      assemblyAndTesting: 1050,
      packagingAndLogistics: 450,
      warrantyToolingContingency: 1800,
    },
    connection: "Planned 4G/LTE + GNSS · SIM required",
    note: "Independent cellular signalling is proposed, subject to supported LTE bands and reliable coverage. SIM/data charges are separate.",
    bestFor: "Independent location-enabled SOS",
    location: "Integrated GNSS (planned)",
    wellness: "None",
    phoneRequired: false,
    networkCosts: "Separate SIM / data plan",
  },
};

export function formatLkr(value: number): string {
  return "Rs. " + Math.round(value).toLocaleString("en-US");
}

export function unitCostEstimate(pricing: GuardianPrice): number {
  return Object.values(pricing.unitCosts).reduce((sum, cost) => sum + cost, 0);
}

/** Indicative base price, excluding output VAT; not an approved tax exemption. */
export function estimatedContribution(pricing: GuardianPrice): number {
  const processingFee = pricing.targetRetailLkr * PAYMENT_FEE_ILLUSTRATION;
  return Math.floor(pricing.targetRetailLkr - processingFee - unitCostEstimate(pricing));
}

/**
 * If 18% VAT must be added, this is an approximate VAT-inclusive customer
 * total. Round UP to the next Rs. 10 to avoid under-collection.
 */
export function illustrativeVatInclusivePrice(pricing: GuardianPrice): number {
  return Math.ceil((pricing.targetRetailLkr * (1 + VAT_ILLUSTRATION)) / 10) * 10;
}

/** Contribution at that alternative gross total after output VAT and a fee. */
export function contributionIfVatApplies(pricing: GuardianPrice): number {
  const gross = illustrativeVatInclusivePrice(pricing);
  const revenueExVat = gross / (1 + VAT_ILLUSTRATION);
  return Math.floor(revenueExVat - gross * PAYMENT_FEE_ILLUSTRATION - unitCostEstimate(pricing));
}

export function savingsVsPreviousTarget(pricing: GuardianPrice): number {
  return Math.round(
    (1 - pricing.targetRetailLkr / pricing.previousTargetLkr) * 100
  );
}
