import { useProducts } from '../../data/hooks'
import type { Category } from '../../data/types'
import { ProductCountLabel } from './ProductCountLabel'
import { ProductGrid } from './ProductGrid'
import styles from './CategoryProducts.module.css'

interface CategoryProductsProps {
  category: Category
  /** Debounced search text; empty when browsing the whole category. */
  search: string
  onClearSearch: () => void
  className?: string
}

/** Main column of the category page: heading, result count and product grid. */
export function CategoryProducts({ category, search, onClearSearch, className }: CategoryProductsProps) {
  const query = search.trim()
  const products = useProducts({ categorySlug: category.slug, search: query })
  const title = query ? `Rezultate pentru „${query}”` : category.name

  return (
    <section className={`${styles.root} ${className ?? ''}`} aria-labelledby="category-products-title">
      <div className={styles.header}>
        <h2 id="category-products-title" className={styles.title}>
          {title}
        </h2>
        <ProductCountLabel count={products.data?.length ?? null} loading={products.loading} />
      </div>
      <ProductGrid
        products={products.data}
        loading={products.loading}
        error={products.error}
        onRetry={products.retry}
        search={query}
        onClearSearch={onClearSearch}
        emptyDescription="Această categorie nu are produse momentan."
      />
    </section>
  )
}
