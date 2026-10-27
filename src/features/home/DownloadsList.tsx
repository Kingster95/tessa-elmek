import { useId } from 'react'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { useDownloads } from '../../data/hooks'
import type { Download } from '../../data/types'
import styles from './DownloadsList.module.css'

/** "Descărcări": catalogues and price lists as downloadable cards. */
export function DownloadsList() {
  const { data, loading, error, retry } = useDownloads()
  const headingId = useId()

  let content
  if (loading) {
    content = <LoadingState label="Se încarcă documentele…" />
  } else if (error) {
    content = <ErrorState error={error} onRetry={retry} title="Nu am putut încărca documentele" />
  } else if (!data || data.length === 0) {
    content = <EmptyState title="Nu există documente disponibile" />
  } else {
    content = (
      <ul className={styles.list}>
        {data.map((download) => (
          <li key={download.id}>
            <DownloadCard download={download} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <section id="descarcari" className={styles.root} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.heading}>
        Descărcări
      </h2>
      {content}
    </section>
  )
}

function DownloadCard({ download }: { download: Download }) {
  const meta = download.sizeLabel ? `${download.format} · ${download.sizeLabel}` : download.format
  return (
    <a
      href={download.url}
      target="_blank"
      rel="noreferrer"
      className={styles.card}
      aria-label={`Deschide ${download.title} (${meta}, se deschide într-o filă nouă)`}
      title={download.description}
    >
      <svg
        className={styles.icon}
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-brand)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" />
      </svg>
      <span className={styles.title}>{download.title}</span>
      <span className={styles.meta}>{meta}</span>
    </a>
  )
}
