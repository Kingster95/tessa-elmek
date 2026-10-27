import { CategoryNav } from './CategoryNav'
import { CategorySearchField } from './CategorySearchField'
import styles from './CategorySidebar.module.css'

interface CategorySidebarProps {
  search: string
  onSearchChange: (value: string) => void
  className?: string
}

/** Left column of the category page: in-category search plus the category list. */
export function CategorySidebar({ search, onSearchChange, className }: CategorySidebarProps) {
  return (
    <aside className={`${styles.root} ${className ?? ''}`} aria-label="Căutare și categorii">
      <CategorySearchField id="category-search" value={search} onChange={onSearchChange} />
      <div className={styles.categories}>
        <p className={`eyebrow eyebrow--muted ${styles.eyebrow}`}>Categorii</p>
        <CategoryNav />
      </div>
    </aside>
  )
}
