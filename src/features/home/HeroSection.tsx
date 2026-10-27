import { useId, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DeviceIllustration } from '../../components/ui/DeviceIllustration'
import { useCompanyInfo } from '../../data/hooks'
import styles from './HeroSection.module.css'

/**
 * Navy hero band at the top of the home page. The desktop and the 390px
 * mockups use different copy, so both variants are rendered and CSS shows
 * one of them per breakpoint (display:none hides the other from assistive
 * technology as well).
 */
export function HeroSection() {
  const { data: company } = useCompanyInfo()
  const navigate = useNavigate()
  const searchId = useId()
  const titleId = useId()

  const kicker = company
    ? `Distribuitor echipamente electrice · din ${company.foundedYear}`
    : 'Distribuitor echipamente electrice'

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const field = event.currentTarget.elements.namedItem('cauta')
    const query = field instanceof HTMLInputElement ? field.value.trim() : ''
    navigate(query ? `/produse?cauta=${encodeURIComponent(query)}` : '/produse')
  }

  return (
    <section className={`${styles.root} on-dark`} aria-labelledby={titleId}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <p className={`eyebrow eyebrow--accent ${styles.kicker}`}>{kicker}</p>
          <h1 id={titleId} className={styles.title}>
            <span className={styles.desktopOnly}>
              Măsurare, protecție și eficiență energetică pentru instalații profesionale.
            </span>
            <span className={styles.phoneOnly}>Măsurare, protecție și eficiență energetică.</span>
          </h1>
          <p className={`${styles.lead} ${styles.desktopOnly}`}>
            Echipamente Circutor și de la alți producători, selectate pentru proiectanți, integratori și
            constructori de tablouri electrice. Trimiteți lista de produse și primiți o ofertă
            personalizată.
          </p>
          <p className={`${styles.lead} ${styles.phoneOnly}`}>
            Alegeți produsele și primiți o ofertă personalizată.
          </p>

          <form
            role="search"
            aria-label="Căutare produse"
            className={styles.search}
            onSubmit={handleSearch}
          >
            <label htmlFor={searchId} className="visually-hidden">
              Caută produse
            </label>
            <input
              id={searchId}
              name="cauta"
              type="search"
              className={`input ${styles.searchInput}`}
              placeholder="Caută cod sau produs"
              autoComplete="off"
              enterKeyHint="search"
            />
          </form>

          <div className={styles.actions}>
            <Link to="/produse" className="btn btn--primary btn--lg">
              Vezi catalogul
            </Link>
            <Link to="/#descarcari" className={`btn btn--outline-light btn--lg ${styles.desktopOnly}`}>
              Descarcă cataloage PDF
            </Link>
          </div>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <span className={styles.barTop} />
          <span className={styles.barBottom} />
          <DeviceIllustration className={styles.illustration} />
        </div>
      </div>
    </section>
  )
}
