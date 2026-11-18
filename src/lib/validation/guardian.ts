import { z } from "zod";

export const guardianSOSSchema = z.object({
  deviceSerial: z.string().trim().min(3).max(80),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  batteryPct: z.number().int().min(0).max(100).optional(),
});

export const guardianSimulatorSchema = guardianSOSSchema.extend({
  category: z
    .enum([
      "FLOOD",
      "LANDSLIDE",
      "FIRE",
      "MEDICAL_EMERGENCY",
      "ROAD_ACCIDENT",
      "MISSING_PERSON",
      "INFRASTRUCTURE_DAMAGE",
      "OTHER",
    ])
    .default("OTHER"),
  description: z.string().trim().max(500).optional(),
  networkType: z.enum(["GPRS", "PHONE_DATA"]).default("GPRS"),
  locationSource: z.enum(["SIMULATED_GPS", "PHONE_GPS"]).default("SIMULATED_GPS"),
});

export const guardianSimulatorLocationSchema = z.object({
  deviceSerial: z.string().trim().min(3).max(80),
  incidentId: z.string().trim().min(1).max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().min(0).max(10_000).optional(),
  batteryPct: z.number().int().min(0).max(100).optional(),
});

export type GuardianSOSInput = z.infer<typeof guardianSOSSchema>;
export type GuardianSimulatorInput = z.infer<typeof guardianSimulatorSchema>;
export type GuardianSimulatorLocationInput = z.infer<
  typeof guardianSimulatorLocationSchema
>;

