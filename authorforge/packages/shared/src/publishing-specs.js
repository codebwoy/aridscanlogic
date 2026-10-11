/**
 * KDP-oriented print specs for non-fiction trim sizes.
 * Values are operational defaults with lastVerified — not guaranteed Amazon policy.
 */

export const PUBLISHING_SPECS = {
  lastVerified: '2026-04-01',
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
  },
}

export const COMPLIANCE_CHECKLIST_DEFAULT = {
  version: 1,
  lastVerified: PUBLISHING_SPECS.lastVerified,
  items: [
    {
      id: 'ai_text_disclosure',
      label: 'Disclose AI-generated text/images/translations at KDP upload if applicable',
      linkKey: 'aiDisclosure',
    },
    {
      id: 'no_misleading_title',
      label: 'Title/subtitle: no misleading “bestseller” claims or trademark stuffing',
      linkKey: 'contentGuidelines',
    },
    {
      id: 'facts_verified',
      label: 'All statistics/citations verified or marked UNVERIFIED and confirmed by you',
      linkKey: null,
    },
    {
      id: 'story_slots',
      label: 'Personal anecdotes are yours (Story Slots filled) or removed',
      linkKey: null,
    },
    {
      id: 'previewer',
      label: 'Run Amazon KDP Previewer on interior + cover before publishing',
      linkKey: 'coverCalculator',
    },
    {
      id: 'upload_pacing',
      label: 'Respect sensible per-day upload pacing (avoid spammy bulk uploads)',
      linkKey: 'contentGuidelines',
    },
  ],
}

export function spineWidthInches(pageCount, paperType = 'white') {
  const ppi = PUBLISHING_SPECS.paperTypes[paperType]?.pagesPerInch || 442
  const pages = Math.max(0, Number(pageCount) || 0)
  return pages / ppi
}
