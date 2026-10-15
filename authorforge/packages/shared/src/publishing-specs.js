/**
 * KDP-oriented print specs for non-fiction trim sizes.
 * Values are operational defaults with lastVerified — not guaranteed Amazon policy.
 */

import { KINDLE_CREATE_LAUNCH_ITEMS, KINDLE_CREATE_SPECS } from './kindle-create-specs.js'

export const PUBLISHING_SPECS = {
  lastVerified: '2026-10-15',
  verifiedNote:
    '⚠ Confirm trim, bleed, spine, and AI disclosure on current Amazon KDP help pages before upload. AuthorForge exports files + checklist only — no Amazon upload automation.',
  dpiTarget: 300,
  bleedInches: 0.125,
  trimSizes: {
    '5x8': { widthIn: 5, heightIn: 8, label: '5 × 8 in' },
    '5.5x8.5': { widthIn: 5.5, heightIn: 8.5, label: '5.5 × 8.5 in' },
    '6x9': { widthIn: 6, heightIn: 9, label: '6 × 9 in (default)' },
    '8.5x11': {
      widthIn: 8.5,
      heightIn: 11,
      label: '8.5 × 11 in (workbook)',
      note: '⚠ Confirm this trim is available for your marketplace/paperback type in current KDP help before upload.',
    },
  },
  defaultTrimId: '6x9',
  paperTypes: {
    white: { label: 'White', pagesPerInch: 442 },
    cream: { label: 'Cream', pagesPerInch: 433 },
  },
  /** Spine width inches ≈ pageCount / pagesPerInch (white/cream). Source: KDP help — verify. */
  spineFormulaNote: 'spineInches = pageCount / pagesPerInch for chosen paper — re-check KDP calculator.',
  kdpHelpUrls: {
    contentGuidelines: 'https://kdp.amazon.com/help/topic/G200672390',
    aiDisclosure: 'https://kdp.amazon.com/help/topic/G200672390',
    coverCalculator: 'https://kdp.amazon.com/cover-calculator',
    manuscript: 'https://kdp.amazon.com/help/topic/G201834230',
    kdpAccount: 'https://kdp.amazon.com/help/topic/G200672390',
    kindleCreate: KINDLE_CREATE_SPECS.helpUrl,
    kindleCreateDe: KINDLE_CREATE_SPECS.helpUrlDe,
  },
  kindleCreate: {
    lastVerified: KINDLE_CREATE_SPECS.lastVerified,
    format: KINDLE_CREATE_SPECS.format,
    note: KINDLE_CREATE_SPECS.verifiedNote,
  },
}

/**
 * Pre-Amazon launch readiness — export is not “live on Amazon”.
 * Authors tick these on the Publish step; state persists on book.compliance.checklist.
 */
