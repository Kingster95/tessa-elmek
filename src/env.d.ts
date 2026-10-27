/// <reference types="vite/client" />

/**
 * Typed view over the environment variables this app reads.
 * Both are optional: a missing VITE_DATA_SOURCE means "mock".
 */
interface ImportMetaEnv {
  readonly VITE_DATA_SOURCE?: 'mock' | 'api'
  readonly VITE_API_BASE_URL?: string
}
