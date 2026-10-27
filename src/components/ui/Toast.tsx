import { Link } from 'react-router-dom'
import styles from './Toast.module.css'

interface ToastProps {
  message: string | null
  onDismiss: () => void
  /** Optional link shown next to the message. */
  action?: { label: string; to: string }
}

/**
 * Polite live region for short feedback (e.g. "added to offer list").
 * Always rendered so screen readers pick up changes; hidden when empty.
 */
export function Toast({ message, onDismiss, action }: ToastProps) {
  return (
    <div className={styles.region} role="status" aria-live="polite">
      {message && (
        <div className={styles.toast}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={styles.message}>{message}</span>
          {action && (
            <Link to={action.to} className={styles.action} onClick={onDismiss}>
              {action.label}
            </Link>
          )}
          <button type="button" className={styles.close} onClick={onDismiss} aria-label="Închide notificarea">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
