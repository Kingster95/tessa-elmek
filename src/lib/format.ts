/** "2026-03-14" -> "14.03.2026" (Romanian numeric date). */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${day}.${month}.${date.getUTCFullYear()}`
}

/** "2026-03-14" -> "14 martie 2026". */
export function formatDateLong(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate
  return new Intl.DateTimeFormat('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

/**
 * Romanian plural for products: 1 produs, 2–19 produse, 20+ "de produse".
 * `none` is returned for zero so callers can show "Niciun produs".
 */
export function formatProductCount(count: number, none = 'Niciun produs'): string {
  if (count === 0) return none
  if (count === 1) return '1 produs'
  const rest = count % 100
  if (count < 20 || (rest >= 1 && rest <= 19)) return `${count} produse`
  return `${count} de produse`
}

/** Generic Romanian plural helper: pluralize(3, 'document', 'documente'). */
export function pluralize(count: number, singular: string, plural: string): string {
  if (count === 1) return `1 ${singular}`
  const rest = count % 100
  if (count < 20 || (rest >= 1 && rest <= 19)) return `${count} ${plural}`
  return `${count} de ${plural}`
}

/** Splits a long description into paragraphs on blank lines. */
export function toParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)
}
