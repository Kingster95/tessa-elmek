import { describeDataError, type DataError } from '../../data/errors'
import styles from './ErrorState.module.css'

interface ErrorStateProps {
  error: DataError
  onRetry?: () => void
  title?: string
  retryLabel?: string
}

export function ErrorState({
  error,
  onRetry,
  title = 'Nu am putut încărca datele',
  retryLabel = 'Încearcă din nou',
}: ErrorStateProps) {
  return (
    <div className={styles.root} role="alert">
      <svg className={styles.icon} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
      </svg>
      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        <p className={styles.message}>{describeDataError(error)}</p>
        {onRetry && (
          <button type="button" className="btn btn--outline" onClick={onRetry}>
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  )
}
