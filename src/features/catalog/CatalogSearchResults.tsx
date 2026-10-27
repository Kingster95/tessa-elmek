import { Link } from 'react-router-dom'
import { useProducts } from '../../data/hooks'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { ProductCountLabel } from './ProductCountLabel'
import { ProductGrid } from './ProductGrid'
import styles from './CatalogSearchResults.module.css'

interface CatalogSearchResultsProps {
  /** Trimmed, non-empty query from the URL. */
  query: string
  onClearSearch: () => void
}

/** Search mode of /produse: results across every category. */
export function CatalogSearchResults({ query, onClearSearch }: CatalogSearchResultsProps) {
  const products = useProducts({ search: query })

  return (
    <section className={styles.root} aria-labelledby="catalog-search-title">
      <SectionHeader
        id="catalog-search-title"
        title={`Rezultate pentru „${query}”`}
        size="lg"
        action={
          <Link to="/produse" className={styles.back}>
            ← Înapoi la categorii
          </Link>
        }
      />
      <ProductCountLabel count={products.data?.length ?? null} loading={products.loading} />
      <ProductGrid
        products={products.data}
        loading={products.loading}
        error={products.error}
        onRetry={products.retry}
        search={query}
        onClearSearch={onClearSearch}
      />
    </section>
  )
}
