/**
 * eBay.de SEO / item-specifics checklist — uses only verified product attributes.
 * Does not invent specs; recommends title from filled fields only.
 */

import { normalizeProductData, normalizeListingCopy } from './schema'

export const EBAY_TITLE_MAX = 80

/** Core Artikelmerkmale for visibility — filled from product when present. */
const SPEC_KEYS = [
  { id: 'marke', de: 'Marke', en: 'Brand', field: (p) => p.marke },
  { id: 'modell', de: 'Modell', en: 'Model', field: (p) => p.modell },
  { id: 'farbe', de: 'Farbe', en: 'Colour', field: (p) => p.farbe },
  { id: 'material', de: 'Material', en: 'Material', field: (p) => p.material },
  { id: 'groesse', de: 'Größe', en: 'Size', field: (p) => p.groesse },
  { id: 'ean', de: 'EAN/GTIN', en: 'EAN/GTIN', field: (p) => p.ean },
  { id: 'zustand', de: 'Zustand', en: 'Condition', field: (p) => p.zustand },
  { id: 'artikelnummer', de: 'Artikelnr.', en: 'SKU', field: (p) => p.artikelnummer },
  {
    id: 'masse',
    de: 'Maße',
    en: 'Dimensions',
    field: (p) => {
      const m = p.masse || {}
      return [m.breite, m.hoehe, m.tiefe, m.sitzhoehe, m.durchmesser].filter(Boolean).join(' ')
    },
  },
  {
    id: 'gewicht',
    de: 'Gewicht',
    en: 'Weight',
    field: (p) => p.masse?.gewicht,
  },
]

function filled(v) {
  return String(v || '').trim().length > 0
}

/**
 * Build a recommended title from verified attributes only (max 80 chars).
 */
export function recommendTitleFromProduct(product) {
  const p = normalizeProductData(product)
  const parts = [
    p.produkttyp,
    p.marke,
    p.modell,
    p.material,
    p.farbe,
    p.masse?.sitzhoehe ? `${String(p.masse.sitzhoehe).replace(/\s*cm$/i, '')} cm` : '',
    p.groesse,
    p.anzahl && Number(p.anzahl) > 1 ? `${p.anzahl}er Set` : '',
  ]
    .map((x) => String(x || '').trim())
    .filter(Boolean)

  let title = parts.join(' ').replace(/\s+/g, ' ').trim()
  if (title.length > EBAY_TITLE_MAX) {
    title = title.slice(0, EBAY_TITLE_MAX).replace(/\s+\S*$/, '').trim()
  }
  return title
}

/**
 * @returns {{
 *   score: number,
 *   missing: { id: string, de: string, en: string }[],
 *   present: { id: string, de: string, en: string }[],
 *   title: { current: string, recommended: string, length: number, overLimit: boolean, opportunity: boolean },
 *   checks: { id: string, ok: boolean, de: string, en: string }[],
 * }}
 */
export function analyzeSeo({ product, listing }) {
  const p = normalizeProductData(product)
  const L = normalizeListingCopy(listing)

  const present = []
  const missing = []
  for (const spec of SPEC_KEYS) {
    if (filled(spec.field(p))) present.push({ id: spec.id, de: spec.de, en: spec.en })
    else missing.push({ id: spec.id, de: spec.de, en: spec.en })
  }

  const current = L.seo_titel || L.titel || ''
  const recommended = recommendTitleFromProduct(p)
  const length = current.length
  const overLimit = length > EBAY_TITLE_MAX
  const opportunity =
    !!recommended &&
    (!current ||
      recommended.toLowerCase() !== current.toLowerCase()) &&
    recommended.split(' ').length > (current.trim() ? current.trim().split(/\s+/).length : 0)

  const checks = [
    {
      id: 'title',
      ok: filled(current) && !overLimit,
      de: overLimit
        ? `Titel zu lang (${length}/${EBAY_TITLE_MAX})`
        : filled(current)
          ? `Titel gesetzt (${length}/${EBAY_TITLE_MAX})`
          : 'Titel fehlt',
      en: overLimit
        ? `Title too long (${length}/${EBAY_TITLE_MAX})`
        : filled(current)
          ? `Title set (${length}/${EBAY_TITLE_MAX})`
          : 'Title missing',
    },
    {
      id: 'category',
      ok: filled(p.category_hint),
      de: filled(p.category_hint) ? 'Kategorie-Hinweis gesetzt' : 'Kategorie-Hinweis fehlt',
      en: filled(p.category_hint) ? 'Category hint set' : 'Category hint missing',
    },
    {
      id: 'identifiers',
      ok: filled(p.ean) || filled(p.artikelnummer),
      de: filled(p.ean) || filled(p.artikelnummer) ? 'Produktkennung vorhanden' : 'EAN/GTIN oder Artikelnr. fehlt',
      en: filled(p.ean) || filled(p.artikelnummer) ? 'Product ID present' : 'EAN/GTIN or SKU missing',
    },
    {
      id: 'description',
      ok: (L.kurzbeschreibung || '').length >= 80,
      de:
        (L.kurzbeschreibung || '').length >= 80
          ? 'Kurzbeschreibung ausreichend'
          : 'Kurzbeschreibung zu kurz / fehlt',
      en:
        (L.kurzbeschreibung || '').length >= 80
          ? 'Short description adequate'
          : 'Short description too short / missing',
    },
    {
      id: 'item_specifics',
      ok: present.length >= 5,
      de: `Artikelmerkmale ${present.length}/${SPEC_KEYS.length} befüllt`,
      en: `Item specifics ${present.length}/${SPEC_KEYS.length} filled`,
    },
    {
      id: 'shipping',
      ok: filled(p.shipping?.lieferzeit) && filled(p.shipping?.versandkosten),
      de:
        filled(p.shipping?.lieferzeit) && filled(p.shipping?.versandkosten)
          ? 'Lieferzeit & Versandkosten gesetzt'
          : 'Lieferzeit oder Versandkosten fehlen',
      en:
        filled(p.shipping?.lieferzeit) && filled(p.shipping?.versandkosten)
          ? 'Handling time & shipping cost set'
          : 'Handling time or shipping cost missing',
    },
  ]

  const specRatio = present.length / SPEC_KEYS.length
  const checksOk = checks.filter((c) => c.ok).length / checks.length
  const score = Math.round(specRatio * 55 + checksOk * 45)

  return {
    score: Math.max(0, Math.min(100, score)),
    missing,
    present,
    title: {
      current,
      recommended,
      length,
      overLimit,
      opportunity,
    },
    checks,
  }
}
