import { useCallback, useEffect, useEffectEvent, useState } from 'react'
import { DataError, toDataError } from '../errors'

export interface AsyncState<T> {
  /** The loaded value, or null while loading / after an error. */
  data: T | null
  loading: boolean
  error: DataError | null
  /** Re-runs the loader for the same inputs. */
  retry: () => void
}

export interface UseAsyncOptions {
  /**
   * Keep showing the previous result while a new one loads (useful for
   * search-as-you-type, where a blank grid between keystrokes would flicker).
   */
  keepPreviousData?: boolean
}

interface Settled<T> {
  key: string
  data: T | null
  error: DataError | null
}

/**
 * Runs `load` whenever `deps` change and exposes { data, loading, error, retry }.
 * `deps` must be JSON-serialisable (strings, numbers, booleans, undefined).
 * Out-of-order responses are ignored: only the result for the latest inputs wins.
 */
export function useAsync<T>(
  load: () => Promise<T>,
  deps: readonly unknown[],
  options: UseAsyncOptions = {},
): AsyncState<T> {
  const [attempt, setAttempt] = useState(0)
  const key = JSON.stringify([deps, attempt])
  const [settled, setSettled] = useState<Settled<T> | null>(null)

  const runLoad = useEffectEvent(() => load())

  useEffect(() => {
    let cancelled = false
    runLoad().then(
      (data) => {
        if (!cancelled) setSettled({ key, data, error: null })
      },
      (reason: unknown) => {
        if (!cancelled) setSettled({ key, data: null, error: toDataError(reason) })
      },
    )
    return () => {
      cancelled = true
    }
  }, [key])

  const retry = useCallback(() => {
    setAttempt((value) => value + 1)
  }, [])

  const isCurrent = settled !== null && settled.key === key
  const loading = !isCurrent
  const data = isCurrent ? settled.data : options.keepPreviousData ? (settled?.data ?? null) : null
  const error = isCurrent ? settled.error : null

  return { data, loading, error, retry }
}
