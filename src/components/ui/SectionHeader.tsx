import type { ReactNode } from 'react'
import styles from './SectionHeader.module.css'

interface SectionHeaderProps {
  title: string
  eyebrow?: string
  /** Link or button shown at the end of the row (e.g. "Toate produsele →"). */
  action?: ReactNode
  /** Heading level; defaults to h2. */
  as?: 'h1' | 'h2' | 'h3'
  size?: 'md' | 'lg' | 'xl'
  id?: string
}

export function SectionHeader({ title, eyebrow, action, as = 'h2', size = 'lg', id }: SectionHeaderProps) {
  const Heading = as
  return (
    <div className={styles.root}>
      <div className={styles.text}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <Heading id={id} className={`${styles.title} ${styles[size]}`}>
          {title}
        </Heading>
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
