# Tessa Elmek – catalog de produse

Frontend pentru Tessa Elmek, distribuitor de echipamente electrice (măsură, protecție,
contorizare, corectarea factorului de putere, încărcare vehicule electrice, aparataj modular).
Site-ul este un catalog: nu există cumpărare online. Vizitatorii adaugă produse într-o
**listă de ofertă** și trimit o cerere de ofertă.

Stack: Vite 8 · React 19 · TypeScript (strict) · React Router 7 · CSS Modules · Vitest.
Singurele dependențe adăugate peste șablon: `react-router-dom` și `vitest`.

## Rulare

```bash
npm install          # o singură dată
npm run dev          # http://localhost:5173, cu date demo
npm run build        # verificare de tipuri (tsc -b) + build de producție în dist/
npm run preview      # servește dist/
npm run lint         # ESLint
npm test             # Vitest (o rulare)
npm run test:watch   # Vitest în mod watch
```

Fonturile (Archivo, IBM Plex Sans, IBM Plex Mono) se încarcă din Google Fonts în `index.html`.

## Date demo vs. date reale

UI-ul nu știe de unde vin datele. Toate componentele citesc exclusiv prin hook-urile din
`src/data/hooks` (`useCategories`, `useProduct`, …), care apelează un `DataRepository`.
Există două implementări ale aceleiași interfețe (`src/data/repository.ts`):

| Implementare | Fișier | Sursă |
| --- | --- | --- |
| `MockRepository` | `src/data/mock/MockRepository.ts` | date locale din `src/data/mock/data`, cu întârziere simulată de ~300 ms |
| `ApiRepository` | `src/data/api/ApiRepository.ts` | REST API prin `fetch`, la `VITE_API_BASE_URL` |

Alegerea se face **într-un singur loc**, `src/data/index.ts`, pe baza variabilei
`VITE_DATA_SOURCE`. Copiați `.env.example` în `.env.local` și setați:

```ini
# demo (implicit când variabila lipsește)
VITE_DATA_SOURCE=mock

# backend real
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=https://api.exemplu.ro/v1
```

Variabilele se citesc la build/pornire (Vite le injectează în bundle), deci după
modificarea `.env.local` reporniți `npm run dev` sau refaceți build-ul.

Datele demo sunt marcate `SAMPLE DATA` în cod (`src/data/mock/data/*`): adresa, telefonul,
emailul, CUI-ul și numărul de înregistrare sunt inventate. Toate linkurile către documente
(fișe tehnice, cataloage) din datele demo duc la două fișiere substitut, `public/documente/demo.pdf`
și `demo.zip`; parametrul `?doc=` din URL doar păstrează linkurile unice. Backend-ul real va
furniza URL-uri către fișierele adevărate.

## Contractul API pe care trebuie să-l respecte backend-ul

Toate endpoint-urile sunt relative la `VITE_API_BASE_URL` (fără slash final), răspund cu
`Content-Type: application/json` și cu formele de mai jos (identice cu tipurile din
`src/data/types.ts`). Câmpurile marcate `?` sunt opționale și pot lipsi din JSON.

| Metodă | Endpoint | Răspuns |
| --- | --- | --- |
| GET | `/company` | `CompanyInfo` |
| GET | `/categories` | `Category[]` (ordonate după `order`) |
| GET | `/categories/:slug` | `Category` sau **404** |
| GET | `/products?category=:slug&search=:text` | `Product[]` (ambii parametri opționali; `search` caută în nume și cod, fără diacritice și fără majuscule) |
| GET | `/products/:slug` | `Product` sau **404** |
| GET | `/products/:id/related` | `Product[]` (recomandat: maximum 4) |
| GET | `/partners` | `Partner[]` |
| GET | `/news` | `NewsItem[]` (cele mai noi primele) |
| GET | `/downloads` | `Download[]` |
| POST | `/quote-requests` | corp `QuoteRequest`, răspuns `QuoteRequestResult` (status 200 sau 201) |

Tratarea erorilor în `ApiRepository`:

