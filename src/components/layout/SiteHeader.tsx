import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useOfferList } from '../../features/offer-list/useOfferList'
import { ThemeToggle } from '../../features/theme/ThemeToggle'
import { formatProductCount } from '../../lib/format'
import styles from './SiteHeader.module.css'

const NAV_ITEMS: { label: string; to: string; end?: boolean; activePrefix?: string }[] = [
  { label: 'Produse', to: '/produse', activePrefix: '/produs' },
  { label: 'Parteneri', to: '/#parteneri' },
  { label: 'Noutăți', to: '/#noutati' },
  { label: 'Descărcări', to: '/#descarcari' },
  { label: 'Contact', to: '/contact', end: true },
]

interface SiteHeaderProps {
  brandName: string
}

export function SiteHeader({ brandName }: SiteHeaderProps) {
  const { itemCount } = useOfferList()
  const location = useLocation()
  const navigate = useNavigate()
  const menuId = useId()
  const desktopSearchId = useId()
  const mobileSearchId = useId()
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  // The menu is "open" only for the location it was opened on, so any
  // navigation closes it without an effect.
  const [openedAt, setOpenedAt] = useState<string | null>(null)
  const menuOpen = openedAt === location.key

  const toggleMenu = () => {
    setOpenedAt(menuOpen ? null : location.key)
  }
  const closeMenu = () => {
    setOpenedAt(null)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && menuOpen) {
      event.preventDefault()
      closeMenu()
      menuButtonRef.current?.focus()
    }
  }

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const input = form.elements.namedItem('cauta')
    const query = input instanceof HTMLInputElement ? input.value.trim() : ''
    closeMenu()
    navigate(query ? `/produse?cauta=${encodeURIComponent(query)}` : '/produse')
  }

  const countLabel = formatProductCount(itemCount, 'niciun produs')
  const offerListLabel = `Lista de ofertă, ${countLabel}`

  return (
    <div className={styles.root} onKeyDown={handleKeyDown}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand} onClick={closeMenu}>
          <svg className={styles.logo} viewBox="0 0 30 34" aria-hidden="true">
            <path d="M2 2h12l14 15-14 15H2l14-15z" fill="var(--color-brand)" />
          </svg>
          <span className={styles.brandName}>{brandName.toUpperCase()}</span>
        </Link>

        <nav aria-label="Principal" className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isHashLink = item.to.includes('#')
            const prefixActive =
              item.activePrefix !== undefined && location.pathname.startsWith(item.activePrefix)
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `${styles.navLink} ${(isActive || prefixActive) && !isHashLink ? styles.navLinkActive : ''}`
                }
              >
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className={styles.tools}>
          <form role="search" aria-label="Căutare în catalog" className={styles.search} onSubmit={handleSearch}>
            <label htmlFor={desktopSearchId} className="visually-hidden">
              Caută produse
            </label>
            <input
              id={desktopSearchId}
              name="cauta"
              type="search"
              className={`input ${styles.searchInput}`}
              placeholder="Caută cod sau produs"
              autoComplete="off"
            />
          </form>
          <ThemeToggle />
          <Link to="/lista-oferta" className={`btn btn--outline ${styles.offerButton}`} aria-label={offerListLabel}>
            <span className={styles.offerLabel}>Lista de ofertă</span>
            <svg className={styles.offerIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M9 4h6l1 2h3v14H5V6h3z" strokeLinejoin="round" />
              <path d="M9 11h6M9 15h6" strokeLinecap="round" />
            </svg>
            <span className="count-badge" aria-hidden="true">
              {itemCount}
            </span>
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? 'Închide meniul' : 'Deschide meniul'}
            onClick={toggleMenu}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div id={menuId} className={styles.mobileMenu} hidden={!menuOpen}>
        <div className={`container ${styles.mobileInner}`}>
          <form role="search" aria-label="Căutare în catalog" className={styles.mobileSearch} onSubmit={handleSearch}>
            <label htmlFor={mobileSearchId} className="visually-hidden">
              Caută produse
            </label>
            <input
              id={mobileSearchId}
              name="cauta"
              type="search"
              className="input"
              placeholder="Caută cod sau produs"
              autoComplete="off"
            />
            <button type="submit" className="btn btn--primary">
              Caută
            </button>
          </form>
          <nav aria-label="Meniu mobil" className={styles.mobileNav}>
            {NAV_ITEMS.map((item) => (
              <Link key={item.to} to={item.to} className={styles.mobileLink} onClick={closeMenu}>
                {item.label}
              </Link>
            ))}
            <Link to="/lista-oferta" className={styles.mobileLink} onClick={closeMenu}>
              <span>
                Lista de ofertă<span className="visually-hidden">, {countLabel}</span>
              </span>
              <span className="count-badge" aria-hidden="true">
                {itemCount}
              </span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}
