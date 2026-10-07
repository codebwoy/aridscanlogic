/**
 * "Can I Sell This?" — lite decision from seller-entered data only.
 * No live eBay demand / Terapeak. Not legal advice or a sales guarantee.
 */

import { PUBLISH_STATUS, normalizeProductData } from './schema'
import { calculateProfit, normalizeEconomics } from './profit'

export const SELL_DECISION = {
  TEST: 'TEST',
  REVIEW: 'REVIEW',
  DONT: 'DONT_SELL',
}

function filled(v) {
  return String(v || '').trim().length > 0
}

function gpsrGaps(product) {
  const g = product.gpsr || {}
  if (g.gpsr_applicable === false) return []
  const gaps = []
  if (!filled(g.hersteller)) gaps.push({ de: 'Hersteller fehlt', en: 'Manufacturer missing' })
  if (!filled(g.hersteller_anschrift)) {
    gaps.push({ de: 'Hersteller-Anschrift fehlt', en: 'Manufacturer address missing' })
  }
  if (!filled(g.eu_verantwortliche_person) && !filled(g.hersteller_anschrift)) {
    gaps.push({
      de: 'EU-Verantwortliche Person / EU-Anschrift unklar',
      en: 'EU Responsible Person / EU address unclear',
    })
  }
  if (!filled(g.produktidentifikation) && !filled(product.ean) && !filled(product.modell)) {
    gaps.push({
      de: 'Produktidentifikation (EAN/Modell) fehlt',
      en: 'Product identification (EAN/model) missing',
    })
  }
  return gaps
}

function shippingGaps(product) {
  const s = product.shipping || {}
  const gaps = []
  if (!filled(s.lieferzeit)) gaps.push({ de: 'Lieferzeit fehlt', en: 'Delivery time missing' })
  if (!filled(s.versandkosten) && s.versandkosten !== '0') {
    gaps.push({ de: 'Versandkosten unklar', en: 'Shipping cost unclear' })
  }
  return gaps
}

/**
 * Heuristic return-risk flag from category / product type wording.
 * Conservative — never claims measured return rates.
 */
function returnRiskHint(product) {
  const blob = `${product.produkttyp || ''} ${product.category_hint || ''} ${product.material || ''}`.toLowerCase()
  if (/kind|baby|spielzeug|toy|elektr|akku|batter|ladegerät|charger/.test(blob)) {
    return {
      level: 'high',
      de: 'Hohes Rückgabe-/Compliance-Risiko (Kinder/Elektronik) — manuelle Prüfung',
      en: 'High return/compliance risk (kids/electronics) — manual review',
    }
  }
  if (/möbel|stuhl|sofa|schrank|tisch|furniture|montage|assembly/.test(blob)) {
    return {
      level: 'medium',
      de: 'Mittleres Retourenrisiko (Maße/Montage) — Maße & Lieferumfang prüfen',
      en: 'Medium return risk (size/assembly) — verify dimensions & contents',
    }
  }
  return {
    level: 'low',
    de: 'Retourenrisiko nicht aus Katalog ableitbar — Annahmen prüfen',
    en: 'Return risk not inferred from catalog — verify assumptions',
  }
}

/**
 * @returns {{
 *   decision: 'TEST' | 'REVIEW' | 'DONT_SELL',
 *   confidence: 'low' | 'medium',
 *   reasons: { severity: 'block' | 'warn' | 'ok', de: string, en: string }[],
 *   profit: object,
 *   disclaimer: { de: string, en: string },
 * }}
 */
