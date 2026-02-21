import { z } from 'zod';

export const tokenGenRequestSchema = z.object({
  userId: z.string().min(17).max(18).regex(/^\d+$/, 'User ID must be a numeric string'),
})

export const tokenGenResponseSchema = z.object({
  token: z.guid(),
  expiresAt: z.date(),
})

export const validateRequestSchema = z.object({
  token: z.guid(),
});

export const validateResponseSchema = z.object({
  valid: z.boolean(),
  userId: z.string().min(17).max(18).regex(/^\d+$/, 'User ID must be a numeric string').nullable(),
});