import { DataError } from '../errors'

export interface JsonRequestOptions {
  method?: 'GET' | 'POST'
  body?: unknown
  signal?: AbortSignal
  /** Resolve to `null` on 404 instead of throwing (single-resource lookups). */
  allowNotFound?: boolean
}

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>

/**
 * Small fetch wrapper that turns every failure mode into a DataError:
 *  - fetch rejects (offline, DNS, CORS, abort)  -> kind 'network'
 *  - non-2xx status                              -> kind 'http' (404 may be null)
 *  - body is not valid JSON                      -> kind 'parse'
 */
export async function requestJson<T>(
  fetchFn: FetchLike,
  url: string,
  options: JsonRequestOptions = {},
): Promise<T | null> {
  const init: RequestInit = {
    method: options.method ?? 'GET',
    headers: { Accept: 'application/json' },
    signal: options.signal,
  }
  if (options.body !== undefined) {
    init.headers = { ...init.headers, 'Content-Type': 'application/json' }
    init.body = JSON.stringify(options.body)
  }

  let response: Response
  try {
    response = await fetchFn(url, init)
  } catch (cause) {
    throw new DataError('network', `Nu am putut contacta serverul (${url}).`, { cause })
  }

  if (response.status === 404 && options.allowNotFound) {
    return null
  }

  if (!response.ok) {
    throw new DataError('http', `Serverul a răspuns cu ${response.status} pentru ${url}.`, {
      status: response.status,
    })
  }

  if (response.status === 204) {
    return null
  }

  try {
    return (await response.json()) as T
  } catch (cause) {
    throw new DataError('parse', `Răspunsul de la ${url} nu este JSON valid.`, {
      status: response.status,
      cause,
    })
  }
}

/** Builds "base/path?key=value" and drops undefined/empty query values. */
export function buildUrl(
  baseUrl: string,
  path: string,
  query: Record<string, string | undefined> = {},
): string {
  const base = baseUrl.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') params.set(key, value)
  }
  const search = params.toString()
  return `${base}${normalizedPath}${search ? `?${search}` : ''}`
}
