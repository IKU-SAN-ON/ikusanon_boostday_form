import { z } from "zod";

export const tokenGenRequestSchema = z.object({
  userId: z
    .string()
    .min(17)
    .max(22)
    .regex(/^\d+$/, "User ID must be a numeric string"),
});

export const tokenGenResponseSchema = z.object({
  token: z.guid(),
  expiresAt: z.date(),
});

export const validateRequestSchema = z.object({
  token: z.guid(),
});

export const SubmitDataRequestSchema = z.object({
  token: z.guid(),
  selectedDates: z.array(z.coerce.date()),
});

export const SubmitDataResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
