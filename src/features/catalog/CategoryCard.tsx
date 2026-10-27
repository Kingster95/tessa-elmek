import { Link } from 'react-router-dom'
import type { Category } from '../../data/types'
import { DeviceIllustration } from '../../components/ui/DeviceIllustration'
import { formatProductCount } from '../../lib/format'
import styles from './CategoryCard.module.css'

interface CategoryCardProps {
  category: Category
  /** 1-based position, rendered as "01", "02"… */
  index: number
  /** When known, shown instead of the generic "Vezi produsele" line. */
  productCount?: number
}

/**
 * Category tile from the home mockup. On phones it collapses into the
 * row layout of the mobile mockup (thumbnail, name, chevron).
 */
export function CategoryCard({ category, index, productCount }: CategoryCardProps) {
  const number = String(index).padStart(2, '0')
  return (
    <Link to={`/produse/${category.slug}`} className={styles.card}>
      <div className={styles.media} aria-hidden="true">
        {category.imageUrl ? (
          <img className={styles.image} src={category.imageUrl} alt="" loading="lazy" />
        ) : (
          <DeviceIllustration className={styles.illustration} />
        )}
      </div>
      <div className={styles.body}>
        <span className={styles.number}>{number}</span>
        <span className={styles.name}>{category.name}</span>
        <span className={styles.footer}>
          {productCount === undefined ? 'Vezi produsele →' : `${formatProductCount(productCount)} →`}
        </span>
      </div>
      <span className={styles.chevron} aria-hidden="true">
        ›
      </span>
    </Link>
  )
}
