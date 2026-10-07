/**
 * Publish Readiness Score — gate before human approval / export.
 * Combines compliance, SEO, profit, quality score, and legal modules.
 */

import { PUBLISH_STATUS } from './schema'
import { legalModulesReady } from './legalInsert'
import { analyzeSeo } from './seoCheck'
import { calculateProfit, normalizeEconomics } from './profit'
import { analyzeImagePlan } from './imageCheck'

export const READINESS_VERDICT = {
  READY: 'READY_TO_PUBLISH',
  FIX: 'DO_NOT_PUBLISH',
  REVIEW: 'NEEDS_REVIEW',
}

/**
 * @returns {{
 *   total: number,
 *   verdict: string,
 *   parts: { id: string, score: number, weight: number, de: string, en: string }[],
 *   problems: { severity: 'block' | 'warn', de: string, en: string }[],
 *   strengths: { de: string, en: string }[],
 *   seo: object,
 *   profit: object,
 * }}
 */
export function computePublishReadiness({
  product,
  listing,
  compliance,
  score,
  legal,
  economics,
  imageChecklist = {},
  humanApproved = false,
}) {
  const seo = analyzeSeo({ product, listing })
  const profit = calculateProfit(normalizeEconomics(economics))
  const images = analyzeImagePlan({ product, checklist: imageChecklist })
  const publishStatus = compliance?.publish_status || PUBLISH_STATUS.NEEDS_REVIEW
  const qualityTotal = Number(score?.total) || 0
  const legalOk = legalModulesReady(legal)

  const complianceScore =
    publishStatus === PUBLISH_STATUS.READY
      ? Math.max(score?.compliance_completeness || 0, 85)
      : publishStatus === PUBLISH_STATUS.BLOCKED
        ? Math.min(score?.compliance_completeness || 0, 40)
        : Math.min(score?.compliance_completeness || 60, 70)

  const profitScore =
    profit.status === 'incomplete'
      ? 40
      : profit.status === 'loss'
        ? 15
        : profit.status === 'thin'
          ? 55
          : 90

  const legalScore = legalOk ? 100 : 35
  const copyScore = qualityTotal || (listing?.titel ? 50 : 0)

  const parts = [
    { id: 'compliance', score: complianceScore, weight: 0.28, de: 'Compliance', en: 'Compliance' },
    { id: 'seo', score: seo.score, weight: 0.18, de: 'SEO / Merkmale', en: 'SEO / specifics' },
    { id: 'copy', score: copyScore, weight: 0.18, de: 'Deutsche Texte', en: 'German copy' },
    { id: 'profit', score: profitScore, weight: 0.14, de: 'Deckungsbeitrag', en: 'Contribution' },
    { id: 'legal', score: legalScore, weight: 0.12, de: 'Rechtstexte', en: 'Legal modules' },
    { id: 'images', score: images.score, weight: 0.1, de: 'Bilder-Plan', en: 'Image plan' },
  ]

  let total = Math.round(parts.reduce((sum, p) => sum + p.score * p.weight, 0))

  const problems = []
  const strengths = []

  if (publishStatus === PUBLISH_STATUS.BLOCKED) {
    total = Math.min(total, 55)
    ;(compliance?.blocked_reasons || []).forEach((r) => {
      problems.push({ severity: 'block', de: r, en: r })
    })
    if (!problems.length) {
      problems.push({
        severity: 'block',
        de: 'Compliance blockiert die Veröffentlichung',
        en: 'Compliance blocks publishing',
      })
    }
  }

  ;(compliance?.claims || [])
    .filter((c) => c.level === 'RED')
    .forEach((c) => {
      problems.push({
        severity: 'block',
        de: `Unzulässige Aussage: ${c.claim}`,
        en: `Unsupported claim: ${c.claim}`,
      })
    })

  if (!legalOk) {
    problems.push({
      severity: 'block',
      de: 'Impressum / Rechtstexte unvollständig',
      en: 'Impressum / legal modules incomplete',
    })
  }

  if (profit.status === 'loss') {
    problems.push({
      severity: 'block',
      de: `Negativer Deckungsbeitrag (€${profit.contribution})`,
      en: `Negative contribution (€${profit.contribution})`,
    })
    total = Math.min(total, 62)
  } else if (profit.status === 'thin') {
    problems.push({
      severity: 'warn',
      de: `Marge ${profit.contribution_margin_pct}% unter Ziel ${profit.target_margin_pct}%`,
      en: `Margin ${profit.contribution_margin_pct}% below target ${profit.target_margin_pct}%`,
    })
  } else if (profit.status === 'incomplete') {
    problems.push({
      severity: 'warn',
      de: 'Verkaufspreis / Einkaufspreis für Profit-Check fehlen',
      en: 'Selling / product cost missing for profit check',
    })
  }

  seo.missing.slice(0, 6).forEach((m) => {
    problems.push({
      severity: 'warn',
      de: `Artikelmerkmal fehlt: ${m.de}`,
      en: `Item specific missing: ${m.en}`,
    })
  })

  if (seo.title.overLimit) {
    problems.push({
      severity: 'warn',
      de: `Titel länger als ${seo.title.length} Zeichen (max. 80)`,
      en: `Title exceeds 80 characters (${seo.title.length})`,
    })
  }

  if (seo.title.opportunity && seo.title.recommended) {
    problems.push({
      severity: 'warn',
      de: `Titel-Chance: „${seo.title.recommended}“`,
      en: `Title opportunity: “${seo.title.recommended}”`,
    })
  }

  ;(compliance?.missing || []).slice(0, 5).forEach((m) => {
    problems.push({ severity: 'warn', de: m, en: m })
  })

  images.missingRequired.forEach((shot) => {
    problems.push({
      severity: 'warn',
      de: `Bild fehlt: ${shot.de}`,
      en: `Image missing: ${shot.en}`,
    })
  })

  if (publishStatus === PUBLISH_STATUS.READY) {
    strengths.push({ de: 'Compliance freigabefähig', en: 'Compliance publish-ready' })
  }
  if (seo.score >= 75) {
    strengths.push({ de: 'SEO / Artikelmerkmale stark', en: 'Strong SEO / item specifics' })
  }
  if (copyScore >= 80) {
    strengths.push({ de: 'Deutsche Copy-Qualität hoch', en: 'High German copy quality' })
  }
  if (profit.meets_target) {
    strengths.push({
      de: `Profitabel (${profit.contribution_margin_pct}% DB)`,
      en: `Profitable (${profit.contribution_margin_pct}% contribution)`,
    })
  }
  if (legalOk) {
    strengths.push({ de: 'Rechtstexte vorhanden', en: 'Legal modules present' })
  }
  if (images.score >= 70) {
    strengths.push({ de: 'Bilder-Plan weitgehend erfüllt', en: 'Image plan mostly complete' })
  }
  if (humanApproved) {
    strengths.push({ de: 'Menschliche Freigabe erteilt', en: 'Human approval granted' })
  }

  const hasBlock = problems.some((p) => p.severity === 'block')
  let verdict = READINESS_VERDICT.REVIEW
  if (hasBlock || total < 70) verdict = READINESS_VERDICT.FIX
  else if (total >= 90 && publishStatus === PUBLISH_STATUS.READY && legalOk && profit.status !== 'loss') {
    verdict = READINESS_VERDICT.READY
  } else if (total >= 78 && !hasBlock) {
    verdict = READINESS_VERDICT.REVIEW
  } else {
    verdict = READINESS_VERDICT.FIX
  }

  // Dedupe problems by de text
  const seen = new Set()
  const uniqueProblems = []
  for (const p of problems) {
    if (seen.has(p.de)) continue
    seen.add(p.de)
    uniqueProblems.push(p)
  }

  return {
    total: Math.max(0, Math.min(100, total)),
    verdict,
    parts,
    problems: uniqueProblems.slice(0, 12),
    strengths: strengths.slice(0, 8),
    seo,
    profit,
    images,
  }
}
