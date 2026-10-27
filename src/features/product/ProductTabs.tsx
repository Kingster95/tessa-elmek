import { useId, useState, type KeyboardEvent } from 'react'
import type { Product } from '../../data/types'
import { DescriptionPanel } from './DescriptionPanel'
import { DocumentsList } from './DocumentsList'
import { SpecsTable } from './SpecsTable'
import styles from './ProductTabs.module.css'

const TABS = [
  { id: 'descriere', label: 'Descriere' },
  { id: 'specificatii', label: 'Specificații tehnice' },
  { id: 'documente', label: 'Documente' },
] as const

type TabId = (typeof TABS)[number]['id']

interface ProductTabsProps {
  product: Product
}

/**
 * Description / specs / documents tabs (WAI-ARIA tabs pattern with roving
 * tabindex). Mount with `key={product.id}` so the selection resets per product.
 */
export function ProductTabs({ product }: ProductTabsProps) {
  const baseId = useId()
  const [selected, setSelected] = useState<TabId>('descriere')

  const tabElementId = (id: TabId) => `${baseId}-tab-${id}`
  const panelElementId = (id: TabId) => `${baseId}-panel-${id}`

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number
    switch (event.key) {
      case 'ArrowRight':
        next = (index + 1) % TABS.length
        break
      case 'ArrowLeft':
        next = (index - 1 + TABS.length) % TABS.length
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = TABS.length - 1
        break
      default:
        return
    }
    event.preventDefault()
    const target = TABS[next]
    setSelected(target.id)
    document.getElementById(tabElementId(target.id))?.focus()
  }

  return (
    <section className={styles.band}>
      <div className="container">
        <h2 className="visually-hidden">Informații produs</h2>
        <div role="tablist" aria-label="Informații produs" className={styles.tablist}>
          {TABS.map((tab, index) => {
            const isSelected = tab.id === selected
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={tabElementId(tab.id)}
                className={styles.tab}
                aria-selected={isSelected}
                aria-controls={panelElementId(tab.id)}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelected(tab.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {TABS.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={panelElementId(tab.id)}
            aria-labelledby={tabElementId(tab.id)}
            tabIndex={0}
            hidden={tab.id !== selected}
            className={styles.panel}
          >
            {tab.id === 'descriere' && <DescriptionPanel text={product.longDescription} />}
            {tab.id === 'specificatii' && <SpecsTable specs={product.specs} productName={product.name} />}
            {tab.id === 'documente' && <DocumentsList documents={product.documents} />}
          </div>
        ))}
      </div>
    </section>
  )
}
