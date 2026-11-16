import { z } from "zod";

export const upsertVolunteerSchema = z.object({
  skills: z.array(z.string().min(1).max(50)).max(20),
  isAvailable: z.boolean(),
});

export const assignVolunteerSchema = z.object({
  volunteerId: z.string().min(1),
});

export const transitionStatusSchema = z.object({
  toStatus: z.enum([
    "UNDER_REVIEW",
    "VERIFIED",
    "ASSIGNED",
    "RESPONDING",
    "RESOLVED",
    "CLOSED",
  ]),
  note: z.string().max(1000).optional(),
});

export type UpsertVolunteerInput = z.infer<typeof upsertVolunteerSchema>;
export type AssignVolunteerInput = z.infer<typeof assignVolunteerSchema>;
export type TransitionStatusInput = z.infer<typeof transitionStatusSchema>;
