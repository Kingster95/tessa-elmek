import type { BreadcrumbItem } from '../components/ui/Breadcrumb'
import { PageHero } from '../components/ui/PageHero'
import { useCompanyInfo } from '../data/hooks'
import { ContactCta } from '../features/contact/ContactCta'
import { ContactDetails } from '../features/contact/ContactDetails'
import { ContactMap } from '../features/contact/ContactMap'
import { usePageTitle } from '../lib/usePageTitle'
import styles from './ContactPage.module.css'

const BREADCRUMB: BreadcrumbItem[] = [{ label: 'Acasă', to: '/' }, { label: 'Contact' }]

export function ContactPage() {
  usePageTitle('Contact')
  // Fetched once here and shared: the details card, the support card's phone
  // line and the map placeholder all read from the same result.
  const company = useCompanyInfo()

  return (
    <>
      <PageHero
        breadcrumb={BREADCRUMB}
        title="Contact"
        description="Suntem la dispoziția dumneavoastră pentru oferte, consultanță tehnică și suport după vânzare."
      />
      <div className={`container section ${styles.body}`}>
        <div className={styles.grid}>
          <ContactDetails company={company} />
          <ContactCta company={company.data} />
        </div>
        <ContactMap company={company.data} />
      </div>
    </>
  )
}
