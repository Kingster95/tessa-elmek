import type { DataError } from '../../data/errors'
import type { Product } from '../../data/types'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { ProductCard } from './ProductCard'
import styles from './ProductGrid.module.css'

interface ProductGridProps {
  /** Null on the very first load; stale data is kept while refetching. */
  products: Product[] | null
  loading: boolean
  error: DataError | null
  onRetry: () => void
  /** Active (trimmed) search text; drives the empty-state copy. */
  search?: string
  /** Shown as "Șterge căutarea" in the empty state while searching. */
  onClearSearch?: () => void
  /** Empty-state copy when nothing is being searched. */
  emptyDescription?: string
}

/**
 * Responsive grid of catalog ProductCards with the shared loading, error and
 * empty states. While a refetch keeps previous data the grid is marked busy
 * and dimmed instead of blanked, so search-as-you-type does not flicker.
 */
export function ProductGrid({
  products,
  loading,
  error,
  onRetry,
  search = '',
  onClearSearch,
  emptyDescription = 'Nu există produse de afișat momentan.',
}: ProductGridProps) {
  if (error) {
    return <ErrorState error={error} onRetry={onRetry} title="Nu am putut încărca produsele" />
  }

  if (products === null || (loading && products.length === 0)) {
    return <LoadingState label="Se încarcă produsele…" />
  }

  if (products.length === 0) {
    const searching = search.length > 0
    return (
      <EmptyState
        title="Niciun produs găsit"
        description={
          searching
            ? `Nu am găsit produse pentru „${search}”. Încercați alt cod sau alt termen.`
            : emptyDescription
        }
        action={
          searching && onClearSearch ? (
            <button type="button" className="btn btn--outline" onClick={onClearSearch}>
              Șterge căutarea
            </button>
          ) : undefined
        }
      />
    )
  }

  return (
    <ul className={styles.grid} role="list" aria-busy={loading || undefined}>
      {products.map((product) => (
        <li key={product.id} className={styles.item}>
          <ProductCard product={product} variant="catalog" />
        </li>
      ))}
    </ul>
  )
}
