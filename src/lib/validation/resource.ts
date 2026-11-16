import { z } from "zod";

export const resourceCategorySchema = z.enum([
  "MEDICAL_SUPPLIES",
  "FOOD_AND_WATER",
  "VEHICLES",
  "RESCUE_EQUIPMENT",
  "TEMPORARY_SHELTER",
]);

export const createResourceSchema = z.object({
  name: z.string().min(2).max(150),
  category: resourceCategorySchema,
  quantityTotal: z.number().int().min(0),
  unit: z.string().min(1).max(30).default("units"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const allocateResourceSchema = z.object({
  incidentId: z.string().min(1),
  quantity: z.number().int().min(1),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type AllocateResourceInput = z.infer<typeof allocateResourceSchema>;
