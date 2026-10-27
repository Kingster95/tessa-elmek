import { NavLink } from 'react-router-dom'
import { useCategories } from '../../data/hooks'
import { LoadingState } from '../../components/ui/LoadingState'
import { useMediaQuery } from './useMediaQuery'
import styles from './CategoryNav.module.css'

/**
 * List of every category, with the current one highlighted. Below 1024px the
 * list sits inside a collapsed <details> so the product grid stays near the
 * top; on desktop the disclosure is forced open and its summary hidden.
 */
export function CategoryNav() {
  const categories = useCategories()
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  if (categories.loading) {
    return <LoadingState size="sm" label="Se încarcă categoriile…" />
  }

  // A failed category list is not worth an error box in a sidebar: hide it.
  if (categories.error || categories.data === null || categories.data.length === 0) {
    return null
  }

  return (
    <nav aria-label="Categorii">
      <details className={styles.details} open={isDesktop}>
        <summary className={styles.summary}>
          <span>Toate categoriile</span>
          <svg
            className={styles.chevron}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </summary>
        <ul className={styles.list} role="list">
          {categories.data.map((category) => (
            <li key={category.id}>
              <NavLink
                to={`/produse/${category.slug}`}
                end
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
              >
                {category.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  )
}
