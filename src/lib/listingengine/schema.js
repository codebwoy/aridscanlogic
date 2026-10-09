/**
 * German E-Commerce Listing Engine — product data, listing output, compliance schemas.
 */

export const LISTING_MODES = [
  { id: 'complete', labelDe: 'Komplettes eBay-Listing', labelEn: 'Complete eBay listing' },
  { id: 'correct', labelDe: 'Deutsche Korrektur (Rechtschreibung/Wörter)', labelEn: 'German correction (spelling/words)' },
  { id: 'seo', labelDe: 'SEO-Optimierung', labelEn: 'SEO optimization' },
  { id: 'rewrite', labelDe: 'Native DE-Überarbeitung', labelEn: 'Native German rewrite' },
  { id: 'translate', labelDe: 'Lieferanten-Übersetzung', labelEn: 'Supplier translation' },
  { id: 'compliance', labelDe: 'Compliance-Prüfung', labelEn: 'Compliance review' },
  { id: 'improve', labelDe: 'Listing verbessern', labelEn: 'Listing improvement' },
]

export const LISTING_PHASES = [
  'idle',
  'input',
  'extracting',
  'copywriting',
  'compliance',
  'review',
  'error',
]

export const CLAIM_LEVELS = ['GREEN', 'YELLOW', 'RED']

export const PUBLISH_STATUS = {
  READY: 'READY_TO_PUBLISH',
  NEEDS_REVIEW: 'NEEDS_REVIEW',
  BLOCKED: 'NOT_READY',
}

export function emptySpecField(key = '', value = '', source = 'verified') {
  return { key, value, source } // verified | supplier_claim | missing
}

export function emptyGpsr() {
  return {
    hersteller: '',
    hersteller_anschrift: '',
    hersteller_email: '',
    hersteller_kontakt: '',
    eu_verantwortliche_person: '',
    eu_verantwortliche_anschrift: '',
    eu_verantwortliche_email: '',
    produktidentifikation: '',
    modellnummer: '',
    seriennummer: '',
    warnhinweise: '',
    sicherheitsinformationen: '',
    gebrauchsanleitung: '',
    entsorgungshinweise: '',
    gpsr_applicable: true,
  }
}

export function emptyShipping() {
  return {
    lieferzeit: '',
    versandart: '',
    versandkosten: '',
    liefergebiet: '',
    sendungsverfolgung: '',
    versanddienstleister: '',
  }
}

export function emptyLegalModules() {
  return {
    impressum: '',
    widerrufsbelehrung: '',
    widerrufsformular: '',
    rueckgabebedingungen: '',
    agb: '',
    datenschutz: '',
    locked: true,
  }
}

/** Verified product facts — AI must not invent beyond these. */
export function emptyProductData() {
  return {
    produkttyp: '',
    marke: '',
    modell: '',
    farbe: '',
    material: '',
    groesse: '',
    anzahl: '',
    ean: '',
    artikelnummer: '',
    herstellerreferenz: '',
    zustand: 'Neu',
    kurz_lieferantenbeschreibung: '',
    spezifikationen: [], // { key, value, source }
    masse: {
      breite: '',
      hoehe: '',
      tiefe: '',
      durchmesser: '',
      sitzhoehe: '',
      gewicht: '',
      tragfaehigkeit: '',
    },
    lieferumfang: [],
    montage: '',
    hinweise: [],
    shipping: emptyShipping(),
    gpsr: emptyGpsr(),
    image_notes: '',
    wholesale_cost: '',
    category_hint: '',
  }
}

export function emptyListingCopy() {
  return {
    seo_titel: '',
    titel: '',
    mobil_titel: '',
    kurzbeschreibung: '',
    produktbeschreibung: '',
    vorteile: [],
    produktdetails: [],
    masse_text: '',
    material_text: '',
    farbe_text: '',
    ausstattung: [],
    lieferumfang: [],
    montage_text: '',
    hinweise: [],
    versand_text: '',
    faq: [], // { question, answer, flagged }
    kundenservice: '',
  }
}

export function emptyClaim() {
  return {
    claim: '',
    level: 'YELLOW', // GREEN | YELLOW | RED
    reason: '',
    location: '',
  }
}

