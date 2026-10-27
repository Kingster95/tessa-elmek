import type { CompanyInfo, Product } from '../../data/types'
import { AddToOfferForm } from './AddToOfferForm'
import styles from './ProductSummary.module.css'

interface ProductSummaryProps {
  product: Product
  /** Null while the company info is still loading or failed. */
  company: CompanyInfo | null
}

/** Right column of the product page: badges, title, intro, key specs, add form, links. */
export function ProductSummary({ product, company }: ProductSummaryProps) {
  const datasheet = product.documents.find((document) => document.type === 'fisa-tehnica')
  const showLinks = Boolean(datasheet) || company !== null

  return (
    <div className={styles.root}>
      <div className={styles.badges}>
        <span className={`badge ${styles.brand}`}>{product.brand}</span>
        <span className="badge">Cod: {product.code}</span>
      </div>

      <h1 className={styles.title}>{product.name}</h1>

      <p className={styles.description}>{product.shortDescription}</p>

      {product.keySpecs.length > 0 && (
        <dl className={styles.specs}>
          {product.keySpecs.map((spec, index) => (
            <div key={`${spec.label}-${index}`} className={styles.specRow}>
              <dt className={styles.specLabel}>{spec.label}</dt>
              <dd className={styles.specValue}>{spec.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <AddToOfferForm product={product} />

      {showLinks && (
        <div className={styles.links}>
          {datasheet && (
            <a href={datasheet.url} target="_blank" rel="noreferrer" className={styles.link}>
              Descarcă fișa tehnică ({datasheet.format})
              <span className="visually-hidden"> (se deschide într-o filă nouă)</span>
            </a>
          )}
          {company && (
            <a href={`tel:${company.phoneHref}`} className={styles.link}>
              Întreabă un consultant: {company.phone}
            </a>
          )}
        </div>
      )}
    </div>
  )
}
