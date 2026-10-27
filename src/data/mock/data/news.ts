import type { NewsItem } from '../../types'

/**
 * SAMPLE DATA – news items shown in the "Noutăți" section, newest first.
 * Dates are ISO strings; the UI formats them with formatDate().
 */
export const news: NewsItem[] = [
  {
    id: 'news-2026-04',
    slug: 'statii-de-incarcare-ve-compatibilitate-ocpp-2-0-1',
    title: 'Stații de încărcare VE: compatibilitate OCPP 2.0.1 pentru întreaga gamă',
    date: '2026-06-16',
    summary:
      'Stațiile de încărcare pentru vehicule electrice din oferta noastră primesc, prin actualizare de firmware, suport pentru protocolul OCPP 2.0.1 și funcții de echilibrare dinamică a sarcinii. Echipa noastră tehnică vă poate asista la configurare.',
  },
  {
    id: 'news-2026-03',
    slug: 'seminar-tehnic-compensarea-energiei-reactive-bucuresti',
    title: 'Seminar tehnic la București despre compensarea energiei reactive',
    date: '2026-04-22',
    summary:
      'Pe 14 mai 2026 organizăm, împreună cu specialiștii Circutor, un seminar dedicat dimensionării bateriilor de condensatoare și filtrării armonicilor în instalațiile industriale. Participarea este gratuită, în limita locurilor disponibile.',
  },
  {
    id: 'news-2026-02',
    slug: 'catalog-2026-actualizat-si-noua-lista-de-preturi',
    title: 'Catalogul 2026 actualizat și noua listă de prețuri sunt disponibile',
    date: '2026-03-10',
    summary:
      'Ediția 2026 a catalogului general include peste 200 de coduri noi și fișe tehnice actualizate. Noua listă de prețuri se aplică de la 1 aprilie 2026 și poate fi descărcată din secțiunea Descărcări.',
  },
  {
    id: 'news-2026-01',
    slug: 'noua-gama-de-analizoare-de-retea-si-contoare-in-stoc',
    title: 'Noua gamă de analizoare de rețea și contoare de energie, disponibilă din stoc',
    date: '2026-01-20',
    summary:
      'Am extins stocul cu noile serii de analizoare de rețea și contoare de energie Circutor, cu comunicație Modbus și certificare MID. Livrare din stocul propriu în 24–48 de ore pentru majoritatea codurilor.',
  },
]
