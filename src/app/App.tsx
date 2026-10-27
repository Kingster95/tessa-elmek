import { RouterProvider } from 'react-router-dom'
import { OfferListProvider } from '../features/offer-list/OfferListProvider'
import { ThemeProvider } from '../features/theme/ThemeProvider'
import { router } from './router'

export function App() {
  return (
    <ThemeProvider>
      <OfferListProvider>
        <RouterProvider router={router} />
      </OfferListProvider>
    </ThemeProvider>
  )
}
