import { useId } from 'react'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { usePartners } from '../../data/hooks'
import type { Partner } from '../../data/types'
import styles from './PartnersStrip.module.css'

/** White band under the hero listing the distributed brands as wordmarks. */
export function PartnersStrip() {
  const { data, loading, error, retry } = usePartners()
  const headingId = useId()

  if (!loading && !error && (data === null || data.length === 0)) {
    return null
  }

  return (
    <section id="parteneri" className={styles.root} aria-labelledby={headingId}>
      <div className={`container ${styles.inner}`}>
        <h2 id={headingId} className={`eyebrow eyebrow--muted ${styles.label}`}>
          Parteneri
        </h2>
        {loading && <LoadingState size="sm" label="Se încarcă partenerii…" />}
        {error && (
          <div className={styles.status}>
            <ErrorState error={error} onRetry={retry} title="Nu am putut încărca partenerii" />
          </div>
        )}
        {data && data.length > 0 && (
          <ul className={styles.list}>
            {sortFeaturedFirst(data).map((partner) => (
              <li key={partner.id}>
                <Wordmark partner={partner} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function Wordmark({ partner }: { partner: Partner }) {
  const className = `${styles.wordmark} ${partner.featured ? styles.featured : ''}`
  if (partner.websiteUrl) {
    return (
      <a
        href={partner.websiteUrl}
        target="_blank"
        rel="noreferrer"
        className={className}
        title={partner.description}
      >
        {partner.name}
        <span className="visually-hidden"> (se deschide într-o filă nouă)</span>
      </a>
    )
  }
  return (
    <span className={className} title={partner.description}>
      {partner.name}
    </span>
  )
}

function sortFeaturedFirst(partners: Partner[]): Partner[] {
  return [...partners].sort((a, b) => Number(b.featured === true) - Number(a.featured === true))
}
