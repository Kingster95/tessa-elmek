import type { Partner } from '../../types'

/**
 * SAMPLE DATA – distributed brands shown in the "Parteneri" section.
 * Circutor is the main distributed brand; the other names are invented
 * placeholders used only to demonstrate the layout.
 */
export const partners: Partner[] = [
  {
    id: 'partner-circutor',
    name: 'Circutor',
    description:
      'Echipamente de măsură, protecție, contorizare, compensare a energiei reactive și încărcare VE (Spania).',
    websiteUrl: 'https://circutor.com',
    featured: true,
  },
  {
    id: 'partner-voltara',
    name: 'Voltara Systems',
    description:
      'Stații de încărcare pentru vehicule electrice și sisteme de gestionare a puterii.',
  },
  {
    id: 'partner-nordmetric',
    name: 'Nordmetric',
    description: 'Instrumentație de măsură de panou și contoare de energie.',
  },
  {
    id: 'partner-helvex',
    name: 'Helvex Energie',
    description: 'Aparataj modular și accesorii pentru tablouri electrice.',
  },
  {
    id: 'partner-kvarta',
    name: 'Kvarta Power',
    description:
      'Condensatoare de putere, baterii de condensatoare și filtre de armonici.',
  },
]
