import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import type {
  Category,
  CompanyInfo,
  Download,
  NewsItem,
  Partner,
  Product,
  QuoteRequest,
} from '../types'
import { MockRepository, type MockDataSet } from './MockRepository'

// ---------------------------------------------------------------------------
// Fixture
// ---------------------------------------------------------------------------

function makeCategory(id: string, slug: string, name: string, order: number): Category {
  return {
    id,
    slug,
    name,
    order,
    shortDescription: `${name} – descriere scurtă.`,
    description: `${name} – descriere pentru pagina categoriei.`,
  }
}

type ProductSeed = Pick<Product, 'id' | 'code' | 'name' | 'categoryId'> & Partial<Product>

function makeProduct(seed: ProductSeed): Product {
  return {
    slug: seed.id,
    brand: 'Circutor',
    shortDescription: `${seed.name} – descriere scurtă.`,
    longDescription: `${seed.name} – descriere completă.\n\nAl doilea paragraf.`,
    keySpecs: [{ label: 'Tensiune nominală', value: '230 V c.a.' }],
    specs: [{ label: 'Tensiune nominală', value: '230 V c.a.' }],
    documents: [],
    imageUrls: [],
    relatedProductIds: [],
    ...seed,
  }
}

// Deliberately NOT in display order, so sorting is actually exercised.
const fixtureCategories: Category[] = [
  makeCategory('cat-protectie', 'protectie-control-electric', 'Protecție și control electric', 2),
  makeCategory(
    'cat-contorizare',
    'contorizare-calitate-energie',
    'Contorizare și analiza calității energiei',
    3,
  ),
  makeCategory('cat-masura', 'aparate-masura-control', 'Aparate pentru măsură și control electric', 1),
]

// Interleaved across categories; "cat-contorizare" intentionally has no products.
const fixtureProducts: Product[] = [
  makeProduct({
    id: 'p-rgu-10',
    slug: 'releu-protectie-diferentiala-rgu-10',
    code: 'RGU-10',
    name: 'Releu de protecție diferențială RGU-10',
    categoryId: 'cat-protectie',
    relatedProductIds: ['p-wru-10'],
    imageUrls: ['/img/rgu-10.jpg'],
  }),
  makeProduct({
    id: 'p-m54510',
    code: 'M54510',
    name: 'Analizor de rețea CVM-C10',
    categoryId: 'cat-masura',
    relatedProductIds: ['p-m54520'],
  }),
  makeProduct({
    id: 'p-wru-10',
    code: 'WRU-10',
    name: 'Toroid WRU-10 pentru protecție diferențială',
    categoryId: 'cat-protectie',
    relatedProductIds: ['p-nu-exista', 'p-rgu-10'],
  }),
  makeProduct({
    id: 'p-m54520',
    code: 'M54520',
    name: 'Multimetru de panou CVM-E3-MINI',
    categoryId: 'cat-masura',
  }),
  makeProduct({
    id: 'p-m31030',
    code: 'M31030',
    name: 'Transformator de curent TC5 pentru măsură 100/5 A',
    categoryId: 'cat-masura',
    relatedProductIds: ['p-rgu-10'],
  }),
  makeProduct({
    id: 'p-m31040',
    code: 'M31040',
    name: 'Transformator de curent TC6 pentru măsură 250/5 A',
    categoryId: 'cat-masura',
  }),
  makeProduct({
    id: 'p-m31050',
    code: 'M31050',
    name: 'Șunt de măsură 100 A / 60 mV',
    categoryId: 'cat-masura',
  }),
]

const fixtureCompany: CompanyInfo = {
  name: 'Tessa Elmek',
  legalName: 'Tessa Elmek S.R.L.',
  address: { street: 'Str. Exemplu nr. 1', city: 'București', postalCode: '010101', country: 'România' },
  phone: '021-000.00.00',
  phoneHref: '+40210000000',
  email: 'office@exemplu.ro',
  fiscalCode: 'RO12345678',
  registrationNumber: 'J40/1234/2006',
  schedule: 'Luni – Vineri, 08:30 – 17:00',
  foundedYear: 2006,
}

