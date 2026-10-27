import { useId } from 'react'
import { Link } from 'react-router-dom'
import type { CompanyInfo } from '../../data/types'
import styles from './ContactCta.module.css'

interface ContactCtaProps {
  /** Null while the company data is still loading; the phone line is then omitted. */
  company: CompanyInfo | null
}

const SUPPORT_TOPICS = [
  'Dimensionarea bateriilor de condensatoare',
  'Alegerea transformatoarelor de curent',
  'Configurarea stațiilor de încărcare',
]

/** Navy "cere ofertă" card plus a short technical-support card. */
export function ContactCta({ company }: ContactCtaProps) {
  const ctaId = useId()
  const supportId = useId()

  return (
    <div className={styles.root}>
      <section className={`${styles.cta} on-dark`} aria-labelledby={ctaId}>
        <p className="eyebrow eyebrow--accent">Cere ofertă</p>
        <h2 id={ctaId} className={styles.ctaTitle}>
          Aveți o listă de produse?
        </h2>
        <p className={styles.ctaText}>
          Adăugați produsele în lista de ofertă și trimiteți cererea online. Răspundem de regulă în
          aceeași zi lucrătoare.
        </p>
        <div className={styles.actions}>
          <Link to="/lista-oferta" className="btn btn--primary">
            Deschide lista de ofertă
          </Link>
          <Link to="/produse" className="btn btn--outline-light">
            Vezi catalogul
          </Link>
        </div>
      </section>

      <section className={`card ${styles.support}`} aria-labelledby={supportId}>
        <h2 id={supportId} className={styles.supportTitle}>
          Suport tehnic
        </h2>
        <p className={styles.supportText}>Inginerii noștri vă pot ajuta cu:</p>
        <ul className={styles.supportList}>
          {SUPPORT_TOPICS.map((topic) => (
            <li key={topic} className={styles.supportItem}>
              {topic}
            </li>
          ))}
        </ul>
        {company && (
          <p className={styles.supportPhone}>
            Sunați-ne la{' '}
            <a href={`tel:${company.phoneHref}`} className={styles.phoneLink}>
              {company.phone}
            </a>
          </p>
        )}
      </section>
    </div>
  )
}