export function emptyComplianceReport() {
  return {
    claims: [],
    missing: [],
    warnings: [],
    image_conflicts: [],
    checklist: {},
    publish_status: PUBLISH_STATUS.NEEDS_REVIEW,
    blocked_reasons: [],
    internal_notes: [],
  }
}

export function emptyQualityScore() {
  return {
    total: 0,
    german_naturalness: 0,
    factual_accuracy: 0,
    customer_clarity: 0,
    ebay_suitability: 0,
    seo_quality: 0,
    conversion_quality: 0,
    compliance_completeness: 0,
  }
}

export function emptyEconomicsFields() {
  return {
    selling_price: '',
    product_cost: '',
    supplier_shipping: '',
    outbound_shipping_cost: '',
    ebay_fee_pct: '12.9',
    ebay_fixed_fee: '0.35',
    ad_cost_per_order: '',
    payment_cost_pct: '0',
    expected_return_rate_pct: '5',
    damage_allowance_pct: '1',
    other_cost_per_order: '',
    software_allocation: '',
    target_margin_pct: '15',
  }
}

export function emptyEbayPublishSettings() {
  return {
    categoryId: '',
    merchantLocationKey: '',
    fulfillmentPolicyId: '',
    paymentPolicyId: '',
    returnPolicyId: '',
    quantity: '1',
    currency: 'EUR',
    marketplaceId: 'EBAY_DE',
    imageUrlsText: '',
    lastListingId: '',
    lastOfferId: '',
    lastSku: '',
  }
}

export function emptyListingSession() {
  return {
    version: 2,
    phase: 'input',
    mode: 'complete',
    source: 'paste', // paste | upload | catalog
    raw_supplier_text: '',
    source_filename: '',
    product: emptyProductData(),
    listing: emptyListingCopy(),
    legal: emptyLegalModules(),
    compliance: emptyComplianceReport(),
    score: emptyQualityScore(),
    economics: emptyEconomicsFields(),
    ebay_settings: emptyEbayPublishSettings(),
    image_checklist: {},
    privacy_acknowledged: false,
    human_approved: false,
    error: '',
    updated_at: null,
  }
}

export function getMaxUploadBytes() {
  return 5 * 1024 * 1024
}

function asArray(v) {
  return Array.isArray(v) ? v : []
}

function asStr(v) {
  return v == null ? '' : String(v)
}

export function normalizeProductData(raw = {}) {
  const base = emptyProductData()
  const m = { ...base.masse, ...(raw.masse || {}) }
  const gpsr = { ...base.gpsr, ...(raw.gpsr || {}) }
  const shipping = { ...base.shipping, ...(raw.shipping || {}) }
  const specs = asArray(raw.spezifikationen).map((s) =>
    typeof s === 'string'
      ? emptySpecField(s, '', 'supplier_claim')
      : emptySpecField(asStr(s.key), asStr(s.value), s.source || 'verified')
  )
  return {
    ...base,
    ...raw,
    produkttyp: asStr(raw.produkttyp),
    marke: asStr(raw.marke),
    modell: asStr(raw.modell),
    farbe: asStr(raw.farbe),
    material: asStr(raw.material),
    groesse: asStr(raw.groesse),
    anzahl: asStr(raw.anzahl),
    ean: asStr(raw.ean),
    artikelnummer: asStr(raw.artikelnummer),
    herstellerreferenz: asStr(raw.herstellerreferenz),
    zustand: asStr(raw.zustand) || 'Neu',
    kurz_lieferantenbeschreibung: asStr(raw.kurz_lieferantenbeschreibung),
    spezifikationen: specs,
    masse: {
      breite: asStr(m.breite),
      hoehe: asStr(m.hoehe),
      tiefe: asStr(m.tiefe),
      durchmesser: asStr(m.durchmesser),
      sitzhoehe: asStr(m.sitzhoehe),
      gewicht: asStr(m.gewicht),
      tragfaehigkeit: asStr(m.tragfaehigkeit),
    },
    lieferumfang: asArray(raw.lieferumfang).map(asStr).filter(Boolean),
    montage: asStr(raw.montage),
    hinweise: asArray(raw.hinweise).map(asStr).filter(Boolean),
    shipping,
    gpsr: {
      ...gpsr,
      gpsr_applicable: gpsr.gpsr_applicable !== false,
    },
    image_notes: asStr(raw.image_notes),
    wholesale_cost: asStr(raw.wholesale_cost),
    category_hint: asStr(raw.category_hint),
  }
}

