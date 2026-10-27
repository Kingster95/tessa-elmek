import type { QuoteRequest, QuoteRequestItem } from '../../data/types'
import type { OfferListItem } from './types'

/** Raw values held by the quote request form (all strings, untrimmed). */
export interface QuoteFormValues {
  companyName: string
  contactPerson: string
  email: string
  phone: string
  message: string
}

export type QuoteFormField = keyof QuoteFormValues

export type QuoteFormErrors = Partial<Record<QuoteFormField, string>>

export const emptyQuoteFormValues: QuoteFormValues = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  message: '',
}

/** Field order, used for the error summary and for focusing the first error. */
export const quoteFormFields: readonly QuoteFormField[] = [
  'companyName',
  'contactPerson',
  'email',
  'phone',
  'message',
] as const

export const COMPANY_NAME_MIN = 2
export const COMPANY_NAME_MAX = 120
export const CONTACT_PERSON_MIN = 2
export const CONTACT_PERSON_MAX = 80
export const MESSAGE_MAX = 2000
export const PHONE_DIGITS_MIN = 10
export const PHONE_DIGITS_MAX = 15

/** Deliberately simple: something@something.tld, no whitespace. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Strips spaces, dots, dashes and parentheses and keeps an optional leading
 * "+": "+40 (722) 123-456" -> "+40722123456".
 */
export function normalizePhone(value: string): string {
  const trimmed = value.trim()
  const hasPrefix = trimmed.startsWith('+')
  const body = (hasPrefix ? trimmed.slice(1) : trimmed).replace(/[\s().-]/g, '')
  return hasPrefix ? `+${body}` : body
}

function isValidPhone(value: string): boolean {
  const normalized = normalizePhone(value)
  const digits = normalized.startsWith('+') ? normalized.slice(1) : normalized
  return (
    /^[0-9]+$/.test(digits) &&
    digits.length >= PHONE_DIGITS_MIN &&
    digits.length <= PHONE_DIGITS_MAX
  )
}

function isValidEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_PATTERN.test(value)
}

export function validateQuoteRequest(values: QuoteFormValues): QuoteFormErrors {
  const errors: QuoteFormErrors = {}

  const companyName = values.companyName.trim()
  if (companyName.length === 0) {
    errors.companyName = 'Introduceți denumirea firmei.'
  } else if (companyName.length < COMPANY_NAME_MIN) {
    errors.companyName = `Denumirea firmei trebuie să aibă cel puțin ${COMPANY_NAME_MIN} caractere.`
  } else if (companyName.length > COMPANY_NAME_MAX) {
    errors.companyName = `Denumirea firmei este prea lungă (maximum ${COMPANY_NAME_MAX} de caractere).`
  }

  const contactPerson = values.contactPerson.trim()
  if (contactPerson.length === 0) {
    errors.contactPerson = 'Introduceți numele persoanei de contact.'
  } else if (contactPerson.length < CONTACT_PERSON_MIN) {
    errors.contactPerson = `Numele persoanei de contact trebuie să aibă cel puțin ${CONTACT_PERSON_MIN} caractere.`
  } else if (contactPerson.length > CONTACT_PERSON_MAX) {
    errors.contactPerson = `Numele persoanei de contact este prea lung (maximum ${CONTACT_PERSON_MAX} de caractere).`
  }

  const email = values.email.trim()
  if (email.length === 0) {
    errors.email = 'Introduceți adresa de email.'
  } else if (!isValidEmail(email)) {
    errors.email = 'Adresa de email nu este validă (exemplu: nume@firma.ro).'
  }

  const phone = values.phone.trim()
  if (phone.length === 0) {
    errors.phone = 'Introduceți numărul de telefon.'
  } else if (!isValidPhone(phone)) {
    errors.phone =
      'Numărul de telefon nu este valid. Folosiți cel puțin 10 cifre, de exemplu 0722 123 456.'
  }

  if (values.message.trim().length > MESSAGE_MAX) {
    errors.message = `Mesajul este prea lung (maximum ${MESSAGE_MAX} de caractere).`
  }

  return errors
}

export function isValid(errors: QuoteFormErrors): boolean {
  return Object.keys(errors).length === 0
}

export function toQuoteRequestItem(item: OfferListItem): QuoteRequestItem {
  return {
    productId: item.productId,
    productCode: item.code,
    productName: item.name,
    quantity: item.quantity,
  }
}

/** Trims every text value and maps the offer list lines to request items. */
export function buildQuoteRequest(values: QuoteFormValues, items: OfferListItem[]): QuoteRequest {
  return {
    companyName: values.companyName.trim(),
    contactPerson: values.contactPerson.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    message: values.message.trim(),
    items: items.map(toQuoteRequestItem),
  }
}