const fixturePartners: Partner[] = [
  { id: 'partner-circutor', name: 'Circutor', description: 'Măsură și eficiență energetică.', featured: true },
]

// Deliberately NOT newest-first.
const fixtureNews: NewsItem[] = [
  { id: 'news-2', slug: 'noutate-veche', title: 'Noutate mai veche', date: '2025-11-02', summary: 'Rezumat.' },
  { id: 'news-3', slug: 'noutate-noua', title: 'Noutate recentă', date: '2026-03-14', summary: 'Rezumat.' },
  { id: 'news-1', slug: 'noutate-medie', title: 'Noutate intermediară', date: '2026-01-20', summary: 'Rezumat.' },
]

const fixtureDownloads: Download[] = [
  { id: 'dl-catalog', title: 'Catalog general 2026', format: 'PDF', url: '/descarcari/catalog-2026.pdf', sizeLabel: '4,2 MB' },
]

const fixture: MockDataSet = {
  company: fixtureCompany,
  categories: fixtureCategories,
  products: fixtureProducts,
  partners: fixturePartners,
  news: fixtureNews,
  downloads: fixtureDownloads,
}

const ALL_PRODUCT_IDS_IN_CATALOG_ORDER = [
  'p-m54510',
  'p-m54520',
  'p-m31030',
  'p-m31040',
  'p-m31050',
  'p-rgu-10',
  'p-wru-10',
]

type Log = (message: string, payload: unknown) => void

function createRepository() {
  const log = vi.fn<Log>()
  const repo = new MockRepository({ delayMs: 0, data: fixture, log })
  return { repo, log }
}

const ids = (products: Product[]) => products.map((product) => product.id)

async function flushMicrotasks(): Promise<void> {
  for (let i = 0; i < 10; i += 1) await Promise.resolve()
}

function duplicates(values: string[]): string[] {
  const seen = new Set<string>()
  const dupes = new Set<string>()
  for (const value of values) {
    if (seen.has(value)) dupes.add(value)
    seen.add(value)
  }
  return [...dupes]
}

// ---------------------------------------------------------------------------
// Behaviour against the fixture
// ---------------------------------------------------------------------------

describe('MockRepository – categories', () => {
  it('getCategories returns categories sorted by order', async () => {
    const { repo } = createRepository()
    const categories = await repo.getCategories()
    expect(categories.map((category) => category.slug)).toEqual([
      'aparate-masura-control',
      'protectie-control-electric',
      'contorizare-calitate-energie',
    ])
  })

  it('getCategory returns the category for a known slug', async () => {
    const { repo } = createRepository()
    const category = await repo.getCategory('protectie-control-electric')
    expect(category).toEqual(fixtureCategories[0])
  })

  it('getCategory returns null for an unknown slug', async () => {
    const { repo } = createRepository()
    await expect(repo.getCategory('nu-exista')).resolves.toBeNull()
  })
})

describe('MockRepository – products', () => {
  it('getProducts without a query returns every product grouped by category order', async () => {
    const { repo } = createRepository()
    const products = await repo.getProducts()
    expect(ids(products)).toEqual(ALL_PRODUCT_IDS_IN_CATALOG_ORDER)
  })

  it('getProducts with an empty query object behaves like no query', async () => {
    const { repo } = createRepository()
    expect(ids(await repo.getProducts({}))).toEqual(ALL_PRODUCT_IDS_IN_CATALOG_ORDER)
  })

  it('getProducts filters by categorySlug', async () => {
    const { repo } = createRepository()
    const products = await repo.getProducts({ categorySlug: 'protectie-control-electric' })
    expect(ids(products)).toEqual(['p-rgu-10', 'p-wru-10'])
  })

  it('getProducts returns [] for an unknown categorySlug', async () => {
    const { repo } = createRepository()
    await expect(repo.getProducts({ categorySlug: 'nu-exista' })).resolves.toEqual([])
  })

  it('getProducts returns [] for a category without products', async () => {
    const { repo } = createRepository()
    await expect(repo.getProducts({ categorySlug: 'contorizare-calitate-energie' })).resolves.toEqual([])
  })

  it('getProduct returns the product for a known slug', async () => {
    const { repo } = createRepository()
    const product = await repo.getProduct('releu-protectie-diferentiala-rgu-10')
    expect(product).toEqual(fixtureProducts[0])
  })

  it('getProduct returns null for an unknown slug', async () => {
    const { repo } = createRepository()
    await expect(repo.getProduct('nu-exista')).resolves.toBeNull()
  })
})

