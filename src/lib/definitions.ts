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

export type ChunithmSongDifficulty = "BAS" | "ADV" | "EXP" | "MAS" | "ULT";

export const chunithmSongDifficultyEnum = [
  "BAS",
  "ADV",
  "EXP",
  "MAS",
  "ULT",
] as const satisfies ChunithmSongDifficulty[];

export const chunithmSongsRequestSchema = z.array(
  z.object({
    title: z.string(),
    artist: z.string(),
    img: z.string(),
    genre: z.string(),
    const: z.number(),
    level: z.number(),
    diff: z.enum(chunithmSongDifficultyEnum),
    notes: z.number(),
    unknown: z.coerce.boolean(),
    chunirec_id: z.string(),
    idx: z.string(),
    bpm: z.number(),
    release: z.number(),
    version: z.string().optional(),
  }),
);

export const getSongConstantRequestSchema = z.object({
  q: z.string().trim().min(1),
  diff: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase())
    .pipe(z.enum(chunithmSongDifficultyEnum)),
});

export interface ChunithmSong {
  title: string;
  artist: string;
  img: string;
  genre: string;
  const: number;
  level: number;
  diff: ChunithmSongDifficulty;
  notes: number;
  unknown: boolean;
  chunirec_id: string;
  idx: string;
  bpm: number;
  release: number;
  version?: string;
}
