import type { ChunithmSongDifficulty as SongDifficulty } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { normalizeSearchText } from "@/utils/buildSearchText";

import { ratio } from "@/utils/strutil";

type SongRecord = {
  id: number;
  title: string;
  artist: string;
  genre: string;
  const: number;
  difficulty: SongDifficulty;
  chunirec_id: string;
  notes: number;
  unknown: boolean;
  search_terms: string;
};

export type SongMatch = SongRecord & { score: number };

const CACHE_TTL_MS = 5 * 60 * 1000;
let songCache: { rows: SongRecord[]; loadedAt: number } | null = null;

/**
 * Loads all songs from the database, caching them for a short time to avoid repeated queries.
 *
 * @returns {Promise<SongRecord[]>} A promise that resolves to an array of song records.
 */
async function loadSongs(): Promise<SongRecord[]> {
  if (songCache && Date.now() - songCache.loadedAt < CACHE_TTL_MS) {
    return songCache.rows;
  }

  const rows = await prisma.chunithmSong.findMany({
    select: {
      id: true,
      title: true,
      artist: true,
      genre: true,
      const: true,
      difficulty: true,
      chunirec_id: true,
      notes: true,
      unknown: true,
      search_terms: true,
    },
  });

  songCache = { rows, loadedAt: Date.now() };
  return rows;
}

/** Call after a song upsert if you want the next search to see it immediately. */
export function invalidateSongCache(): void {
  songCache = null;
}

/**
 * Token-set similarity (0-100): compare the shared tokens first, then compare
 * the remaining tokens, so extra words/variants do not penalize a match.
 */
export function tokenSetRatio(a: string, b: string): number {
  const aTokens = new Set(a.split(/\s+/).filter(Boolean));
  const bTokens = new Set(b.split(/\s+/).filter(Boolean));
  if (!aTokens.size || !bTokens.size) return 0;

  const intersection: string[] = [];
  const onlyA: string[] = [];
  const onlyB: string[] = [];

  for (const token of aTokens) {
    if (bTokens.has(token)) intersection.push(token);
    else onlyA.push(token);
  }
  for (const token of bTokens) {
    if (!aTokens.has(token)) onlyB.push(token);
  }

  intersection.sort();
  onlyA.sort();
  onlyB.sort();

  const section = intersection.join(" ");
  const combinedA = [section, ...onlyA].filter(Boolean).join(" ");
  const combinedB = [section, ...onlyB].filter(Boolean).join(" ");

  return Math.max(
    ratio(section, combinedA),
    ratio(section, combinedB),
    ratio(combinedA, combinedB),
  );
}

/**
 * Fuzzy-match songs from Postgres. Results are chart rows: the same title can
 * appear once per difficulty, so callers may want to group by chunirec_id.
 */
export async function getSongs(
  query: string,
  limit = 10,
  difficulty?: SongDifficulty,
): Promise<SongMatch[]> {
  const normalizedQuery = normalizeSearchText(query);
  const safeLimit = Math.max(0, Math.trunc(limit));
  if (!normalizedQuery || safeLimit === 0) return [];

  const rows = await loadSongs();
  const candidates = difficulty
    ? rows.filter((song) => song.difficulty === difficulty)
    : rows;

  return candidates
    .map((song) => ({
      ...song,
      score: tokenSetRatio(normalizedQuery, song.search_terms),
    }))
    .filter((song) => song.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.search_terms.length - b.search_terms.length ||
        a.title.localeCompare(b.title),
    )
    .slice(0, safeLimit);
}

export async function getSong(query: string): Promise<SongMatch | null> {
  const [match] = await getSongs(query, 1);
  return match ?? null;
}
