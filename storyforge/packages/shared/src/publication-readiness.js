/**
 * Publication readiness — checklist measure for StoryForge picture books.
 * Not a guarantee of Amazon acceptance or editorial perfection.
 */

import { preflightImageResolution, validatePageCount } from './print-math.js'
import { CONTINUITY_CHECKLIST } from './craft-library.js'

export const PUBLICATION_READINESS_META = {
  id: 'publication_readiness',
  title: 'Publication readiness',
  disclaimer:
    'This score is a readiness checklist — not a guarantee of Amazon acceptance, copyright, or editorial quality. Always verify in the KDP Online Previewer before publishing.',
  levels: [
    { id: 'blocked', min: 0, max: 39, label: 'Blocked' },
    { id: 'needs_work', min: 40, max: 69, label: 'Needs work' },
    { id: 'almost', min: 70, max: 89, label: 'Almost ready' },
    { id: 'ready_for_preview', min: 90, max: 100, label: 'Ready for KDP Previewer' },
  ],
}

/** Human continuity QC items (from Launchpad two-pass checklist). */
export const CONTINUITY_SIGNOFF_ITEMS = CONTINUITY_CHECKLIST.passes.flatMap((pass) =>
  pass.items.map((label, i) => ({
    id: `${pass.id}_${i}`,
    passId: pass.id,
    passTitle: pass.title,
    label,
  })),
)

/** Light copy lint for short picture-book lines (not AuthorForge prose gates). */
export const PICTURE_BOOK_BANNED_PHRASES = [
  'as an ai',
  'delve',
  'tapestry',
  'in conclusion',
  'it is important to note',
  'unlock the secrets',
  'journey of self-discovery',
]

const GATE_WEIGHTS = {
  print: 35,
  continuity: 25,
  copy: 25,
  human: 15,
}

const MAX_WORDS_PER_PAGE_SOFT = 40
const MAX_WORDS_PER_PAGE_HARD = 70
const MIN_TEXT_COVERAGE = 0.5

export function emptyPublicationSignoff() {
  return {
    continuity: Object.fromEntries(CONTINUITY_SIGNOFF_ITEMS.map((item) => [item.id, false])),
    kdp_previewer_reviewed: false,
    kdp_previewer_reviewed_at: null,
    notes: '',
    updated_at: null,
  }
}

export function normalizePublicationSignoff(raw) {
  const base = emptyPublicationSignoff()
  if (!raw || typeof raw !== 'object') return base
  const continuity = { ...base.continuity }
  const src = raw.continuity && typeof raw.continuity === 'object' ? raw.continuity : {}
  for (const item of CONTINUITY_SIGNOFF_ITEMS) {
    continuity[item.id] = Boolean(src[item.id])
  }
  return {
    continuity,
    kdp_previewer_reviewed: Boolean(raw.kdp_previewer_reviewed),
    kdp_previewer_reviewed_at: raw.kdp_previewer_reviewed_at || null,
    notes: String(raw.notes || '').slice(0, 2000),
    updated_at: raw.updated_at || null,
  }
}

