import { useState, type FormEvent } from 'react'
import type { Product } from '../../data/types'
import { QuantityInput } from '../../components/ui/QuantityInput'
import { useOfferList } from '../offer-list/useOfferList'
import styles from './AddToOfferForm.module.css'

interface AddToOfferFormProps {
  product: Product
}

/** Quantity + "add to offer list"; the layout shows the confirmation toast. */
export function AddToOfferForm({ product }: AddToOfferFormProps) {
  const offerList = useOfferList()
  const [quantity, setQuantity] = useState(1)
  const listed = offerList.items.find((item) => item.productId === product.id)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    offerList.add(product, quantity)
  }

  return (
    <div className={styles.root}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <QuantityInput
          id="cantitate"
          size="lg"
          value={quantity}
          onChange={setQuantity}
          label="Cantitate"
          describedAs={product.name}
        />
        <button type="submit" className={`btn btn--primary btn--lg ${styles.submit}`}>
          Adaugă în lista de ofertă
        </button>
      </form>
      <p className={styles.status} role="status">
        {listed ? `În lista de ofertă: ${listed.quantity} buc.` : ''}
      </p>
    </div>
  )
}
