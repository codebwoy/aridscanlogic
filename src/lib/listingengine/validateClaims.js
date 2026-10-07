/**
 * Client-side claim / missing-data guards (runs after Engine 2).
 */

import {
  normalizeProductData,
  normalizeListingCopy,
  normalizeCompliance,
  PUBLISH_STATUS,
} from './schema'

const RISKY_PATTERNS = [
  { re: /\bpremium(qualität|qualitaet)?\b/i, label: 'Premiumqualität' },
  { re: /\bbesonders\s+langlebig\b/i, label: 'besonders langlebig' },
  { re: /\bumweltfreundlich\b/i, label: 'umweltfreundlich' },
  { re: /\bnachhaltig\b/i, label: 'nachhaltig' },
  { re: /\bergonomisch\b/i, label: 'ergonomisch' },
  { re: /\ballergikerfreundlich\b/i, label: 'allergikerfreundlich' },
  { re: /\bwasserdicht\b/i, label: 'wasserdicht' },
  { re: /\brostfrei\b/i, label: 'rostfrei' },
  { re: /\bbruchsicher\b/i, label: 'bruchsicher' },
  { re: /\bmade\s+in\s+germany\b/i, label: 'Made in Germany' },
  { re: /\bce[- ]?zertifiziert\b/i, label: 'CE-zertifiziert' },
  { re: /\bblitzschnell(er)?\s+versand\b/i, label: 'blitzschneller Versand' },
  { re: /\bjetzt\s+sofort\b/i, label: 'JETZT SOFORT' },
  { re: /\bbestseller\b/i, label: 'Bestseller' },
  { re: /\bunglaublich\b/i, label: 'Unglaublich' },
]

function listingBlob(listing) {
  const L = normalizeListingCopy(listing)
  return [
    L.seo_titel,
    L.titel,
    L.mobil_titel,
    L.kurzbeschreibung,
    L.produktbeschreibung,
    L.vorteile.join('\n'),
    L.produktdetails.join('\n'),
    L.masse_text,
    L.material_text,
    L.farbe_text,
    L.ausstattung.join('\n'),
    L.lieferumfang.join('\n'),
    L.montage_text,
    L.hinweise.join('\n'),
    L.versand_text,
    L.kundenservice,
    L.faq.map((f) => `${f.question} ${f.answer}`).join('\n'),
  ]
    .join('\n')
    .toLowerCase()
}

function productBlob(product) {
  const p = normalizeProductData(product)
  return JSON.stringify(p).toLowerCase()
}

function factSupported(claimLabel, productText) {
  const key = claimLabel.toLowerCase()
  return productText.includes(key)
}

/**
 * Merge LLM compliance with deterministic guards.
 */
