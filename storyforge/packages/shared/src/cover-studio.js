/**
 * Professional Cover Studio — children’s paperback covers for Amazon KDP.
 * Specs distilled from Amazon KDP Help “Create a Paperback Cover” (G201953020):
 * single PDF BACK|SPINE|FRONT, 0.125" bleed, 300 DPI, barcode reserve, spine text ≥80 pages.
 * Art generation prompts inspired by public Midjourney/Replicate craft (title-safe, focal hero).
 * Canva Connect inspiration: handoff checklist for optional external polish — not an OAuth integration.
 * Not affiliated with Amazon, Midjourney, Replicate, or Canva.
 */

import { coverWrapLayout } from './print-math.js'
import { BOOK_FORMATS } from './launchpad-seed.js'
import { validateIsbn13, ISBN_BARCODE_META } from './isbn-barcode.js'

export const COVER_STUDIO_META = {
  id: 'cover_studio',
  title: 'Cover Studio',
  sourceIds: ['S68', 'S42', 'S54', 'S71', 'S72'],
  kdpHelpUrl: 'https://kdp.amazon.com/en_US/help/topic/G201953020',
  kdpCalculatorNote:
    'Always re-check final wrap size in the live Amazon KDP cover calculator / template generator before upload.',
  disclaimer:
    'StoryForge builds a print-oriented cover wrap PDF. Verify bleed, spine, and barcode against current KDP Help (G201953020). Not affiliated with Amazon, Midjourney, Replicate, or Canva.',
}

/** Layout moods for children’s covers (prompt craft — Midjourney/Replicate style). */
export const COVER_LAYOUT_PRESETS = [
  {
    id: 'hero_centered',
    label: 'Hero centered',
    bestFor: 'Character-led picture books; strong thumbnail',
    artNote: 'Full-body or 3/4 hero centered, plain-to-soft background, title-safe top third empty of critical detail',
  },
  {
    id: 'bedtime_soft',
    label: 'Bedtime soft',
    bestFor: 'Night / comfort / belonging stories',
    artNote: 'Warm soft lighting, cozy setting, hero lower-center, dreamy negative space above for title',
  },
  {
    id: 'adventure_wide',
    label: 'Adventure wide',
    bestFor: 'Journey / courage / outdoors',
    artNote: 'Hero in mid-action, readable silhouette, environment behind, keep top band clear for title',
  },
  {
    id: 'series_brand',
    label: 'Series brand',
    bestFor: 'Matching covers across a series',
    artNote: 'Consistent framing and palette; hero pose recognizable at Amazon thumbnail size',
  },
]

export const COVER_FINISH_OPTIONS = [
  { id: 'glossy', label: 'Glossy', note: 'KDP print finish option — choose in KDP Print Options' },
  { id: 'matte', label: 'Matte', note: 'KDP print finish option — choose in KDP Print Options' },
]

/** Pre-publication checklist (KDP G201953020). */
export const COVER_KDP_CHECKLIST = [
  'Single PDF: back cover + spine + front cover as one continuous wrap',
  'Bleed 0.125" (3.2 mm) on all outer edges — backgrounds/images extend into bleed',
  'Important text/images ≥0.25" (6.4 mm) inside the outer trim (safe area)',
  'No hard color edges exactly on the spine fold (print variance ~0.0625")',
  'Spine text only if page count ≥ 80 (KDP rejects spine text under ~79–80 pages)',
  'Leave barcode reserve clear on back (~2" × 1.2") unless you supply your own barcode',
  'Cover art ≥ 300 DPI at wrap size; prefer flattened layers; embed fonts in PDF',
  'Title/author on cover match KDP title setup exactly',
  'File ideally under ~40 MB (hard limit 650 MB)',
  'Re-check dimensions in the Amazon KDP cover calculator before upload',
]

/**
 * Build a title-safe cover art prompt from pinned character + layout preset.
 * Text is NOT baked into the image — StoryForge overlays type in the wrap PDF.
 */
export function buildCoverArtPrompt({
  characterName = 'Hero',
  emotionalCore = 'courage',
  layoutId = 'hero_centered',
  artStyle = 'children’s picture book illustration',
  premise = '',
} = {}) {
  const layout = COVER_LAYOUT_PRESETS.find((p) => p.id === layoutId) || COVER_LAYOUT_PRESETS[0]
  const name = String(characterName || 'Hero').trim() || 'Hero'
  const core = String(emotionalCore || 'courage').trim()
  const premiseBit = premise ? ` Story mood: ${String(premise).slice(0, 120)}.` : ''
  return [
    `Professional children’s picture book COVER illustration of ${name}.`,
    layout.artNote + '.',
    `Emotional tone: ${core}.${premiseBit}`,
    `Art style: ${artStyle}, warm friendly, high quality, age 3–8, readable at Amazon thumbnail.`,
    'CRITICAL: leave the top third mostly clear (title-safe) — no text, no logos, no watermark, no signature.',
    'Single strong focal character; soft or simple background; merch-readable silhouette.',
    'Match the approved character identity from the reference / pinned Character Turbo anchor.',
  ].join(' ')
}

/**
 * Back-cover art — soft supporting scene; keep barcode reserve clear (lower-right ~2"×1.2").
 * Blurb text is overlaid in the wrap PDF — do not bake text into the image.
 */
