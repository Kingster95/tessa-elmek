import { useEffect } from 'react'

const SITE_NAME = 'Tessa Elmek'

/** Sets document.title to "<title> · Tessa Elmek" (or just the site name). */
export function usePageTitle(title: string | undefined): void {
  useEffect(() => {
    const previous = document.title
    document.title = title ? `${title} · ${SITE_NAME}` : SITE_NAME
    return () => {
      document.title = previous
    }
  }, [title])
}
