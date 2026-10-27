import type { CompanyInfo } from '../../types'

/**
 * SAMPLE DATA – an invented address, phone, email, fiscal code and
 * registration number. Replace with the real company details before launch.
 */
export const company: CompanyInfo = {
  name: 'Tessa Elmek',
  legalName: 'Tessa Elmek S.R.L.',
  address: {
    street: 'Str. Dimitrie Pompeiu nr. 9-9A, Clădirea 20, et. 2, Sector 2',
    city: 'București',
    postalCode: '020335',
    country: 'România',
  },
  phone: '021-410.22.60',
  phoneHref: '+40214102260',
  fax: '021-410.22.61',
  email: 'office@tessaelmek.ro',
  fiscalCode: 'RO18234567',
  registrationNumber: 'J40/5123/2006',
  schedule: 'Luni – Vineri, 08:30 – 17:00',
  foundedYear: 2006,
}
