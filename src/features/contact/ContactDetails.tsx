import { useId, type ReactNode } from 'react'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import type { AsyncState } from '../../data/hooks'
import type { CompanyInfo } from '../../data/types'
import styles from './ContactDetails.module.css'

interface ContactDetailsProps {
  company: AsyncState<CompanyInfo>
}

const ICON_ATTRS = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

const ICONS = {
  address: (
    <svg {...ICON_ATTRS}>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  phone: (
    <svg {...ICON_ATTRS}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  ),
  fax: (
    <svg {...ICON_ATTRS}>
      <path d="M6 9V4h12v5" />
      <rect x="3" y="9" width="18" height="8" rx="1.5" />
      <path d="M6 14h12v6H6z" />
    </svg>
  ),
  email: (
    <svg {...ICON_ATTRS}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  schedule: (
    <svg {...ICON_ATTRS}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  billing: (
    <svg {...ICON_ATTRS}>
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5M10 13h6M10 17h6" />
    </svg>
  ),
}

function buildMapsHref(company: CompanyInfo): string {
  const { street, postalCode, city, country } = company.address
  const query = `${street}, ${postalCode} ${city}, ${country}`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

interface RowProps {
  icon: ReactNode
  label: string
  children: ReactNode
}

function Row({ icon, label, children }: RowProps) {
  return (
    <div className={styles.row}>
      <dt className={styles.term}>
        <span className={styles.icon}>{icon}</span>
        {label}
      </dt>
      <dd className={styles.detail}>{children}</dd>
    </div>
  )
}

/** White card with the company's address, phone, email, schedule and billing data. */
export function ContactDetails({ company }: ContactDetailsProps) {
  const headingId = useId()
  const { data, loading, error, retry } = company

  if (loading) {
    return (
      <div className={`card ${styles.root}`}>
        <LoadingState label="Se încarcă datele de contact…" />
      </div>
    )
  }

  if (error) {
    return <ErrorState error={error} onRetry={retry} title="Nu am putut încărca datele de contact" />
  }

  if (!data) {
    return <EmptyState title="Datele de contact nu sunt disponibile momentan" />
  }

  const { address } = data

  return (
    <section className={`card ${styles.root}`} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.title}>
        Date de contact
      </h2>

      <dl className={styles.list}>
        <Row icon={ICONS.address} label="Adresă">
          <address className={styles.address}>
            {address.street}
            <br />
            {address.postalCode} {address.city}
            <br />
            {address.country}
          </address>
        </Row>

        <Row icon={ICONS.phone} label="Telefon">
          <a href={`tel:${data.phoneHref}`} className={styles.link}>
            {data.phone}
          </a>
        </Row>

        {data.fax && (
          <Row icon={ICONS.fax} label="Fax">
            {data.fax}
          </Row>
        )}

        <Row icon={ICONS.email} label="Email">
          <a href={`mailto:${data.email}`} className={styles.link}>
            {data.email}
          </a>
        </Row>

        <Row icon={ICONS.schedule} label="Program">
          {data.schedule}
        </Row>

        <Row icon={ICONS.billing} label="Date de facturare">
          <span>{data.legalName}</span>
          <span>
            <span className={styles.muted}>CUI</span> <span className="mono">{data.fiscalCode}</span>
          </span>
          <span>
            <span className={styles.muted}>Nr. Reg. Com.</span>{' '}
            <span className="mono">{data.registrationNumber}</span>
          </span>
        </Row>
      </dl>

      <a href={buildMapsHref(data)} className={styles.mapsLink} target="_blank" rel="noreferrer">
        Deschide în Google Maps
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
        <span className="visually-hidden">(se deschide într-o fereastră nouă)</span>
      </a>
    </section>
  )
}
