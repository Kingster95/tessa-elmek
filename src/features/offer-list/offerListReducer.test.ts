import { describe, expect, it } from 'vitest'
import type { Product } from '../../data/types'
import {
  clampQuantity,
  initialOfferListState,
  offerListReducer,
  toOfferListItem,
} from './offerListReducer'
import { MAX_QUANTITY, MIN_QUANTITY, type OfferListItem, type OfferListState } from './types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p-rgu-10',
    slug: 'releu-protectie-diferentiala-rgu-10',
    code: 'RGU-10',
    name: 'Releu de protecție diferențială RGU-10',
    shortDescription: 'Releu diferențial cu toroid extern.',
    longDescription: 'Descriere completă.',
    categoryId: 'cat-protectie',
    brand: 'Circutor',
    keySpecs: [{ label: 'Tensiune', value: '230 V c.a.' }],
    specs: [{ label: 'Tensiune', value: '230 V c.a.' }],
    documents: [],
    imageUrls: ['/img/rgu-10.jpg'],
    relatedProductIds: [],
    ...overrides,
  }
}

const releu = makeProduct()
const analizor = makeProduct({
  id: 'p-m54510',
  slug: 'analizor-retea-cvm-c10',
  code: 'M54510',
  name: 'Analizor de rețea CVM-C10',
  categoryId: 'cat-masura',
  imageUrls: [],
})

function stateWith(...items: OfferListItem[]): OfferListState {
  return { items }
}

function snapshot(state: OfferListState): string {
  return JSON.stringify(state)
}

// ---------------------------------------------------------------------------
// clampQuantity / toOfferListItem
// ---------------------------------------------------------------------------

describe('clampQuantity', () => {
  it.each([
    [1, 1],
    [0, MIN_QUANTITY],
    [-7, MIN_QUANTITY],
    [MAX_QUANTITY, MAX_QUANTITY],
    [MAX_QUANTITY + 1, MAX_QUANTITY],
    [2.4, 2],
    [2.5, 3],
    [7.49, 7],
    [Number.NaN, MIN_QUANTITY],
    [Number.POSITIVE_INFINITY, MIN_QUANTITY],
    [Number.NEGATIVE_INFINITY, MIN_QUANTITY],
  ])('clampQuantity(%s) -> %s', (input, expected) => {
    expect(clampQuantity(input)).toBe(expected)
  })
})

describe('toOfferListItem', () => {
  it('snapshots the fields the UI needs and clamps the quantity', () => {
    expect(toOfferListItem(releu, 0)).toEqual({
      productId: 'p-rgu-10',
      slug: 'releu-protectie-diferentiala-rgu-10',
      code: 'RGU-10',
      name: 'Releu de protecție diferențială RGU-10',
      brand: 'Circutor',
      imageUrl: '/img/rgu-10.jpg',
      quantity: 1,
    })
  })

  it('uses the first image only', () => {
    const product = makeProduct({ imageUrls: ['/img/a.jpg', '/img/b.jpg'] })
    expect(toOfferListItem(product, 1).imageUrl).toBe('/img/a.jpg')
  })

  it('omits imageUrl when the product has no images', () => {
    expect(toOfferListItem(analizor, 1)).not.toHaveProperty('imageUrl')
  })

  it('omits imageUrl when the first image is an empty string', () => {
    const product = makeProduct({ imageUrls: ['', '/img/b.jpg'] })
    expect(toOfferListItem(product, 1)).not.toHaveProperty('imageUrl')
  })
})

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

