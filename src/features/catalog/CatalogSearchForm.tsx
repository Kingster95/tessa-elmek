import type { FormEvent } from 'react'
import styles from './CatalogSearchForm.module.css'

interface CatalogSearchFormProps {
  /** Current query from the URL; used as the input's initial value. */
  initialQuery: string
  onSubmit: (query: string) => void
}

/** Search box shown inside the hero of /produse. Submits the trimmed query. */
export function CatalogSearchForm({ initialQuery, onSubmit }: CatalogSearchFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const input = event.currentTarget.elements.namedItem('cauta')
    if (input instanceof HTMLInputElement) {
      onSubmit(input.value.trim())
    }
  }

  return (
    <form role="search" className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="catalog-search" className="visually-hidden">
        Caută produse
      </label>
      <input
        id="catalog-search"
        name="cauta"
        type="search"
        className={`input input--lg ${styles.input}`}
        placeholder="Caută cod sau produs"
        defaultValue={initialQuery}
        autoComplete="off"
        enterKeyHint="search"
      />
      <button type="submit" className={`btn btn--primary btn--lg ${styles.button}`}>
        Caută
      </button>
    </form>
  )
}