export const LAUNCH_READINESS = {
  version: 3,
  studio: 'authorforge',
  lastVerified: PUBLISHING_SPECS.lastVerified,
  lead:
    'Studio export = KDP-shaped files + checklist. You still edit, disclose AI use, run Previewer, and upload manually in KDP. Reflowable DOCX is structured for Kindle Create (KPF) when you choose that path.',
  phases: [
    {
      id: 'manuscript',
      title: 'Manuscript & product quality',
      items: [
        {
          id: 'human_edit',
          label: 'Human edit pass completed (voice, typos, structure) — AI draft is not final copy',
          required: true,
        },
        {
          id: 'story_slots',
          label: 'Personal anecdotes are yours (Story Slots filled) or removed',
          required: true,
        },
        {
          id: 'facts_verified',
          label: 'All statistics/citations verified or marked UNVERIFIED and confirmed by you',
          required: true,
        },
        {
          id: 'bio_blurb',
          label: 'Author bio, back-cover copy, and series name (if any) reviewed',
          required: true,
        },
        {
          id: 'rights_ok',
          label: 'Rights OK: no trademarked fanfic, no libel, no CSAM; content matches your intent',
          required: true,
          linkKey: 'contentGuidelines',
        },
        {
          id: 'no_misleading_title',
          label: 'Title/subtitle: no misleading “bestseller” claims or trademark stuffing',
          required: true,
          linkKey: 'contentGuidelines',
        },
      ],
    },
    {
      id: 'amazon_account',
      title: 'Amazon / KDP account side',
      items: [
        {
          id: 'kdp_account',
          label: 'KDP account ready (identity, tax, bank payouts)',
          required: true,
          linkKey: 'kdpAccount',
        },
        {
          id: 'marketplace_language',
          label: 'Marketplace(s) and listing language match the manuscript language',
          required: true,
        },
        {
          id: 'pricing_royalty',
          label: 'Pricing, royalty plan, and territories decided',
          required: true,
        },
        {
          id: 'isbn_imprint',
          label: 'ISBN (or free KDP ISBN) and imprint name decided',
          required: false,
        },
        {
          id: 'categories_keywords',
          label: 'Categories + 7 keywords finalized (studio draft reviewed by you)',
          required: true,
        },
        {
          id: 'ai_text_disclosure',
          label: 'Disclose AI-generated text/images/translations at KDP upload if applicable',
          required: true,
          linkKey: 'aiDisclosure',
        },
        {
          id: 'previewer',
          label: 'Run Amazon KDP Previewer on interior + cover; fix margin/bleed warnings',
          required: true,
          linkKey: 'coverCalculator',
        },
        {
          id: 'barcode_clear',
          label: 'Cover barcode zone left clear (Amazon places the barcode)',
          required: true,
          linkKey: 'coverCalculator',
        },
        {
          id: 'upload_pacing',
          label: 'Respect sensible per-day upload pacing (avoid spammy bulk uploads)',
          required: false,
          linkKey: 'contentGuidelines',
        },
      ],
    },
    {
      id: 'studio_setup',
      title: 'Studio / tech setup',
      items: [
        {
          id: 'live_llm',
          label: 'Publishable prose generated with a live LLM (not FakeLLM offline fixtures)',
          required: true,
        },
        {
          id: 'desktop_credits',
          label: 'Desktop ≥1024px session used; credits available for remaining jobs',
          required: false,
        },
        {
          id: 'backup_export',
          label: 'Book backup exported / library persisted if you need a local copy',
          required: false,
        },
        {
          id: 'trim_paper_verify',
          label: 'Trim size + cream/white paper confirmed against current KDP help',
          required: true,
          linkKey: 'manuscript',
        },
      ],
    },
    {
      id: 'typesetting',
      title: 'Typesetting / Kindle Create (reflowable)',
      items: KINDLE_CREATE_LAUNCH_ITEMS,
    },
    {
      id: 'after_export',
      title: 'After studio export',
      items: [
        {
          id: 'manual_kdp_upload',
          label: 'Upload ZIP/PDF/EPUB manually in KDP (studio does not auto-upload to Amazon)',
          required: true,
          linkKey: 'manuscript',
        },
        {
          id: 'look_inside_desc',
          label: 'KDP description / Look Inside checked after upload',
          required: true,
        },
        {
          id: 'aplus_optional',
          label: 'A+ / ads modules verified against Amazon image specs (if used)',
          required: false,
        },
        {
          id: 'post_publish_updates',
          label: 'Plan post-publish typo fixes via KDP updates; marketing is outside the app',
          required: false,
        },
      ],
    },
    {
      id: 'strategy',
      title: 'Strategy reminder',
      items: [
        {
          id: 'niche_validated',
          label: 'Niche demand validated by you — studio niche tips are guidance, not Amazon sales data',
          required: false,
        },
      ],
    },
  ],
}

/** Flat checklist for export ZIP + legacy compliance consumers (derived from launch readiness). */
export const COMPLIANCE_CHECKLIST_DEFAULT = {
  version: LAUNCH_READINESS.version,
  lastVerified: PUBLISHING_SPECS.lastVerified,
  items: LAUNCH_READINESS.phases.flatMap((p) =>
    p.items.map((item) => ({
      id: item.id,
      label: item.label,
      linkKey: item.linkKey || null,
      phase: p.id,
      required: !!item.required,
    }))
  ),
}

export function flattenLaunchItems(readiness = LAUNCH_READINESS) {
  return readiness.phases.flatMap((p) =>
    p.items.map((item) => ({
      ...item,
      phaseId: p.id,
      phaseTitle: p.title,
    }))
  )
}

/** Merge saved ticks `{ id, checked }[]` onto the template. */
export function mergeLaunchChecklist(savedChecklist = [], readiness = LAUNCH_READINESS) {
  const byId = new Map(
    (Array.isArray(savedChecklist) ? savedChecklist : []).map((row) => [row.id, !!row.checked])
  )
  return flattenLaunchItems(readiness).map((item) => ({
    ...item,
    checked: byId.has(item.id) ? byId.get(item.id) : false,
  }))
}

export function launchReadinessProgress(savedChecklist = [], readiness = LAUNCH_READINESS) {
  const merged = mergeLaunchChecklist(savedChecklist, readiness)
  const required = merged.filter((i) => i.required)
  const requiredDone = required.filter((i) => i.checked).length
  const allDone = merged.filter((i) => i.checked).length
  return {
    total: merged.length,
    checked: allDone,
    requiredTotal: required.length,
    requiredChecked: requiredDone,
    requiredComplete: required.length > 0 && requiredDone === required.length,
    percent: merged.length ? Math.round((allDone / merged.length) * 100) : 0,
  }
}

export function launchReadinessPayload(readiness = LAUNCH_READINESS) {
  return {
    version: readiness.version,
    studio: readiness.studio,
    lastVerified: readiness.lastVerified,
    lead: readiness.lead,
    phases: readiness.phases,
    helpUrls: PUBLISHING_SPECS.kdpHelpUrls,
    dpiTarget: PUBLISHING_SPECS.dpiTarget,
    verifiedNote: PUBLISHING_SPECS.verifiedNote,
    kindleCreate: PUBLISHING_SPECS.kindleCreate,
  }
}

export function spineWidthInches(pageCount, paperType = 'white') {
  const ppi = PUBLISHING_SPECS.paperTypes[paperType]?.pagesPerInch || 442
  const pages = Math.max(0, Number(pageCount) || 0)
  return pages / ppi
}
