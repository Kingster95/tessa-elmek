import { Link } from 'react-router-dom'
import { usePageTitle } from '../lib/usePageTitle'
import styles from './NotFoundPage.module.css'

/** 404 screen; also reused by RouteErrorPage for unmatched routes. */
export function NotFoundPage() {
  usePageTitle('Pagina nu a fost găsită')

  return (
    <div className={`container ${styles.root}`}>
      <p className="eyebrow eyebrow--muted">Eroare 404</p>
      <h1 className={styles.title}>Pagina nu a fost găsită</h1>
      <p className={styles.text}>
        Adresa poate fi greșită sau pagina a fost mutată. Folosiți meniul sau căutarea pentru a găsi
        produsul dorit.
      </p>
      <div className={styles.actions}>
        <Link to="/" className="btn btn--primary">
          Înapoi la pagina principală
        </Link>
        <Link to="/produse" className="btn btn--outline">
          Vezi produsele
        </Link>
      </div>
    </div>
  )
}
