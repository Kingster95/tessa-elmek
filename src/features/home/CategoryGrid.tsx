import { useId } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { useCategories } from '../../data/hooks'
import { CategoryCard } from '../catalog/CategoryCard'
import styles from './CategoryGrid.module.css'

/** "Gama de produse": one tile per category, rows on phones. */
export function CategoryGrid() {
  const { data, loading, error, retry } = useCategories()
  const headingId = useId()

  let content
  if (loading) {
    content = <LoadingState label="Se încarcă categoriile…" />
  } else if (error) {
    content = <ErrorState error={error} onRetry={retry} title="Nu am putut încărca categoriile" />
  } else if (!data || data.length === 0) {
    content = (
      <EmptyState
        title="Nicio categorie disponibilă"
        description="Catalogul este în curs de actualizare. Reveniți în curând sau contactați-ne pentru o ofertă."
        action={
          <Link to="/contact" className="btn btn--outline">
            Contactați-ne
          </Link>
        }
      />
    )
  } else {
    content = (
      <ul className={styles.grid}>
        {data.map((category, index) => (
          <li key={category.id} className={styles.cell}>
            <CategoryCard category={category} index={index + 1} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <section className={`container ${styles.root}`} aria-labelledby={headingId}>
      <div className={styles.header}>
        <SectionHeader
          eyebrow="Categorii"
          title="Gama de produse"
          size="xl"
          id={headingId}
          action={
            <Link to="/produse" className={styles.headerLink}>
              Toate produsele →
            </Link>
          }
        />
      </div>
      <div className={styles.body}>{content}</div>
    </section>
  )
}
