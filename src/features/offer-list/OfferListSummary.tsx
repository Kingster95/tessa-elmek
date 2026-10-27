import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { formatProductCount } from '../../lib/format'
import styles from './OfferListSummary.module.css'

interface OfferListSummaryProps {
  itemCount: number
  totalQuantity: number
  onClear: () => void
}

/** Totals row under the product lines, with an inline two-step "clear list". */
export function OfferListSummary({ itemCount, totalQuantity, onClear }: OfferListSummaryProps) {
  const [confirming, setConfirming] = useState(false)
  const clearButtonRef = useRef<HTMLButtonElement>(null)

  const cancel = () => {
    // Commit the state change first so the "Golește lista" button exists again
    // when focus returns to it.
    flushSync(() => {
      setConfirming(false)
    })
    clearButtonRef.current?.focus()
  }

  return (
    <div className={styles.root}>
      <p className={styles.totals}>
        {formatProductCount(itemCount)} · {totalQuantity} buc. în total
      </p>
      {confirming ? (
        <div className={styles.confirm} role="group" aria-labelledby="golire-lista-intrebare">
          <span id="golire-lista-intrebare" className={styles.question}>
            Sigur doriți să goliți lista?
          </span>
          <div className={styles.confirmActions}>
            <button
              type="button"
              className={`btn btn--outline ${styles.confirmButton}`}
              onClick={onClear}
              autoFocus
            >
              Da, golește
            </button>
            <button type="button" className={`btn btn--ghost ${styles.confirmButton}`} onClick={cancel}>
              Renunță
            </button>
          </div>
        </div>
      ) : (
        <button
          ref={clearButtonRef}
          type="button"
          className={`btn btn--ghost ${styles.clearButton}`}
          onClick={() => setConfirming(true)}
        >
          Golește lista
        </button>
      )}
    </div>
  )
}
