import { describe, expect, it, vi, type Mock } from 'vitest'
import type { Category, Product, QuoteRequest, QuoteRequestResult } from '../types'
import { DataError, type DataErrorKind } from '../errors'
import { ApiRepository } from './ApiRepository'
import type { FetchLike } from './http'

const BASE_URL = 'https://api.exemplu.ro/v1'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function fetchReturning(...responses: Response[]): Mock<FetchLike> {
  const fetchFn = vi.fn<FetchLike>()
  for (const response of responses) fetchFn.mockResolvedValueOnce(response)
  return fetchFn
}

function createRepository(fetchFn: Mock<FetchLike>, baseUrl = BASE_URL): ApiRepository {
  return new ApiRepository({ baseUrl, fetchFn })
}

function callArgs(fetchFn: Mock<FetchLike>, index = 0): { url: string; init: RequestInit } {
  const args = fetchFn.mock.calls[index]
  if (!args) throw new Error(`fetch call #${index} was not made`)
  return { url: args[0], init: args[1] ?? {} }
}

function requestedUrl(fetchFn: Mock<FetchLike>): string {
  return callArgs(fetchFn).url
}

function bodyOf(init: RequestInit): string {
  if (typeof init.body !== 'string') throw new Error('Expected a string request body')
  return init.body
}

/** Resolves with the DataError a promise rejects with (and asserts it is one). */
async function rejectionOf(promise: Promise<unknown>): Promise<DataError> {
  await expect(promise).rejects.toBeInstanceOf(DataError)
  const error: unknown = await promise.then(
    () => undefined,
    (reason: unknown) => reason,
  )
  if (!(error instanceof DataError)) throw new Error('Expected the promise to reject with a DataError')
  return error
}

async function expectDataError(
  promise: Promise<unknown>,
  kind: DataErrorKind,
  status?: number,
): Promise<DataError> {
  const error = await rejectionOf(promise)
  expect(error.name).toBe('DataError')
  expect(error.kind).toBe(kind)
  expect(error.status).toBe(status)
  return error
}

const sampleCategory: Category = {
  id: 'cat-protectie',
  slug: 'protectie-control-electric',
  name: 'Protecție și control electric',
  shortDescription: 'Relee de protecție diferențială și relee de supraveghere.',
  description: 'Echipamente care protejează oamenii și instalațiile.',
  order: 2,
}

const sampleProduct: Product = {
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
  imageUrls: [],
  relatedProductIds: [],
}

// ---------------------------------------------------------------------------
// URL building
// ---------------------------------------------------------------------------

