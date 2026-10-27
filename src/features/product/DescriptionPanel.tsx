import { toParagraphs } from '../../lib/format'
import styles from './DescriptionPanel.module.css'

interface DescriptionPanelProps {
  /** Full description; paragraphs separated by blank lines. */
  text: string
}

export function DescriptionPanel({ text }: DescriptionPanelProps) {
  const paragraphs = toParagraphs(text)

  if (paragraphs.length === 0) {
    return <p className={styles.empty}>Nu există o descriere detaliată pentru acest produs.</p>
  }

  return (
    <div className={styles.root}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  )
}
