import type { Download } from '../../types'

/**
 * SAMPLE DATA – documents offered in the "Descărcări" section.
 * In demo mode every url resolves to the placeholders public/documente/demo.pdf or demo.zip; the ?doc= query only keeps the links unique.
 */
export const downloads: Download[] = [
  {
    id: 'dl-01',
    title: 'Catalog general Circutor 2026',
    description:
      'Gama completă de echipamente de măsură, protecție și compensare, cu coduri și date tehnice.',
    format: 'PDF',
    url: '/documente/demo.pdf?doc=catalog-general-circutor-2026',
    sizeLabel: '24,8 MB',
  },
  {
    id: 'dl-02',
    title: 'Listă de prețuri 2026',
    description: 'Prețuri de listă valabile de la 1 aprilie 2026, exprimate în lei, fără TVA.',
    format: 'PDF',
    url: '/documente/demo.pdf?doc=lista-de-preturi-2026',
    sizeLabel: '3,6 MB',
  },
  {
    id: 'dl-03',
    title: 'Ghid de selecție pentru baterii de condensatoare',
    description:
      'Criterii de dimensionare, trepte recomandate și indicații privind filtrarea armonicilor.',
    format: 'PDF',
    url: '/documente/demo.pdf?doc=ghid-selectie-baterii-de-condensatoare',
    sizeLabel: '5,2 MB',
  },
  {
    id: 'dl-04',
    title: 'Fișe tehnice și manuale – arhivă completă',
    description:
      'Toate fișele tehnice și manualele de utilizare din catalog, grupate pe categorii de produse.',
    format: 'ZIP',
    url: '/documente/demo.zip?doc=fise-tehnice-si-manuale-arhiva',
    sizeLabel: '312,5 MB',
  },
]
