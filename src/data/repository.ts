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
} from './types'

/**
 * Everything the UI can ask of a data source. Implemented by MockRepository
 * (local demo data) and ApiRepository (REST backend). Components never touch
 * a repository directly; they go through the hooks in ./hooks.
 *
 * Conventions:
 *  - Single-resource lookups (`getCategory`, `getProduct`) resolve to `null`
 *    when the key does not exist. A missing page is not an error.
 *  - Every other failure rejects with a `DataError` (see ./errors).
 */
export interface DataRepository {
  getCompanyInfo(): Promise<CompanyInfo>
  getCategories(): Promise<Category[]>
  getCategory(slug: string): Promise<Category | null>
  getProducts(query?: ProductQuery): Promise<Product[]>
  getProduct(slug: string): Promise<Product | null>
  getRelatedProducts(productId: string): Promise<Product[]>
  getPartners(): Promise<Partner[]>
  getNews(): Promise<NewsItem[]>
  getDownloads(): Promise<Download[]>
  submitQuoteRequest(request: QuoteRequest): Promise<QuoteRequestResult>
}
