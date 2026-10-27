import { useSyncExternalStore } from 'react'

/**
 * True while the viewport matches `query` (e.g. '(min-width: 1024px)').
 * Backed by matchMedia through useSyncExternalStore, so no state is written
 * from an effect and the value is correct on the first render.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = (onChange: () => void) => {
    const mediaQueryList = window.matchMedia(query)
    mediaQueryList.addEventListener('change', onChange)
    return () => {
      mediaQueryList.removeEventListener('change', onChange)
    }
  }
  const getSnapshot = () => window.matchMedia(query).matches
  const getServerSnapshot = () => false

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
