import type { DataRepository } from './repository'
import { ApiRepository } from './api/ApiRepository'
import { MockRepository } from './mock/MockRepository'

export type DataSource = 'mock' | 'api'

const DEFAULT_API_BASE_URL = '/api'

/**
 * THE ONE PLACE that reads VITE_DATA_SOURCE. Everything else imports
 * `repository` (or, better, the hooks in ./hooks) and stays source-agnostic.
 */
export function resolveDataSource(raw: string | undefined): DataSource {
  return raw === 'api' ? 'api' : 'mock'
}

export function createRepository(
  source: DataSource,
  apiBaseUrl: string | undefined,
): DataRepository {
  if (source === 'api') {
    const baseUrl = apiBaseUrl?.trim() || DEFAULT_API_BASE_URL
    if (!apiBaseUrl?.trim()) {
      console.warn(
        `[data] VITE_DATA_SOURCE=api dar VITE_API_BASE_URL lipsește; se folosește "${DEFAULT_API_BASE_URL}".`,
      )
    }
    return new ApiRepository({ baseUrl })
  }
  return new MockRepository()
}

export const dataSource: DataSource = resolveDataSource(import.meta.env.VITE_DATA_SOURCE)

export const repository: DataRepository = createRepository(
  dataSource,
  import.meta.env.VITE_API_BASE_URL,
)

export type { DataRepository } from './repository'
export * from './types'
export { DataError, describeDataError, isDataError, toDataError } from './errors'
export type { DataErrorKind } from './errors'
