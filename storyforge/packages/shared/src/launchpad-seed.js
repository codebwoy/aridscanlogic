/**
 * Launchpad Part A seed content — editable via admin/config APIs.
 * Source-traced; marketing/⚠ claims flagged in ConfigValue.verified_note.
 */

export const BOOK_FORMATS = [
  {
    id: 'board',
    format: 'Board Book',
    ageRange: '0–3',
    pages: '12–24',
    pageMin: 12,
    pageMax: 24,
    keyFeature: 'Ultra-simple, thick pages',
    recommendedTrims: ['sq_85', 'sq_8'],
  },
  {
    id: 'picture',
    format: 'Picture Book',
    ageRange: '3–7',
    pages: '24–40',
    pageMin: 24,
    pageMax: 40,
    keyFeature: 'Most popular for self-publishers',
    recommendedTrims: ['sq_85', 'us_letter'],
    note: 'Most first-time KDP self-publishers target picture books (ages 3–7).',
  },
  {
    id: 'early_reader',
    format: 'Early Reader',
    ageRange: '5–8',
    pages: '32–64',
    pageMin: 32,
    pageMax: 64,
    keyFeature: 'Short chapters, controlled vocab',
    recommendedTrims: ['us_letter', 'sq_85'],
  },
  {
    id: 'chapter',
    format: 'Chapter Book',
    ageRange: '7–10',
    pages: '60–100+',
    pageMin: 60,
    pageMax: 100,
    keyFeature: 'Longer, series-friendly',
    recommendedTrims: ['us_letter'],
  },
]

/** @type {Array<{ key: string, value: string, source_label: string, verified_note?: string }>} */
export const CONFIG_VALUES = [
  {
    key: 'quick_book_time_estimate',
    value: 'about 10 minutes once you know the workflow',
    source_label: 'per source text (S12)',
    verified_note: '⚠ Marketing claim from source — unverified.',
  },
  {
    key: 'kdp_print_royalty_rate',
    value: '60',
    source_label: 'per source text (S30)',
    verified_note: '⚠ Flat rate as stated by source; verify against current KDP calculator (print cost applies).',
  },
  {
    key: 'kdp_ai_disclosure_confidential',
    value:
      'KDP requires disclosure if your book contains AI-generated images, selected during upload. Source states it is confidential and not visible to customers.',
    source_label: 'per source text (S20)',
    verified_note: '⚠ Verify against current KDP wording before relying on “confidential”.',
  },
  {
    key: 'kdp_ai_disclosure_required_since',
    value: 'September 2023',
    source_label: 'per source text (S30 / Step 5)',
    verified_note: '⚠ Verify against current KDP Help.',
  },
  {
    key: 'back_to_school_timing_before_august',
    value: 'Publish before August for back-to-school demand spikes',
    source_label: 'per source text (S18)',
    verified_note: '⚠ Source also says July — both shown; set preferred publish-by in guide.',
  },
  {
    key: 'back_to_school_timing_july',
    value: 'Back to school = publish in July',
    source_label: 'per source text (S18 / S31)',
  },
  {
    key: 'trial_credits_display',
    value: '20',
    source_label: 'per source text (S25)',
  },
  {
    key: 'character_turbo_default_engine',
    value: 'v3',
    source_label: 'per source text (S5) — “Turbo V3”',
  },
  {
    key: 'kdp_upload_url',
    value: 'https://kdp.amazon.com',
    source_label: 'per source text (S30)',
  },
  {
    key: 'us_copyright_ai_explainer',
    value:
      'U.S. copyright protection for AI-illustrated books is limited where human authorship is insufficient. This is guidance only — not legal advice. Confirm with official Copyright Office materials and counsel.',
    source_label: 'per source text (S24)',
    verified_note: 'Editable admin text; add official source links in Reading slots.',
  },
]

