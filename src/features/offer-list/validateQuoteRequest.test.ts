import { describe, expect, it } from 'vitest'
import type { OfferListItem } from './types'
import {
  buildQuoteRequest,
  emptyQuoteFormValues,
  isValid,
  normalizePhone,
  validateQuoteRequest,
  type QuoteFormValues,
} from './validateQuoteRequest'

const validValues: QuoteFormValues = {
  companyName: 'Electro Instal S.R.L.',
  contactPerson: 'Ana Popescu',
  email: 'ana.popescu@electroinstal.ro',
  phone: '0722 123 456',
  message: '',
}

function withValues(overrides: Partial<QuoteFormValues>): QuoteFormValues {
  return { ...validValues, ...overrides }
}

describe('validateQuoteRequest', () => {
  it('accepts a complete, valid form', () => {
    const errors = validateQuoteRequest(validValues)
    expect(errors).toEqual({})
    expect(isValid(errors)).toBe(true)
  })

  it('reports every required field when the form is empty', () => {
    const errors = validateQuoteRequest(emptyQuoteFormValues)
    expect(errors).toEqual({
      companyName: 'Introduceți denumirea firmei.',
      contactPerson: 'Introduceți numele persoanei de contact.',
      email: 'Introduceți adresa de email.',
      phone: 'Introduceți numărul de telefon.',
    })
    expect(isValid(errors)).toBe(false)
  })

  it('treats whitespace-only values as missing', () => {
    const errors = validateQuoteRequest(
      withValues({ companyName: '   ', contactPerson: '\t', email: ' ', phone: '  ' }),
    )
    expect(errors.companyName).toBe('Introduceți denumirea firmei.')
    expect(errors.contactPerson).toBe('Introduceți numele persoanei de contact.')
    expect(errors.email).toBe('Introduceți adresa de email.')
    expect(errors.phone).toBe('Introduceți numărul de telefon.')
  })

  describe('companyName', () => {
    it('requires at least 2 characters', () => {
      expect(validateQuoteRequest(withValues({ companyName: 'A' })).companyName).toBe(
        'Denumirea firmei trebuie să aibă cel puțin 2 caractere.',
      )
      expect(validateQuoteRequest(withValues({ companyName: 'AB' })).companyName).toBeUndefined()
    })

    it('rejects more than 120 characters', () => {
      expect(validateQuoteRequest(withValues({ companyName: 'x'.repeat(120) })).companyName).toBeUndefined()
      expect(validateQuoteRequest(withValues({ companyName: 'x'.repeat(121) })).companyName).toBe(
        'Denumirea firmei este prea lungă (maximum 120 de caractere).',
      )
    })

    it('ignores surrounding whitespace when measuring length', () => {
      const padded = `  ${'x'.repeat(120)}  `
      expect(validateQuoteRequest(withValues({ companyName: padded })).companyName).toBeUndefined()
    })
  })

  describe('contactPerson', () => {
    it('requires at least 2 characters', () => {
      expect(validateQuoteRequest(withValues({ contactPerson: 'I' })).contactPerson).toBe(
        'Numele persoanei de contact trebuie să aibă cel puțin 2 caractere.',
      )
    })

    it('rejects more than 80 characters', () => {
      expect(validateQuoteRequest(withValues({ contactPerson: 'x'.repeat(80) })).contactPerson).toBeUndefined()
      expect(validateQuoteRequest(withValues({ contactPerson: 'x'.repeat(81) })).contactPerson).toBe(
        'Numele persoanei de contact este prea lung (maximum 80 de caractere).',
      )
    })
  })

  describe('email', () => {
    const invalidMessage = 'Adresa de email nu este validă (exemplu: nume@firma.ro).'
    const invalid = ['nume', 'nume@', '@firma.ro', 'nume@firma', 'nume firma@firma.ro', 'nume@@firma.ro', 'nume@firma.r']
    const valid = ['nume@firma.ro', 'prenume.nume+oferta@sub.firma.com', '  nume@firma.ro  ']

    it.each(invalid)('rejects "%s"', (email) => {
      expect(validateQuoteRequest(withValues({ email })).email).toBe(invalidMessage)
    })

    it.each(valid)('accepts "%s"', (email) => {
      expect(validateQuoteRequest(withValues({ email })).email).toBeUndefined()
    })
  })

  describe('phone', () => {
    const invalidMessage =
      'Numărul de telefon nu este valid. Folosiți cel puțin 10 cifre, de exemplu 0722 123 456.'
    const valid = ['0722123456', '0722 123 456', '+40 (722) 123-456', '021.410.22.60', '+40 21 410 22 60', '0040722123456']
    const invalid = ['12345', '072212345', '0722 123 45a', '0722+123456', '1234567890123456', 'telefon']

    it.each(valid)('accepts "%s"', (phone) => {
      expect(validateQuoteRequest(withValues({ phone })).phone).toBeUndefined()
    })

    it.each(invalid)('rejects "%s"', (phone) => {
      expect(validateQuoteRequest(withValues({ phone })).phone).toBe(invalidMessage)
    })
  })

  describe('message', () => {
    it('is optional', () => {
      expect(validateQuoteRequest(withValues({ message: '' })).message).toBeUndefined()
      expect(validateQuoteRequest(withValues({ message: 'Livrare în 2 săptămâni.' })).message).toBeUndefined()
    })

    it('rejects more than 2000 characters', () => {
      expect(validateQuoteRequest(withValues({ message: 'x'.repeat(2000) })).message).toBeUndefined()
      expect(validateQuoteRequest(withValues({ message: 'x'.repeat(2001) })).message).toBe(
        'Mesajul este prea lung (maximum 2000 de caractere).',
      )
    })
  })
})