describe('ApiRepository – URL building', () => {
  it('getProducts encodes category and trimmed search as query parameters', async () => {
    const fetchFn = fetchReturning(jsonResponse([]))
    await createRepository(fetchFn).getProducts({ categorySlug: 'x', search: ' abc ' })
    expect(requestedUrl(fetchFn)).toBe(`${BASE_URL}/products?category=x&search=abc`)
  })

  it('getProducts without parameters requests /products', async () => {
    const fetchFn = fetchReturning(jsonResponse([]), jsonResponse([]))
    const repo = createRepository(fetchFn)
    await repo.getProducts()
    await repo.getProducts({})
    expect(callArgs(fetchFn, 0).url).toBe(`${BASE_URL}/products`)
    expect(callArgs(fetchFn, 1).url).toBe(`${BASE_URL}/products`)
  })

  it('omits undefined, empty and whitespace-only search values', async () => {
    const fetchFn = fetchReturning(jsonResponse([]), jsonResponse([]), jsonResponse([]))
    const repo = createRepository(fetchFn)
    await repo.getProducts({ categorySlug: 'x', search: undefined })
    await repo.getProducts({ categorySlug: 'x', search: '' })
    await repo.getProducts({ search: '   ' })
    expect(callArgs(fetchFn, 0).url).toBe(`${BASE_URL}/products?category=x`)
    expect(callArgs(fetchFn, 1).url).toBe(`${BASE_URL}/products?category=x`)
    expect(callArgs(fetchFn, 2).url).toBe(`${BASE_URL}/products`)
  })

  it('percent-encodes the search text', async () => {
    const fetchFn = fetchReturning(jsonResponse([]))
    await createRepository(fetchFn).getProducts({ search: 'releu ș&t' })
    expect(requestedUrl(fetchFn)).toBe(`${BASE_URL}/products?search=releu+%C8%99%26t`)
  })

  it('URI-encodes slugs and ids in the path', async () => {
    const fetchFn = fetchReturning(jsonResponse(sampleProduct), jsonResponse(sampleCategory), jsonResponse([]))
    const repo = createRepository(fetchFn)
    await repo.getProduct('releu rgu/10')
    await repo.getCategory('protecție/ș')
    await repo.getRelatedProducts('p/1?x')
    expect(callArgs(fetchFn, 0).url).toBe(`${BASE_URL}/products/releu%20rgu%2F10`)
    expect(callArgs(fetchFn, 1).url).toBe(`${BASE_URL}/categories/protec%C8%9Bie%2F%C8%99`)
    expect(callArgs(fetchFn, 2).url).toBe(`${BASE_URL}/products/p%2F1%3Fx/related`)
  })

  it('tolerates a trailing slash on baseUrl', async () => {
    const single = fetchReturning(jsonResponse([]))
    await createRepository(single, `${BASE_URL}/`).getProducts()
    expect(requestedUrl(single)).toBe(`${BASE_URL}/products`)

    const double = fetchReturning(jsonResponse([]))
    await createRepository(double, `${BASE_URL}//`).getCategories()
    expect(requestedUrl(double)).toBe(`${BASE_URL}/categories`)
  })

  it('maps every list endpoint to its path', async () => {
    const fetchFn = fetchReturning(
      jsonResponse({}),
      jsonResponse([]),
      jsonResponse([]),
      jsonResponse([]),
      jsonResponse([]),
    )
    const repo = createRepository(fetchFn)
    await repo.getCompanyInfo()
    await repo.getCategories()
    await repo.getPartners()
    await repo.getNews()
    await repo.getDownloads()
    expect(fetchFn.mock.calls.map((call) => call[0])).toEqual([
      `${BASE_URL}/company`,
      `${BASE_URL}/categories`,
      `${BASE_URL}/partners`,
      `${BASE_URL}/news`,
      `${BASE_URL}/downloads`,
    ])
  })

  it('sends GET requests that accept JSON and carry no body', async () => {
    const fetchFn = fetchReturning(jsonResponse([]))
    await createRepository(fetchFn).getCategories()
    const { init } = callArgs(fetchFn)
    expect(init.method).toBe('GET')
    expect(init.headers).toEqual({ Accept: 'application/json' })
    expect(init.body).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// Successful and not-found responses
// ---------------------------------------------------------------------------

describe('ApiRepository – responses', () => {
  it('returns the parsed JSON body', async () => {
    const fetchFn = fetchReturning(jsonResponse([sampleProduct]), jsonResponse(sampleCategory))
    const repo = createRepository(fetchFn)
    await expect(repo.getProducts()).resolves.toEqual([sampleProduct])
    await expect(repo.getCategory('protectie-control-electric')).resolves.toEqual(sampleCategory)
  })

  it('getProduct resolves to null on 404', async () => {
    const fetchFn = fetchReturning(jsonResponse({ message: 'Not found' }, 404))
    await expect(createRepository(fetchFn).getProduct('nu-exista')).resolves.toBeNull()
  })

  it('getCategory resolves to null on 404', async () => {
    const fetchFn = fetchReturning(jsonResponse({ message: 'Not found' }, 404))
    await expect(createRepository(fetchFn).getCategory('nu-exista')).resolves.toBeNull()
  })
})

// ---------------------------------------------------------------------------
// Failure modes
// ---------------------------------------------------------------------------

describe('ApiRepository – errors', () => {
  it('getCategories rejects with an http DataError on 404', async () => {
    const fetchFn = fetchReturning(jsonResponse({ message: 'Not found' }, 404))
    await expectDataError(createRepository(fetchFn).getCategories(), 'http', 404)
  })

  it('rejects with an http DataError carrying the status on 500', async () => {
    const fetchFn = fetchReturning(jsonResponse({ message: 'Boom' }, 500))
    const error = await expectDataError(createRepository(fetchFn).getProducts(), 'http', 500)
    expect(error.message).toContain('500')
  })

  it('getProducts does not treat 404 as an empty list', async () => {
    const fetchFn = fetchReturning(jsonResponse([], 404))
    await expectDataError(createRepository(fetchFn).getProducts(), 'http', 404)
  })

  it('rejects with a network DataError when fetch itself rejects', async () => {
    const cause = new TypeError('Failed to fetch')
    const fetchFn = vi.fn<FetchLike>().mockRejectedValue(cause)
    const error = await expectDataError(createRepository(fetchFn).getCategories(), 'network')
    expect(error.cause).toBe(cause)
  })

  it('rejects with a parse DataError when the body is not JSON', async () => {
    const fetchFn = fetchReturning(
      new Response('<!doctype html><p>Pagină de eroare</p>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      }),
    )
    const error = await expectDataError(createRepository(fetchFn).getCategories(), 'parse', 200)
    expect(error.cause).toBeInstanceOf(Error)
  })

  it('rejects with a parse DataError when a required endpoint answers 204', async () => {
    const fetchFn = fetchReturning(new Response(null, { status: 204 }))
    await expectDataError(createRepository(fetchFn).getCategories(), 'parse')
  })
})

// ---------------------------------------------------------------------------
// Quote requests
// ---------------------------------------------------------------------------

describe('ApiRepository – submitQuoteRequest', () => {
  const request: QuoteRequest = {
    companyName: 'Instal Prod S.R.L.',
    contactPerson: 'Ion Popescu',
    email: 'ion.popescu@exemplu.ro',
    phone: '0722 000 000',
    message: 'Vă rugăm să ne transmiteți o ofertă.',
    items: [
      { productId: 'p-rgu-10', productCode: 'RGU-10', productName: 'Releu RGU-10', quantity: 2 },
    ],
  }
  const result: QuoteRequestResult = {
    referenceNumber: 'TE-2026-04821',
    receivedAt: '2026-10-12T09:30:00.000Z',
  }

  it('POSTs the request as JSON and returns the parsed result', async () => {
    const fetchFn = fetchReturning(jsonResponse(result, 201))
    await expect(createRepository(fetchFn).submitQuoteRequest(request)).resolves.toEqual(result)

    const { url, init } = callArgs(fetchFn)
    expect(url).toBe(`${BASE_URL}/quote-requests`)
    expect(init.method).toBe('POST')
    expect(init.headers).toEqual({ Accept: 'application/json', 'Content-Type': 'application/json' })
    expect(JSON.parse(bodyOf(init))).toEqual(request)
  })

  it('rejects with a parse DataError when the server answers 204', async () => {
    const fetchFn = fetchReturning(new Response(null, { status: 204 }))
    await expectDataError(createRepository(fetchFn).submitQuoteRequest(request), 'parse')
  })

  it('rejects with an http DataError on a server error', async () => {
    const fetchFn = fetchReturning(jsonResponse({ message: 'Boom' }, 503))
    await expectDataError(createRepository(fetchFn).submitQuoteRequest(request), 'http', 503)
  })

  it('rejects with a network DataError when fetch rejects', async () => {
    const fetchFn = vi.fn<FetchLike>().mockRejectedValue(new TypeError('Failed to fetch'))
    await expectDataError(createRepository(fetchFn).submitQuoteRequest(request), 'network')
  })
})