- `404` la `/categories/:slug` și `/products/:slug` devine `null` (pagina afișează „negăsit”).
- Orice alt status non-2xx aruncă `DataError` cu `kind: 'http'` și `status`.
- Eșec de rețea (offline, CORS, DNS) aruncă `DataError` cu `kind: 'network'`.
- Corp care nu este JSON valid aruncă `DataError` cu `kind: 'parse'`.
- Paginile afișează mesajul potrivit și un buton „Încearcă din nou”.

### Forme JSON

```jsonc
// CompanyInfo – GET /company
{
  "name": "Tessa Elmek",
  "legalName": "Tessa Elmek S.R.L.",
  "address": { "street": "Str. Exemplu nr. 1", "city": "Sector 2, București", "postalCode": "020335", "country": "România" },
  "phone": "021-410.22.60",
  "phoneHref": "+40214102260",
  "fax": "021-410.22.61",             // ?
  "email": "office@tessaelmek.ro",
  "fiscalCode": "RO18234567",
  "registrationNumber": "J40/5123/2006",
  "schedule": "Luni – Vineri, 08:30 – 17:00",
  "foundedYear": 2006
}
```

```jsonc
// Category – GET /categories, GET /categories/:slug
{
  "id": "cat-masura",
  "slug": "aparate-masura-control",
  "name": "Aparate pentru măsură și control electric",
  "shortDescription": "O propoziție pentru carduri.",
  "description": "Una-două propoziții pentru antetul paginii de categorie.",
  "order": 1,
  "imageUrl": "https://…/categorie.jpg"   // ?
}
```

```jsonc
// Product – GET /products, GET /products/:slug, GET /products/:id/related
{
  "id": "prd-mas-01",
  "slug": "analizor-retea-cvm-c10",
  "code": "M54510",
  "name": "Analizor de rețea CVM-C10 cu RS-485",
  "shortDescription": "Una-două rânduri: funcție și aplicație.",
  "longDescription": "Paragraf 1.\n\nParagraf 2.",        // paragrafele separate prin linie goală
  "categoryId": "cat-masura",
  "brand": "Circutor",
  "keySpecs": [ { "label": "Tensiune de alimentare", "value": "85…265 V c.a." } ],   // de regulă 4
  "specs":    [ { "label": "Grad de protecție", "value": "IP51 (față)" } ],         // de regulă 8+
  "documents": [
    {
      "id": "doc-prd-mas-01-1",
      "title": "Fișă tehnică M54510",
      "type": "fisa-tehnica",            // fisa-tehnica | manual | certificat | catalog | schema | altul
      "format": "PDF",                   // PDF | ZIP | XLSX | DOCX | DWG
      "url": "https://…/m54510.pdf",
      "sizeLabel": "1,2 MB",             // ?
      "language": "ro"                   // ?
    }
  ],
  "imageUrls": [],                       // gol => UI-ul desenează o ilustrație
  "relatedProductIds": ["prd-mas-02", "prd-mas-03"]
}
```

```jsonc
// Partner – GET /partners
{
  "id": "partner-circutor",
  "name": "Circutor",
  "description": "Echipamente de măsură și compensare a energiei reactive.",
  "websiteUrl": "https://circutor.com",   // ?
  "logoUrl": "https://…/circutor.svg",     // ?
  "featured": true                          // ?  brandul principal, evidențiat
}
```

```jsonc
// NewsItem – GET /news
{
  "id": "news-2026-03",
  "slug": "catalog-2026",
  "title": "Catalogul 2026 este disponibil",
  "date": "2026-03-05",                    // ISO (AAAA-LL-ZZ)
  "summary": "Una-două propoziții.",
  "url": "https://…/articol"              // ?
}
```

```jsonc
// Download – GET /downloads
{
  "id": "dl-01",
  "title": "Catalog general Circutor 2026",
  "description": "Gama completă, în limba română.",   // ?
  "format": "PDF",
  "url": "https://…/catalog-2026.pdf",
  "sizeLabel": "24,8 MB"                               // ?
}
```

