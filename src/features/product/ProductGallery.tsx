import { useState } from 'react'
import { ProductImage } from '../../components/ui/ProductImage'
import styles from './ProductGallery.module.css'

interface ProductGalleryProps {
  images: string[]
  /** Product name, used as alt text for the main photo. */
  name: string
}

/**
 * Main image frame plus a thumbnail strip when the product has several
 * photos. Mount with `key={product.id}` so the active index resets per product.
 */
export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const current: string | undefined = images[active] ?? images[0]

  return (
    <div className={styles.root}>
      <ProductImage key={current ?? 'ilustratie'} src={current} alt={name} size="lg" />
      {images.length > 1 && (
        <div className={styles.thumbs} role="group" aria-label="Imagini produs">
          {images.map((src, index) => {
            const isActive = index === active
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                className={`${styles.thumb} ${isActive ? styles.active : ''}`}
                aria-label={`Imagine ${index + 1}`}
                aria-pressed={isActive}
                onClick={() => setActive(index)}
              >
                <img className={styles.thumbImage} src={src} alt="" loading="lazy" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