describe('MockRepository – search', () => {
  it('matches a substring of the product name', async () => {
    const { repo } = createRepository()
    expect(ids(await repo.getProducts({ search: 'analizor' }))).toEqual(['p-m54510'])
  })

  it('matches the product code case-insensitively', async () => {
    const { repo } = createRepository()
    expect(ids(await repo.getProducts({ search: 'rgu-10' }))).toEqual(['p-rgu-10'])
    expect(ids(await repo.getProducts({ search: 'm5452' }))).toEqual(['p-m54520'])
  })

  it('is diacritics-insensitive', async () => {
    const { repo } = createRepository()
    expect(ids(await repo.getProducts({ search: 'protectie' }))).toEqual(['p-rgu-10', 'p-wru-10'])
    expect(ids(await repo.getProducts({ search: 'masura' }))).toEqual(['p-m31030', 'p-m31040', 'p-m31050'])
    expect(ids(await repo.getProducts({ search: 'Sunt' }))).toEqual(['p-m31050'])
  })

  it('accepts diacritics in the query, including legacy cedilla forms', async () => {
    const { repo } = createRepository()
    expect(ids(await repo.getProducts({ search: 'protecție' }))).toEqual(['p-rgu-10', 'p-wru-10'])
    expect(ids(await repo.getProducts({ search: 'protecţie' }))).toEqual(['p-rgu-10', 'p-wru-10'])
  })

  it('requires every token of a multi-word search to match', async () => {
    const { repo } = createRepository()
    expect(ids(await repo.getProducts({ search: 'releu diferențială' }))).toEqual(['p-rgu-10'])
    expect(ids(await repo.getProducts({ search: 'toroid releu' }))).toEqual([])
  })

  it('combines search with a category filter', async () => {
    const { repo } = createRepository()
    const inCategory = await repo.getProducts({
      categorySlug: 'aparate-masura-control',
      search: 'transformator',
    })
    expect(ids(inCategory)).toEqual(['p-m31030', 'p-m31040'])

    const outsideCategory = await repo.getProducts({
      categorySlug: 'aparate-masura-control',
      search: 'rgu-10',
    })
    expect(outsideCategory).toEqual([])
  })

  it('treats an empty or whitespace-only search as no filter', async () => {
    const { repo } = createRepository()
    expect(ids(await repo.getProducts({ search: '' }))).toEqual(ALL_PRODUCT_IDS_IN_CATALOG_ORDER)
    expect(ids(await repo.getProducts({ search: '   ' }))).toEqual(ALL_PRODUCT_IDS_IN_CATALOG_ORDER)
  })

  it('returns [] when nothing matches', async () => {
    const { repo } = createRepository()
    await expect(repo.getProducts({ search: 'inexistent' })).resolves.toEqual([])
  })
})

describe('MockRepository – related products', () => {
  it('lists hand-picked related products first, then tops up from the same category to 4', async () => {
    const { repo } = createRepository()
    const related = await repo.getRelatedProducts('p-m54510')
    expect(ids(related)).toEqual(['p-m54520', 'p-m31030', 'p-m31040', 'p-m31050'])
  })

  it('keeps a cross-category hand-picked product ahead of same-category fill', async () => {
    const { repo } = createRepository()
    const related = await repo.getRelatedProducts('p-m31030')
    expect(ids(related)).toEqual(['p-rgu-10', 'p-m54510', 'p-m54520', 'p-m31040'])
  })

  it('never includes the product itself and caps the list at 4', async () => {
    const { repo } = createRepository()
    const related = await repo.getRelatedProducts('p-m31050')
    expect(related).toHaveLength(4)
    expect(ids(related)).not.toContain('p-m31050')
  })

  it('skips unknown related ids and returns fewer than 4 when the category is small', async () => {
    const { repo } = createRepository()
    expect(ids(await repo.getRelatedProducts('p-wru-10'))).toEqual(['p-rgu-10'])
    expect(ids(await repo.getRelatedProducts('p-rgu-10'))).toEqual(['p-wru-10'])
  })

  it('returns [] for an unknown product id', async () => {
    const { repo } = createRepository()
    await expect(repo.getRelatedProducts('nu-exista')).resolves.toEqual([])
  })
})

