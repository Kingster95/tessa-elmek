import { useCategories, useProducts } from '../../data/hooks'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { CategoryCard } from './CategoryCard'
import styles from './CategoryGrid.module.css'

/**
 * Every category as a CategoryCard. Product counts come from the full
 * product list and are shown only once it has loaded; a failed count never
 * blocks the categories themselves.
 */
export function CategoryGrid() {
  const categories = useCategories()
  const products = useProducts({})

  if (categories.loading) {
    return <LoadingState label="Se încarcă categoriile…" />
  }

  if (categories.error) {
    return (
      <ErrorState
        error={categories.error}
        onRetry={categories.retry}
        title="Nu am putut încărca categoriile"
      />
    )
  }

  if (categories.data === null || categories.data.length === 0) {
    return (
      <EmptyState
        title="Nicio categorie disponibilă"
        description="Gama de produse este în curs de actualizare. Reveniți în curând sau contactați-ne pentru detalii."
      />
    )
  }

  const countsReady = products.data !== null && !products.loading
  const counts = new Map<string, number>()
  if (countsReady && products.data) {
    for (const product of products.data) {
      counts.set(product.categoryId, (counts.get(product.categoryId) ?? 0) + 1)
    }
  }

  return (
    <ul className={styles.grid} role="list">
      {categories.data.map((category, index) => (
        <li key={category.id} className={styles.item}>
          <CategoryCard
            category={category}
            index={index + 1}
            productCount={countsReady ? (counts.get(category.id) ?? 0) : undefined}
          />
        </li>
      ))}
    </ul>
  )
}