export function evaluateCanISellThis({ product, economics, compliance } = {}) {
  const p = normalizeProductData(product || {})
  const profit = calculateProfit(normalizeEconomics(economics || {}))
  const reasons = []
  const gaps = gpsrGaps(p)
  const shipGaps = shippingGaps(p)
  const returnHint = returnRiskHint(p)
  const publishStatus = compliance?.publish_status
  const redClaims = (compliance?.claims || []).filter((c) => c.level === 'RED')

  const hasIdentity = filled(p.produkttyp) || filled(p.marke) || filled(p.modell)

  if (!hasIdentity) {
    reasons.push({
      severity: 'block',
      de: 'Produkttyp / Marke / Modell fehlen — Entscheidung nicht möglich',
      en: 'Product type / brand / model missing — cannot decide',
    })
  } else {
    reasons.push({
      severity: 'ok',
      de: 'Grundlegende Produktidentität vorhanden',
      en: 'Basic product identity present',
    })
  }

  gaps.forEach((g) => reasons.push({ severity: 'block', de: g.de, en: g.en }))
  shipGaps.forEach((g) => reasons.push({ severity: 'warn', de: g.de, en: g.en }))

  if (returnHint.level === 'high' || returnHint.level === 'medium') {
    reasons.push({ severity: 'warn', de: returnHint.de, en: returnHint.en })
  } else {
    reasons.push({ severity: 'ok', de: returnHint.de, en: returnHint.en })
  }

  if (profit.status === 'loss') {
    reasons.push({
      severity: 'block',
      de: `Negativer Deckungsbeitrag (€${profit.contribution}) bei aktuellen Annahmen`,
      en: `Negative contribution (€${profit.contribution}) under current assumptions`,
    })
  } else if (profit.status === 'thin') {
    reasons.push({
      severity: 'warn',
      de: `Marge ${profit.contribution_margin_pct}% unter Ziel ${profit.target_margin_pct}%`,
      en: `Margin ${profit.contribution_margin_pct}% below target ${profit.target_margin_pct}%`,
    })
  } else if (profit.status === 'ok') {
    reasons.push({
      severity: 'ok',
      de: `Deckungsbeitrag €${profit.contribution} (${profit.contribution_margin_pct}%) — Schätzung`,
      en: `Contribution €${profit.contribution} (${profit.contribution_margin_pct}%) — estimate`,
    })
  } else {
    reasons.push({
      severity: 'warn',
      de: 'Verkaufs-/Einkaufspreis fehlen — Profitabilität unbekannt',
      en: 'Selling/product cost missing — profitability unknown',
    })
  }

  if (publishStatus === PUBLISH_STATUS.BLOCKED) {
    reasons.push({
      severity: 'block',
      de: 'Compliance: Veröffentlichung blockiert',
      en: 'Compliance: publishing blocked',
    })
  } else if (publishStatus === PUBLISH_STATUS.READY) {
    reasons.push({
      severity: 'ok',
      de: 'Compliance-Status freigabefähig (anhand vorliegender Daten)',
      en: 'Compliance status publish-ready (based on available data)',
    })
  }

  redClaims.slice(0, 3).forEach((c) => {
    reasons.push({
      severity: 'block',
      de: `Unzulässige Aussage: ${c.claim}`,
      en: `Unsupported claim: ${c.claim}`,
    })
  })

  reasons.push({
    severity: 'warn',
    de: 'Keine Live-Nachfrage / Wettbewerbsdaten — nur deine Eingaben',
    en: 'No live demand / competition data — your inputs only',
  })

  const hasBlock = reasons.some((r) => r.severity === 'block')
  const warnCount = reasons.filter((r) => r.severity === 'warn').length

  let decision = SELL_DECISION.TEST
  if (hasBlock) decision = SELL_DECISION.DONT
  else if (
    returnHint.level === 'high' ||
    warnCount >= 2 ||
    profit.status === 'incomplete' ||
    profit.status === 'thin'
  ) {
    decision = SELL_DECISION.REVIEW
  }

  return {
    decision,
    confidence: hasIdentity && profit.status !== 'incomplete' ? 'medium' : 'low',
    reasons: reasons.slice(0, 14),
    profit,
    disclaimer: {
      de: 'Operative Entscheidungshilfe — keine Rechts-, Steuer- oder Absatzgarantie. GPSR/eBay-Regeln selbst prüfen.',
      en: 'Operational aid only — not legal, tax, or sales advice. Verify GPSR/eBay rules yourself.',
    },
  }
}