describe('MockRepository – company, partners, news, downloads', () => {
  it('getCompanyInfo returns the company data', async () => {
    const { repo } = createRepository()
    await expect(repo.getCompanyInfo()).resolves.toEqual(fixtureCompany)
  })

  it('getPartners and getDownloads return the lists as given', async () => {
    const { repo } = createRepository()
    await expect(repo.getPartners()).resolves.toEqual(fixturePartners)
    await expect(repo.getDownloads()).resolves.toEqual(fixtureDownloads)
  })

  it('getNews returns items sorted newest first', async () => {
    const { repo } = createRepository()
    const news = await repo.getNews()
    expect(news.map((item) => item.date)).toEqual(['2026-03-14', '2026-01-20', '2025-11-02'])
  })
})

describe('MockRepository – quote requests', () => {
  const request: QuoteRequest = {
    companyName: 'Instal Prod S.R.L.',
    contactPerson: 'Ion Popescu',
    email: 'ion.popescu@exemplu.ro',
    phone: '0722 000 000',
    message: 'Vă rugăm să ne transmiteți o ofertă de preț.',
    items: [
      {
        productId: 'p-rgu-10',
        productCode: 'RGU-10',
        productName: 'Releu de protecție diferențială RGU-10',
        quantity: 3,
      },
    ],
  }

  it('returns a reference number and an ISO timestamp', async () => {
    const { repo } = createRepository()
    const result = await repo.submitQuoteRequest(request)
    expect(result.referenceNumber).toMatch(/^TE-\d{4}-\d{5}$/)
    expect(result.referenceNumber.startsWith(`TE-${new Date().getFullYear()}-`)).toBe(true)
    expect(new Date(result.receivedAt).toISOString()).toBe(result.receivedAt)
  })

  it('logs the request together with the result', async () => {
    const { repo, log } = createRepository()
    const result = await repo.submitQuoteRequest(request)
    expect(log).toHaveBeenCalledTimes(1)
    expect(log).toHaveBeenCalledWith(expect.any(String), { request, result })
  })
})

describe('MockRepository – defensive copies', () => {
  it('mutating a returned category does not affect later calls', async () => {
    const { repo } = createRepository()
    const first = await repo.getCategory('aparate-masura-control')
    expect(first).not.toBeNull()
    if (first) first.name = 'MODIFICAT'
    const second = await repo.getCategory('aparate-masura-control')
    expect(second?.name).toBe('Aparate pentru măsură și control electric')
  })

  it('mutating a returned product (including nested arrays) does not affect later calls', async () => {
    const { repo } = createRepository()
    const first = await repo.getProduct('p-m54510')
    expect(first).not.toBeNull()
    if (first) {
      first.keySpecs.push({ label: 'Nou', value: 'x' })
      first.relatedProductIds.length = 0
    }
    const second = await repo.getProduct('p-m54510')
    expect(second?.keySpecs).toHaveLength(1)
    expect(second?.relatedProductIds).toEqual(['p-m54520'])
  })

  it('returns distinct objects on every call', async () => {
    const { repo } = createRepository()
    const [a, b] = await Promise.all([repo.getCompanyInfo(), repo.getCompanyInfo()])
    expect(a).toEqual(b)
    expect(a).not.toBe(b)
    expect(a.address).not.toBe(b.address)
  })
})

// ---------------------------------------------------------------------------
// Simulated latency
// ---------------------------------------------------------------------------

