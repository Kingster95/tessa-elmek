import { useState } from 'react'
import styles from './QuantityInput.module.css'

interface QuantityInputProps {
  id: string
  value: number
  onChange: (value: number) => void
  label?: string
  /** Hide the label visually (still announced) for compact rows. */
  hideLabel?: boolean
  min?: number
  max?: number
  size?: 'md' | 'lg'
  /** Extra context for the +/− buttons, e.g. the product name. */
  describedAs?: string
}

/**
 * Number field with 44px −/+ buttons; the typed value is committed on blur.
 * At the bounds the buttons stay focusable (aria-disabled, no-op) so keyboard
 * focus is never dropped from a button that just became disabled.
 */
export function QuantityInput({
  id,
  value,
  onChange,
  label = 'Cantitate',
  hideLabel = false,
  min = 1,
  max = 9999,
  size = 'md',
  describedAs,
}: QuantityInputProps) {
  const [draft, setDraft] = useState<string | null>(null)
  const clamp = (next: number) => Math.min(max, Math.max(min, Math.round(next)))
  const suffix = describedAs ? ` pentru ${describedAs}` : ''
  const atMin = value <= min
  const atMax = value >= max

  const commit = (raw: string) => {
    const parsed = Number.parseInt(raw, 10)
    onChange(Number.isNaN(parsed) ? value : clamp(parsed))
    setDraft(null)
  }

  return (
    <div className={`${styles.root} ${size === 'lg' ? styles.lg : ''}`}>
      <label htmlFor={id} className={hideLabel ? 'visually-hidden' : styles.label}>
        {label}
      </label>
      <div className={styles.group}>
        <button
          type="button"
          className={styles.step}
          onClick={() => {
            if (!atMin) onChange(clamp(value - 1))
          }}
          aria-disabled={atMin}
          aria-label={`Scade cantitatea${suffix}`}
        >
          −
        </button>
        <input
          id={id}
          className={styles.input}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={draft ?? value}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={(event) => commit(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              commit(event.currentTarget.value)
            }
          }}
        />
        <button
          type="button"
          className={styles.step}
          onClick={() => {
            if (!atMax) onChange(clamp(value + 1))
          }}
          aria-disabled={atMax}
          aria-label={`Crește cantitatea${suffix}`}
        >
          +
        </button>
      </div>
    </div>
  )
}