export function normalizeListingCopy(raw = {}) {
  const base = emptyListingCopy()
  const faq = asArray(raw.faq).map((f) => ({
    question: asStr(f?.question || f?.frage),
    answer: asStr(f?.answer || f?.antwort),
    flagged: !!f?.flagged,
  }))
  return {
    ...base,
    seo_titel: asStr(raw.seo_titel || raw.seo_title),
    titel: asStr(raw.titel || raw.title),
    mobil_titel: asStr(raw.mobil_titel || raw.mobile_title),
    kurzbeschreibung: asStr(raw.kurzbeschreibung),
    produktbeschreibung: asStr(raw.produktbeschreibung),
    vorteile: asArray(raw.vorteile).map(asStr).filter(Boolean),
    produktdetails: asArray(raw.produktdetails).map((d) =>
      typeof d === 'string' ? d : `${asStr(d.key)}: ${asStr(d.value)}`.trim()
    ),
    masse_text: asStr(raw.masse_text),
    material_text: asStr(raw.material_text),
    farbe_text: asStr(raw.farbe_text),
    ausstattung: asArray(raw.ausstattung).map(asStr).filter(Boolean),
    lieferumfang: asArray(raw.lieferumfang).map(asStr).filter(Boolean),
    montage_text: asStr(raw.montage_text),
    hinweise: asArray(raw.hinweise).map(asStr).filter(Boolean),
    versand_text: asStr(raw.versand_text),
    faq,
    kundenservice: asStr(raw.kundenservice),
  }
}

export function normalizeCompliance(raw = {}) {
  const base = emptyComplianceReport()
  return {
    ...base,
    ...raw,
    claims: asArray(raw.claims).map((c) => ({
      claim: asStr(c.claim),
      level: CLAIM_LEVELS.includes(c.level) ? c.level : 'YELLOW',
      reason: asStr(c.reason),
      location: asStr(c.location),
    })),
    missing: asArray(raw.missing).map(asStr).filter(Boolean),
    warnings: asArray(raw.warnings).map(asStr).filter(Boolean),
    image_conflicts: asArray(raw.image_conflicts).map(asStr).filter(Boolean),
    checklist: typeof raw.checklist === 'object' && raw.checklist ? raw.checklist : {},
    publish_status: Object.values(PUBLISH_STATUS).includes(raw.publish_status)
      ? raw.publish_status
      : PUBLISH_STATUS.NEEDS_REVIEW,
    blocked_reasons: asArray(raw.blocked_reasons).map(asStr).filter(Boolean),
    internal_notes: asArray(raw.internal_notes).map(asStr).filter(Boolean),
  }
}

export function normalizeScore(raw = {}) {
  const base = emptyQualityScore()
  const n = (v) => {
    const x = Number(v)
    return Number.isFinite(x) ? Math.max(0, Math.min(100, Math.round(x))) : 0
  }
  return {
    german_naturalness: n(raw.german_naturalness),
    factual_accuracy: n(raw.factual_accuracy),
    customer_clarity: n(raw.customer_clarity),
    ebay_suitability: n(raw.ebay_suitability),
    seo_quality: n(raw.seo_quality),
    conversion_quality: n(raw.conversion_quality),
    compliance_completeness: n(raw.compliance_completeness),
    total: n(raw.total),
  }
}

