/**
 * Lower-cases and strips diacritics so "Masura" matches "Măsură" and
 * "ş" (cedilla) matches "ș" (comma below).
 */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ş/g, 's')
    .replace(/ţ/g, 't')
    .toLowerCase()
    .trim()
}

/** Splits a search phrase into normalized, non-empty tokens. */
export function searchTokens(query: string): string[] {
  return normalizeText(query)
    .split(/\s+/)
    .filter((token) => token.length > 0)
}

/** True when every token of `query` appears somewhere in `haystack`. */
export function matchesAllTokens(haystack: string, query: string): boolean {
  const tokens = searchTokens(query)
  if (tokens.length === 0) return true
  const normalized = normalizeText(haystack)
  return tokens.every((token) => normalized.includes(token))
}

/** Builds a URL-safe slug from Romanian text. */
export function slugify(value: string): string {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
