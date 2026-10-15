/**
 * Central Amazon / print specs. Update here when KDP / Merch / ACX change.
 * UI must surface `lastVerified`.
 */

export const PUBLISHING_SPECS = {
  lastVerified: '2026-04-11',
  dpi: 300,
  bleedInches: 0.125,
  /** Default exterior margins (inches); gutter grows with page count. */
  safeMarginInches: 0.5,
  trimSizesInches: [
    { id: 'sq_85', label: '8.5 × 8.5 in', width: 8.5, height: 8.5 },
    { id: 'sq_8', label: '8 × 8 in', width: 8, height: 8 },
    { id: 'sq_825', label: '8.25 × 8.25 in', width: 8.25, height: 8.25 },
    { id: 'us_letter', label: '8.5 × 11 in', width: 8.5, height: 11 },
    { id: 'a4', label: 'A4 (210 × 297 mm)', width: 8.27, height: 11.69 },
  ],
  paperTypes: {
    white: {
      id: 'white',
      label: 'White',
      /** Spine inches per page (placeholder — verify against current KDP calculator). */
      spineInchesPerPage: 0.002252,
    },
    cream: {
      id: 'cream',
      label: 'Cream',
      spineInchesPerPage: 0.0025,
    },
    premium_color: {
      id: 'premium_color',
      label: 'Premium color',
      spineInchesPerPage: 0.002347,
    },
  },
  pageCount: {
    min: 24,
    max: 828,
    /** Picture-book presets */
    presets: [24, 32, 40],
    mustBeEven: true,
  },
  merch: {
    canvasPx: { width: 4500, height: 5400 },
    colorSpace: 'sRGB',
    maxFileBytes: 25 * 1024 * 1024,
    transparentPng: true,
    minDpi: 300,
    /** Keep in sync with ScanLogic `src/lib/bizstart/amazon/merchConfig.js` fileSpecs. */
    note: 'Verify current Merch templates before upload — Amazon Hub Merch guide surfaces lastVerified.',
  },
  aPlus: {
    // Placeholder sizes — verify in Seller Central / KDP A+ before production use
    modules: [
      { id: 'standard_image', width: 970, height: 600 },
      { id: 'premium_hero', width: 1464, height: 600 },
    ],
  },
  disclaimers: {
    notAffiliated:
      'Not affiliated with or endorsed by Amazon. Exported files are not guaranteed to pass Amazon previewers.',
    aiRights:
      'Copyright protectability of purely AI-generated imagery is legally uncertain in many jurisdictions. You are responsible for confirming rights for your use.',
    kdpAiDisclosure:
      'Amazon KDP requires disclosure of AI-generated content when publishing. Keep an AI usage record for each project.',
  },
  /**
   * Kindle Create reflowable DOC(X) is for text novels/non-fiction — not picture-book spreads.
   * @see kindle-create-specs.js
   */
  kindleCreate: {
    applicable: false,
    lastVerified: '2026-10-15',
    helpUrl: 'https://kdp.amazon.com/en_US/help/topic/G7R2L7V5X6SJH948',
    note:
      'Picture books use fixed-layout / print PDF packs. Do not force Kindle Create reflowable chapter/TOC patterns onto illustrated spreads.',
  },
}

export function getTrimSize(id) {
  return PUBLISHING_SPECS.trimSizesInches.find((t) => t.id === id) || null
}

export function getPaperType(id) {
  return PUBLISHING_SPECS.paperTypes[id] || null
}
