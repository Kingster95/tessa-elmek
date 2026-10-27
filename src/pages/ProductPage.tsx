import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { PageHero } from '../components/ui/PageHero'
import { useCategories, useCompanyInfo, useProduct } from '../data/hooks'
import { ProductOverview } from '../features/product/ProductOverview'
import { ProductTabs } from '../features/product/ProductTabs'
import { RelatedProducts } from '../features/product/RelatedProducts'
import { usePageTitle } from '../lib/usePageTitle'

const NOT_FOUND_BREADCRUMB = [
  { label: 'Acasă', to: '/' },
  { label: 'Produse', to: '/produse' },
  { label: 'Produs negăsit' },
]

export function ProductPage() {
  const { productSlug } = useParams()
  const { data: product, loading, error, retry } = useProduct(productSlug)
  const categories = useCategories()
  const company = useCompanyInfo()

  const notFound = !loading && !error && product === null
  usePageTitle(product ? `${product.name} (${product.code})` : notFound ? 'Produs negăsit' : 'Produs')

  if (loading) {
    return (
      <div className="container section">
        <LoadingState label="Se încarcă produsul…" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container section">
        <ErrorState error={error} onRetry={retry} title="Nu am putut încărca produsul" />
      </div>
    )
  }

  if (!product) {
    return (
      <>
        <PageHero title="Produs negăsit" breadcrumb={NOT_FOUND_BREADCRUMB} />
        <div className="container section">
          <EmptyState
            title="Produsul nu a fost găsit"
            description="Codul sau linkul poate fi greșit. Căutați produsul în catalog sau contactați-ne."
            action={
              <Link to="/produse" className="btn btn--primary">
                Vezi catalogul
              </Link>
            }
          />
        </div>
      </>
    )
  }

  const category = categories.data?.find((entry) => entry.id === product.categoryId) ?? null

  return (
    <>
      <ProductOverview product={product} category={category} company={company.data} />
      <ProductTabs key={product.id} product={product} />
      <RelatedProducts productId={product.id} />
    </>
  )
}
