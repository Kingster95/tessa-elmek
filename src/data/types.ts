/**
 * Domain types shared by every data source (mock and REST API) and by the UI.
 * The UI only ever sees these shapes; it never knows where they come from.
 */

export interface Category {
  id: string
  /** URL segment used in /produse/:categorySlug */
  slug: string
  name: string
  /** One sentence, shown on cards. */
  shortDescription: string
  /** One or two sentences, shown in the category page hero. */
  description: string
  /** Display order, ascending. */
  order: number
  /** Optional image; when missing the UI draws an illustration. */
  imageUrl?: string
}

export interface ProductSpec {
  label: string
  value: string
}

export type ProductDocumentType =
  | 'fisa-tehnica'
  | 'manual'
  | 'certificat'
  | 'catalog'
  | 'schema'
  | 'altul'

export type DocumentFormat = 'PDF' | 'ZIP' | 'XLSX' | 'DOCX' | 'DWG'

export interface ProductDocument {
  id: string
  title: string
  type: ProductDocumentType
  format: DocumentFormat
  url: string
  /** Human readable, e.g. "1,2 MB". */
  sizeLabel?: string
  /** ISO 639-1 code, e.g. "ro" or "en". */
  language?: string
}

export interface Product {
  id: string
  /** URL segment used in /produs/:productSlug */
  slug: string
  /** Manufacturer / catalog code, e.g. "M54510". */
  code: string
  name: string
  /** One or two lines: function and application. */
  shortDescription: string
  /**
   * Full description. Paragraphs are separated by a blank line ("\n\n");
   * the UI splits on that.
   */
  longDescription: string
  categoryId: string
  brand: string
  /** Exactly the few specs worth showing next to the title (typically 4). */
  keySpecs: ProductSpec[]
  /** Complete technical specification table (typically 8 or more rows). */
  specs: ProductSpec[]
  documents: ProductDocument[]
  /** Empty when there is no photo; the UI then draws an illustration. */
  imageUrls: string[]
  /** Hand-picked related products; the data source may top this up. */
  relatedProductIds: string[]
}

export interface Partner {
  id: string
  name: string
  /** One line: what the brand makes. */
  description: string
  websiteUrl?: string
  logoUrl?: string
  /** True for the main distributed brand (shown first and highlighted). */
  featured?: boolean
}

export interface NewsItem {
  id: string
  slug: string
  title: string
  /** ISO date, e.g. "2026-03-14". */
  date: string
  summary: string
  /** Optional link to the full article or an external page. */
  url?: string
}

export interface Download {
  id: string
  title: string
  description?: string
  format: DocumentFormat
  url: string
  sizeLabel?: string
}

export interface PostalAddress {
  street: string
  city: string
  postalCode: string
  country: string
}

export interface CompanyInfo {
  /** Brand name shown in the UI, e.g. "Tessa Elmek". */
  name: string
  /** Legal name, e.g. "Tessa Elmek S.R.L.". */
  legalName: string
  address: PostalAddress
  /** Display form, e.g. "021-410.22.60". */
  phone: string
  /** Dialable form for tel: links, e.g. "+40214102260". */
  phoneHref: string
  fax?: string
  email: string
  /** Cod de identificare fiscală, e.g. "RO18234567". */
  fiscalCode: string
  /** Număr de ordine în Registrul Comerțului, e.g. "J40/5123/2006". */
  registrationNumber: string
  /** Opening hours, display form. */
  schedule: string
  foundedYear: number
}

export interface ProductQuery {
  /** Restrict to one category. */
  categorySlug?: string
  /** Free text matched against product name and code. */
  search?: string
}

export interface QuoteRequestItem {
  productId: string
  productCode: string
  productName: string
  quantity: number
}

export interface QuoteRequest {
  companyName: string
  contactPerson: string
  email: string
  phone: string
  message: string
  items: QuoteRequestItem[]
}

export interface QuoteRequestResult {
  /** Reference the customer can quote back, e.g. "TE-2026-04821". */
  referenceNumber: string
  /** ISO timestamp of when the request was accepted. */
  receivedAt: string
}
