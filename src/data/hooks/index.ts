import { useCallback, useState } from 'react'
import { repository } from '../index'
import { DataError, toDataError } from '../errors'
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
import { useAsync, type AsyncState } from './useAsync'

export type { AsyncState } from './useAsync'

/*
 * Every hook returns { data, loading, error, retry }. Components import these
 * and nothing else from the data layer, so swapping mock for API never
 * touches a component.
 */

/*
 * Company info and the category list are requested by several components on
 * the same page (layout, hero, sidebar, breadcrumb). They change rarely, so
 * one in-flight/settled promise is shared for the whole session. A failed
 * request is forgotten immediately, so "Încearcă din nou" really retries.
 */
const sharedRequests = new Map<string, Promise<unknown>>()

function shared<T>(key: string, load: () => Promise<T>): Promise<T> {
  const existing = sharedRequests.get(key)
  if (existing) return existing as Promise<T>
  const request = load().catch((reason: unknown) => {
    sharedRequests.delete(key)
    throw reason
  })
  sharedRequests.set(key, request)
  return request
}

/** Drops the shared company/category responses (used by tests). */
export function clearSharedRequests(): void {
  sharedRequests.clear()
}

export function useCompanyInfo(): AsyncState<CompanyInfo> {
  return useAsync(() => shared('company', () => repository.getCompanyInfo()), [])
}

export function useCategories(): AsyncState<Category[]> {
  return useAsync(() => shared('categories', () => repository.getCategories()), [])
}

/** `data` is null both while loading and when the slug does not exist. */
export function useCategory(slug: string | undefined): AsyncState<Category | null> {
  return useAsync(
    () => (slug ? repository.getCategory(slug) : Promise.resolve(null)),
    [slug],
  )
}

export function useProducts(query: ProductQuery = {}): AsyncState<Product[]> {
  const search = query.search?.trim() ?? ''
  return useAsync(
    () =>
      repository.getProducts({
        categorySlug: query.categorySlug,
        search: search || undefined,
      }),
    [query.categorySlug, search],
    { keepPreviousData: true },
  )
}

/** `data` is null both while loading and when the slug does not exist. */
export function useProduct(slug: string | undefined): AsyncState<Product | null> {
  return useAsync(
    () => (slug ? repository.getProduct(slug) : Promise.resolve(null)),
    [slug],
  )
}

export function useRelatedProducts(productId: string | undefined): AsyncState<Product[]> {
  return useAsync(
    () => (productId ? repository.getRelatedProducts(productId) : Promise.resolve([])),
    [productId],
  )
}

export function usePartners(): AsyncState<Partner[]> {
  return useAsync(() => repository.getPartners(), [])
}

export function useNews(): AsyncState<NewsItem[]> {
  return useAsync(() => repository.getNews(), [])
}

export function useDownloads(): AsyncState<Download[]> {
  return useAsync(() => repository.getDownloads(), [])
}

export interface QuoteRequestSubmission {
  submit: (request: QuoteRequest) => Promise<QuoteRequestResult | null>
  submitting: boolean
  result: QuoteRequestResult | null
  error: DataError | null
  reset: () => void
}

/** Mutation-style hook for the offer list form. */
export function useQuoteRequestSubmission(): QuoteRequestSubmission {
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<QuoteRequestResult | null>(null)
  const [error, setError] = useState<DataError | null>(null)

  const submit = useCallback(async (request: QuoteRequest) => {
    setSubmitting(true)
    setError(null)
    try {
      const response = await repository.submitQuoteRequest(request)
      setResult(response)
      return response
    } catch (reason) {
      setError(toDataError(reason))
      return null
    } finally {
      setSubmitting(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return { submit, submitting, result, error, reset }
}
