import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHero } from '../components/ui/PageHero'
import type { QuoteRequest, QuoteRequestResult } from '../data/types'
import { OfferListItems } from '../features/offer-list/OfferListItems'
import { OfferListSummary } from '../features/offer-list/OfferListSummary'
import { QuoteRequestForm } from '../features/offer-list/QuoteRequestForm'
import { QuoteRequestSuccess } from '../features/offer-list/QuoteRequestSuccess'
import { useOfferList } from '../features/offer-list/useOfferList'
import { usePageTitle } from '../lib/usePageTitle'
import styles from './OfferListPage.module.css'

interface SubmittedQuote {
  result: QuoteRequestResult
  email: string
}

const BREADCRUMB = [{ label: 'Acasă', to: '/' }, { label: 'Lista de ofertă' }]

export function OfferListPage() {
  usePageTitle('Lista de ofertă')
  const offerList = useOfferList()
  const [submitted, setSubmitted] = useState<SubmittedQuote | null>(null)
  const emptyStateLinkRef = useRef<HTMLAnchorElement>(null)

  // Removing the last line or clearing the list unmounts the whole list
  // section, including whichever button was focused. Send focus to what took
  // its place: the empty state's call to action, or the main landmark when
  // that is not rendered either.
  const focusAfterListEmptied = () => {
    const target = emptyStateLinkRef.current ?? document.getElementById('continut')
    target?.focus()
  }

  const handleClear = () => {
    // Commit the cleared list first so the empty state exists when focus moves.
    flushSync(() => {
      offerList.clear()
    })
    focusAfterListEmptied()
  }

  const handleSuccess = (result: QuoteRequestResult, request: QuoteRequest) => {
    setSubmitted({ result, email: request.email })
    offerList.clear()
  }

  let content
  if (submitted) {
    content = <QuoteRequestSuccess result={submitted.result} email={submitted.email} />
  } else if (offerList.items.length === 0) {
    content = (
      <EmptyState
        title="Lista de ofertă este goală"
        description="Adăugați produse din catalog, apoi reveniți aici pentru a trimite cererea de ofertă."
        action={
          <Link ref={emptyStateLinkRef} to="/produse" className="btn btn--primary">
            Vezi catalogul
          </Link>
        }
      />
    )
  } else {
    content = (
      <div className={styles.layout}>
        <section className={styles.listColumn} aria-labelledby="produse-selectate-titlu">
          <h2 id="produse-selectate-titlu" className={styles.heading}>
            Produse selectate
          </h2>
          <OfferListItems
            items={offerList.items}
            onQuantityChange={offerList.setQuantity}
            onRemove={offerList.remove}
            onListEmptied={focusAfterListEmptied}
          />
          <OfferListSummary
            itemCount={offerList.itemCount}
            totalQuantity={offerList.totalQuantity}
            onClear={handleClear}
          />
        </section>
        <div className={styles.formColumn}>
          <QuoteRequestForm items={offerList.items} onSuccess={handleSuccess} />
        </div>
      </div>
    )
  }

  return (
    <>
      <PageHero
        breadcrumb={BREADCRUMB}
        title="Lista de ofertă"
        description="Verificați produsele și cantitățile, apoi completați datele de contact. Un consultant revine cu prețuri, disponibilitate și termen de livrare."
      />
      <div className="container section">{content}</div>
    </>
  )
}
