import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useCategory } from '../data/hooks'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { PageHero } from '../components/ui/PageHero'
import { CategoryNotFound } from '../features/catalog/CategoryNotFound'
import { CategoryProducts } from '../features/catalog/CategoryProducts'
import { CategorySidebar } from '../features/catalog/CategorySidebar'
import { useDebouncedValue } from '../lib/useDebouncedValue'
import { usePageTitle } from '../lib/usePageTitle'
import styles from './CategoryPage.module.css'

/** /produse/:categorySlug – products of one category, with in-category search. */
export function CategoryPage() {
  const { categorySlug } = useParams()
  // Keyed on the slug so the search box starts fresh in every category.
  return <CategoryPageContent key={categorySlug} slug={categorySlug} />
}

interface CategoryPageContentProps {
  slug: string | undefined
}

function CategoryPageContent({ slug }: CategoryPageContentProps) {
  const category = useCategory(slug)
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(() => searchParams.get('cauta') ?? '')
  const debouncedSearch = useDebouncedValue(search, 250)

  const notFound = !category.loading && category.error === null && category.data === null
  usePageTitle(category.data?.name ?? (notFound ? 'Categorie negăsită' : 'Produse'))

  const handleSearchChange = (value: string) => {
    setSearch(value)
    // preventScrollReset: a search keystroke is a navigation for the router,
    // and <ScrollRestoration /> would otherwise jump to the top on every key.
    setSearchParams(value.trim() ? { cauta: value } : {}, {
      replace: true,
      preventScrollReset: true,
    })
  }

  if (category.loading) {
    return (
      <div className="container section">
        <LoadingState label="Se încarcă categoria…" />
      </div>
    )
  }

  if (category.error) {
    return (
      <div className="container section">
        <ErrorState
          error={category.error}
          onRetry={category.retry}
          title="Nu am putut încărca categoria"
        />
      </div>
    )
  }

  if (category.data === null) {
    return <CategoryNotFound />
  }

  return (
    <>
      <PageHero
        breadcrumb={[
          { label: 'Acasă', to: '/' },
          { label: 'Produse', to: '/produse' },
          { label: category.data.name },
        ]}
        title={category.data.name}
        description={category.data.description}
      />
      <div className={`container ${styles.layout}`}>
        <CategorySidebar
          className={styles.sidebar}
          search={search}
          onSearchChange={handleSearchChange}
        />
        <CategoryProducts
          className={styles.main}
          category={category.data}
          search={debouncedSearch}
          onClearSearch={() => handleSearchChange('')}
        />
      </div>
    </>
  )
}
