import type { ReactNode } from 'react'
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb'
import styles from './PageHero.module.css'

interface PageHeroProps {
  title: string
  eyebrow?: string
  description?: string
  breadcrumb?: BreadcrumbItem[]
  /** Extra content under the description (e.g. a search box). */
  children?: ReactNode
}

/** Navy band at the top of inner pages: breadcrumb, h1 and a short intro. */
export function PageHero({ title, eyebrow, description, breadcrumb, children }: PageHeroProps) {
  return (
    <section className={`${styles.root} on-dark`}>
      <div className={`container ${styles.inner}`}>
        {breadcrumb && <Breadcrumb items={breadcrumb} tone="dark" />}
        {eyebrow && <p className="eyebrow eyebrow--accent">{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
        {children}
      </div>
    </section>
  )
}
