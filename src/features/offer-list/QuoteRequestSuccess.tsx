import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import type { QuoteRequestResult } from '../../data/types'
import styles from './QuoteRequestSuccess.module.css'

interface QuoteRequestSuccessProps {
  result: QuoteRequestResult
  /** The address the request was sent from, echoed back to the visitor. */
  email: string
}

/** Confirmation card shown in place of the list once a request was accepted. */
export function QuoteRequestSuccess({ result, email }: QuoteRequestSuccessProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  // The card replaces the form the visitor just used; bring focus (and the
  // viewport) to it so the confirmation is not missed.
  useEffect(() => {
    rootRef.current?.focus()
  }, [])

  return (
    <div ref={rootRef} className={`card ${styles.root}`} role="status" tabIndex={-1}>
      <div className={styles.icon} aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className={styles.title}>Cererea de ofertă a fost trimisă</h2>
      <p className={styles.reference}>
        Număr de referință:{' '}
        <strong className={`mono ${styles.referenceNumber}`}>{result.referenceNumber}</strong>
      </p>
      <p className={styles.text}>
        Vă vom contacta la adresa <strong className={styles.email}>{email}</strong> în cel mai scurt
        timp. Păstrați numărul de referință pentru corespondență.
      </p>
      <div className={styles.actions}>
        <Link to="/produse" className={`btn btn--primary ${styles.action}`}>
          Înapoi la catalog
        </Link>
        <Link to="/" className={`btn btn--outline ${styles.action}`}>
          Pagina principală
        </Link>
      </div>
    </div>
  )
}
