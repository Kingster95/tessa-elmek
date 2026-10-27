import { useTheme } from './useTheme'
import styles from './ThemeToggle.module.css'

/**
 * Light/dark switch: a pill track with a sliding thumb that carries the icon
 * of the active theme (sun or moon). Exposed as a switch named "Mod întunecat"
 * whose checked state is the dark theme.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Mod întunecat"
      title={isDark ? 'Treci la modul luminos' : 'Treci la modul întunecat'}
      className={`${styles.root} ${className ?? ''}`}
      onClick={toggleTheme}
    >
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb}>
          <svg
            className={`${styles.icon} ${styles.sun}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
          </svg>
          <svg
            className={`${styles.icon} ${styles.moon}`}
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          >
            <path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1z" />
          </svg>
        </span>
      </span>
    </button>
  )
}
