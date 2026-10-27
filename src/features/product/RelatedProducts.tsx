import { useRelatedProducts } from '../../data/hooks'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { ProductCard } from '../catalog/ProductCard'
import styles from './RelatedProducts.module.css'

interface RelatedProductsProps {
  productId: string
}

/** "Produse similare" grid; renders nothing when there is nothing related. */
export function RelatedProducts({ productId }: RelatedProductsProps) {
  const { data, loading, error, retry } = useRelatedProducts(productId)

  if (loading) {
    return (
      <section className={`container ${styles.root}`}>
        <LoadingState label="Se încarcă produsele similare…" />
      </section>
    )
  }

  if (error) {
    return (
      <section className={`container ${styles.root}`}>
        <ErrorState error={error} onRetry={retry} title="Nu am putut încărca produsele similare" />
      </section>
    )
  }

  if (!data || data.length === 0) {
    return null
  }

  return (
    <section className={`container ${styles.root}`} aria-labelledby="produse-similare">
      <h2 id="produse-similare" className={styles.title}>
        Produse similare
      </h2>
      <ul className={styles.grid}>
        {data.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} variant="compact" />
          </li>
        ))}
      </ul>
    </section>
  )
}
