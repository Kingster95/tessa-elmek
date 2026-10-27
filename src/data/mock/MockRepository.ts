import type { DataRepository } from '../repository'
import type {
  Category,
  CompanyInfo,
  Download,
  NewsItem,
  Partner,
  Product,
  ProductQuery,
  QuoteRequest,
  QuoteRequestResult,
} from '../types'
import { matchesAllTokens } from '../../lib/text'
import { categories as defaultCategories } from './data/categories'
import { company as defaultCompany } from './data/company'
import { downloads as defaultDownloads } from './data/downloads'
import { news as defaultNews } from './data/news'
import { partners as defaultPartners } from './data/partners'
import { products as defaultProducts } from './data/products'

export interface MockRepositoryOptions {
  /** Simulated latency per call, so loading states are visible. */
  delayMs?: number
  /** Override the bundled sample data (used by tests). */
  data?: Partial<MockDataSet>
  /** Where quote requests get logged. Defaults to console.info. */
  log?: (message: string, payload: unknown) => void
}

export interface MockDataSet {
  company: CompanyInfo
  categories: Category[]
  products: Product[]
  partners: Partner[]
  news: NewsItem[]
  downloads: Download[]
}

const DEFAULT_DELAY_MS = 300
const RELATED_PRODUCTS_TARGET = 4

/**
 * In-memory implementation of DataRepository backed by the sample data in
 * ./data. Every method waits `delayMs` so the UI's loading states are real.
 */
export class MockRepository implements DataRepository {
  private readonly delayMs: number
  private readonly data: MockDataSet
  private readonly log: (message: string, payload: unknown) => void
  private quoteCounter = 0

  constructor(options: MockRepositoryOptions = {}) {
    this.delayMs = options.delayMs ?? DEFAULT_DELAY_MS
    this.data = {
      company: options.data?.company ?? defaultCompany,
      categories: options.data?.categories ?? defaultCategories,
      products: options.data?.products ?? defaultProducts,
      partners: options.data?.partners ?? defaultPartners,
      news: options.data?.news ?? defaultNews,
      downloads: options.data?.downloads ?? defaultDownloads,
    }
    this.log =
      options.log ??
      ((message, payload) => {
        console.info(message, payload)
      })
  }

  async getCompanyInfo(): Promise<CompanyInfo> {
    await this.wait()
    return clone(this.data.company)
  }

  async getCategories(): Promise<Category[]> {
    await this.wait()
    return this.sortedCategories().map(clone)
  }

  async getCategory(slug: string): Promise<Category | null> {
    await this.wait()
    const category = this.data.categories.find((item) => item.slug === slug)
    return category ? clone(category) : null
  }

  async getProducts(query: ProductQuery = {}): Promise<Product[]> {
    await this.wait()
    let result = this.sortedProducts()

    if (query.categorySlug !== undefined) {
      const category = this.data.categories.find((item) => item.slug === query.categorySlug)
      if (!category) return []
      result = result.filter((product) => product.categoryId === category.id)
    }

    const search = query.search?.trim() ?? ''
    if (search.length > 0) {
      result = result.filter((product) =>
        matchesAllTokens(`${product.name} ${product.code}`, search),
      )
    }

    return result.map(clone)
  }

  async getProduct(slug: string): Promise<Product | null> {
    await this.wait()
    const product = this.data.products.find((item) => item.slug === slug)
    return product ? clone(product) : null
  }

  async getRelatedProducts(productId: string): Promise<Product[]> {
    await this.wait()
    const product = this.data.products.find((item) => item.id === productId)
    if (!product) return []

    const byId = new Map(this.data.products.map((item) => [item.id, item]))
    const picked: Product[] = []
    const seen = new Set<string>([product.id])

    for (const id of product.relatedProductIds) {
      const related = byId.get(id)
      if (related && !seen.has(related.id)) {
        picked.push(related)
        seen.add(related.id)
      }
    }

    // Top up with products from the same category so the section is never thin.
    for (const candidate of this.data.products) {
      if (picked.length >= RELATED_PRODUCTS_TARGET) break
      if (candidate.categoryId === product.categoryId && !seen.has(candidate.id)) {
        picked.push(candidate)
        seen.add(candidate.id)
      }
    }

    return picked.slice(0, RELATED_PRODUCTS_TARGET).map(clone)
  }

  async getPartners(): Promise<Partner[]> {
    await this.wait()
    return this.data.partners.map(clone)
  }

  async getNews(): Promise<NewsItem[]> {
    await this.wait()
    return [...this.data.news].sort((a, b) => b.date.localeCompare(a.date)).map(clone)
  }

  async getDownloads(): Promise<Download[]> {
    await this.wait()
    return this.data.downloads.map(clone)
  }

  async submitQuoteRequest(request: QuoteRequest): Promise<QuoteRequestResult> {
    await this.wait()
    this.quoteCounter += 1
    const now = new Date()
    const sequence = String(this.quoteCounter + Math.floor(Math.random() * 9000) + 1000).padStart(5, '0')
    const result: QuoteRequestResult = {
      referenceNumber: `TE-${now.getFullYear()}-${sequence}`,
      receivedAt: now.toISOString(),
    }
    this.log('[MockRepository] Cerere de ofertă primită (date demo)', { request, result })
    return result
  }

  private sortedCategories(): Category[] {
    return [...this.data.categories].sort((a, b) => a.order - b.order)
  }

  /** Products grouped by category order, keeping file order inside a category. */
  private sortedProducts(): Product[] {
    const order = new Map(this.sortedCategories().map((category, index) => [category.id, index]))
    return [...this.data.products].sort(
      (a, b) => (order.get(a.categoryId) ?? Infinity) - (order.get(b.categoryId) ?? Infinity),
    )
  }

  private wait(): Promise<void> {
    if (this.delayMs <= 0) return Promise.resolve()
    return new Promise((resolve) => {
      setTimeout(resolve, this.delayMs)
    })
  }
}

/** Hands callers their own copy so UI code can never mutate the sample data. */
function clone<T>(value: T): T {
  return structuredClone(value)
}
