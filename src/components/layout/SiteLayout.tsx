import { useEffect, useRef } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { useCompanyInfo } from '../../data/hooks'
import { useOfferList } from '../../features/offer-list/useOfferList'
import { Toast } from '../ui/Toast'
import { ContactBar } from './ContactBar'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'
import styles from './SiteLayout.module.css'

const FALLBACK_BRAND = 'Tessa Elmek'
const MAIN_ID = 'continut'
const OFFER_LIST_PATH = '/lista-oferta'

/** Shared chrome: skip link, contact bar + header, page outlet, footer, toast. */
export function SiteLayout() {
  const company = useCompanyInfo()
  const { notice, dismissNotice } = useOfferList()
  const { pathname } = useLocation()
  const brandName = company.data?.name ?? FALLBACK_BRAND

  useFocusMainOnNavigation()
  useScrollToHash()

  return (
    <>
      <a href={`#${MAIN_ID}`} className="skip-link">
        Sari la conținut
      </a>
      <header className={styles.header}>
        <ContactBar company={company.data} />
        <SiteHeader brandName={brandName} />
      </header>
      <main id={MAIN_ID} className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter company={company.data} brandName={brandName} />
      <Toast
        message={notice?.message ?? null}
        onDismiss={dismissNotice}
        action={pathname === OFFER_LIST_PATH ? undefined : { label: 'Vezi lista', to: OFFER_LIST_PATH }}
      />
      <ScrollRestoration />
    </>
  )
}

/**
 * After a client-side navigation to another page, move keyboard focus to the
 * main landmark so screen readers announce the new page and Tab starts from
 * its content instead of from wherever the clicked link was.
 */
function useFocusMainOnNavigation() {
  const { pathname } = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    document.getElementById(MAIN_ID)?.focus({ preventScroll: true })
  }, [pathname])
}

/**
 * Scrolls to #anchors (e.g. /#noutati) after client-side navigation. The
 * sections above the target may still be loading, so for a short while the
 * scroll position is re-aligned whenever the page height changes, unless the
 * visitor starts scrolling themselves.
 */
function useScrollToHash() {
  const { hash, key } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    const align = () => {
      document.getElementById(id)?.scrollIntoView({ block: 'start' })
    }

    align()

    const observer = new ResizeObserver(align)
    observer.observe(document.body)
    const stop = () => {
      observer.disconnect()
    }
    const timer = window.setTimeout(stop, 2000)
    window.addEventListener('wheel', stop, { passive: true, once: true })
    window.addEventListener('touchmove', stop, { passive: true, once: true })

    return () => {
      stop()
      window.clearTimeout(timer)
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchmove', stop)
    }
  }, [hash, key])
}
