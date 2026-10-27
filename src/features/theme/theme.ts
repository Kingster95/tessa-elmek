/**
 * Theme model shared by the provider, the toggle and the pre-paint script in
 * index.html. Keep THEME_STORAGE_KEY in sync with that script.
 */
export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'tessa-elmek.theme.v1'
export const THEME_ATTRIBUTE = 'data-theme'
const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)'

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

export function oppositeTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark'
}

/** The visitor's explicit choice, or null when none was saved (or storage is blocked). */
export function readStoredTheme(storage: Storage | undefined = safeStorage()): Theme | null {
  if (!storage) return null
  try {
    const raw = storage.getItem(THEME_STORAGE_KEY)
    return isTheme(raw) ? raw : null
  } catch {
    return null
  }
}

export function writeStoredTheme(theme: Theme, storage: Storage | undefined = safeStorage()): void {
  if (!storage) return
  try {
    storage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Storage blocked or full: the choice still applies for this session.
  }
}

/** What the operating system / browser asks for. */
export function readSystemTheme(matchMedia: typeof window.matchMedia | undefined = safeMatchMedia()): Theme {
  if (!matchMedia) return 'light'
  try {
    return matchMedia(DARK_SCHEME_QUERY).matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

/** Stored choice first, otherwise the system preference. */
export function resolveTheme(stored: Theme | null, system: Theme): Theme {
  return stored ?? system
}

/** The theme already applied to <html> by the inline script, if any. */
export function readDocumentTheme(): Theme | null {
  if (typeof document === 'undefined') return null
  const value = document.documentElement.getAttribute(THEME_ATTRIBUTE)
  return isTheme(value) ? value : null
}

export function applyThemeToDocument(theme: Theme): void {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme)
}

/**
 * Subscribes to system theme changes. Returns an unsubscribe function; a
 * no-op when matchMedia is unavailable.
 */
export function subscribeToSystemTheme(onChange: (theme: Theme) => void): () => void {
  const matchMedia = safeMatchMedia()
  if (!matchMedia) return () => {}
  const mediaQueryList = matchMedia(DARK_SCHEME_QUERY)
  const handleChange = (event: MediaQueryListEvent) => {
    onChange(event.matches ? 'dark' : 'light')
  }
  mediaQueryList.addEventListener('change', handleChange)
  return () => {
    mediaQueryList.removeEventListener('change', handleChange)
  }
}

function safeStorage(): Storage | undefined {
  try {
    if (typeof window === 'undefined') return undefined
    return window.localStorage
  } catch {
    return undefined
  }
}

function safeMatchMedia(): typeof window.matchMedia | undefined {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined
  return window.matchMedia.bind(window)
}
