import { createContext } from 'react'
import type { Theme } from './theme'

export interface ThemeContextValue {
  theme: Theme
  /** True when the visitor chose a theme; false while following the system. */
  isExplicit: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
