import { useContext } from 'react'
import { OfferListContext, type OfferListContextValue } from './OfferListContext'

export function useOfferList(): OfferListContextValue {
  const value = useContext(OfferListContext)
  if (!value) {
    throw new Error('useOfferList trebuie folosit în interiorul <OfferListProvider>.')
  }
  return value
}
