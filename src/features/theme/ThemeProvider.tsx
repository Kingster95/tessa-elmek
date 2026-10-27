import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  THEME_STORAGE_KEY,
  applyThemeToDocument,
  isTheme,
  oppositeTheme,
  readDocumentTheme,
  readStoredTheme,
  readSystemTheme,
  resolveTheme,
  subscribeToSystemTheme,
  writeStoredTheme,
  type Theme,
} from './theme'
import { ThemeContext, type ThemeContextValue } from './ThemeContext'

/**
 * Owns the light/dark choice for the whole site.
 *
 * - First render reuses the theme the inline script in index.html already put
 *   on <html>, so there is no flash and no mismatch.
 * - Without a saved choice the site follows the system preference and reacts
 *   when it changes; once the visitor toggles, the choice is saved and wins.
 * - Other tabs stay in sync through the `storage` event.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<Theme | null>(() => readStoredTheme())
  const [system, setSystem] = useState<Theme>(() => readDocumentTheme() ?? readSystemTheme())
  const theme = resolveTheme(stored, system)

  useEffect(() => {
    applyThemeToDocument(theme)
  }, [theme])

  useEffect(() => subscribeToSystemTheme(setSystem), [])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY && event.key !== null) return
      setStored(isTheme(event.newValue) ? event.newValue : null)
    }
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const value = useMemo<ThemeContextValue>(() => {
    const setTheme = (next: Theme) => {
      setStored(next)
      writeStoredTheme(next)
    }
    return {
      theme,
      isExplicit: stored !== null,
      setTheme,
      toggleTheme: () => setTheme(oppositeTheme(theme)),
    }
  }, [theme, stored])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