export const PROMPT_TEMPLATES = [
  {
    id: 'pt_anchor_fullbody',
    tool: 'character_turbo',
    title: 'Anchor — full body, front, white background',
    sourceIds: ['S3', 'S5', 'S13'],
    text:
      'Full-body front-facing cartoon character named {{characterName}}, standing pose, white background, consistent design for a children’s picture book, clear facial features, no text, no watermark.',
  },
  {
    id: 'pt_scene_from_anchor',
    tool: 'editor_pro',
    title: 'Scene from pinned anchor',
    sourceIds: ['S4', 'S6', 'S13'],
    text:
      'Using the pinned anchor of {{characterName}}, illustrate page scene: {{sceneBrief}}. Keep face, colours, and outfit consistent with the anchor. Children’s picture book style.',
  },
  {
    id: 'pt_two_character',
    tool: 'story_scene_pro',
    title: 'Two-character scene',
    sourceIds: ['S7', 'S13'],
    text:
      'Combine {{characterName}} and {{secondCharacterName}} in one scene: {{sceneBrief}}. Both must match their anchors. Children’s picture book style.',
  },
  {
    id: 'pt_photo_cartoon',
    tool: 'photo_to_cartoon',
    title: 'Photo to cartoon character',
    sourceIds: ['S8', 'S14', 'S13'],
    text:
      'Turn this photo into a friendly cartoon children’s-book character named {{characterName}}: full body, front-facing, white background, consistent features for reuse across pages.',
  },
  {
    id: 'pt_cover',
    tool: 'editor_pro',
    title: 'Cover from anchor',
    sourceIds: ['S4', 'S13'],
    text:
      'Cover illustration of {{characterName}} from the pinned anchor, title-safe top area, {{emotionalCore}} mood, children’s picture book cover, no text in the image.',
  },
]

export const RECIPES = [
  {
    id: 'recipe_quick_book',
    title: 'Quick Book',
    estimatedTimeKey: 'quick_book_time_estimate',
    sourceIds: ['S12'],
    niche: null,
    steps: [
      { id: 'qb1', title: 'Create Character Turbo anchor', tool: 'character_turbo', promptId: 'pt_anchor_fullbody' },
      { id: 'qb2', title: 'Write emotional core + short manuscript', tool: null, courseStep: 2 },
      { id: 'qb3', title: 'Generate pages in Editor Pro from anchor', tool: 'editor_pro', promptId: 'pt_scene_from_anchor' },
      { id: 'qb4', title: 'Layout in Canvas + export pages', tool: 'canvas', courseStep: 4 },
      { id: 'qb5', title: 'Export KDP interior + cover checklist', tool: null, courseStep: 5 },
    ],
  },
  {
    id: 'recipe_back_to_school',
    title: 'Back to School book',
    estimatedTimeKey: 'quick_book_time_estimate',
    sourceIds: ['S16'],
    niche: 'back_to_school',
    steps: [
      { id: 'bts1', title: 'Character Turbo (school-ready hero)', tool: 'character_turbo', promptId: 'pt_anchor_fullbody' },
      { id: 'bts2', title: 'Scenes from anchor (classroom / first day)', tool: 'editor_pro', promptId: 'pt_scene_from_anchor' },
      { id: 'bts3', title: 'Canvas layout + export', tool: 'canvas' },
    ],
  },
  {
    id: 'recipe_personalised_baby',
    title: 'Personalised baby / gift book',
    estimatedTimeKey: 'quick_book_time_estimate',
    sourceIds: ['S15', 'S16'],
    niche: 'personalised_baby',
    steps: [
      { id: 'pb1', title: 'Photo to Cartoon (with guardian consent)', tool: 'photo_to_cartoon', promptId: 'pt_photo_cartoon' },
      { id: 'pb2', title: 'Pin as anchor → Editor Pro pages', tool: 'editor_pro', promptId: 'pt_scene_from_anchor' },
      { id: 'pb3', title: 'Canvas + export one listing (see personalisation note)', tool: 'canvas' },
    ],
  },
]

