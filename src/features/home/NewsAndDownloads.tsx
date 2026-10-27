import { DownloadsList } from './DownloadsList'
import { NewsList } from './NewsList'
import styles from './NewsAndDownloads.module.css'

/** Two-column band at the bottom of the home page: news on the left, downloads on the right. */
export function NewsAndDownloads() {
  return (
    <div className={`container ${styles.root}`}>
      <NewsList />
      <DownloadsList />
    </div>
  )
}
