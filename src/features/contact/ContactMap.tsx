import type { CompanyInfo } from '../../data/types'
import styles from './ContactMap.module.css'

interface ContactMapProps {
  /** Null while loading; the address line is then omitted. */
  company: CompanyInfo | null
}

/** Navy map placeholder, full width under the contact grid (no embedded map yet). */
export function ContactMap({ company }: ContactMapProps) {
  return (
    <div className={styles.root}>
      <svg className={styles.icon} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
      <span className={styles.label}>Hartă locație</span>
      {company && (
        <span className={styles.address}>
          {company.address.street}, {company.address.city}
        </span>
      )}
    </div>
  )
}
