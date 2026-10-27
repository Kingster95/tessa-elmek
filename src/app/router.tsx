import { createBrowserRouter } from 'react-router-dom'
import { SiteLayout } from '../components/layout/SiteLayout'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { RouteErrorPage } from '../pages/RouteErrorPage'

/*
 * The home page ships in the main bundle; every other page is a separate
 * chunk loaded on first navigation (React Router's route-level `lazy`).
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <SiteLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'produse',
        lazy: () => import('../pages/CategoriesPage').then((m) => ({ Component: m.CategoriesPage })),
      },
      {
        path: 'produse/:categorySlug',
        lazy: () => import('../pages/CategoryPage').then((m) => ({ Component: m.CategoryPage })),
      },
      {
        path: 'produs/:productSlug',
        lazy: () => import('../pages/ProductPage').then((m) => ({ Component: m.ProductPage })),
      },
      {
        path: 'lista-oferta',
        lazy: () => import('../pages/OfferListPage').then((m) => ({ Component: m.OfferListPage })),
      },
      {
        path: 'contact',
        lazy: () => import('../pages/ContactPage').then((m) => ({ Component: m.ContactPage })),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
