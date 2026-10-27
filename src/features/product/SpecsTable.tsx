import type { ProductSpec } from '../../data/types'
import styles from './SpecsTable.module.css'

interface SpecsTableProps {
  specs: ProductSpec[]
  productName: string
}

export function SpecsTable({ specs, productName }: SpecsTableProps) {
  if (specs.length === 0) {
    return <p className={styles.empty}>Nu există specificații tehnice pentru acest produs.</p>
  }

  return (
    <table className={styles.table}>
      <caption className="visually-hidden">Specificații tehnice {productName}</caption>
      <tbody>
        {specs.map((spec, index) => (
          <tr key={`${spec.label}-${index}`} className={styles.row}>
            <th scope="row" className={styles.label}>
              {spec.label}
            </th>
            <td className={styles.value}>{spec.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
