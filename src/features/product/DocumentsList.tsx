import type { ProductDocument, ProductDocumentType } from '../../data/types'
import styles from './DocumentsList.module.css'

const TYPE_LABELS: Record<ProductDocumentType, string> = {
  'fisa-tehnica': 'Fișă tehnică',
  manual: 'Manual',
  certificat: 'Certificat',
  catalog: 'Catalog',
  schema: 'Schemă',
  altul: 'Document',
}

interface DocumentsListProps {
  documents: ProductDocument[]
}

export function DocumentsList({ documents }: DocumentsListProps) {
  if (documents.length === 0) {
    return <p className={styles.empty}>Nu există documente atașate pentru acest produs.</p>
  }

  return (
    <ul className={styles.list}>
      {documents.map((document) => {
        const meta = [document.format, document.sizeLabel, document.language?.toUpperCase()]
          .filter((part): part is string => Boolean(part))
          .join(' · ')
        return (
          <li key={document.id} className={styles.row}>
            <span className={styles.icon} aria-hidden="true">
              <DocumentIcon />
            </span>
            <div className={styles.body}>
              <span className={styles.title}>{document.title}</span>
              <span className={styles.meta}>
                <span>{TYPE_LABELS[document.type]}</span>
                <span className={styles.format}>{meta}</span>
              </span>
            </div>
            <a
              href={document.url}
              target="_blank"
              rel="noreferrer"
              className={`btn btn--outline ${styles.action}`}
            >
              Deschide
              <span className="visually-hidden"> {document.title} (se deschide într-o filă nouă)</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function DocumentIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" focusable="false">
      <path d="M7 3h7l5 5v13H7z" strokeLinejoin="round" />
      <path d="M14 3v5h5M10 13h5M10 17h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
