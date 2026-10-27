import styles from './LoadingState.module.css'

interface LoadingStateProps {
  label?: string
  /** Compact inline spinner for small areas (e.g. a sidebar). */
  size?: 'sm' | 'md'
}

export function LoadingState({ label = 'Se încarcă…', size = 'md' }: LoadingStateProps) {
  return (
    <div className={`${styles.root} ${size === 'sm' ? styles.small : ''}`} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