export const GUIDES = [
  {
    id: 'guide_back_to_school',
    slug: 'back-to-school',
    title: 'Back to School',
    niche: 'back_to_school',
    recipeId: 'recipe_back_to_school',
    sourceIds: ['S16', 'S17', 'S18', 'S19'],
    body:
      'Seasonal children’s picture books timed for back-to-school demand. Create one consistent character with Character Turbo, then scene pages from the anchor.',
    timingAdvice: [
      { key: 'back_to_school_timing_before_august', label: 'Source A' },
      { key: 'back_to_school_timing_july', label: 'Source B (KDP guide)' },
    ],
    publishByDefault: '2026-07-15',
    marketData: [
      {
        id: 'md_bts_1',
        rank: '',
        estimatedRevenue: '',
        source: '',
        date: '',
        note: 'Owner-entered BSR / revenue — do not scrape Amazon.',
      },
    ],
    trendsQuery: 'back to school childrens books',
    trendsUrl:
      'https://trends.google.com/trends/explore?q=back%20to%20school%20childrens%20books',
    userTrendNote: '',
  },
  {
    id: 'guide_personalised_baby',
    slug: 'personalised-baby-books',
    title: 'Personalised Baby Books',
    niche: 'personalised_baby',
    recipeId: 'recipe_personalised_baby',
    sourceIds: ['S15', 'S16', 'S17', 'S18', 'S19'],
    body:
      'Gift niche: turn a baby/child photo into a cartoon character and build a personalised storybook. Requires guardian consent before photo processing.',
    personalisationWarning:
      'KDP listings are not per-order personalised print-on-demand for unique names. One uploaded title = one listing. Plan fulfilment accordingly.',
    timingAdvice: [],
    publishByDefault: '',
    marketData: [
      {
        id: 'md_pb_1',
        rank: '',
        estimatedRevenue: '',
        source: '',
        date: '',
        note: 'Owner-entered BSR / revenue — do not scrape Amazon.',
      },
    ],
    trendsQuery: 'personalised baby book',
    trendsUrl: 'https://trends.google.com/trends/explore?q=personalised%20baby%20book',
    userTrendNote: '',
  },
  {
    id: 'guide_merch_handoff',
    slug: 'merch-from-character',
    title: 'Merch from your character',
    niche: 'merch_handoff',
    recipeId: 'recipe_quick_book',
    sourceIds: ['S3', 'S31'],
    body:
      'After you pin a Character Turbo anchor: export transparent PNGs of the character for Amazon Merch on Demand. Apply early at merch.amazon.com (waitlist). Full Merch ops, tiers, pricing, and DE tax notes live in ScanLogic → BizStart → Amazon Hub playbooks (mobile-readable). StoryForge stays the creation studio — Merch upload is manual on Amazon.',
    timingAdvice: [{ key: 'back_to_school_timing_july', label: 'Seasonal publish timing (books)' }],
    publishByDefault: '',
    marketData: [
      {
        id: 'md_merch_1',
        rank: '',
        estimatedRevenue: '',
        source: '',
        date: '',
        note: 'Owner-entered Merch BSR / sales — do not scrape Amazon.',
      },
    ],
    trendsQuery: 'Kinder T-Shirt Tier',
    trendsUrl:
      'https://trends.google.de/trends/explore?geo=DE&q=Kinder%20T-Shirt%20Tier',
    userTrendNote: '',
  },
  {
    id: 'guide_de_kids_research',
    slug: 'de-kids-market-research',
    title: 'DE kids market research',
    niche: 'research_de',
    recipeId: 'recipe_quick_book',
    sourceIds: ['S17', 'S19', 'S31'],
    body:
      'Before burning Merch design slots or picking a book niche: use Amazon.de bestsellers + search autocomplete, Google Trends (Germany), and optional paid keyword tools. Do not scrape. Record owner-entered BSR notes below. Detailed research loop is in ScanLogic Amazon Hub → “Research the German kids market”.',
    timingAdvice: [],
    publishByDefault: '',
    marketData: [
      {
        id: 'md_research_1',
        rank: '',
        estimatedRevenue: '',
        source: '',
        date: '',
        note: 'Owner-entered Amazon.de observations — no scraping.',
      },
    ],
    trendsQuery: 'Kinderbuch Geschenk',
    trendsUrl:
      'https://trends.google.de/trends/explore?geo=DE&q=Kinderbuch%20Geschenk',
    userTrendNote: '',
  },
]