export function mergeComplianceGuards(product, listing, llmCompliance = {}) {
  const p = normalizeProductData(product)
  const L = normalizeListingCopy(listing)
  const report = normalizeCompliance(llmCompliance)
  const text = listingBlob(L)
  const facts = productBlob(p)

  const extraClaims = []
  for (const { re, label } of RISKY_PATTERNS) {
    if (re.test(text) && !factSupported(label, facts)) {
      const already = report.claims.some(
        (c) => c.claim.toLowerCase().includes(label.toLowerCase()) && c.level === 'RED'
      )
      if (!already) {
        extraClaims.push({
          claim: label,
          level: 'RED',
          reason: 'Evaluative / risky claim not substantiated in verified product data.',
          location: 'listing',
        })
      }
    }
  }

  const missing = new Set(report.missing)
  if (!p.produkttyp && !L.titel) missing.add('Produkttyp / Titel')
  if (!p.farbe && !L.farbe_text) missing.add('Farbe')
  if (!p.material && !L.material_text) missing.add('Material')
  const hasMass =
    Object.values(p.masse).some(Boolean) || (L.masse_text && L.masse_text !== 'Nicht angegeben')
  if (!hasMass) missing.add('Maße')
  if (!p.lieferumfang.length && !L.lieferumfang.length) missing.add('Lieferumfang')
  if (!p.shipping.lieferzeit && !/lieferzeit/i.test(L.versand_text || '')) {
    missing.add('Lieferzeit (Versand)')
  }

  if (p.gpsr.gpsr_applicable) {
    if (!p.gpsr.hersteller) missing.add('GPSR: Hersteller')
    if (!p.gpsr.hersteller_anschrift) missing.add('GPSR: Herstelleranschrift')
    if (!p.gpsr.eu_verantwortliche_person && !p.gpsr.hersteller_anschrift.includes('EU')) {
      missing.add('GPSR: EU Verantwortliche Person (prüfen)')
    }
  }

  const claims = [...report.claims, ...extraClaims]
  const redCount = claims.filter((c) => c.level === 'RED').length
  const blocked = new Set(report.blocked_reasons)

  if (redCount > 0) {
    blocked.add(`${redCount} nicht unterstützte / riskante Aussage(n) (RED)`)
  }
  if (p.gpsr.gpsr_applicable && (!p.gpsr.hersteller || !p.gpsr.hersteller_anschrift)) {
    blocked.add('NICHT ZUR VERÖFFENTLICHUNG FREIGEGEBEN – PRODUKTSICHERHEITSANGABEN FEHLEN.')
  }

  let publish_status = report.publish_status
  if (blocked.size > 0 || redCount > 0) {
    publish_status = PUBLISH_STATUS.BLOCKED
  } else if (missing.size > 0 || claims.some((c) => c.level === 'YELLOW')) {
    publish_status = PUBLISH_STATUS.NEEDS_REVIEW
  } else if (publish_status === PUBLISH_STATUS.BLOCKED) {
    publish_status = PUBLISH_STATUS.NEEDS_REVIEW
  }

  const checklist = {
    german_language: true,
    product_title: !!(L.titel || L.seo_titel),
    product_condition: !!p.zustand,
    specifications: hasMass || p.spezifikationen.length > 0,
    manufacturer_gpsr: !p.gpsr.gpsr_applicable || !!(p.gpsr.hersteller && p.gpsr.hersteller_anschrift),
    shipping_info: !!(p.shipping.lieferzeit || L.versand_text),
    no_red_claims: redCount === 0,
    no_fake_urgency: !/\bjetzt\s+sofort\b|\bbestseller\b/i.test(text),
    ...report.checklist,
  }

  return normalizeCompliance({
    ...report,
    claims,
    missing: [...missing],
    blocked_reasons: [...blocked],
    publish_status,
    checklist,
    internal_notes: [
      ...report.internal_notes,
      ...(extraClaims.length
        ? [`Client guard flagged ${extraClaims.length} risky claim(s).`]
        : []),
    ],
  })
}

/**
 * Strip RED claims from listing text heuristically (safe downgrade).
 */
export function stripRedClaimsFromListing(listing, claims) {
  const L = normalizeListingCopy(listing)
  const red = (claims || []).filter((c) => c.level === 'RED').map((c) => c.claim)
  if (!red.length) return L

  const scrub = (s) => {
    let out = String(s || '')
    for (const claim of red) {
      const re = new RegExp(claim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
      out = out.replace(re, '').replace(/\s{2,}/g, ' ').trim()
    }
    return out
  }

  return normalizeListingCopy({
    ...L,
    seo_titel: scrub(L.seo_titel),
    titel: scrub(L.titel),
    mobil_titel: scrub(L.mobil_titel),
    kurzbeschreibung: scrub(L.kurzbeschreibung),
    produktbeschreibung: scrub(L.produktbeschreibung),
    vorteile: L.vorteile.map(scrub).filter(Boolean),
    produktdetails: L.produktdetails.map(scrub).filter(Boolean),
    hinweise: L.hinweise.map(scrub).filter(Boolean),
    versand_text: scrub(L.versand_text),
    kundenservice: scrub(L.kundenservice),
  })
}
