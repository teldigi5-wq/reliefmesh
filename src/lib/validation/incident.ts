import { z } from "zod";

export const incidentCategorySchema = z.enum([
  "FLOOD",
  "LANDSLIDE",
  "FIRE",
  "MEDICAL_EMERGENCY",
  "ROAD_ACCIDENT",
  "MISSING_PERSON",
  "INFRASTRUCTURE_DAMAGE",
  "OTHER",
]);

export const severitySchema = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);

export const createIncidentSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().min(10).max(2000),
  category: incidentCategorySchema,
  severity: severitySchema,
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().max(300).optional(),
});

export type CreateIncidentInput = z.infer<typeof createIncidentSchema>;