export function buildBackCoverArtPrompt({
  characterName = 'Hero',
  emotionalCore = 'courage',
  artStyle = 'children’s picture book illustration',
  premise = '',
} = {}) {
  const name = String(characterName || 'Hero').trim() || 'Hero'
  const core = String(emotionalCore || 'courage').trim()
  const premiseBit = premise ? ` Story mood: ${String(premise).slice(0, 120)}.` : ''
  return [
    `Professional children’s picture book BACK COVER illustration featuring ${name}.`,
    'Soft atmospheric scene or quiet supporting moment — not as loud as the front cover.',
    `Emotional tone: ${core}.${premiseBit}`,
    `Art style: ${artStyle}, warm friendly, high quality, age 3–8.`,
    'CRITICAL: leave the LOWER-RIGHT area mostly empty and plain (barcode reserve ~2×1.2 inches) — no important art, no text, no logos.',
    'Leave the UPPER half relatively calm for a back-cover blurb overlay.',
    'No text, no logos, no watermark, no signature baked into the image.',
    'Match the approved character identity from the pinned Character Turbo anchor.',
  ].join(' ')
}

export function emptyCoverStudioState() {
  return {
    layout_id: 'hero_centered',
    finish: 'glossy',
    title_placement: 'top',
    author: '',
    subtitle: '',
    front_art_url: null,
    back_art_url: null,
    generated_at: null,
    back_generated_at: null,
    prompt: '',
    back_prompt: '',
    isbn: '',
    embed_isbn_barcode: false,
    canva_handoff_acknowledged: false,
  }
}

export function normalizeCoverStudioState(raw) {
  const base = emptyCoverStudioState()
  if (!raw || typeof raw !== 'object') return base
  const layoutOk = COVER_LAYOUT_PRESETS.some((p) => p.id === raw.layout_id)
  const finishOk = COVER_FINISH_OPTIONS.some((f) => f.id === raw.finish)
  return {
    layout_id: layoutOk ? raw.layout_id : base.layout_id,
    finish: finishOk ? raw.finish : base.finish,
    title_placement: raw.title_placement === 'bottom' ? 'bottom' : 'top',
    author: String(raw.author || '').slice(0, 120),
    subtitle: String(raw.subtitle || '').slice(0, 160),
    front_art_url: raw.front_art_url || null,
    back_art_url: raw.back_art_url || null,
    generated_at: raw.generated_at || null,
    back_generated_at: raw.back_generated_at || null,
    prompt: String(raw.prompt || '').slice(0, 2000),
    back_prompt: String(raw.back_prompt || '').slice(0, 2000),
    isbn: String(raw.isbn || '')
      .replace(/[^0-9Xx-]/g, '')
      .slice(0, 20),
    embed_isbn_barcode: Boolean(raw.embed_isbn_barcode),
    canva_handoff_acknowledged: Boolean(raw.canva_handoff_acknowledged),
  }
}

/**
 * Geometry + checklist snapshot for Studio / export.
 */
export function assessCoverStudio(project, coverState) {
  const trimId = project?.trim_id || 'sq_85'
  const pageCount = project?.page_count || 32
  const paper = project?.paper_type || 'white'
  const layout = coverWrapLayout(trimId, pageCount, paper)
  const state = normalizeCoverStudioState(coverState || project?.cover_studio)
  const format = BOOK_FORMATS.find((f) => f.id === project?.format_id) || BOOK_FORMATS.find((f) => f.id === 'picture')
  const hasFront = Boolean(state.front_art_url || project?.pinned_anchor?.heroUrl)
  const hasBack = Boolean(state.back_art_url)
  const issues = []
  if (!project?.pinned_anchor?.heroUrl) {
    issues.push({ severity: 'block', message: 'Pin Character Turbo before generating cover art' })
  }
  if (!hasFront) {
    issues.push({ severity: 'warn', message: 'No front cover art yet — Generate front art or use pinned hero' })
  }
  if (!hasBack) {
    issues.push({
      severity: 'warn',
      message: 'No back cover art yet — Generate back art (barcode-safe) for a complete wrap',
    })
  }
  if (!layout.spineTextAllowed) {
    issues.push({
      severity: 'info',
      message: `Spine text omitted (${pageCount} pages < ${layout.spineTextMinPages}) — KDP rule`,
    })
  }
  if (state.embed_isbn_barcode) {
    const check = validateIsbn13(state.isbn)
    if (!check.ok) {
      issues.push({
        severity: 'block',
        message: check.error || 'Embed ISBN barcode is on — enter a valid ISBN-13',
      })
    }
  }
  return {
    layout,
    state,
    format,
    hasFront,
    hasBack,
    issues,
    checklist: COVER_KDP_CHECKLIST,
    presets: COVER_LAYOUT_PRESETS,
    finishes: COVER_FINISH_OPTIONS,
    kdpHelpUrl: COVER_STUDIO_META.kdpHelpUrl,
    canvaHandoff: {
      note: 'Optional: export front PNG + wrap PDF, then polish typography in Canva (Connect APIs / design editor). StoryForge does not auto-push to Canva.',
      docsUrl: 'https://www.canva.dev/docs/apps/rest-apis/',
      steps: [
        'Generate title-safe front art in Cover Studio',
        'Export cover wrap PDF (Finish pack / Export cover wrap)',
        'Optionally open front art in Canva for type experiments — re-import finals into StoryForge wrap or upload PDF to KDP',
        'Keep barcode reserve empty; match title/author to KDP metadata',
      ],
    },
    meta: COVER_STUDIO_META,
  }
}

export function coverStudioPayload() {
  return {
    meta: COVER_STUDIO_META,
    presets: COVER_LAYOUT_PRESETS,
    finishes: COVER_FINISH_OPTIONS,
    checklist: COVER_KDP_CHECKLIST,
    empty: emptyCoverStudioState(),
    isbnBarcode: ISBN_BARCODE_META,
  }
}