export function wordCount(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

export function bannedPhraseHits(text, banned = PICTURE_BOOK_BANNED_PHRASES) {
  const lower = String(text || '').toLowerCase()
  return banned.filter((p) => lower.includes(String(p).toLowerCase()))
}

function levelForScore(score) {
  const n = Math.max(0, Math.min(100, Math.round(score)))
  const found = PUBLICATION_READINESS_META.levels.find((l) => n >= l.min && n <= l.max)
  return found || PUBLICATION_READINESS_META.levels[0]
}

function pageHasArt(page) {
  return Boolean(page?.asset?.url || page?.layers?.[0]?.url || page?.illustrationUrl)
}

function pageArtDims(page) {
  const asset = page?.asset || {}
  return {
    widthPx: Number(asset.width) || 0,
    heightPx: Number(asset.height) || 0,
  }
}

/**
 * @param {object} project
 * @param {{ signoff?: object }} [opts]
 */
export function assessPublicationReadiness(project, opts = {}) {
  const pages = Array.isArray(project?.pages) ? project.pages : []
  const pageCount = Number(project?.page_count) || pages.length || 0
  const trimId = project?.trim_id || 'sq_85'
  const signoff = normalizePublicationSignoff(opts.signoff ?? project?.publication_signoff)
  const bilingual = Boolean(project?.secondary_language)
  const issues = []
  const warnings = []

  // ── Print gate ──────────────────────────────────────────────────────────
  const pageCheck = validatePageCount(pageCount)
  const artPages = pages.filter(pageHasArt)
  const missingArt = pages
    .filter((p) => !pageHasArt(p))
    .map((p) => (p.page_index ?? 0) + 1)
  const dpiChecks = pages.map((p) => {
    if (!pageHasArt(p)) {
      return { page: (p.page_index ?? 0) + 1, ok: false, severity: 'block', message: 'No art' }
    }
    const dims = pageArtDims(p)
    // If dims unknown but asset exists, warn (mock / soft export may omit width)
    if (!dims.widthPx || !dims.heightPx) {
      return {
        page: (p.page_index ?? 0) + 1,
        ok: true,
        severity: 'warn',
        message: 'Art present but pixel size unknown — run 2.5× print upscale before KDP upload',
      }
    }
    const pf = preflightImageResolution(dims.widthPx, dims.heightPx, trimId)
    return { page: (p.page_index ?? 0) + 1, ...pf }
  })
  const dpiBlocks = dpiChecks.filter((c) => !c.ok && c.severity === 'block')
  const dpiWarns = dpiChecks.filter((c) => c.severity === 'warn')

  let printScore = 0
  if (pageCheck.ok) printScore += 0.2
  else issues.push(...pageCheck.errors.map((e) => ({ gate: 'print', severity: 'block', message: e })))

  if (pages.length && artPages.length === pages.length) printScore += 0.45
  else if (artPages.length >= pages.length * 0.8) {
    printScore += 0.25
    warnings.push({
      gate: 'print',
      severity: 'warn',
      message: `Missing art on page(s): ${missingArt.slice(0, 12).join(', ')}${missingArt.length > 12 ? '…' : ''}`,
    })
  } else {
    issues.push({
      gate: 'print',
      severity: 'block',
      message:
        missingArt.length === pages.length
          ? 'No page illustrations yet — generate Editor Pro scenes first'
          : `Only ${artPages.length}/${pages.length || pageCount} pages have art`,
    })
  }

  if (pages.length && dpiBlocks.length === 0) {
    printScore += 0.35
    if (dpiWarns.length) {
      warnings.push({
        gate: 'print',
        severity: 'warn',
        message: `${dpiWarns.length} page(s) need 2.5× print upscale or known print DPI`,
      })
      printScore -= 0.08
    }
  } else if (dpiBlocks.length) {
    issues.push({
      gate: 'print',
      severity: 'block',
      message: `${dpiBlocks.length} page(s) under print resolution — run 2.5× print upscale`,
    })
    printScore += Math.max(0, 0.35 * (1 - dpiBlocks.length / pages.length))
  }

  printScore = clamp01(printScore)

  // ── Continuity gate ─────────────────────────────────────────────────────
  const pinned = Boolean(project?.pinned_anchor?.heroUrl || project?.pinned_anchor_asset_id)
  const ipLocked = Boolean(project?.ip_character?.locked_at)
  const badges = pages.map((p) => p.consistencyBadge).filter(Boolean)
  const failBadges = badges.filter((b) => b === 'fail').length
  const passBadges = badges.filter((b) => b === 'pass').length
  const continuityKeys = CONTINUITY_SIGNOFF_ITEMS.map((i) => i.id)
  const checkedCount = continuityKeys.filter((k) => signoff.continuity[k]).length
  const continuityRatio = continuityKeys.length ? checkedCount / continuityKeys.length : 0

  let continuityScore = 0
  if (pinned) continuityScore += 0.35
  else issues.push({ gate: 'continuity', severity: 'block', message: 'Pin a Character Turbo anchor before scenes' })

  if (ipLocked) continuityScore += 0.15
  else
    warnings.push({
      gate: 'continuity',
      severity: 'warn',
      message: 'IP Character DNA not locked — merch/series identity may drift',
    })

  if (pages.length && artPages.length) {
    if (failBadges === 0 && passBadges >= Math.ceil(artPages.length * 0.5)) continuityScore += 0.2
    else if (failBadges === 0) continuityScore += 0.12
    else {
      issues.push({
        gate: 'continuity',
        severity: 'block',
        message: `${failBadges} page(s) failed consistency — regenerate from pinned anchor`,
      })
    }
  }

  continuityScore += 0.3 * continuityRatio
  if (continuityRatio < 1) {
    warnings.push({
      gate: 'continuity',
      severity: 'warn',
      message: `Human continuity QC: ${checkedCount}/${continuityKeys.length} items checked`,
    })
  }
  continuityScore = clamp01(continuityScore)

  // ── Copy gate ───────────────────────────────────────────────────────────
  const withPrimary = pages.filter((p) => String(p.text_content || '').trim())
  const textCoverage = pages.length ? withPrimary.length / pages.length : 0
  let copyScore = 0
  const bannedAll = []
  let longPages = 0
  let missingSecondary = 0

  for (const p of pages) {
    const primary = String(p.text_content || '').trim()
    const secondary = String(p.text_secondary || '').trim()
    const wc = wordCount(primary)
    if (wc > MAX_WORDS_PER_PAGE_HARD) {
      longPages += 1
      issues.push({
        gate: 'copy',
        severity: 'block',
        message: `Page ${(p.page_index ?? 0) + 1}: ${wc} words (picture-book pages usually stay under ~${MAX_WORDS_PER_PAGE_SOFT})`,
      })
    } else if (wc > MAX_WORDS_PER_PAGE_SOFT) {
      longPages += 1
      warnings.push({
        gate: 'copy',
        severity: 'warn',
        message: `Page ${(p.page_index ?? 0) + 1}: ${wc} words — consider tightening for ages 3–8`,
      })
    }
    const hits = bannedPhraseHits(`${primary} ${secondary}`)
    if (hits.length) {
      bannedAll.push({ page: (p.page_index ?? 0) + 1, hits })
      issues.push({
        gate: 'copy',
        severity: 'block',
        message: `Page ${(p.page_index ?? 0) + 1}: flagged phrase(s): ${hits.join(', ')}`,
      })
    }
    if (bilingual && primary && !secondary) missingSecondary += 1
  }

  if (textCoverage >= 0.9) copyScore += 0.45
  else if (textCoverage >= MIN_TEXT_COVERAGE) {
    copyScore += 0.28
    warnings.push({
      gate: 'copy',
      severity: 'warn',
      message: `Primary text on ${withPrimary.length}/${pages.length} pages — fill remaining story lines`,
    })
  } else {
    issues.push({
      gate: 'copy',
      severity: 'block',
      message: `Story text missing on most pages (${withPrimary.length}/${pages.length}) — write primary lines in Studio`,
    })
    copyScore += 0.1 * textCoverage
  }

  if (!bannedAll.length) copyScore += 0.25
  if (longPages === 0) copyScore += 0.15
  else copyScore += Math.max(0, 0.15 - longPages * 0.03)

  if (bilingual) {
    if (missingSecondary === 0 && withPrimary.length) copyScore += 0.1
    else {
      warnings.push({
        gate: 'copy',
        severity: 'warn',
        message: `${missingSecondary} page(s) missing secondary-language lines`,
      })
      copyScore += 0.04
    }
    if (project?.secondary_verified) copyScore += 0.05
    else
      warnings.push({
        gate: 'copy',
        severity: 'warn',
        message: 'Secondary language not marked verified — have a fluent reader check L2',
      })
  } else {
    copyScore += 0.15
  }
  copyScore = clamp01(copyScore)

  // ── Human sign-off ──────────────────────────────────────────────────────
  let humanScore = 0
  if (signoff.kdp_previewer_reviewed) {
    humanScore = 1
  } else {
    warnings.push({
      gate: 'human',
      severity: 'warn',
      message: 'Confirm you reviewed the book in the Amazon KDP Online Previewer',
    })
  }

  const weighted =
    printScore * GATE_WEIGHTS.print +
    continuityScore * GATE_WEIGHTS.continuity +
    copyScore * GATE_WEIGHTS.copy +
    humanScore * GATE_WEIGHTS.human
  const score = Math.round(weighted)
  const level = levelForScore(score)

  const gates = {
    print: gatePayload('print', printScore, GATE_WEIGHTS.print, [
      ...issues.filter((i) => i.gate === 'print'),
      ...warnings.filter((w) => w.gate === 'print'),
    ]),
    continuity: gatePayload('continuity', continuityScore, GATE_WEIGHTS.continuity, [
      ...issues.filter((i) => i.gate === 'continuity'),
      ...warnings.filter((w) => w.gate === 'continuity'),
    ]),
    copy: gatePayload('copy', copyScore, GATE_WEIGHTS.copy, [
      ...issues.filter((i) => i.gate === 'copy'),
      ...warnings.filter((w) => w.gate === 'copy'),
    ]),
    human: gatePayload('human', humanScore, GATE_WEIGHTS.human, [
      ...issues.filter((i) => i.gate === 'human'),
      ...warnings.filter((w) => w.gate === 'human'),
    ]),
  }

  const blockCount = issues.filter((i) => i.severity === 'block').length
  const exportAllowed = blockCount === 0 && score >= 70
  const publishClaimAllowed = false // never claim 100% publication-ready

  return {
    score,
    level: level.id,
    levelLabel: level.label,
    weights: GATE_WEIGHTS,
    gates,
    issues,
    warnings,
    summary: {
      pages: pages.length || pageCount,
      pagesWithArt: artPages.length,
      pagesWithText: withPrimary.length,
      pinned,
      ipLocked,
      continuityChecked: checkedCount,
      continuityTotal: continuityKeys.length,
      kdpPreviewerReviewed: Boolean(signoff.kdp_previewer_reviewed),
      bilingual,
      dpiBlocks: dpiBlocks.length,
    },
    continuityItems: CONTINUITY_SIGNOFF_ITEMS.map((item) => ({
      ...item,
      checked: Boolean(signoff.continuity[item.id]),
    })),
    signoff,
    exportSuggested: exportAllowed,
    publishClaimAllowed,
    disclaimer: PUBLICATION_READINESS_META.disclaimer,
    dpiChecks,
    generatedAt: new Date().toISOString(),
  }
}

export function publicationReadinessPayload() {
  return {
    meta: PUBLICATION_READINESS_META,
    continuityItems: CONTINUITY_SIGNOFF_ITEMS,
    bannedPhrases: PICTURE_BOOK_BANNED_PHRASES,
    weights: GATE_WEIGHTS,
    emptySignoff: emptyPublicationSignoff(),
  }
}

function clamp01(n) {
  return Math.max(0, Math.min(1, Number(n) || 0))
}

function gatePayload(id, ratio, weight, findings) {
  const score = Math.round(clamp01(ratio) * 100)
  const blocks = findings.filter((f) => f.severity === 'block')
  const status = blocks.length ? 'fail' : score >= 85 ? 'pass' : score >= 50 ? 'warn' : 'fail'
  return {
    id,
    score,
    weight,
    weighted: Math.round(clamp01(ratio) * weight),
    status,
    findings: findings.slice(0, 24),
  }
}
