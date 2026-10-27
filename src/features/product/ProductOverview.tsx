import { Breadcrumb, type BreadcrumbItem } from '../../components/ui/Breadcrumb'
import type { Category, CompanyInfo, Product } from '../../data/types'
import { ProductGallery } from './ProductGallery'
import { ProductSummary } from './ProductSummary'
import styles from './ProductOverview.module.css'

interface ProductOverviewProps {
  product: Product
  /** Resolved category for the breadcrumb; null while unknown. */
  category: Category | null
  company: CompanyInfo | null
}

/** Breadcrumb plus the two-column gallery / summary block at the top of the page. */
export function ProductOverview({ product, category, company }: ProductOverviewProps) {
  const breadcrumb: BreadcrumbItem[] = [
    { label: 'Acasă', to: '/' },
    { label: 'Produse', to: '/produse' },
  ]
  if (category) {
    breadcrumb.push({ label: category.name, to: `/produse/${category.slug}` })
  }
  breadcrumb.push({ label: product.name })

  return (
    <>
      <div className={`container ${styles.breadcrumb}`}>
        <Breadcrumb items={breadcrumb} />
      </div>
      <section className={`container ${styles.grid}`}>
        <ProductGallery key={product.id} images={product.imageUrls} name={product.name} />
        <ProductSummary product={product} company={company} />
      </section>
    </>
  )
}