/** JSON schemas for InvokeLLM structured output */
export const PRODUCT_EXTRACT_JSON_SCHEMA = {
  type: 'object',
  properties: {
    produkttyp: { type: 'string' },
    marke: { type: 'string' },
    modell: { type: 'string' },
    farbe: { type: 'string' },
    material: { type: 'string' },
    groesse: { type: 'string' },
    anzahl: { type: 'string' },
    ean: { type: 'string' },
    artikelnummer: { type: 'string' },
    herstellerreferenz: { type: 'string' },
    zustand: { type: 'string' },
    kurz_lieferantenbeschreibung: { type: 'string' },
    spezifikationen: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          value: { type: 'string' },
          source: { type: 'string' },
        },
      },
    },
    masse: {
      type: 'object',
      properties: {
        breite: { type: 'string' },
        hoehe: { type: 'string' },
        tiefe: { type: 'string' },
        durchmesser: { type: 'string' },
        sitzhoehe: { type: 'string' },
        gewicht: { type: 'string' },
        tragfaehigkeit: { type: 'string' },
      },
    },
    lieferumfang: { type: 'array', items: { type: 'string' } },
    montage: { type: 'string' },
    hinweise: { type: 'array', items: { type: 'string' } },
    shipping: {
      type: 'object',
      properties: {
        lieferzeit: { type: 'string' },
        versandart: { type: 'string' },
        versandkosten: { type: 'string' },
        liefergebiet: { type: 'string' },
        sendungsverfolgung: { type: 'string' },
        versanddienstleister: { type: 'string' },
      },
    },
    gpsr: {
      type: 'object',
      properties: {
        hersteller: { type: 'string' },
        hersteller_anschrift: { type: 'string' },
        hersteller_email: { type: 'string' },
        eu_verantwortliche_person: { type: 'string' },
        eu_verantwortliche_anschrift: { type: 'string' },
        eu_verantwortliche_email: { type: 'string' },
        produktidentifikation: { type: 'string' },
        modellnummer: { type: 'string' },
        warnhinweise: { type: 'string' },
        sicherheitsinformationen: { type: 'string' },
        gebrauchsanleitung: { type: 'string' },
        gpsr_applicable: { type: 'boolean' },
      },
    },
    missing_fields: { type: 'array', items: { type: 'string' } },
    supplier_claims_to_verify: { type: 'array', items: { type: 'string' } },
  },
}

export const LISTING_COPY_JSON_SCHEMA = {
  type: 'object',
  properties: {
    seo_titel: { type: 'string' },
    titel: { type: 'string' },
    mobil_titel: { type: 'string' },
    kurzbeschreibung: { type: 'string' },
    produktbeschreibung: { type: 'string' },
    vorteile: { type: 'array', items: { type: 'string' } },
    produktdetails: { type: 'array', items: { type: 'string' } },
    masse_text: { type: 'string' },
    material_text: { type: 'string' },
    farbe_text: { type: 'string' },
    ausstattung: { type: 'array', items: { type: 'string' } },
    lieferumfang: { type: 'array', items: { type: 'string' } },
    montage_text: { type: 'string' },
    hinweise: { type: 'array', items: { type: 'string' } },
    versand_text: { type: 'string' },
    faq: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          answer: { type: 'string' },
          flagged: { type: 'boolean' },
        },
      },
    },
    kundenservice: { type: 'string' },
  },
}

export const COMPLIANCE_JSON_SCHEMA = {
  type: 'object',
  properties: {
    claims: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          claim: { type: 'string' },
          level: { type: 'string' },
          reason: { type: 'string' },
          location: { type: 'string' },
        },
      },
    },
    missing: { type: 'array', items: { type: 'string' } },
    warnings: { type: 'array', items: { type: 'string' } },
    image_conflicts: { type: 'array', items: { type: 'string' } },
    checklist: { type: 'object' },
    publish_status: { type: 'string' },
    blocked_reasons: { type: 'array', items: { type: 'string' } },
    internal_notes: { type: 'array', items: { type: 'string' } },
    score: {
      type: 'object',
      properties: {
        german_naturalness: { type: 'number' },
        factual_accuracy: { type: 'number' },
        customer_clarity: { type: 'number' },
        ebay_suitability: { type: 'number' },
        seo_quality: { type: 'number' },
        conversion_quality: { type: 'number' },
        compliance_completeness: { type: 'number' },
        total: { type: 'number' },
      },
    },
    suggested_listing_fixes: LISTING_COPY_JSON_SCHEMA,
  },
}
