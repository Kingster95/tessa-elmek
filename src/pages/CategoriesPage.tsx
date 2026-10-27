import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageHero } from '../components/ui/PageHero'
import { SectionHeader } from '../components/ui/SectionHeader'
import { CatalogSearchForm } from '../features/catalog/CatalogSearchForm'
import { CatalogSearchResults } from '../features/catalog/CatalogSearchResults'
import { CategoryGrid } from '../features/catalog/CategoryGrid'
import { usePageTitle } from '../lib/usePageTitle'

/**
 * /produse – the category overview, or global search results when the URL
 * carries ?cauta=<text> (the header search lands here too).
 */
export function CategoriesPage() {
  usePageTitle('Produse')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const query = (searchParams.get('cauta') ?? '').trim()
  const searchMode = query.length > 0

  const goToSearch = (nextQuery: string) => {
    navigate(nextQuery ? `/produse?cauta=${encodeURIComponent(nextQuery)}` : '/produse')
  }

  return (
    <>
      <PageHero
        breadcrumb={[{ label: 'Acasă', to: '/' }, { label: 'Produse' }]}
        title="Produse"
        description="Alegeți o categorie sau căutați direct după codul ori denumirea produsului."
      >
        <CatalogSearchForm key={query} initialQuery={query} onSubmit={goToSearch} />
      </PageHero>

      <div className="container section">
        {searchMode ? (
          <CatalogSearchResults query={query} onClearSearch={() => goToSearch('')} />
        ) : (
          <section aria-labelledby="categories-title">
            <SectionHeader id="categories-title" eyebrow="Categorii" title="Gama de produse" size="xl" />
            <CategoryGrid />
          </section>
        )}
      </div>
    </>
  )
}
