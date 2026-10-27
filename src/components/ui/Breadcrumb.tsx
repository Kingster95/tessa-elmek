import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import styles from './Breadcrumb.module.css'

export interface BreadcrumbItem {
  label: string
  /** Omit on the current page (last item). */
  to?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  /** 'dark' when rendered on the navy hero band. */
  tone?: 'light' | 'dark'
}

export function Breadcrumb({ items, tone = 'light' }: BreadcrumbProps) {
  return (
    <nav aria-label="Navigare ierarhică" className={`${styles.root} ${tone === 'dark' ? styles.dark : ''}`}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <Fragment key={`${item.label}-${index}`}>
              <li className={styles.item}>
                {item.to && !isLast ? (
                  <Link to={item.to} className={styles.link}>
                    {item.label}
                  </Link>
                ) : (
                  <span className={styles.current} aria-current={isLast ? 'page' : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast && (
                <li className={styles.separator} aria-hidden="true">
                  /
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
