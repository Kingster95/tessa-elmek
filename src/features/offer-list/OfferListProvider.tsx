import { useCallback, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import type { Product } from '../../data/types'
import { OfferListContext, type OfferListContextValue, type OfferListNotice } from './OfferListContext'
import { offerListReducer } from './offerListReducer'
import { OFFER_LIST_STORAGE_KEY, loadOfferListState, saveOfferListState } from './offerListStorage'

const NOTICE_DURATION_MS = 3500

interface OfferListProviderProps {
  children: ReactNode
}

export function OfferListProvider({ children }: OfferListProviderProps) {
  const [state, dispatch] = useReducer(offerListReducer, undefined, loadOfferListState)
  const [notice, setNotice] = useState<OfferListNotice | null>(null)

  useEffect(() => {
    saveOfferListState(state)
  }, [state])

  // Keep several open tabs in sync: when another tab changes the list,
  // reload it from storage instead of overwriting it on the next change.
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== OFFER_LIST_STORAGE_KEY) return
      dispatch({ type: 'replace', items: loadOfferListState().items })
    }
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => {
      setNotice((current) => (current?.id === notice.id ? null : current))
    }, NOTICE_DURATION_MS)
    return () => {
      window.clearTimeout(timer)
    }
  }, [notice])

  const announce = useCallback((message: string) => {
    setNotice({ id: Date.now(), message })
  }, [])

  const add = useCallback(
    (product: Product, quantity = 1) => {
      dispatch({ type: 'add', product, quantity })
      announce(`Produsul „${product.name}” a fost adăugat în lista de ofertă.`)
    },
    [announce],
  )

  const setQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'setQuantity', productId, quantity })
  }, [])

  const remove = useCallback(
    (productId: string) => {
      dispatch({ type: 'remove', productId })
      announce('Produsul a fost eliminat din lista de ofertă.')
    },
    [announce],
  )

  const clear = useCallback(() => {
    dispatch({ type: 'clear' })
  }, [])

  const dismissNotice = useCallback(() => {
    setNotice(null)
  }, [])

  const value = useMemo<OfferListContextValue>(() => {
    const ids = new Set(state.items.map((item) => item.productId))
    return {
      items: state.items,
      itemCount: state.items.length,
      totalQuantity: state.items.reduce((sum, item) => sum + item.quantity, 0),
      notice,
      add,
      setQuantity,
      remove,
      clear,
      has: (productId: string) => ids.has(productId),
      dismissNotice,
    }
  }, [state.items, notice, add, setQuantity, remove, clear, dismissNotice])

  return <OfferListContext.Provider value={value}>{children}</OfferListContext.Provider>
}
