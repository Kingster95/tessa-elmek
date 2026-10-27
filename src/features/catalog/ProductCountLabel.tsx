import { formatProductCount } from '../../lib/format'
import styles from './ProductCountLabel.module.css'

interface ProductCountLabelProps {
  /** Null until the first result arrives. */
  count: number | null
  loading: boolean
}

/**
 * "12 produse" next to a results heading. Always rendered so the live region
 * exists before its text changes; empty when there is nothing to say yet.
 */
export function ProductCountLabel({ count, loading }: ProductCountLabelProps) {
  let text = ''
  if (count !== null) {
    text = formatProductCount(count)
  } else if (loading) {
    text = 'Se încarcă…'
  }

  return (
    <p className={styles.root} aria-live="polite">
      {text}
    </p>
  )
}
