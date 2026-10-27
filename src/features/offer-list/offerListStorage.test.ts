import { describe, expect, it } from 'vitest'
import { OFFER_LIST_STORAGE_KEY, loadOfferListState, saveOfferListState } from './offerListStorage'
import { MAX_QUANTITY, MIN_QUANTITY, type OfferListItem, type OfferListState } from './types'

// ---------------------------------------------------------------------------
// Storage stubs
// ---------------------------------------------------------------------------

interface MemoryStorage extends Storage {
  /** Plain view of everything written, for assertions. */
  dump(): Record<string, string>
}

function createMemoryStorage(initial: Record<string, string> = {}): MemoryStorage {
  const map = new Map(Object.entries(initial))
  return {
    get length() {
      return map.size
    },
    clear: () => {
      map.clear()
    },
    getItem: (key) => map.get(key) ?? null,
    key: (index) => [...map.keys()][index] ?? null,
    removeItem: (key) => {
      map.delete(key)
    },
    setItem: (key, value) => {
      map.set(key, String(value))
    },
    dump: () => Object.fromEntries(map),
  }
}

/** Mimics Safari private mode / blocked storage: every access throws. */
function createThrowingStorage(): Storage {
  const fail = (): never => {
    throw new Error('SecurityError: accesul la localStorage este blocat')
  }
  return { length: 0, clear: fail, getItem: fail, key: fail, removeItem: fail, setItem: fail }
}

function withRaw(raw: string): MemoryStorage {
  return createMemoryStorage({ [OFFER_LIST_STORAGE_KEY]: raw })
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const releu: OfferListItem = {
  productId: 'p-rgu-10',
  slug: 'releu-protectie-diferentiala-rgu-10',
  code: 'RGU-10',
  name: 'Releu de protecție diferențială RGU-10',
  brand: 'Circutor',
  imageUrl: '/img/rgu-10.jpg',
  quantity: 2,
}

const analizor: OfferListItem = {
  productId: 'p-m54510',
  slug: 'analizor-retea-cvm-c10',
  code: 'M54510',
  name: 'Analizor de rețea CVM-C10',
  brand: 'Circutor',
  quantity: 5,
}

const state: OfferListState = { items: [releu, analizor] }

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('loadOfferListState', () => {
  it('returns an empty list when nothing is stored', () => {
    expect(loadOfferListState(createMemoryStorage())).toEqual({ items: [] })
  })

  it('returns an empty list when the stored value is an empty string', () => {
    expect(loadOfferListState(withRaw(''))).toEqual({ items: [] })
  })

  it('ignores malformed JSON', () => {
    expect(loadOfferListState(withRaw('{not json'))).toEqual({ items: [] })
  })

  it.each(['null', '42', '"text"', '[]', '{}', '{"items": {"a": 1}}', '{"items": "x"}'])(
    'ignores a payload whose items are not an array: %s',
    (raw) => {
      expect(loadOfferListState(withRaw(raw))).toEqual({ items: [] })
    },
  )

  it('drops items that are missing required fields or have wrong types', () => {
    const raw = JSON.stringify({
      items: [
        releu,
        { ...analizor, productId: undefined },
        { ...analizor, productId: 'p-1', code: 123 },
        { ...analizor, productId: 'p-2', quantity: '3' },
        { ...analizor, productId: 'p-3', name: null },
        { ...analizor, productId: 'p-4', slug: undefined },
        'text',
        null,
        7,
      ],
    })
    expect(loadOfferListState(withRaw(raw))).toEqual({ items: [releu] })
  })

  it('defaults brand to an empty string and keeps imageUrl only when it is a non-empty string', () => {
    const raw = JSON.stringify({
      items: [
        { ...releu, brand: undefined, imageUrl: '' },
        { ...analizor, brand: 42, imageUrl: 17 },
      ],
    })
    const loaded = loadOfferListState(withRaw(raw))
    expect(loaded.items).toHaveLength(2)
    expect(loaded.items[0]).toEqual({ ...releu, brand: '', imageUrl: undefined })
    expect(loaded.items[0]).not.toHaveProperty('imageUrl')
    expect(loaded.items[1]).toEqual({ ...analizor, brand: '' })
    expect(loaded.items[1]).not.toHaveProperty('imageUrl')
  })

  it('keeps only the first occurrence of a duplicated productId', () => {
    const raw = JSON.stringify({ items: [releu, { ...releu, quantity: 9 }, analizor] })
    expect(loadOfferListState(withRaw(raw))).toEqual({ items: [releu, analizor] })
  })

  it('clamps and rounds stored quantities', () => {
    const raw = JSON.stringify({
      items: [
        { ...releu, quantity: 0 },
        { ...analizor, quantity: MAX_QUANTITY + 500 },
        { ...analizor, productId: 'p-3', quantity: 2.6 },
        { ...analizor, productId: 'p-4', quantity: -1 },
      ],
    })
    const loaded = loadOfferListState(withRaw(raw))
    expect(loaded.items.map((item) => item.quantity)).toEqual([MIN_QUANTITY, MAX_QUANTITY, 3, MIN_QUANTITY])
  })

  it('returns an empty list when the storage throws', () => {
    expect(loadOfferListState(createThrowingStorage())).toEqual({ items: [] })
  })

  it('tolerates an undefined storage', () => {
    expect(loadOfferListState(undefined)).toEqual({ items: [] })
    expect(loadOfferListState()).toEqual({ items: [] })
  })
})

describe('saveOfferListState', () => {
  it('round-trips through load', () => {
    const storage = createMemoryStorage()
    saveOfferListState(state, storage)
    expect(loadOfferListState(storage)).toEqual(state)
  })

  it('writes { items } as JSON under the versioned key', () => {
    const storage = createMemoryStorage()
    saveOfferListState(state, storage)
    const dump = storage.dump()
    expect(Object.keys(dump)).toEqual([OFFER_LIST_STORAGE_KEY])
    expect(JSON.parse(dump[OFFER_LIST_STORAGE_KEY] ?? '')).toEqual({ items: state.items })
  })

  it('overwrites a previous value', () => {
    const storage = createMemoryStorage()
    saveOfferListState(state, storage)
    saveOfferListState({ items: [analizor] }, storage)
    expect(loadOfferListState(storage)).toEqual({ items: [analizor] })
  })

  it('removes the key when the list is empty', () => {
    const storage = withRaw(JSON.stringify(state))
    saveOfferListState({ items: [] }, storage)
    expect(storage.getItem(OFFER_LIST_STORAGE_KEY)).toBeNull()
    expect(storage.length).toBe(0)
  })

  it('does not throw when the storage throws', () => {
    const throwing = createThrowingStorage()
    expect(() => saveOfferListState(state, throwing)).not.toThrow()
    expect(() => saveOfferListState({ items: [] }, throwing)).not.toThrow()
  })

  it('tolerates an undefined storage', () => {
    expect(() => saveOfferListState(state, undefined)).not.toThrow()
    expect(() => saveOfferListState(state)).not.toThrow()
  })
})
