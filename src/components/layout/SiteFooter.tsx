import { Link } from 'react-router-dom'
import type { CompanyInfo } from '../../data/types'
import styles from './SiteFooter.module.css'

interface SiteFooterProps {
  company: CompanyInfo | null
  brandName: string
}

export function SiteFooter({ company, brandName }: SiteFooterProps) {
  const year = new Date().getFullYear()
  const mapsHref = company
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${company.address.street}, ${company.address.postalCode} ${company.address.city}`,
      )}`
    : undefined

  return (
    <footer id="contact-footer" className={`${styles.root} on-dark`}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.column}>
          <span className={styles.brand}>{brandName.toUpperCase()}</span>
          {company && (
            <p className={styles.legal}>
              {company.legalName}
              <br />
              {company.fiscalCode} · {company.registrationNumber}
            </p>
          )}
          <nav aria-label="Subsol" className={styles.links}>
            <Link to="/produse" className={styles.link}>
              Produse
            </Link>
            <Link to="/lista-oferta" className={styles.link}>
              Lista de ofertă
            </Link>
            <Link to="/contact" className={styles.link}>
              Contact
            </Link>
          </nav>
        </div>

        <div className={styles.column}>
          <span className={styles.heading}>Contact</span>
          {company ? (
            <address className={styles.address}>
              <span>
                {company.address.street}
                <br />
                {company.address.postalCode} {company.address.city}
              </span>
              <span className={styles.phoneLine}>
                Tel.{' '}
                <a href={`tel:${company.phoneHref}`} className={styles.link}>
                  {company.phone}
                </a>
                {company.fax && <> · Fax {company.fax}</>}
              </span>
              <a href={`tel:${company.phoneHref}`} className={`btn btn--outline-light ${styles.phoneButton}`}>
                Sună: {company.phone}
              </a>
              <a href={`mailto:${company.email}`} className={styles.email}>
                {company.email}
              </a>
            </address>
          ) : (
            <p className={styles.muted}>Datele de contact se încarcă…</p>
          )}
        </div>

        <div className={styles.column}>
          <span className={styles.heading}>Program</span>
          {company && <p className={styles.schedule}>{company.schedule}</p>}
          <div className={styles.mapCard}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" strokeLinejoin="round" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span className={styles.mapLabel}>Hartă locație</span>
            {mapsHref && (
              <a href={mapsHref} className={styles.mapLink} target="_blank" rel="noreferrer">
                Deschide în Google Maps
                <span className="visually-hidden"> (se deschide într-o filă nouă)</span>
              </a>
            )}
          </div>
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        © {year} {company?.legalName ?? `${brandName} S.R.L.`} · Toate drepturile rezervate.
      </div>
    </footer>
  )
}
