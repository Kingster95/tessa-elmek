import type { ChangeEvent } from 'react'
import type { QuoteFormField as QuoteFormFieldName } from './validateQuoteRequest'

export interface QuoteFieldConfig {
  name: QuoteFormFieldName
  id: string
  label: string
  hint?: string
  type?: 'text' | 'email' | 'tel'
  inputMode?: 'email' | 'tel'
  autoComplete: string
  multiline?: boolean
  required?: boolean
}

interface QuoteFormFieldProps {
  field: QuoteFieldConfig
  value: string
  error: string | undefined
  onChange: (name: QuoteFormFieldName, value: string) => void
}

/** One labelled control of the quote form, with its hint and error message. */
export function QuoteFormField({ field, value, error, onChange }: QuoteFormFieldProps) {
  const hintId = field.hint ? `${field.id}-indicatie` : undefined
  const errorId = `${field.id}-eroare`
  const describedBy = [error ? errorId : undefined, hintId].filter(Boolean).join(' ') || undefined

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(field.name, event.target.value)
  }

  const shared = {
    id: field.id,
    name: field.name,
    className: 'input',
    value,
    onChange: handleChange,
    autoComplete: field.autoComplete,
    'aria-required': field.required ? true : undefined,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
  } as const

  return (
    <div className="field">
      <label htmlFor={field.id} className="field__label">
        {field.label}
      </label>
      {field.multiline ? (
        <textarea {...shared} rows={5} />
      ) : (
        <input {...shared} type={field.type ?? 'text'} inputMode={field.inputMode} />
      )}
      {field.hint && (
        <p id={hintId} className="field__hint">
          {field.hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field__error">
          {error}
        </p>
      )}
    </div>
  )
}
