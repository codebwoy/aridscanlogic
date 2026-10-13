/**
 * Launchpad Part A seed content — editable via admin/config APIs.
 * Source-traced; marketing/⚠ claims flagged in ConfigValue.verified_note.
 *
 * VIDEO_TUTORIALS / WORKFLOW_PLAYBOOKS distill public Neolemon tutorials + guides
 * (https://www.neolemon.com/tutorials/ and /guides/) into StoryForge-owned playbooks.
 * Craft library (Compass, DNA, styles, 7-day, multi-char, continuity) lives in craft-library.js.
 * Not affiliated with Neolemon — do not paste third-party prompts or video scripts.
 */

import { EDITOR_VARIATION_PLAYBOOKS } from './craft-library.js'

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
    tool: 'cover_studio',
    title: 'Cover from anchor',
    sourceIds: ['S4', 'S13', 'S68'],
    text:
      'Cover illustration of {{characterName}} from the pinned anchor, title-safe top area, {{emotionalCore}} mood, children’s picture book cover, no text in the image.',
  },
  {
    id: 'pt_prompt_formula',
    tool: 'character_turbo',
    title: 'Prompt formula — who + features + outfit + personality',
    sourceIds: ['S33', 'S5'],
    text:
      '{{characterName}}: a {{ageBand}} {{whoDescriptor}} with {{features}}, wearing {{outfit}}, {{personality}} personality, full-body front view on plain white background, children’s picture book cartoon, no text, no watermark.',
  },
  {
    id: 'pt_crayon_to_character',
    tool: 'photo_to_cartoon',
    title: 'Kid drawing → storybook character',
    sourceIds: ['S34', 'S8'],
    text:
      'Polish this hand-drawn children’s character into a clean storybook cartoon named {{characterName}}: keep the child’s design intent, full body, front-facing, plain white background, reusable across pages.',
  },
  {
    id: 'pt_bedtime_scene',
    tool: 'editor_pro',
    title: 'Bedtime scene from anchor',
    sourceIds: ['S35', 'S6'],
    text:
      'Using the pinned anchor of {{characterName}}, bedtime scene: {{sceneBrief}}. Soft evening lighting, calm {{emotionalCore}} mood, keep face/colours/outfit consistent, children’s picture book style.',
  },
  {
    id: 'pt_new_setting_from_anchor',
    tool: 'editor_pro',
    title: 'New setting — restart from anchor',
    sourceIds: ['S36', 'S6'],
    text:
      'Return to the pinned anchor of {{characterName}}. New setting only: {{sceneBrief}}. Do not continue from a previous scene image — fresh pose in the new place, same face and outfit rules.',
  },
  {
    id: 'pt_identity_block',
    tool: 'character_turbo',
    title: 'Identity block (from Character DNA)',
    sourceIds: ['S40', 'S5'],
    text:
      '{{characterName}}, {{ageBand}}, {{whoDescriptor}}, {{features}}, wearing {{outfit}}, {{styleLock}}, full body visible, neutral standing pose, plain white background, children’s picture book, no text, no watermark.',
  },
  {
    id: 'pt_multi_char_3part',
    tool: 'story_scene_pro',
    title: 'Multi-character — identity → position → action',
    sourceIds: ['S45', 'S7'],
    text:
      'Identity: {{characterName}} (matches pinned hero anchor) and {{secondCharacterName}} (matches second anchor). Position: {{characterName}} on the left, {{secondCharacterName}} on the right. Action: {{sceneBrief}}. Keep faces and outfits locked to each anchor. Children’s picture book style.',
  },
  {
    id: 'pt_action_change',
    tool: 'editor_action',
    title: 'Action change — same character',
    sourceIds: ['S52', 'S6'],
    text:
      'Same character {{characterName}} as pinned anchor, same outfit, same style. Change the action to: {{actionVerb}}, full body visible when possible.',
  },
  {
    id: 'pt_expression_change',
    tool: 'editor_expression',
    title: 'Expression change — same face rules',
    sourceIds: ['S46', 'S52'],
    text:
      'Same character {{characterName}}, same hairstyle, same outfit as pinned anchor. Change expression to: {{emotion}}, keep face proportions identical.',
  },
  {
    id: 'pt_style_lock',
    tool: 'editor_pro',
    title: 'Style lock reminder',
    sourceIds: ['S41', 'S40'],
    text:
      'Keep the exact same art style: {{styleLock}}. Same character {{characterName}} as pinned anchor. Scene: {{sceneBrief}}.',
  },
  {
    id: 'pt_cover_from_dna',
    tool: 'cover_studio',
    title: 'Cover — focal hero, title-safe',
    sourceIds: ['S42', 'S4', 'S68'],
    text:
      'Cover illustration of {{characterName}} from the pinned anchor, one clear focal point, {{emotionalCore}} mood, title-safe top third empty of critical detail, children’s picture book cover, no text in the image.',
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
      { id: 'qb1', title: 'Write emotional core + short manuscript', tool: null, courseStep: 2 },
      {
        id: 'qb1b',
        title: 'Generate theme-aware character name from book core + lock IP DNA',
        tool: 'character_name_ideas',
        courseStep: 2,
        sourceIds: ['S61'],
      },
      { id: 'qb2', title: 'Create Character Turbo anchor', tool: 'character_turbo', promptId: 'pt_anchor_fullbody' },
      { id: 'qb3', title: 'Generate pages in Editor Pro from anchor', tool: 'editor_pro', promptId: 'pt_scene_from_anchor' },
      { id: 'qb4', title: 'Layout in Canvas + export pages', tool: 'canvas', courseStep: 4 },
      {
        id: 'qb4b',
        title: 'Run publication readiness (print + continuity + copy + KDP Previewer sign-off)',
        tool: 'publication_readiness',
        courseStep: 4,
      },
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
  {
    id: 'recipe_crayon_character',
    title: 'Kid drawing → storybook character',
    estimatedTimeKey: 'quick_book_time_estimate',
    sourceIds: ['S34'],
    niche: 'crayon_to_character',
    steps: [
      {
        id: 'cr1',
        title: 'Photo to Cartoon from drawing (guardian consent if a child’s art)',
        tool: 'photo_to_cartoon',
        promptId: 'pt_crayon_to_character',
      },
      { id: 'cr2', title: 'Pin polished character as anchor', tool: 'character_turbo', promptId: 'pt_anchor_fullbody' },
      { id: 'cr3', title: 'Editor Pro scenes from the pinned anchor', tool: 'editor_pro', promptId: 'pt_scene_from_anchor' },
      { id: 'cr4', title: 'Canvas layout + page export', tool: 'canvas' },
    ],
  },
  {
    id: 'recipe_bedtime_personalised',
    title: 'Personalised bedtime story',
    estimatedTimeKey: 'quick_book_time_estimate',
    sourceIds: ['S35', 'S14'],
    niche: 'bedtime_personalised',
    steps: [
      { id: 'bt1', title: 'Plan emotional core + short bedtime manuscript', tool: null, courseStep: 2 },
      {
        id: 'bt2',
        title: 'Character Turbo or Photo to Cartoon (consent) → pin anchor',
        tool: 'character_turbo',
        promptId: 'pt_prompt_formula',
      },
      { id: 'bt3', title: 'Bedtime scenes from anchor (restart anchor on setting changes)', tool: 'editor_pro', promptId: 'pt_bedtime_scene' },
      { id: 'bt4', title: 'Canvas: fill bleed, add text, export each page', tool: 'canvas' },
      { id: 'bt5', title: 'KDP preflight + AI disclosure checklist', tool: null, courseStep: 5 },
    ],
  },
  {
    id: 'recipe_multi_character_masterclass',
    title: 'Multi-character picture book',
    estimatedTimeKey: 'quick_book_time_estimate',
    sourceIds: ['S37', 'S7'],
    niche: 'multi_character',
    steps: [
      { id: 'mc1', title: 'Break story into page beats before illustrating', tool: null, courseStep: 2 },
      { id: 'mc2', title: 'Character Turbo anchor for hero (+ second character)', tool: 'character_turbo', promptId: 'pt_anchor_fullbody' },
      { id: 'mc3', title: 'Single-character pages in Editor Pro from each anchor', tool: 'editor_pro', promptId: 'pt_scene_from_anchor' },
      { id: 'mc4', title: 'Two-character moments in Story Scene Pro', tool: 'story_scene_pro', promptId: 'pt_two_character' },
      { id: 'mc5', title: 'Canvas cover + interiors → export', tool: 'canvas' },
    ],
  },
  {
    id: 'recipe_kdp_print_ready',
    title: 'KDP print-ready (studio layout path)',
    estimatedTimeKey: 'quick_book_time_estimate',
    sourceIds: ['S38', 'S11', 'S68'],
    niche: 'kdp_print_ready',
    steps: [
      { id: 'kp1', title: 'Pin Character Turbo / Photo-to-Cartoon anchor', tool: 'character_turbo', promptId: 'pt_anchor_fullbody' },
      { id: 'kp2', title: 'Generate all pages from the anchor', tool: 'editor_pro', promptId: 'pt_scene_from_anchor' },
      { id: 'kp3', title: 'Canvas at KDP trim + bleed; fill page; export PNGs', tool: 'canvas' },
      {
        id: 'kp3b',
        title: 'Publication readiness score + continuity QC + KDP Previewer sign-off',
        tool: 'publication_readiness',
        sourceIds: ['S60'],
      },
      {
        id: 'kp3c',
        title: 'Cover Studio: title-safe art + KDP wrap PDF (BACK|SPINE|FRONT)',
        tool: 'cover_studio',
        sourceIds: ['S68', 'S54'],
      },
      { id: 'kp4', title: 'Interior PDF + Finish pack checklist (no unofficial Amazon upload)', tool: null, courseStep: 5 },
    ],
  },
  {
    id: 'recipe_seven_day_launch',
    title: '7-day idea → launch skeleton',
    estimatedTimeKey: 'quick_book_time_estimate',
    sourceIds: ['S44'],
    niche: 'seven_day',
    steps: [
      { id: 'sd1', title: 'Day 1–2: market + Storytelling Compass + draft', tool: null, courseStep: 2 },
      { id: 'sd2', title: 'Day 3: Character DNA → Turbo/Photo anchor → pin', tool: 'character_turbo', promptId: 'pt_identity_block' },
      { id: 'sd3', title: 'Day 3: scenes from anchor (+ multi-char if needed)', tool: 'editor_pro', promptId: 'pt_scene_from_anchor' },
      { id: 'sd4', title: 'Day 4: Canvas trim/bleed + export', tool: 'canvas' },
      { id: 'sd5', title: 'Day 5–7: listing, disclosure, launch notes', tool: null, courseStep: 5 },
    ],
  },
  {
    id: 'recipe_coloring_from_story',
    title: 'Coloring pages from story art',
    estimatedTimeKey: 'quick_book_time_estimate',
    sourceIds: ['S50', 'S34'],
    niche: 'coloring_pages',
    steps: [
      { id: 'cl1', title: 'Finish color story pages from pinned anchor', tool: 'editor_pro', promptId: 'pt_scene_from_anchor' },
      { id: 'cl2', title: 'Derive line-art / coloring versions from approved pages', tool: 'editor_pro' },
      { id: 'cl3', title: 'Canvas export clean B&W interiors; honest listing copy', tool: 'canvas' },
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
  {
    id: 'guide_consistency_masterclass',
    slug: 'character-consistency-masterclass',
    title: 'Same character on every page',
    niche: 'consistency',
    recipeId: 'recipe_multi_character_masterclass',
    sourceIds: ['S33', 'S37'],
    body:
      'Consistency is the hard problem of AI children’s books. Design the hero once (full-body front white-bg anchor), then generate every page from that pinned anchor. Change pose, expression, outfit, and background — not the face identity. For multi-character stories, pin each cast member, then use Story Scene Pro for shared moments.',
    timingAdvice: [],
    publishByDefault: '',
    marketData: [],
    trendsQuery: 'childrens picture book',
    trendsUrl: 'https://trends.google.com/trends/explore?q=childrens%20picture%20book',
    userTrendNote: '',
  },
  {
    id: 'guide_crayon_to_character',
    slug: 'kids-drawing-to-character',
    title: 'Kid drawing → storybook character',
    niche: 'crayon_to_character',
    recipeId: 'recipe_crayon_character',
    sourceIds: ['S34'],
    body:
      'Turn a hand-drawn kid character into a polished, reusable storybook hero. Use Photo to Cartoon (or a drawing reference) with guardian consent when the art belongs to a child, pin the result as the anchor, then illustrate pages from that anchor. Great for gift books, coloring pages, and classroom-style projects.',
    personalisationWarning:
      'If the drawing is a child’s work, record guardian consent before processing. KDP still gets one listing — not per-order unique drawings.',
    timingAdvice: [],
    publishByDefault: '',
    marketData: [],
    trendsQuery: 'personalized childrens book',
    trendsUrl: 'https://trends.google.com/trends/explore?q=personalized%20childrens%20book',
    userTrendNote: '',
  },
  {
    id: 'guide_bedtime_personalised',
    slug: 'personalised-bedtime-story',
    title: 'Personalised bedtime story',
    niche: 'bedtime_personalised',
    recipeId: 'recipe_bedtime_personalised',
    sourceIds: ['S35', 'S14'],
    body:
      'Calm bedtime books work best with one consistent character, soft lighting, and short page beats. Plan the emotional core first, pin the hero, generate evening scenes from the anchor (restart from the anchor when the setting changes), then compose in Canvas for KDP.',
    personalisationWarning:
      'Personalised names/photos = one uploaded title. Do not promise Amazon will print a unique book per customer order.',
    timingAdvice: [],
    publishByDefault: '',
    marketData: [],
    trendsQuery: 'bedtime story book for kids',
    trendsUrl: 'https://trends.google.com/trends/explore?q=bedtime%20story%20book%20for%20kids',
    userTrendNote: '',
  },
  {
    id: 'guide_kdp_print_ready_studio',
    slug: 'kdp-print-ready-studio',
    title: 'KDP print-ready in StoryForge',
    niche: 'kdp_print_ready',
    recipeId: 'recipe_kdp_print_ready',
    sourceIds: ['S38', 'S11', 'S30', 'S68'],
    body:
      'End-to-end print path inside StoryForge: pin anchor → scene pages → Canvas at official trim/bleed → Cover Studio (title-safe art + wrap PDF) → publication readiness score (print + continuity + copy + KDP Previewer sign-off) → export → KDP upload checklist. External layout tools (e.g. Canva) are optional polish; StoryForge Canvas / Cover Studio is the first-party path. No unofficial Amazon upload automation. Readiness is a checklist measure — not Amazon approval. Always re-check wrap size in the Amazon KDP cover calculator (G201953020).',
    timingAdvice: [],
    publishByDefault: '',
    marketData: [],
    trendsQuery: 'amazon kdp childrens book',
    trendsUrl: 'https://trends.google.com/trends/explore?q=amazon%20kdp%20childrens%20book',
    userTrendNote: '',
  },
  {
    id: 'guide_craft_library',
    slug: 'craft-library',
    title: 'Craft library (Compass → DNA → continuity)',
    niche: 'craft',
    recipeId: 'recipe_seven_day_launch',
    sourceIds: ['S39', 'S40', 'S41', 'S44', 'S47'],
    body:
      'Open the Craft tab for Storytelling Compass, Character DNA, art-style lock, cover rules, 7-day skeleton, multi-character prompting, expression arcs, and two-pass continuity QC. Distilled from public children’s-book / consistency teaching themes — not third-party scripts.',
    timingAdvice: [],
    publishByDefault: '',
    marketData: [],
    trendsQuery: 'childrens book illustration',
    trendsUrl: 'https://trends.google.com/trends/explore?q=childrens%20book%20illustration',
    userTrendNote: '',
  },
  {
    id: 'guide_coloring_from_story',
    slug: 'coloring-from-story',
    title: 'Coloring pages from story art',
    niche: 'coloring_pages',
    recipeId: 'recipe_coloring_from_story',
    sourceIds: ['S50'],
    body:
      'Derive print-ready coloring pages from approved color story art so the character stays consistent. Export clean line on white; be honest in the listing about B&W vs color interiors. Pair with Amazon Hub low/medium-content playbooks for listing structure.',
    timingAdvice: [],
    publishByDefault: '',
    marketData: [],
    trendsQuery: 'kids coloring book',
    trendsUrl: 'https://trends.google.com/trends/explore?q=kids%20coloring%20book',
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
      'Fill Storytelling Compass (Craft tab) before page beats',
      'Generate theme-aware character name ideas from emotional core + culture (IP Builder)',
      'Plan page turns — words and images as a duet',
      'Keep text per page minimal; aim for rhyme or rhythm',
      'Stay inside age word-count band (Craft → Age lengths)',
      'Add structure notes for reference book “The Koala Who Could” (your notes only — no copyrighted text)',
    ],
  },
  {
    id: 3,
    key: 'illustrate',
    title: 'Illustrate using AI',
    sourceIds: ['S28', 'S40', 'S45', 'S47', 'S61'],
    checklist: [
      'Write Character DNA (Craft tab) — lock never-change traits',
      'Generate theme-aware name ideas from emotional core + culture, then pick one',
      'Lock one art style for the whole book',
      'Create character in Character Turbo (full body, front, white background — default pose)',
      'Or Photo to Cartoon / kid-drawing polish first (guardian consent when required)',
      'Download / pin the anchor image before any scenes',
      'Build a small pose + expression pack from the anchor',
      'Generate each page in Editor Pro from the pinned anchor (action + place)',
      'When the story moves to a new setting: restart from the anchor — do not chain a new place onto an old scene',
      'Multi-character: identity → position → action (Story Scene Pro); separate anchors per cast member',
      'Run two-pass continuity QC (Craft tab) before export',
      'Watch Tutorials tab videos for end-to-end consistency walkthroughs (external; optional)',
    ],
  },
  {
    id: 4,
    key: 'layout',
    title: 'Layout & design',
    sourceIds: ['S29', 'S38', 'S60', 'S68'],
    checklist: [
      'Open Canvas',
      'Set trim 8.5×11 portrait or 8.5×8.5 square (or project trim)',
      'Prefer backgrounds first, then place character layers',
      'Expand / fill art to the page (full bleed OK for many KDP picture books)',
      'Add story text; adjust font size for readability',
      'Add speech bubbles if needed',
      'Cover Studio: pin Character Turbo → generate title-safe cover art → Export cover wrap PDF',
      'Run Publication readiness (print + continuity QC + copy lint + KDP Previewer sign-off)',
      'Export pages / finish pack only after addressing readiness blocks',
    ],
  },
  {
    id: 5,
    key: 'upload',
    title: 'Upload to Amazon KDP',
    sourceIds: ['S30', 'S60', 'S67', 'S68'],
    checklist: [
      'Confirm publication readiness score in Studio → Canvas (checklist only — not Amazon approval)',
      'Review publication-readiness.json inside the KDP ZIP pack',
      'Build/edit the 5-part KDP description in Studio → Canvas (hook, promise, SEL, real review only, CTA) — copy into the listing',
      'Cover Studio wrap PDF ready — re-check size in Amazon KDP cover calculator (G201953020) before upload',
      'Before upload: ScanLogic Amazon Hub → First-time publisher truths (ISBN plan, pricing band, tax/Freiberufler orientation)',
      'Go to kdp.amazon.com',
      'Set title, description, keywords, categories',
      'Upload interior PDF and cover wrap PDF (BACK|SPINE|FRONT)',
      'Disclose AI-generated content if applicable',
      'Set your price (see royalty config + Hub pricing guidance ⚠)',
      'Final check in Amazon KDP Online Previewer before publishing',
    ],
  },
  {
    id: 6,
    key: 'optimise',
    title: 'Optimise after launch',
    sourceIds: ['S31'],
    checklist: [
      'Read ScanLogic Amazon Hub → First-time publisher truths (ecosystem, distribution, pricing, schools, reviews, DE tax) before scaling ads',
      'Research niches using owner-entered BSR data (guides)',
      'Apply seasonal timing (e.g. back to school → July)',
      'If publishing a character book: apply Merch + plan 10 researched designs (see Merch guide)',
      'Link Author Central ↔ book back matter ↔ Merch (Amazon Hub brand-loop playbook)',
      'Gather reviews (compliant methods only) — plan ~10–15 genuine early reviews; never buy fakes',
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
  'Fill the Storytelling Compass (Character → Context → Challenge → Choices → Change) before illustrating',
  'Ages ~3–5: about 200–500 words; ages ~5–8: about 500–1000 — adjust to format',
  'Map an expression / emotion beat sheet before mass-generating faces',
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

/**
 * Public video catalogue from https://www.neolemon.com/tutorials/ (YouTube).
 * Titles/descriptions are public listing metadata — StoryForge maps each to our tools.
 * ⚠ Third-party product; may upsell. Watch on YouTube; build inside StoryForge.
 */
export const VIDEO_TUTORIALS = [
  {
    id: 'vt_masterclass',
    youtubeId: 'h6NSbAXkzUk',
    title: 'How to Make a Children’s Book with AI: Full Masterclass (Same Characters on Every Page)',
    summary:
      'End-to-end illustrated children’s book with one consistent character on every page.',
    storyforgePath:
      'Character Turbo → pin anchor → Editor Pro pages → Canvas → KDP checklist (Quick Book / multi-character recipe).',
    recipeId: 'recipe_quick_book',
    guideId: 'guide_consistency_masterclass',
    sourceIds: ['S33'],
    url: 'https://www.youtube.com/watch?v=h6NSbAXkzUk',
    pageAnchor: 'https://www.neolemon.com/tutorials/#h6NSbAXkzUk',
  },
  {
    id: 'vt_photo_to_cartoon',
    youtubeId: 'ShbVrXRqEJI',
    title: 'Turn Your Kids Photos into Cartoon Characters with AI',
    summary: 'Photo → reusable cartoon character for a whole story.',
    storyforgePath: 'Photo to Cartoon (guardian consent) → pin as anchor → Editor Pro.',
    recipeId: 'recipe_personalised_baby',
    guideId: 'guide_personalised_baby',
    sourceIds: ['S8', 'S14'],
    url: 'https://www.youtube.com/watch?v=ShbVrXRqEJI',
    pageAnchor: 'https://www.neolemon.com/tutorials/#ShbVrXRqEJI',
  },
  {
    id: 'vt_crayon',
    youtubeId: 'nDd4otuMIeo',
    title: 'I Turned a Kid’s Crayon Drawing Into a Storybook Character in 5 Minutes',
    summary: 'Hand-drawn kid art polished into a storybook-ready character.',
    storyforgePath: 'Drawing reference via Photo to Cartoon → pin → scenes (crayon recipe).',
    recipeId: 'recipe_crayon_character',
    guideId: 'guide_crayon_to_character',
    sourceIds: ['S34'],
    url: 'https://www.youtube.com/watch?v=nDd4otuMIeo',
    pageAnchor: 'https://www.neolemon.com/tutorials/#nDd4otuMIeo',
  },
  {
    id: 'vt_personalised_book',
    youtubeId: '4PQ5mT5wJ-M',
    title: 'How to Make a Personalized Children’s Book with AI (Same Character, Every Page)',
    summary: 'Personalised book where the same character appears on every page.',
    storyforgePath: 'Photo/Turbo anchor → Editor Pro → Canvas; one KDP listing per unique book.',
    recipeId: 'recipe_personalised_baby',
    guideId: 'guide_personalised_baby',
    sourceIds: ['S14', 'S15'],
    url: 'https://www.youtube.com/watch?v=4PQ5mT5wJ-M',
    pageAnchor: 'https://www.neolemon.com/tutorials/#4PQ5mT5wJ-M',
  },
  {
    id: 'vt_pro_illustrations',
    youtubeId: '0LdEyBbx0Bk',
    title: 'How To Create Professional AI Illustrations for Children’s Book With Character Consistency',
    summary: 'Professional-looking pages while keeping the character consistent in every scene.',
    storyforgePath:
      'Clear Character Turbo description → pin → Editor Pro with new-setting-from-anchor when locations change.',
    recipeId: 'recipe_quick_book',
    guideId: 'guide_consistency_masterclass',
    sourceIds: ['S33', 'S36'],
    url: 'https://www.youtube.com/watch?v=0LdEyBbx0Bk',
    pageAnchor: 'https://www.neolemon.com/tutorials/#0LdEyBbx0Bk',
  },
  {
    id: 'vt_kdp_canva_2026',
    youtubeId: 'hdibSPA8n3w',
    title: 'How to Create a Children’s Book for KDP Amazon using Neolemon AI & Canva (2026 Guide)',
    summary: 'Print-ready children’s book for Amazon KDP (external layout tools optional).',
    storyforgePath:
      'StoryForge Canvas is the first-party layout path (Canva optional). Follow KDP print-ready recipe + disclosure.',
    recipeId: 'recipe_kdp_print_ready',
    guideId: 'guide_kdp_print_ready_studio',
    sourceIds: ['S38', 'S30'],
    url: 'https://www.youtube.com/watch?v=hdibSPA8n3w',
    pageAnchor: 'https://www.neolemon.com/tutorials/#hdibSPA8n3w',
  },
  {
    id: 'vt_bedtime',
    youtubeId: 'pA-iWAKq0Oc',
    title: 'Create a Personalized Bedtime Story Book with AI (Same Character, Every Page)',
    summary: 'Bedtime story starring one consistent character.',
    storyforgePath: 'Bedtime recipe: plan → pin → soft evening scenes → Canvas → KDP.',
    recipeId: 'recipe_bedtime_personalised',
    guideId: 'guide_bedtime_personalised',
    sourceIds: ['S35'],
    url: 'https://www.youtube.com/watch?v=pA-iWAKq0Oc',
    pageAnchor: 'https://www.neolemon.com/tutorials/#pA-iWAKq0Oc',
  },
]

/** StoryForge-owned workflow lessons distilled from public tool guides (not vendor scripts). */
export const WORKFLOW_PLAYBOOKS = [
  {
    id: 'wf_character_turbo',
    tool: 'character_turbo',
    title: 'Character Turbo — pin a reusable hero',
    sourceIds: ['S5', 'S33'],
    bullets: [
      'Write a clear who + features + outfit + personality description (prompt formula template).',
      'Default Advanced Options that travel well: full body, front view, standing, plain white background.',
      'Generate, pick the strongest face, then pin that image as the project anchor before any scenes.',
      'Regenerate or simplify details if the face drifts — do not start page art until the anchor is locked.',
    ],
  },
  {
    id: 'wf_editor_pro',
    tool: 'editor_pro',
    title: 'Editor Pro — scenes from the pinned anchor',
    sourceIds: ['S6', 'S36'],
    bullets: [
      'Always start from the pinned anchor, not from a previous scene thumbnail.',
      'Describe one change at a time: action + place.',
      'Stay in one setting until that beat is done; when the story moves, restart from the anchor so old backgrounds do not ghost into the new place.',
      'Keep face, hair, and outfit rules consistent with the anchor unless the story explicitly changes clothes.',
    ],
  },
  {
    id: 'wf_story_scene_pro',
    tool: 'story_scene_pro',
    title: 'Story Scene Pro — multi-character pages',
    sourceIds: ['S7', 'S37'],
    bullets: [
      'Create and pin each character separately first.',
      'Combine anchors in Story Scene Pro for shared moments — do not cram four characters into a single freeform prompt.',
      'Keep object/background references secondary to character identity.',
    ],
  },
  {
    id: 'wf_photo_to_cartoon',
    tool: 'photo_to_cartoon',
    title: 'Photo / drawing → cartoon anchor',
    sourceIds: ['S8', 'S14', 'S34'],
    bullets: [
      'Guardian consent is required before processing a child’s photo or artwork.',
      'Generate a full-body front white-bg cartoon, then pin it as the Character Turbo-equivalent anchor.',
      'Kid crayon drawings use the same consent + pin path, then Editor Pro for story pages.',
    ],
  },
  {
    id: 'wf_canvas',
    tool: 'canvas',
    title: 'Canvas — compose print pages',
    sourceIds: ['S9', 'S29', 'S38'],
    bullets: [
      'Set the project trim before placing art.',
      'Build in layers: background, then character, then text / speech bubbles.',
      'Fill toward full page / bleed when the print format allows.',
      'Export each page, then clear the canvas for the next — keeps files KDP-clean.',
    ],
  },
  ...EDITOR_VARIATION_PLAYBOOKS,
]

export const TUTORIALS_META = {
  lastVerified: '2026-10-11',
  catalogueUrl: 'https://www.neolemon.com/tutorials/',
  channelUrl: 'https://www.youtube.com/@neolemonapp',
  independenceNote:
    '⚠ Not affiliated with Neolemon. Tutorials are third-party videos that may promote paid plans. StoryForge maps the learning goals to our own tools; we do not embed their prompts or claim their commercial terms.',
}

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