export const COURSE_STEPS = [
  {
    id: 1,
    key: 'format',
    title: 'Choose your book format',
    sourceIds: ['S26'],
    checklist: [
      'Review the format table (Board / Picture / Early Reader / Chapter)',
      'Select a format (picture book recommended for first-timers)',
      'Confirm page-count range and recommended trim sizes',
    ],
  },
  {
    id: 2,
    key: 'manuscript',
    title: 'Write your manuscript',
    sourceIds: ['S27', 'S27b'],
    checklist: [
      'Set emotional core (required before outline)',
      'Plan page turns — words and images as a duet',
      'Keep text per page minimal; aim for rhyme or rhythm',
      'Add structure notes for reference book “The Koala Who Could” (your notes only — no copyrighted text)',
    ],
  },
  {
    id: 3,
    key: 'illustrate',
    title: 'Illustrate using AI',
    sourceIds: ['S28'],
    checklist: [
      'Create character in Character Turbo (full body, front, white background)',
      'Download / pin the anchor image',
      'Generate each page in Editor Pro from the anchor',
      'Use Story Scene Pro for two-character scenes',
      'For personalised books: Photo to Cartoon first (with consent)',
    ],
  },
  {
    id: 4,
    key: 'layout',
    title: 'Layout & design',
    sourceIds: ['S29'],
    checklist: [
      'Open Canvas',
      'Set trim 8.5×11 portrait or 8.5×8.5 square',
      'Add story text; adjust font size for readability',
      'Add speech bubbles if needed',
      'Export pages individually',
    ],
  },
  {
    id: 5,
    key: 'upload',
    title: 'Upload to Amazon KDP',
    sourceIds: ['S30'],
    checklist: [
      'Go to kdp.amazon.com',
      'Set title, description, keywords, categories',
      'Upload interior PDF and cover file',
      'Disclose AI-generated content if applicable',
      'Set your price (see royalty config)',
    ],
  },
  {
    id: 6,
    key: 'optimise',
    title: 'Optimise after launch',
    sourceIds: ['S31'],
    checklist: [
      'Research niches using owner-entered BSR data (guides)',
      'Apply seasonal timing (e.g. back to school → July)',
      'If publishing a character book: apply Merch + plan 10 researched designs (see Merch guide)',
      'Link Author Central ↔ book back matter ↔ Merch (Amazon Hub brand-loop playbook)',
      'Gather reviews (compliant methods only)',
      'Consider Amazon Ads only after organic signal',
    ],
  },
]

export const MANUSCRIPT_PRINCIPLES = [
  'Picture books are engineered around page turns',
  'Words and images work as a duet',
  'Aim for rhyming or rhythmic text',
  'Keep text per page minimal (images carry half the story)',
  'Identify the emotional core before writing (e.g. overcoming fear, embracing change)',
]

export const REFERENCE_BOOKS = [
  {
    id: 'ref_koala',
    title: 'The Koala Who Could',
    role: 'Picture-book structure, rhyme, and character-driven storytelling benchmark',
    sourceIds: ['S27b'],
    ownerNotes: '',
    note: 'Do not paste copyrighted text — store your own structural summary only.',
  },
]

export const READING_RESOURCES = [
  {
    group: 'AI Illustration for KDP',
    slots: [
      {
        id: 'rr_ai_1',
        description:
          'Covers AI illustration for children’s picture books and KDP self-publishing (source rating: 4.9 stars).',
        title: '',
        author: '',
        link: '',
        rating: '4.9',
        reviewCount: '',
        dateChecked: '',
      },
    ],
  },
  {
    group: "Children's Book Self-Publishing Guides",
    slots: [
      {
        id: 'rr_cb_1',
        description:
          'Comprehensive writing/illustrating/publishing/marketing guide (4.6 stars, 1,275 reviews).',
        title: '',
        author: '',
        link: '',
        rating: '4.6',
        reviewCount: '1275',
        dateChecked: '',
      },
      {
        id: 'rr_cb_2',
        description:
          'Guide on niche research, keywords, hiring illustrators, and Amazon Ads for picture books.',
        title: '',
        author: '',
        link: '',
        rating: '',
        reviewCount: '',
        dateChecked: '',
      },
      {
        id: 'rr_cb_3',
        description:
          'Hands-on writing guide from story creation to publication (4.7 stars, 848 reviews).',
        title: '',
        author: '',
        link: '',
        rating: '4.7',
        reviewCount: '848',
        dateChecked: '',
      },
    ],
  },
  {
    group: 'Amazon KDP Publishing Guides',
    slots: [
      {
        id: 'rr_kdp_1',
        description: 'Up-to-date 2025 edition covering the full KDP process (4.4 stars).',
        title: '',
        author: '',
        link: '',
        rating: '4.4',
        reviewCount: '',
        dateChecked: '',
      },
      {
        id: 'rr_kdp_2',
        description: 'Guide covering formatting, marketing, and Amazon Ads (4.1 stars, 449 reviews).',
        title: '',
        author: '',
        link: '',
        rating: '4.1',
        reviewCount: '449',
        dateChecked: '',
      },
    ],
  },
]

export const COMMERCIAL_USE_STATEMENT = {
  mock:
    'Mock image provider (development): no commercial rights granted. Configure a production ImageProvider and paste its commercial-use terms here before selling books.',
  sourceIds: ['S23'],
}

export function configMap(values = CONFIG_VALUES) {
  return Object.fromEntries(values.map((c) => [c.key, c]))
}

export function fillPrompt(templateText, vars = {}) {
  return String(templateText || '').replace(/\{\{(\w+)\}\}/g, (_, k) =>
    vars[k] != null && vars[k] !== '' ? String(vars[k]) : `{{${k}}}`
  )
}
