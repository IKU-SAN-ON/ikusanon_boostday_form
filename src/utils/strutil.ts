/**
 * Calculates the Levenshtein distance between two strings.
 *
 * @param a - The first string.
 * @param b - The second string.
 * @returns The Levenshtein distance between the two strings.
 */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  let current = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i++) {
    current[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + substitutionCost,
      );
    }
    [previous, current] = [current, previous];
  }

  return previous[b.length];
}

/**
 * Calculates the similarity ratio between two strings as a percentage.
 *
 * @param a - The first string.
 * @param b - The second string.
 * @returns The similarity ratio between the two strings as a percentage.
 */
export function ratio(a: string, b: string): number {
  if (a === b) return 100;
  const longest = Math.max(a.length, b.length);
  if (longest === 0) return 100;
  return (1 - levenshtein(a, b) / longest) * 100;
}
