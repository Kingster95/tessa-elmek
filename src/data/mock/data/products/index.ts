import type { Product } from '../../../types'
import { masuraProducts } from './masura'
import { protectieProducts } from './protectie'
import { contorizareProducts } from './contorizare'
import { factorPutereProducts } from './factor-putere'
import { incarcareVeProducts } from './incarcare-ve'
import { aparatajModularProducts } from './aparataj-modular'

/**
 * SAMPLE DATA – every mock product, in catalog order. One file per category
 * keeps the lists readable; this module just concatenates them.
 * Every document url resolves to the demo placeholders public/documente/demo.pdf or demo.zip; the ?doc= query only keeps the links unique.
 */
export const products: Product[] = [
  ...masuraProducts,
  ...protectieProducts,
  ...contorizareProducts,
  ...factorPutereProducts,
  ...incarcareVeProducts,
  ...aparatajModularProducts,
]
