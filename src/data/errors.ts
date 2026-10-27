/**
 * The one error type that leaves the data layer. Hooks and pages can switch on
 * `kind` to pick a message; they never need to know about fetch or HTTP.
 */
export type DataErrorKind =
  /** Could not reach the server (offline, DNS, CORS, aborted). */
  | 'network'
  /** Server answered with a non-2xx status. */
  | 'http'
  /** Server answered, but the body was not the JSON we expected. */
  | 'parse'
  /** A single resource was requested by key and does not exist. */
  | 'not_found'
  /** Anything else. */
  | 'unknown'

export interface DataErrorOptions {
  status?: number
  cause?: unknown
}

export class DataError extends Error {
  readonly kind: DataErrorKind
  readonly status: number | undefined

  constructor(kind: DataErrorKind, message: string, options: DataErrorOptions = {}) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause })
    this.name = 'DataError'
    this.kind = kind
    this.status = options.status
  }
}

export function isDataError(value: unknown): value is DataError {
  return value instanceof DataError
}

/** Wraps anything thrown by a data source so callers always get a DataError. */
export function toDataError(value: unknown): DataError {
  if (isDataError(value)) return value
  if (value instanceof Error) {
    return new DataError('unknown', value.message, { cause: value })
  }
  return new DataError('unknown', 'A apărut o eroare necunoscută.', { cause: value })
}

/** Romanian message suitable for showing to a visitor. */
export function describeDataError(error: DataError): string {
  switch (error.kind) {
    case 'network':
      return 'Nu am putut contacta serverul. Verificați conexiunea la internet și încercați din nou.'
    case 'http':
      return error.status !== undefined && error.status >= 500
        ? 'Serverul a întâmpinat o problemă. Vă rugăm să încercați din nou în câteva momente.'
        : 'Cererea nu a putut fi procesată. Vă rugăm să încercați din nou.'
    case 'parse':
      return 'Am primit un răspuns neașteptat de la server. Vă rugăm să încercați din nou.'
    case 'not_found':
      return 'Resursa solicitată nu a fost găsită.'
    default:
      return 'A apărut o eroare neașteptată. Vă rugăm să încercați din nou.'
  }
}
