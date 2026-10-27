import { useState } from 'react'
import { DeviceIllustration } from './DeviceIllustration'
import styles from './ProductImage.module.css'

interface ProductImageProps {
  /** First image URL, if any. */
  src?: string
  /** Product name; used as alt text for a real photo. */
  alt: string
  /** Visual size of the frame. */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Shows the product photo when one exists, otherwise (or when the photo fails
 * to load) the inline device illustration on the muted frame from the mockups.
 */
export function ProductImage({ src, alt, size = 'md', className }: ProductImageProps) {
  const [failed, setFailed] = useState(false)
  const showPhoto = Boolean(src) && !failed
  const classes = [styles.frame, styles[size], className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      {showPhoto ? (
        <img
          className={styles.photo}
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => {
            setFailed(true)
          }}
        />
      ) : (
        <DeviceIllustration className={styles.illustration} />
      )}
    </div>
  )
}
