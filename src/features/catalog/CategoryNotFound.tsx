import { Link } from 'react-router-dom'
import { EmptyState } from '../../components/ui/EmptyState'
import { PageHero } from '../../components/ui/PageHero'

/** Rendered by /produse/:categorySlug when the slug does not exist. */
export function CategoryNotFound() {
  return (
    <>
      <PageHero
        title="Categorie negăsită"
        breadcrumb={[
          { label: 'Acasă', to: '/' },
          { label: 'Produse', to: '/produse' },
          { label: 'Categorie negăsită' },
        ]}
      />
      <div className="container section">
        <EmptyState
          title="Categoria nu a fost găsită"
          description="Linkul poate fi greșit sau categoria a fost redenumită."
          action={
            <Link to="/produse" className="btn btn--primary">
              Vezi toate categoriile
            </Link>
          }
        />
      </div>
    </>
  )
}
