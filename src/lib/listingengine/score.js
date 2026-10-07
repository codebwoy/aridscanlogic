import { normalizeScore, PUBLISH_STATUS } from './schema'

const WEIGHTS = {
  german_naturalness: 0.2,
  factual_accuracy: 0.2,
  customer_clarity: 0.15,
  ebay_suitability: 0.15,
  seo_quality: 0.1,
  conversion_quality: 0.1,
  compliance_completeness: 0.1,
}

export function computeWeightedTotal(parts) {
  const s = normalizeScore(parts)
  let sum = 0
  for (const [k, w] of Object.entries(WEIGHTS)) {
    sum += (s[k] || 0) * w
  }
  return Math.round(sum)
}

/**
 * Cap score when compliance blocks publish — marketing cannot override.
 */
export function finalizeScore(rawScore, publishStatus) {
  const s = normalizeScore(rawScore)
  let total = s.total || computeWeightedTotal(s)
  if (publishStatus === PUBLISH_STATUS.BLOCKED) {
    total = Math.min(total, 55)
    s.compliance_completeness = Math.min(s.compliance_completeness || 0, 40)
  } else if (publishStatus === PUBLISH_STATUS.NEEDS_REVIEW) {
    total = Math.min(total, 78)
  }
  return normalizeScore({ ...s, total })
}

export function localFallbackScore(listing, compliance) {
  const hasTitle = !!(listing?.titel || listing?.seo_titel)
  const hasKurz = (listing?.kurzbeschreibung || '').length > 80
  const hasVorteile = (listing?.vorteile || []).length >= 3
  const red = (compliance?.claims || []).filter((c) => c.level === 'RED').length
  const missing = (compliance?.missing || []).length

  const factual = Math.max(20, 90 - red * 15 - missing * 5)
  const clarity = hasTitle && hasKurz && hasVorteile ? 80 : 50
  const ebay = hasTitle && hasKurz ? 75 : 45
  const complianceScore = Math.max(10, 85 - red * 20 - missing * 4)

  return finalizeScore(
    {
      german_naturalness: 70,
      factual_accuracy: factual,
      customer_clarity: clarity,
      ebay_suitability: ebay,
      seo_quality: hasTitle ? 70 : 40,
      conversion_quality: hasVorteile ? 70 : 45,
      compliance_completeness: complianceScore,
    },
    compliance?.publish_status
  )
}