describe('MockRepository – simulated latency', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('resolves only after delayMs has elapsed', async () => {
    const repo = new MockRepository({ delayMs: 50, data: fixture, log: vi.fn<Log>() })
    let settled = false
    const pending = repo.getCategories().then((value) => {
      settled = true
      return value
    })

    await flushMicrotasks()
    expect(settled).toBe(false)

    await vi.advanceTimersByTimeAsync(49)
    expect(settled).toBe(false)

    await vi.advanceTimersByTimeAsync(1)
    await expect(pending).resolves.toHaveLength(3)
    expect(settled).toBe(true)
  })

  it('does not schedule a timer when delayMs is 0', async () => {
    const repo = new MockRepository({ delayMs: 0, data: fixture, log: vi.fn<Log>() })
    let settled = false
    const pending = repo.getCategories().then(() => {
      settled = true
    })
    await flushMicrotasks()
    expect(vi.getTimerCount()).toBe(0)
    expect(settled).toBe(true)
    await pending
  })
})

// ---------------------------------------------------------------------------
// Integrity of the bundled demo data
// ---------------------------------------------------------------------------

describe('MockRepository – bundled demo data integrity', () => {
  const repo = new MockRepository({ delayMs: 0, log: vi.fn<Log>() })
  let categories: Category[] = []
  let products: Product[] = []

  const label = (product: Product) => `${product.code} (${product.id})`
  const CEDILLA = /[ŞşŢţ]/

  beforeAll(async () => {
    categories = await repo.getCategories()
    products = await repo.getProducts()
  })

  it('has exactly 6 categories with unique ids and slugs', () => {
    expect(categories).toHaveLength(6)
    expect(duplicates(categories.map((category) => category.id))).toEqual([])
    expect(duplicates(categories.map((category) => category.slug))).toEqual([])
  })

  it('has at least 25 products', () => {
    expect(products.length).toBeGreaterThanOrEqual(25)
  })

  it('has unique product ids, slugs and codes', () => {
    expect(duplicates(products.map((product) => product.id))).toEqual([])
    expect(duplicates(products.map((product) => product.slug))).toEqual([])
    expect(duplicates(products.map((product) => product.code))).toEqual([])
  })

  it('uses URL-safe slugs everywhere', () => {
    const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    const offenders = [...categories, ...products]
      .filter((item) => !SLUG.test(item.slug))
      .map((item) => item.slug)
    expect(offenders).toEqual([])
  })

  it('assigns every product to an existing category', () => {
    const categoryIds = new Set(categories.map((category) => category.id))
    const offenders = products
      .filter((product) => !categoryIds.has(product.categoryId))
      .map((product) => `${label(product)} -> ${product.categoryId}`)
    expect(offenders).toEqual([])
  })

  it('gives every product exactly 4 key specs', () => {
    const offenders = products
      .filter((product) => product.keySpecs.length !== 4)
      .map((product) => `${label(product)}: ${product.keySpecs.length} keySpecs`)
    expect(offenders).toEqual([])
  })

  it('gives every product at least 8 specs', () => {
    const offenders = products
      .filter((product) => product.specs.length < 8)
      .map((product) => `${label(product)}: ${product.specs.length} specs`)
    expect(offenders).toEqual([])
  })

  it('gives every product at least one document', () => {
    const offenders = products.filter((product) => product.documents.length === 0).map(label)
    expect(offenders).toEqual([])
  })

  it('points relatedProductIds at existing products of the same category, never itself', () => {
    const byId = new Map(products.map((product) => [product.id, product]))
    const offenders: string[] = []
    for (const product of products) {
      for (const relatedId of product.relatedProductIds) {
        const related = byId.get(relatedId)
        if (!related) {
          offenders.push(`${label(product)}: related "${relatedId}" does not exist`)
        } else if (related.id === product.id) {
          offenders.push(`${label(product)}: references itself`)
        } else if (related.categoryId !== product.categoryId) {
          offenders.push(`${label(product)}: related "${relatedId}" is in another category`)
        }
      }
    }
    expect(offenders).toEqual([])
  })

  it('uses comma-below ș/ț, never cedilla ş/ţ, in any text', () => {
    const offenders = [
      ...categories.filter((category) => CEDILLA.test(JSON.stringify(category))).map((c) => c.slug),
      ...products.filter((product) => CEDILLA.test(JSON.stringify(product))).map(label),
    ]
    expect(offenders).toEqual([])
  })
})
