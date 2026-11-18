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
  portability: string;
  communitySupportGoalLkr?: number;
  communitySupportNote?: string;
};

export const guardianPricing: Record<GuardianDeviceKey, GuardianPrice> = {
  "guardian-button": {
    label: "Guardian Button",
    targetRetailLkr: 1990,
    previousTargetLkr: 2990,
    unitCosts: {
      electronicsAndPower: 610,
      enclosure: 180,
      assemblyAndTesting: 170,
      packagingAndLogistics: 130,
      warrantyToolingContingency: 310,
    },
    connection: "Bluetooth LE · smartphone required",
    note: "A compatible paired phone and connectivity are needed to forward an SOS alert.",
    bestFor: "Budget-conscious households with a paired smartphone",
    location: "Paired phone's location",
    wellness: "None",
    phoneRequired: true,
    networkCosts: "Phone data",
    portability: "Small keychain, bag or pocket",
  },
  "ring-lite": {
    label: "Guardian Ring Lite",
    targetRetailLkr: 4490,
    previousTargetLkr: 5490,
    unitCosts: {
      electronicsAndPower: 1180,
      enclosure: 510,
      assemblyAndTesting: 370,
      packagingAndLogistics: 240,
      warrantyToolingContingency: 700,
    },
    connection: "Bluetooth LE · smartphone required",
    note: "Planned phone-assisted SOS; standalone GPS or mobile data is not included.",
    bestFor: "All-day, discreet personal SOS where a smartphone is available",
    location: "Paired phone's location",
    wellness: "None",
    phoneRequired: true,
    networkCosts: "Phone data",
    portability: "Worn on a finger; everyday-carry design goal",
  },
  "ring-pro": {
    label: "Guardian Ring Pro",
    targetRetailLkr: 11990,
    previousTargetLkr: 11990,
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
    portability: "Worn on a finger; everyday-carry design goal",
  },
  "guardian-remote": {
    label: "Guardian Remote",
    targetRetailLkr: 8990,
    previousTargetLkr: 14990,
    unitCosts: {
      electronicsAndPower: 3650,
      enclosure: 570,
      assemblyAndTesting: 650,
      packagingAndLogistics: 380,
      warrantyToolingContingency: 1150,
    },
    connection: "Planned 4G/LTE + GNSS · SIM required",
    note: "Independent cellular signalling is proposed, subject to supported LTE bands and reliable coverage. SIM/data charges are separate.",
    bestFor: "Phone-free SOS for at-risk people, with community procurement support",
    location: "Integrated GNSS (planned)",
    wellness: "None",
    phoneRequired: false,
    networkCosts: "Separate SIM / data plan",
    portability: "Clip, lanyard or bag attachment design goal (dimensions untested)",
    communitySupportGoalLkr: 3990,
    communitySupportNote: "A proposed assisted household price only if a partner funds the difference; no funding agreement exists.",
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

/** Illustrative support required per unit to reach a community-access goal. */
export function proposedSupportGap(pricing: GuardianPrice): number {
  if (pricing.communitySupportGoalLkr === undefined) return 0;
  return Math.max(0, pricing.targetRetailLkr - pricing.communitySupportGoalLkr);
}

export function savingsVsPreviousTarget(pricing: GuardianPrice): number {
  return Math.round(
    (1 - pricing.targetRetailLkr / pricing.previousTargetLkr) * 100
  );
}
