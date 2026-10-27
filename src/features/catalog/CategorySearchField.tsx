import styles from './CategorySearchField.module.css'

interface CategorySearchFieldProps {
  id: string
  value: string
  onChange: (value: string) => void
  label?: string
}

/** Controlled search box from the category sidebar ("Cod, nume sau serie"). */
export function CategorySearchField({
  id,
  value,
  onChange,
  label = 'Caută în această categorie',
}: CategorySearchFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <input
        id={id}
        type="search"
        className={`input ${styles.input}`}
        placeholder="Cod, nume sau serie"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
        enterKeyHint="search"
      />
    </div>
  )
}