describe('normalizePhone', () => {
  it('strips spaces, dots, dashes and parentheses', () => {
    expect(normalizePhone('0722 123 456')).toBe('0722123456')
    expect(normalizePhone('021.410.22.60')).toBe('0214102260')
    expect(normalizePhone('(0722) 123-456')).toBe('0722123456')
  })

  it('keeps a leading plus sign', () => {
    expect(normalizePhone('+40 (722) 123-456')).toBe('+40722123456')
    expect(normalizePhone('  +40 722 123 456  ')).toBe('+40722123456')
  })

  it('leaves other characters in place so validation can reject them', () => {
    expect(normalizePhone('0722 123 45a')).toBe('072212345a')
  })
})

describe('isValid', () => {
  it('is true only when there are no messages', () => {
    expect(isValid({})).toBe(true)
    expect(isValid({ email: 'Introduceți adresa de email.' })).toBe(false)
  })
})

describe('buildQuoteRequest', () => {
  const items: OfferListItem[] = [
    {
      productId: 'p-1',
      slug: 'contor-trifazat',
      code: 'M54510',
      name: 'Contor trifazat',
      brand: 'Circutor',
      imageUrl: '/img/m54510.jpg',
      quantity: 3,
    },
    {
      productId: 'p-2',
      slug: 'analizor-retea',
      code: 'CVM-C10',
      name: 'Analizor de rețea',
      brand: 'Circutor',
      quantity: 1,
    },
  ]

  it('trims every text value', () => {
    const request = buildQuoteRequest(
      {
        companyName: '  Electro Instal S.R.L.  ',
        contactPerson: ' Ana Popescu ',
        email: ' ana@electroinstal.ro ',
        phone: ' +40 (722) 123-456 ',
        message: '  Livrare urgentă.  ',
      },
      items,
    )
    expect(request.companyName).toBe('Electro Instal S.R.L.')
    expect(request.contactPerson).toBe('Ana Popescu')
    expect(request.email).toBe('ana@electroinstal.ro')
    expect(request.phone).toBe('+40 (722) 123-456')
    expect(request.message).toBe('Livrare urgentă.')
  })

  it('maps offer list lines to request items in order', () => {
    const request = buildQuoteRequest(validValues, items)
    expect(request.items).toEqual([
      { productId: 'p-1', productCode: 'M54510', productName: 'Contor trifazat', quantity: 3 },
      { productId: 'p-2', productCode: 'CVM-C10', productName: 'Analizor de rețea', quantity: 1 },
    ])
  })

  it('produces an empty item list when there are no lines', () => {
    expect(buildQuoteRequest(validValues, []).items).toEqual([])
  })
})
