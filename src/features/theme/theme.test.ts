import { describe, expect, it } from 'vitest'
import indexHtml from '../../../index.html?raw'
import {
  THEME_STORAGE_KEY,
  isTheme,
  oppositeTheme,
  readStoredTheme,
  readSystemTheme,
  resolveTheme,
  writeStoredTheme,
} from './theme'

function createMemoryStorage(
  initial: Record<string, string> = {},
): Storage & { dump(): Record<string, string> } {
  const map = new Map(Object.entries(initial))
  return {
    get length() {
      return map.size
    },
    clear: () => {
      map.clear()
    },
    getItem: (key) => map.get(key) ?? null,
    key: (index) => [...map.keys()][index] ?? null,
    removeItem: (key) => {
      map.delete(key)
    },
    setItem: (key, value) => {
      map.set(key, String(value))
    },
    dump: () => Object.fromEntries(map),
  }
}

/** Mimics Safari private mode / blocked storage: every access throws. */
function createThrowingStorage(): Storage {
  const fail = (): never => {
    throw new Error('SecurityError: accesul la localStorage este blocat')
  }
  return { length: 0, clear: fail, getItem: fail, key: fail, removeItem: fail, setItem: fail }
}

function fakeMatchMedia(matches: boolean): typeof window.matchMedia {
  return ((query: string) => ({ matches, media: query })) as unknown as typeof window.matchMedia
}

describe('theme storage', () => {
  it('returns null when nothing was saved', () => {
    expect(readStoredTheme(createMemoryStorage())).toBeNull()
    expect(readStoredTheme(undefined)).toBeNull()
  })

  it('ignores values that are not a theme', () => {
    expect(readStoredTheme(createMemoryStorage({ [THEME_STORAGE_KEY]: 'blue' }))).toBeNull()
    expect(readStoredTheme(createMemoryStorage({ [THEME_STORAGE_KEY]: '' }))).toBeNull()
  })

  it('round-trips a saved choice', () => {
    const storage = createMemoryStorage()
    writeStoredTheme('dark', storage)
    expect(storage.dump()).toEqual({ [THEME_STORAGE_KEY]: 'dark' })
    expect(readStoredTheme(storage)).toBe('dark')
  })

  it('survives blocked storage', () => {
    const storage = createThrowingStorage()
    expect(() => writeStoredTheme('light', storage)).not.toThrow()
    expect(readStoredTheme(storage)).toBeNull()
  })
})

describe('theme resolution', () => {
  it('prefers the saved choice over the system', () => {
    expect(resolveTheme('light', 'dark')).toBe('light')
    expect(resolveTheme('dark', 'light')).toBe('dark')
  })

  it('falls back to the system preference', () => {
    expect(resolveTheme(null, 'dark')).toBe('dark')
    expect(readSystemTheme(fakeMatchMedia(true))).toBe('dark')
    expect(readSystemTheme(fakeMatchMedia(false))).toBe('light')
    expect(readSystemTheme(undefined)).toBe('light')
  })

  it('toggles between the two themes', () => {
    expect(oppositeTheme('light')).toBe('dark')
    expect(oppositeTheme('dark')).toBe('light')
    expect(isTheme('dark')).toBe(true)
    expect(isTheme('auto')).toBe(false)
  })
})

describe('pre-paint script in index.html', () => {
  it('uses the same storage key and attribute as the provider', () => {
    expect(indexHtml).toContain(`'${THEME_STORAGE_KEY}'`)
    expect(indexHtml).toContain('data-theme')
    expect(indexHtml).toContain('prefers-color-scheme: dark')
  })
})
