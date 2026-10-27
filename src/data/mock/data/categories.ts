import type { Category } from '../../types'

/**
 * SAMPLE DATA – the six catalog categories. Product files reference these
 * by `id`; the UI routes by `slug`.
 */
export const categories: Category[] = [
  {
    id: 'cat-masura',
    slug: 'aparate-masura-control',
    name: 'Aparate pentru măsură și control electric',
    shortDescription:
      'Analizoare de rețea, multimetre de panou, transformatoare de curent și indicatoare digitale.',
    description:
      'Instrumente pentru măsurarea și supravegherea mărimilor electrice în tablouri de distribuție și instalații industriale: analizoare de rețea, multimetre de panou, transformatoare de curent și convertoare de semnal.',
    order: 1,
  },
  {
    id: 'cat-protectie',
    slug: 'protectie-control-electric',
    name: 'Protecție și control electric',
    shortDescription:
      'Relee de protecție diferențială, relee de supraveghere și dispozitive de control pentru motoare și linii.',
    description:
      'Echipamente care protejează oamenii și instalațiile: relee diferențiale cu toroid, relee de supraveghere a tensiunii și fazelor, dispozitive de control pentru motoare și automatizări.',
    order: 2,
  },
  {
    id: 'cat-contorizare',
    slug: 'contorizare-calitate-energie',
    name: 'Contorizare și analiza calității energiei',
    shortDescription:
      'Contoare de energie, analizoare portabile și software de gestionare energetică.',
    description:
      'Contoare de energie electrică monofazate și trifazate, analizoare fixe și portabile pentru calitatea energiei, înregistratoare și soluții software pentru monitorizarea consumurilor.',
    order: 3,
  },
  {
    id: 'cat-factor-putere',
    slug: 'corectare-factor-putere',
    name: 'Corectarea factorului de putere și filtrarea armonicilor',
    shortDescription:
      'Regulatoare de energie reactivă, baterii de condensatoare, filtre active și pasive.',
    description:
      'Soluții complete pentru compensarea energiei reactive și reducerea distorsiunilor armonice: regulatoare automate, condensatoare de putere, baterii de condensatoare și filtre active.',
    order: 4,
  },
  {
    id: 'cat-incarcare-ve',
    slug: 'incarcare-vehicule-electrice',
    name: 'Sisteme de încărcare pentru vehicule electrice',
    shortDescription:
      'Stații de încărcare în curent alternativ și continuu, accesorii și sisteme de gestionare.',
    description:
      'Stații de încărcare pentru vehicule electrice destinate locuințelor, parcărilor și flotelor: wallbox-uri monofazate și trifazate, stații rapide în curent continuu, cabluri și software de administrare.',
    order: 5,
  },
  {
    id: 'cat-aparataj-modular',
    slug: 'aparataj-modular-accesorii',
    name: 'Aparataj modular și accesorii pentru tablouri',
    shortDescription:
      'Întrerupătoare automate, dispozitive diferențiale, descărcătoare și accesorii pentru tablouri.',
    description:
      'Aparataj modular montat pe șină DIN și accesorii pentru echiparea tablourilor electrice: întrerupătoare automate, dispozitive de protecție diferențială, descărcătoare de supratensiune, contactoare modulare și repartitoare.',
    order: 6,
  },
]
