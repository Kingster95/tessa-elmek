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
import { DataError } from '../errors'
import { buildUrl, requestJson, type FetchLike } from './http'

export interface ApiRepositoryOptions {
  /** e.g. "https://api.example.ro/v1" – no trailing slash needed. */
  baseUrl: string
  /** Injectable for tests; defaults to the global fetch. */
  fetchFn?: FetchLike
}

/**
 * DataRepository backed by a REST API. Endpoints (relative to baseUrl):
 *
 *   GET  /company
 *   GET  /categories
 *   GET  /categories/:slug                 (404 -> null)
 *   GET  /products?category=:slug&search=:text
 *   GET  /products/:slug                   (404 -> null)
 *   GET  /products/:id/related
 *   GET  /partners
 *   GET  /news
 *   GET  /downloads
 *   POST /quote-requests                   (body: QuoteRequest)
 *
 * Every response body is the JSON shape of the matching type in ../types.
 */
export class ApiRepository implements DataRepository {
  private readonly baseUrl: string
  private readonly fetchFn: FetchLike

  constructor(options: ApiRepositoryOptions) {
    this.baseUrl = options.baseUrl
    this.fetchFn = options.fetchFn ?? ((input, init) => fetch(input, init))
  }

  getCompanyInfo(): Promise<CompanyInfo> {
    return this.getRequired<CompanyInfo>('/company')
  }

  getCategories(): Promise<Category[]> {
    return this.getRequired<Category[]>('/categories')
  }

  getCategory(slug: string): Promise<Category | null> {
    return this.getOptional<Category>(`/categories/${encodeURIComponent(slug)}`)
  }

  getProducts(query: ProductQuery = {}): Promise<Product[]> {
    return this.getRequired<Product[]>('/products', {
      category: query.categorySlug,
      search: query.search?.trim(),
    })
  }

  getProduct(slug: string): Promise<Product | null> {
    return this.getOptional<Product>(`/products/${encodeURIComponent(slug)}`)
  }

  getRelatedProducts(productId: string): Promise<Product[]> {
    return this.getRequired<Product[]>(`/products/${encodeURIComponent(productId)}/related`)
  }

  getPartners(): Promise<Partner[]> {
    return this.getRequired<Partner[]>('/partners')
  }

  getNews(): Promise<NewsItem[]> {
    return this.getRequired<NewsItem[]>('/news')
  }

  getDownloads(): Promise<Download[]> {
    return this.getRequired<Download[]>('/downloads')
  }

  async submitQuoteRequest(request: QuoteRequest): Promise<QuoteRequestResult> {
    const result = await requestJson<QuoteRequestResult>(
      this.fetchFn,
      buildUrl(this.baseUrl, '/quote-requests'),
      { method: 'POST', body: request },
    )
    if (result === null) {
      throw new DataError('parse', 'Serverul nu a returnat un număr de referință pentru cerere.')
    }
    return result
  }

  private async getRequired<T>(
    path: string,
    query?: Record<string, string | undefined>,
  ): Promise<T> {
    const result = await requestJson<T>(this.fetchFn, buildUrl(this.baseUrl, path, query))
    if (result === null) {
      throw new DataError('parse', `Serverul nu a returnat date pentru ${path}.`)
    }
    return result
  }

  private getOptional<T>(path: string): Promise<T | null> {
    return requestJson<T>(this.fetchFn, buildUrl(this.baseUrl, path), { allowNotFound: true })
  }
}
