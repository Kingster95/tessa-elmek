import type { CompanyInfo } from '../../data/types'
import styles from './ContactBar.module.css'

interface ContactBarProps {
  company: CompanyInfo | null
}

/** Thin navy strip above the header with phone, email and address. */
export function ContactBar({ company }: ContactBarProps) {
  return (
    <div className={`${styles.root} on-dark`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.links}>
          {company ? (
            <>
              <a href={`tel:${company.phoneHref}`} className={styles.link}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" strokeLinejoin="round" />
                </svg>
                <span>Tel. {company.phone}</span>
              </a>
              <a href={`mailto:${company.email}`} className={styles.link}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" strokeLinejoin="round" />
                </svg>
                <span>{company.email}</span>
              </a>
            </>
          ) : (
            <span className={styles.placeholder} aria-hidden="true">
              &nbsp;
            </span>
          )}
        </div>
        {company && (
          <div className={styles.address}>
            {company.address.street}, {company.address.city}
          </div>
        )}
      </div>
    </div>
  )
}
