import * as wanakana from "wanakana";
import type { ChunithmSong } from "@/lib/definitions";

const SYMBOL_REPLACEMENTS: Record<string, string> = {
  "&": " and ",
  "+": " plus ",
  "×": " x ",
  "÷": " div ",
  "∞": " infinity ",
  "∀": "a",
  "∃": "e",
  Ø: "o",
  ø: "o",
  Æ: "ae",
  æ: "ae",
  Œ: "oe",
  œ: "oe",
  ß: "ss",
  Ł: "l",
  ł: "l",
  Đ: "d",
  đ: "d",
  Ð: "d",
  ð: "d",
  Þ: "th",
  þ: "th",
};

const GREEK_REPLACEMENTS: Record<string, string> = {
  α: "a",
  β: "b",
  γ: "g",
  δ: "d",
  ε: "e",
  ζ: "z",
  η: "e",
  θ: "th",
  ι: "i",
  κ: "k",
  λ: "l",
  μ: "m",
  ν: "n",
  ξ: "x",
  ο: "o",
  π: "p",
  ρ: "r",
  σ: "s",
  ς: "s",
  τ: "t",
  υ: "u",
  φ: "f",
  χ: "ch",
  ψ: "ps",
  ω: "o",
};

/**
 * Removes punctuation/symbols while preserving letters, numbers and marks.
 * Used both for the original-title variant and the fully normalized variant.
 */
function stripSymbols(text: string): string {
  return text
    .replace(/['\u2018\u2019\u02BC\u0060\u00B4]/g, "")
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Normalizes a song title or a fuzzy-search query using the same rules.
 *
 * Kana/kanji are preserved (and kana is also emitted as romaji).
 * Greek is transliterated.
 * Latin diacritics and OCR-hostile symbols are reduced.
 */
export function normalizeSearchText(value: string): string {
  const cleaned = value
    .normalize("NFKC")
    .replace(/\p{Cf}|\uFE0E|\uFE0F/gu, "")
    .toLowerCase();

  // Keep the original script (katakana, kanji, Greek, accents) with symbols
  // removed; OCR is usually better at scripts than at decorative symbols.
  const original = stripSymbols(cleaned);

  // Strip diacritics from Latin/Greek/Cyrillic only; kana dakuten are meaningful.
  let text = cleaned
    .normalize("NFD")
    .replace(
      /(?<=[\p{Script=Latin}\p{Script=Greek}\p{Script=Cyrillic}])\p{M}+/gu,
      "",
    )
    .normalize("NFC");

  text = text
    .replace(/[\u0370-\u03FF\u1F00-\u1FFF]/gu, (char) => {
      return GREEK_REPLACEMENTS[char] ?? char;
    })
    .replace(/[&+×÷∞∀∃ØøÆæŒœßŁłĐđÐðÞþ]/g, (char) => {
      return SYMBOL_REPLACEMENTS[char] ?? char;
    });

  text = stripSymbols(text);

  // passRomaji is required: without it wanakana converts Latin ("Re") to kana.
  // Keep "ー" in kana, but drop it from romaji so OCR that omits long vowels
  // still matches.
  const kana = text
    ? wanakana.toHiragana(text, {
        passRomaji: true,
        convertLongVowelMark: false,
      })
    : "";
  const romaji = kana
    ? wanakana
        .toRomaji(kana, { passRomaji: true, convertLongVowelMark: false })
        .replace(/-/g, "")
        .replace(/['\u2018\u2019]/g, "")
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .replace(/\s+/g, " ")
        .trim()
    : "";

  const variants = [original, kana, romaji].filter((variant) => variant);
  return Array.from(new Set(variants)).join(" ");
}

export function buildSearchText(song: ChunithmSong): string {
  return normalizeSearchText(song.title);
}
