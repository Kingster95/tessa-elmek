import type { Product } from '../../data/types'
import {
  MAX_QUANTITY,
  MIN_QUANTITY,
  type OfferListAction,
  type OfferListItem,
  type OfferListState,
} from './types'

export const initialOfferListState: OfferListState = { items: [] }

export function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) return MIN_QUANTITY
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Math.round(value)))
}

export function toOfferListItem(product: Product, quantity: number): OfferListItem {
  const item: OfferListItem = {
    productId: product.id,
    slug: product.slug,
    code: product.code,
    name: product.name,
    brand: product.brand,
    quantity: clampQuantity(quantity),
  }
  if (product.imageUrls[0]) item.imageUrl = product.imageUrls[0]
  return item
}

export function offerListReducer(state: OfferListState, action: OfferListAction): OfferListState {
  switch (action.type) {
    case 'add': {
      const existing = state.items.find((item) => item.productId === action.product.id)
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.productId === action.product.id
              ? { ...item, quantity: clampQuantity(item.quantity + action.quantity) }
              : item,
          ),
        }
      }
      return { items: [...state.items, toOfferListItem(action.product, action.quantity)] }
    }
    case 'setQuantity':
      return {
        items: state.items.map((item) =>
          item.productId === action.productId
            ? { ...item, quantity: clampQuantity(action.quantity) }
            : item,
        ),
      }
    case 'remove':
      return { items: state.items.filter((item) => item.productId !== action.productId) }
    case 'clear':
      return initialOfferListState
    case 'replace':
      return { items: action.items }
    default:
      return state
  }
}
