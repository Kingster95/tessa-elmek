import { useId } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { useNews } from '../../data/hooks'
import type { NewsItem } from '../../data/types'
import { formatDate } from '../../lib/format'
import styles from './NewsList.module.css'

/** "Noutăți": compact dated rows, newest first. */
export function NewsList() {
  const { data, loading, error, retry } = useNews()
  const headingId = useId()

  let content
  if (loading) {
    content = <LoadingState label="Se încarcă noutățile…" />
  } else if (error) {
    content = <ErrorState error={error} onRetry={retry} title="Nu am putut încărca noutățile" />
  } else if (!data || data.length === 0) {
    content = <EmptyState title="Nu există noutăți momentan" />
  } else {
    content = (
      <ul className={styles.list}>
        {sortNewestFirst(data).map((item) => (
          <li key={item.id} className={styles.item}>
            <time dateTime={item.date} className={styles.date}>
              {formatDate(item.date)}
            </time>
            <div className={styles.body}>
              <h3 className={styles.title}>
                <NewsTitle item={item} />
              </h3>
              {item.summary && <p className={styles.summary}>{item.summary}</p>}
            </div>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <section id="noutati" className={styles.root} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.heading}>
        Noutăți
      </h2>
      {content}
    </section>
  )
}

function NewsTitle({ item }: { item: NewsItem }) {
  if (!item.url) return <>{item.title}</>
  if (/^https?:\/\//i.test(item.url)) {
    return (
      <a href={item.url} className={styles.link} target="_blank" rel="noreferrer">
        {item.title}
        <span className="visually-hidden"> (se deschide într-o filă nouă)</span>
      </a>
    )
  }
  return (
    <Link to={item.url} className={styles.link}>
      {item.title}
    </Link>
  )
}

function sortNewestFirst(items: NewsItem[]): NewsItem[] {
  return [...items].sort((a, b) => b.date.localeCompare(a.date))
}
