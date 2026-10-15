/**
 * Kindle Create applicability for StoryForge picture books.
 * Reflowable DOC(X) → Kindle Create is for text novels/non-fiction — not illustrated spreads.
 * Source: KDP Help G7R2L7V5X6SJH948 (lastVerified aligned with write studios).
 */

export const KINDLE_CREATE_SPECS = {
  lastVerified: '2026-10-15',
  sourceTopicId: 'G7R2L7V5X6SJH948',
  helpUrl: 'https://kdp.amazon.com/en_US/help/topic/G7R2L7V5X6SJH948',
  helpUrlDe: 'https://kdp.amazon.com/de_DE/help/topic/G7R2L7V5X6SJH948',
  applicable: false,
  format: 'fixed_layout_picture_book',
  verifiedNote:
    '⚠ StoryForge exports print-oriented picture-book packs (trim, bleed, DPI). Kindle Create’s reflowable DOC(X) path is for text books — do not force chapter-heading/TOC reflowable patterns onto illustrated spreads. Confirm current KDP Help for kids’ ebook formats.',
  useInstead: [
    'Print PDF interior at chosen trim + bleed',
    'Cover wrap via KDP cover calculator',
    'Validate in KDP Online Previewer before publish',
  ],
  sharedStillApplies: [
    'Images JPG/PNG, target ≥300 ppi for print sharpness',
    'Alt text / accessibility for any ebook conversion you choose outside StoryForge',
    'AI disclosure on KDP when applicable',
    'Never claim studio export = live on Amazon',
  ],
  images: {
    formats: ['JPG', 'PNG'],
    recommendedPpi: 300,
    minLongSidePx: 100,
  },
}

export function kindleCreatePayload() {
  return {
    lastVerified: KINDLE_CREATE_SPECS.lastVerified,
    helpUrl: KINDLE_CREATE_SPECS.helpUrl,
    helpUrlDe: KINDLE_CREATE_SPECS.helpUrlDe,
    applicable: KINDLE_CREATE_SPECS.applicable,
    format: KINDLE_CREATE_SPECS.format,
    verifiedNote: KINDLE_CREATE_SPECS.verifiedNote,
    useInstead: KINDLE_CREATE_SPECS.useInstead,
    sharedStillApplies: KINDLE_CREATE_SPECS.sharedStillApplies,
    images: KINDLE_CREATE_SPECS.images,
  }
}
