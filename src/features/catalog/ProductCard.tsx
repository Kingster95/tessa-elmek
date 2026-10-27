import { Link } from 'react-router-dom'
import type { Product } from '../../data/types'
import { ProductImage } from '../../components/ui/ProductImage'
import { useOfferList } from '../offer-list/useOfferList'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
  /**
   * 'catalog' – image, code, name, short description, "Detalii" + add button.
   * 'compact' – image, code, name only (similar products).
   */
  variant?: 'catalog' | 'compact'
}

export function ProductCard({ product, variant = 'catalog' }: ProductCardProps) {
  const offerList = useOfferList()
  const href = `/produs/${product.slug}`
  const inList = offerList.has(product.id)

  if (variant === 'compact') {
    return (
      <article className={`${styles.card} ${styles.compact}`}>
        <Link to={href} className={styles.compactLink}>
          <ProductImage src={product.imageUrls[0]} alt="" size="sm" />
          <div className={styles.compactBody}>
            <span className={styles.code}>{product.code}</span>
            <span className={styles.compactName}>{product.name}</span>
          </div>
        </Link>
      </article>
    )
  }

  return (
    <article className={styles.card}>
      <Link to={href} className={styles.imageLink} tabIndex={-1} aria-hidden="true">
        <ProductImage src={product.imageUrls[0]} alt="" size="md" />
      </Link>
      <div className={styles.body}>
        <span className={styles.code}>{product.code}</span>
        <h3 className={styles.name}>
          <Link to={href} className={styles.nameLink}>
            {product.name}
          </Link>
        </h3>
        <p className={styles.description}>{product.shortDescription}</p>
        <div className={styles.actions}>
          <Link to={href} className={`btn btn--outline ${styles.details}`}>
            Detalii<span className="visually-hidden"> despre {product.name}</span>
          </Link>
          <button
            type="button"
            className={`btn btn--primary btn--icon ${inList ? styles.added : ''}`}
            onClick={() => offerList.add(product, 1)}
            aria-label={
              inList
                ? `Adaugă încă o bucată din ${product.name} în lista de ofertă`
                : `Adaugă ${product.name} în lista de ofertă`
            }
            title="Adaugă în lista de ofertă"
          >
            {inList ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <span aria-hidden="true">+</span>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
