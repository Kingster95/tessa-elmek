import { useRef } from 'react'
import { flushSync } from 'react-dom'
import { Link } from 'react-router-dom'
import { ProductImage } from '../../components/ui/ProductImage'
import { QuantityInput } from '../../components/ui/QuantityInput'
import { MAX_QUANTITY, MIN_QUANTITY, type OfferListItem } from './types'
import styles from './OfferListItems.module.css'

interface OfferListItemsProps {
  items: OfferListItem[]
  onQuantityChange: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  /**
   * Called right after the last line was removed. The list (and this
   * component) is gone by then, so the page decides where focus goes next.
   */
  onListEmptied: () => void
}

/** The product lines of the offer list: image, code, name, quantity, remove. */
export function OfferListItems({ items, onQuantityChange, onRemove, onListEmptied }: OfferListItemsProps) {
  // Remove buttons keyed by productId, so focus can move to a neighbouring
  // line once the focused button has been unmounted.
  const removeButtons = useRef(new Map<string, HTMLButtonElement>())

  const handleRemove = (productId: string) => {
    const index = items.findIndex((item) => item.productId === productId)
    // Prefer the next line; fall back to the previous one when the last line goes.
    const neighbour: OfferListItem | undefined = items[index + 1] ?? items[index - 1]
    // Commit the removal first so the focused button is gone and its neighbour
    // (or the empty state) is in the DOM when focus moves.
    flushSync(() => {
      onRemove(productId)
    })
    if (neighbour) {
      removeButtons.current.get(neighbour.productId)?.focus()
    } else {
      onListEmptied()
    }
  }

  return (
    <ul className={styles.list} aria-label="Produse din lista de ofertă">
      {items.map((item) => (
        <li key={item.productId} className={styles.row}>
          <div className={styles.media}>
            <ProductImage src={item.imageUrl} alt="" size="sm" className={styles.image} />
          </div>
          <div className={styles.body}>
            <span className={styles.code}>{item.code}</span>
            <span className={styles.name}>
              <Link to={`/produs/${item.slug}`} className={styles.nameLink}>
                {item.name}
              </Link>
            </span>
            <span className={styles.brand}>{item.brand}</span>
          </div>
          <div className={styles.controls}>
            <QuantityInput
              id={`cantitate-${item.productId}`}
              label={`Cantitate pentru ${item.name}`}
              hideLabel
              value={item.quantity}
              min={MIN_QUANTITY}
              max={MAX_QUANTITY}
              onChange={(quantity) => onQuantityChange(item.productId, quantity)}
              describedAs={item.name}
            />
            <button
              ref={(node) => {
                if (node) removeButtons.current.set(item.productId, node)
                else removeButtons.current.delete(item.productId)
              }}
              type="button"
              className={`btn btn--outline btn--icon ${styles.remove}`}
              onClick={() => handleRemove(item.productId)}
              aria-label={`Elimină ${item.name} din listă`}
              title="Elimină din listă"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
