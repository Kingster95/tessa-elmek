import { createContext } from 'react'
import type { Product } from '../../data/types'
import type { OfferListItem } from './types'

export interface OfferListNotice {
  id: number
  message: string
}

export interface OfferListContextValue {
  items: OfferListItem[]
  /** Number of distinct product lines (what the header badge shows). */
  itemCount: number
  /** Sum of all quantities. */
  totalQuantity: number
  /** Short-lived feedback after add/remove, rendered as a toast by the layout. */
  notice: OfferListNotice | null
  add: (product: Product, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  remove: (productId: string) => void
  clear: () => void
  has: (productId: string) => boolean
  dismissNotice: () => void
}

export const OfferListContext = createContext<OfferListContextValue | null>(null)
