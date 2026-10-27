import { useEffect, useRef, useState, type FormEvent } from 'react'
import { flushSync } from 'react-dom'
import { ErrorState } from '../../components/ui/ErrorState'
import { useQuoteRequestSubmission } from '../../data/hooks'
import type { QuoteRequest, QuoteRequestResult } from '../../data/types'
import { QuoteFormField, type QuoteFieldConfig } from './QuoteFormField'
import type { OfferListItem } from './types'
import {
  buildQuoteRequest,
  emptyQuoteFormValues,
  isValid,
  validateQuoteRequest,
  type QuoteFormErrors,
  type QuoteFormField as FieldName,
  type QuoteFormValues,
} from './validateQuoteRequest'
import styles from './QuoteRequestForm.module.css'

const FIELDS: QuoteFieldConfig[] = [
  {
    name: 'companyName',
    id: 'oferta-firma',
    label: 'Denumirea firmei *',
    autoComplete: 'organization',
    required: true,
  },
  {
    name: 'contactPerson',
    id: 'oferta-persoana',
    label: 'Persoana de contact *',
    autoComplete: 'name',
    required: true,
  },
  {
    name: 'email',
    id: 'oferta-email',
    label: 'Adresa de email *',
    type: 'email',
    inputMode: 'email',
    autoComplete: 'email',
    required: true,
  },
  {
    name: 'phone',
    id: 'oferta-telefon',
    label: 'Numărul de telefon *',
    type: 'tel',
    inputMode: 'tel',
    autoComplete: 'tel',
    hint: 'De exemplu 0722 123 456',
    required: true,
  },
  {
    name: 'message',
    id: 'oferta-mesaj',
    label: 'Mesaj (opțional)',
    autoComplete: 'off',
    multiline: true,
    hint: 'Detalii despre proiect, termen de livrare dorit, condiții speciale.',
  },
]

interface QuoteRequestFormProps {
  items: OfferListItem[]
  /** Called once the server accepted the request; the page owns what follows. */
  onSuccess: (result: QuoteRequestResult, request: QuoteRequest) => void
}

export function QuoteRequestForm({ items, onSuccess }: QuoteRequestFormProps) {
  const [values, setValues] = useState<QuoteFormValues>(emptyQuoteFormValues)
  const [errors, setErrors] = useState<QuoteFormErrors>({})
  const [summaryFocusKey, setSummaryFocusKey] = useState(0)
  // Only ever bumped inside flushSync after a failed submission; see attemptSubmit.
  const [, setFailedSubmissions] = useState(0)
  const summaryRef = useRef<HTMLDivElement>(null)
  const submitErrorRef = useRef<HTMLDivElement>(null)
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const { submit, submitting, error } = useQuoteRequestSubmission()

  // Move focus to the error summary each time a submit attempt fails validation.
  useEffect(() => {
    if (summaryFocusKey > 0) summaryRef.current?.focus()
  }, [summaryFocusKey])

  const handleChange = (name: FieldName, value: string) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      if (!current[name]) return current
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  const attemptSubmit = () => {
    if (submitting) return
    const nextErrors = validateQuoteRequest(values)
    if (!isValid(nextErrors)) {
      setErrors(nextErrors)
      setSummaryFocusKey((key) => key + 1)
      return
    }
    const request = buildQuoteRequest(values, items)
    void submit(request).then((result) => {
      if (result) {
        onSuccess(result, request)
        return
      }
      // The hook has queued its `error` state, but updates made outside an
      // event (here: after the request settled) are committed by React on its
      // own schedule. A sync update inside flushSync is committed together with
      // that queued error, so the ErrorState is in the DOM when focus moves.
      flushSync(() => {
        setFailedSubmissions((count) => count + 1)
      })
      submitErrorRef.current?.focus()
    })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    attemptSubmit()
  }

  // Retrying unmounts the ErrorState (and its focused button) as soon as the
  // hook clears the previous error; park focus on the submit button meanwhile.
  const handleRetry = () => {
    submitButtonRef.current?.focus()
    attemptSubmit()
  }

  const errorEntries = FIELDS.flatMap((field) => {
    const message = errors[field.name]
    return message ? [{ field, message }] : []
  })

  return (
    <form
      className={`card ${styles.root}`}
      noValidate
      onSubmit={handleSubmit}
      aria-busy={submitting || undefined}
      aria-labelledby="date-oferta-titlu"
    >
      <div className={styles.header}>
        <h2 id="date-oferta-titlu" className={styles.title}>
          Date pentru ofertă
        </h2>
        <p className={styles.intro}>Câmpurile marcate cu * sunt obligatorii.</p>
      </div>

      {errorEntries.length > 0 && (
        <div ref={summaryRef} className={styles.summary} role="alert" tabIndex={-1}>
          <h3 className={styles.summaryTitle}>Verificați câmpurile marcate</h3>
          <ul className={styles.summaryList}>
            {errorEntries.map(({ field, message }) => (
              <li key={field.name}>
                <a
                  href={`#${field.id}`}
                  className={styles.summaryLink}
                  onClick={(event) => {
                    event.preventDefault()
                    document.getElementById(field.id)?.focus()
                  }}
                >
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.fields}>
        {FIELDS.map((field) => (
          <QuoteFormField
            key={field.name}
            field={field}
            value={values[field.name]}
            error={errors[field.name]}
            onChange={handleChange}
          />
        ))}
      </div>

      {error && (
        <div ref={submitErrorRef} className={styles.submitError} tabIndex={-1}>
          <ErrorState error={error} onRetry={handleRetry} title="Cererea nu a putut fi trimisă" />
        </div>
      )}

      <div className={styles.actions}>
        {/*
         * Not `disabled`: a disabled button loses focus, which would leave
         * keyboard focus on <body> if the submission fails. Clicks while
         * submitting are ignored in attemptSubmit instead.
         */}
        <button
          ref={submitButtonRef}
          type="submit"
          className="btn btn--primary btn--lg btn--block"
          aria-disabled={submitting || undefined}
        >
          {submitting ? 'Se trimite…' : 'Trimite cererea de ofertă'}
        </button>
        <p className={styles.note}>Nu există obligații de cumpărare. Oferta este gratuită.</p>
      </div>
    </form>
  )
}