describe('offerListReducer – add', () => {
  it('adds a new item with a snapshot of the product', () => {
    const next = offerListReducer(initialOfferListState, { type: 'add', product: releu, quantity: 2 })
    expect(next.items).toEqual([{ ...toOfferListItem(releu, 1), quantity: 2 }])
  })

  it('appends new items after existing ones', () => {
    const state = stateWith(toOfferListItem(releu, 1))
    const next = offerListReducer(state, { type: 'add', product: analizor, quantity: 1 })
    expect(next.items.map((item) => item.productId)).toEqual(['p-rgu-10', 'p-m54510'])
  })

  it.each([0, -3, Number.NaN, 0.4])('clamps a new item quantity of %s up to 1', (quantity) => {
    const next = offerListReducer(initialOfferListState, { type: 'add', product: releu, quantity })
    expect(next.items[0]?.quantity).toBe(MIN_QUANTITY)
  })

  it('increments the quantity when the product is already listed', () => {
    const state = stateWith(toOfferListItem(releu, 2), toOfferListItem(analizor, 1))
    const next = offerListReducer(state, { type: 'add', product: releu, quantity: 3 })
    expect(next.items).toHaveLength(2)
    expect(next.items[0]?.quantity).toBe(5)
    expect(next.items[1]).toEqual(state.items[1])
  })

  it('caps the incremented quantity at MAX_QUANTITY', () => {
    const state = stateWith(toOfferListItem(releu, MAX_QUANTITY - 1))
    const next = offerListReducer(state, { type: 'add', product: releu, quantity: 10 })
    expect(next.items[0]?.quantity).toBe(MAX_QUANTITY)
  })

  it('does not mutate the previous state', () => {
    const state = stateWith(toOfferListItem(releu, 1))
    const before = snapshot(state)
    const next = offerListReducer(state, { type: 'add', product: releu, quantity: 1 })
    expect(snapshot(state)).toBe(before)
    expect(next).not.toBe(state)
    expect(next.items).not.toBe(state.items)
  })
})

describe('offerListReducer – setQuantity', () => {
  const state = stateWith(toOfferListItem(releu, 2), toOfferListItem(analizor, 4))

  it('sets the quantity of the matching item only', () => {
    const next = offerListReducer(state, { type: 'setQuantity', productId: 'p-rgu-10', quantity: 7 })
    expect(next.items.map((item) => item.quantity)).toEqual([7, 4])
  })

  it.each([
    [0, MIN_QUANTITY],
    [-5, MIN_QUANTITY],
    [MAX_QUANTITY + 1, MAX_QUANTITY],
    [2.4, 2],
    [2.5, 3],
    [Number.NaN, MIN_QUANTITY],
    [Number.POSITIVE_INFINITY, MIN_QUANTITY],
  ])('clamps and rounds %s to %s', (quantity, expected) => {
    const next = offerListReducer(state, { type: 'setQuantity', productId: 'p-rgu-10', quantity })
    expect(next.items[0]?.quantity).toBe(expected)
  })

  it('is a no-op for an unknown productId', () => {
    const next = offerListReducer(state, { type: 'setQuantity', productId: 'nu-exista', quantity: 9 })
    expect(next.items).toEqual(state.items)
  })
})

describe('offerListReducer – remove', () => {
  const state = stateWith(toOfferListItem(releu, 2), toOfferListItem(analizor, 4))

  it('removes only the matching item', () => {
    const next = offerListReducer(state, { type: 'remove', productId: 'p-rgu-10' })
    expect(next.items.map((item) => item.productId)).toEqual(['p-m54510'])
  })

  it('is a no-op for an unknown productId', () => {
    const next = offerListReducer(state, { type: 'remove', productId: 'nu-exista' })
    expect(next.items).toEqual(state.items)
  })

  it('does not mutate the previous state', () => {
    const before = snapshot(state)
    offerListReducer(state, { type: 'remove', productId: 'p-rgu-10' })
    expect(snapshot(state)).toBe(before)
  })
})

describe('offerListReducer – clear', () => {
  it('empties the list', () => {
    const state = stateWith(toOfferListItem(releu, 2), toOfferListItem(analizor, 4))
    const next = offerListReducer(state, { type: 'clear' })
    expect(next).toEqual({ items: [] })
    expect(next).toBe(initialOfferListState)
  })
})
