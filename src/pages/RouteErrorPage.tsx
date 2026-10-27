import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { usePageTitle } from '../lib/usePageTitle'
import { NotFoundPage } from './NotFoundPage'
import styles from './RouteErrorPage.module.css'

/**
 * errorElement of the root route. It renders outside SiteLayout, so it brings
 * its own minimal chrome (brand bar + main) around the message.
 */
export function RouteErrorPage() {
  const error = useRouteError()
  const notFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link to="/" className={styles.brand}>
            <svg className={styles.logo} viewBox="0 0 30 34" aria-hidden="true">
              <path d="M2 2h12l14 15-14 15H2l14-15z" fill="var(--color-brand)" />
            </svg>
            <span className={styles.brandName}>TESSA ELMEK</span>
          </Link>
        </div>
      </header>
      <main className={styles.main}>{notFound ? <NotFoundPage /> : <UnexpectedError error={error} />}</main>
    </div>
  )
}

interface UnexpectedErrorProps {
  error: unknown
}

function UnexpectedError({ error }: UnexpectedErrorProps) {
  usePageTitle('Eroare')
  const details = import.meta.env.DEV ? describeError(error) : null

  return (
    <div className={`container ${styles.content}`}>
      <p className="eyebrow eyebrow--muted">Eroare</p>
      <h1 className={styles.title}>A apărut o eroare neașteptată</h1>
      <p className={styles.text}>Ne cerem scuze. Reîncărcați pagina sau reveniți la pagina principală.</p>
      {details && <pre className={`mono ${styles.details}`}>{details}</pre>}
      <div className={styles.actions}>
        <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
          Reîncarcă pagina
        </button>
        <Link to="/" className="btn btn--outline">
          Pagina principală
        </Link>
      </div>
    </div>
  )
}

/** Developer-facing summary of whatever the router caught. */
function describeError(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`.trim()
  }
  if (error instanceof Error) {
    return error.stack ?? error.message
  }
  return String(error)
}
