import { clampQuantity, initialOfferListState } from './offerListReducer'
import type { OfferListItem, OfferListState } from './types'

export const OFFER_LIST_STORAGE_KEY = 'tessa-elmek.offer-list.v1'

/**
 * localStorage can throw (Safari private mode, blocked storage, quota) and can
 * hold garbage from older versions. Every access is guarded; a failure simply
 * means the list starts empty / is not persisted.
 */
export function loadOfferListState(storage: Storage | undefined = safeStorage()): OfferListState {
  if (!storage) return initialOfferListState
  try {
    const raw = storage.getItem(OFFER_LIST_STORAGE_KEY)
    if (!raw) return initialOfferListState
    const parsed: unknown = JSON.parse(raw)
    return { items: sanitizeItems(parsed) }
  } catch {
    return initialOfferListState
  }
}

export function saveOfferListState(
  state: OfferListState,
  storage: Storage | undefined = safeStorage(),
): void {
  if (!storage) return
  try {
    if (state.items.length === 0) {
      storage.removeItem(OFFER_LIST_STORAGE_KEY)
    } else {
      storage.setItem(OFFER_LIST_STORAGE_KEY, JSON.stringify({ items: state.items }))
    }
  } catch {
    // Storage blocked or full: the list still works for this session.
  }
}

function safeStorage(): Storage | undefined {
  try {
    if (typeof window === 'undefined') return undefined
    return window.localStorage
  } catch {
    return undefined
  }
}

function sanitizeItems(value: unknown): OfferListItem[] {
  if (!isRecord(value) || !Array.isArray(value.items)) return []
  const items: OfferListItem[] = []
  const seen = new Set<string>()
  for (const candidate of value.items) {
    const item = sanitizeItem(candidate)
    if (item && !seen.has(item.productId)) {
      items.push(item)
      seen.add(item.productId)
    }
  }
  return items
}

function sanitizeItem(value: unknown): OfferListItem | null {
  if (!isRecord(value)) return null
  const { productId, slug, code, name, brand, imageUrl, quantity } = value
  if (
    typeof productId !== 'string' ||
    typeof slug !== 'string' ||
    typeof code !== 'string' ||
    typeof name !== 'string' ||
    typeof quantity !== 'number'
  ) {
    return null
  }
  const item: OfferListItem = {
    productId,
    slug,
    code,
    name,
    brand: typeof brand === 'string' ? brand : '',
    quantity: clampQuantity(quantity),
  }
  if (typeof imageUrl === 'string' && imageUrl) item.imageUrl = imageUrl
  return item
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
