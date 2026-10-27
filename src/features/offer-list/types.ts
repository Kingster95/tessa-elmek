import type { Product } from '../../data/types'

/** A product line in the offer list. Snapshot of the fields the UI needs. */
export interface OfferListItem {
  productId: string
  slug: string
  code: string
  name: string
  brand: string
  imageUrl?: string
  quantity: number
}

export interface OfferListState {
  items: OfferListItem[]
}

export type OfferListAction =
  | { type: 'add'; product: Product; quantity: number }
  | { type: 'setQuantity'; productId: string; quantity: number }
  | { type: 'remove'; productId: string }
  | { type: 'clear' }
  /** Replace the whole list, e.g. after another tab changed localStorage. */
  | { type: 'replace'; items: OfferListItem[] }

export const MIN_QUANTITY = 1
export const MAX_QUANTITY = 9999
