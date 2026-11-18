import { z } from "zod";

export const pushTokenSchema = z.object({
  token: z.string().min(20).max(4096),
  platform: z.enum(["ANDROID", "IOS"]),
});

export const removePushTokenSchema = z.object({
  token: z.string().min(20).max(4096),
});