```jsonc
// QuoteRequest – corpul cererii POST /quote-requests
{
  "companyName": "Electro Instal S.R.L.",
  "contactPerson": "Ana Popescu",
  "email": "ana@electroinstal.ro",
  "phone": "0722123456",
  "message": "Livrare în București, termen 2 săptămâni.",   // poate fi "" (gol)
  "items": [
    { "productId": "prd-mas-01", "productCode": "M54510", "productName": "Analizor de rețea CVM-C10", "quantity": 3 }
  ]
}

// QuoteRequestResult – răspunsul
{
  "referenceNumber": "TE-2026-04821",
  "receivedAt": "2026-10-12T09:30:00.000Z"
}
```

Validarea formularului se face în client (`validateQuoteRequest.ts`), dar backend-ul trebuie
să valideze din nou și să răspundă cu `4xx` + mesaj la date invalide.

## Structura proiectului

```
src/
  main.tsx                 punct de intrare (încarcă styles/global.css)
  env.d.ts                 tipurile variabilelor VITE_*
  app/                     App (provider-ul listei de ofertă) și router-ul
  styles/
    tokens.css             TOATE culorile, fonturile, razele, spațierile (variabile CSS); paleta întunecată sub [data-theme="dark"]
    global.css             reset, focus vizibil, utilitare (.container, .btn, .input, …)
  data/                    stratul de date – singurul care știe de unde vin datele
    types.ts               tipurile de domeniu
    repository.ts          interfața DataRepository
    errors.ts              DataError (network | http | parse | not_found | unknown)
    index.ts               citește VITE_DATA_SOURCE și exportă `repository`
    hooks/                 useCategories, useProduct, … → { data, loading, error, retry }
    mock/                  MockRepository + date demo (data/products/*.ts, câte un fișier pe categorie)
    api/                   ApiRepository + wrapper fetch (http.ts)
  components/
    layout/                bară de contact, header (meniu mobil, căutare), footer, layout
    ui/                    LoadingState, ErrorState, EmptyState, ProductImage, PageHero, …
  features/
    catalog/               ProductCard, CategoryCard, sidebar/grilă de categorie
    home/                  secțiunile paginii principale
    product/               galerie, specificații, tab-uri, produse similare
    offer-list/            context + reducer + localStorage, formular de cerere, validare
    contact/               detalii de contact
    theme/                 mod luminos/întunecat: provider, comutator, persistare
  pages/                   câte o componentă pe rută
  lib/                     formatare, normalizare text (fără diacritice), hook-uri mici
design/                    machetele HTML de referință
```

## Mod luminos / întunecat

Comutatorul din dreapta sus (header) schimbă tema întregului site. Implementarea este în
`src/features/theme`:

- Paleta întunecată redefinește **aceleași** variabile CSS din `tokens.css` sub
  `:root[data-theme="dark"]`, deci componentele nu știu ce temă este activă. Culorile de text
  și linkurile sunt ridicate astfel încât fiecare combinație păstrează cel puțin 4.5:1.
- Fără o alegere salvată, site-ul urmează preferința sistemului (`prefers-color-scheme`) și
  reacționează când aceasta se schimbă. După ce vizitatorul apasă comutatorul, alegerea se
  salvează în `localStorage` (cheia `tessa-elmek.theme.v1`, în `try/catch`) și are prioritate.
- Un script inline din `index.html` aplică atributul `data-theme` înainte de prima randare,
  ca pagina să nu clipească în alb la încărcare. Cheia și atributul trebuie să rămână identice
  cu cele din `theme.ts` (există un test care verifică asta).
- Comutatorul este un `button` cu `role="switch"` numit „Mod întunecat”; `aria-checked`
  este `true` în tema întunecată. Filele deschise în paralel se sincronizează prin evenimentul
  `storage`.

## Lista de ofertă

Stare globală cu React Context + `useReducer` (`src/features/offer-list`), persistată în
`localStorage` sub cheia `tessa-elmek.offer-list.v1`. Toate accesările sunt în `try/catch`,
deci site-ul funcționează și când stocarea este blocată (lista trăiește doar în sesiune).
Trimiterea formularului apelează `repository.submitQuoteRequest`, afișează confirmarea cu
numărul de referință și golește lista.

## Teste

`npm test` rulează suitele Vitest pentru `MockRepository` (filtrare, căutare, negăsit,
integritatea datelor demo), `ApiRepository` (construirea URL-urilor, erori tipizate),
reducer-ul și stocarea listei de ofertă și validarea formularului.
