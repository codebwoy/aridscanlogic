/**
 * StoryForge craft library — distilled from public children’s-book + consistency
 * education (incl. Neolemon guides/blog themes at neolemon.com).
 * Original StoryForge wording. Not affiliated. No third-party prompts/scripts pasted.
 * Legal/pricing pages of third parties are NOT imported as StoryForge policy.
 */

import { ipCharacterPayload } from './ip-character.js'

export const CRAFT_META = {
  lastVerified: '2026-10-11',
  independenceNote:
    '⚠ Craft lessons are StoryForge-owned distillations of public teaching themes (including Neolemon.com guides/blog). Not affiliated. Third-party pricing, ToS, Privacy, and Refund pages are theirs — StoryForge has its own credits, disclosure helper, and SECURITY.md.',
  catalogueUrls: {
    guides: 'https://www.neolemon.com/guides/',
    tutorials: 'https://www.neolemon.com/tutorials/',
    blog: 'https://www.neolemon.com/blog',
    home: 'https://www.neolemon.com/',
  },
}

/** 5-step planning before any generation. */
export const STORYTELLING_COMPASS = {
  id: 'storytelling_compass',
  title: 'Storytelling Compass (plan before you generate)',
  sourceIds: ['S39'],
  steps: [
    {
      id: 'character',
      label: 'Character',
      prompt: 'Who is the hero in one sentence? What must never change (silhouette, face landmarks, outfit)?',
    },
    {
      id: 'context',
      label: 'Context',
      prompt: 'Where and when does the story live? What world rules stay constant?',
    },
    {
      id: 'challenge',
      label: 'Challenge',
      prompt: 'What problem or fear does the hero face?',
    },
    {
      id: 'choices',
      label: 'Choices',
      prompt: 'What attempts or decisions create page-turn tension?',
    },
    {
      id: 'change',
      label: 'Change',
      prompt: 'How has the hero grown by the last page?',
    },
  ],
  note: 'Fill all five before Character Turbo. Images cannot fix a hollow arc.',
}

/** Human-authored identity sheet — lock before scenes. */
export const CHARACTER_DNA_FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age / age band' },
  { key: 'archetype', label: 'Role / archetype' },
  { key: 'silhouette', label: 'Silhouette (big shapes)' },
  { key: 'faceLandmarks', label: 'Face landmarks' },
  { key: 'hair', label: 'Hair (shape + color + texture)' },
  { key: 'skinOrFur', label: 'Skin / fur / markings' },
  { key: 'signatureOutfit', label: 'Signature outfit' },
  { key: 'styleRules', label: 'Style rules (2D/3D, line, shading, palette)' },
  { key: 'neverChange', label: 'Never change (3–5 locked traits)' },
  { key: 'allowedToChange', label: 'Allowed to change (pose, expression, background…)' },
]

export const CHARACTER_DNA_GUIDE = {
  id: 'character_dna',
  title: 'Character DNA (lock identity before scenes)',
  sourceIds: ['S40'],
  fields: CHARACTER_DNA_FIELDS,
  bullets: [
    'Write DNA in your own words before generating — this is human authorship scaffolding.',
    'Generate one full-body, front-facing, plain white-background anchor that matches the DNA.',
    'Build a tiny pose pack + expression pack from that anchor before full page production.',
    'Keep Identity blocks separate from Action / Scene blocks so prompts do not drift.',
    'Document your process (DNA + anchor + edits) for provenance; do not assume copyright on pure AI output.',
  ],
}

/** Pick one style early; do not mix mid-book. */
export const ART_STYLES = [
  { id: 'watercolor', label: 'Watercolor', bestFor: 'Gentle, nature, ages ~0–8' },
  { id: 'collage', label: 'Collage / textured', bestFor: 'Bold tactile looks, ages ~2–7' },
  { id: 'line', label: 'Pencil / ink / line', bestFor: 'High-energy motion, ages ~4–10' },
  { id: 'flat_cartoon', label: 'Cartoon / flat digital', bestFor: 'Comedy + easiest consistency, ages ~2–8' },
  { id: 'digital_paint', label: 'Digital painting', bestFor: 'Fantasy / atmosphere, ages ~3–10' },
  { id: 'realistic', label: 'Realistic', bestFor: 'Nonfiction / historical authority, ages ~5–12' },
  { id: 'abstract', label: 'Abstract', bestFor: 'Conceptual / experimental, ages ~2–7' },
  { id: 'pixar_3d', label: '3D / cinematic cartoon', bestFor: 'World-building & action, ages ~3–10' },
  { id: 'anime', label: 'Anime / manga-inspired', bestFor: 'Expressive emotion, ages ~5–12' },
  { id: 'clay', label: 'Claymation / tactile', bestFor: 'Sensory-rich, ages ~2–6' },
  { id: 'mixed', label: 'Mixed media', bestFor: 'Layered uniqueness, ages ~3–10' },
]

export const ART_STYLE_GUIDE = {
  id: 'art_styles',
  title: 'Lock one art style for the whole book',
  sourceIds: ['S41'],
  styles: ART_STYLES,
  chooseBy: [
    'Emotional register of the story',
    'Child reader vs adult buyer expectations',
    'How many illustrations you need',
    'Production path (AI-assisted vs hand)',
    'Market comps vs intentional differentiation',
  ],
  note: 'Changing style mid-project is a top cause of “inconsistent” books.',
}

export const COVER_DESIGN_RULES = {
  id: 'cover_design',
  title: 'Children’s book cover that sells',
  sourceIds: ['S42', 'S68'],
  bullets: [
    'Covers drive click decisions — plan cover after the character is locked, not before DNA exists.',
    'Serve a dual audience: fun for kids, professional and age-appropriate for parents.',
    'One strong focal point (usually the hero) beats cluttered scenes at thumbnail size.',
    'Warm / bright palettes read “kids”; keep title type large and readable on mobile.',
    'Series: keep visual identity consistent across covers so browsers recognize your brand.',
    'Generate cover art from the pinned anchor; leave title-safe space (no text baked into the image).',
    'Use Cover Studio (Canvas): layout mood → generate_cover_art → typography overlay → KDP wrap PDF (BACK|SPINE|FRONT).',
  ],
  note: 'Third-party “57% / 80% / 35%” stats are marketing anecdotes — treat as motivation, not verified research. Verify wrap size in Amazon KDP cover calculator (G201953020).',
}

export const AGE_WORD_COUNTS = {
  id: 'age_word_counts',
  title: 'Manuscript length by age band',
  sourceIds: ['S43'],
  rows: [
    { ages: '3–5', words: 'about 200–500', notes: 'Minimal text; images carry half the story' },
    { ages: '5–8', words: 'about 500–1000', notes: 'Still picture-led; clearer plot beats' },
    { ages: 'Board 0–3', words: 'very few words / labels', notes: 'Ultra-simple; thick-page formats' },
  ],
}

export const SEVEN_DAY_PLAN = {
  id: 'seven_day_plan',
  title: '7-day idea → launch skeleton',
  sourceIds: ['S44'],
  days: [
    { day: 1, title: 'Market research', tasks: ['Scan Amazon age/category comps', 'Note pain points (bedtime, emotions, school)', 'Pick one niche + age band'] },
    {
      day: 2,
      title: 'Story draft',
      tasks: [
        'Fill Storytelling Compass',
        'Draft page beats for ~24–32 pages',
        'Stay inside age word-count band',
        'Generate theme-aware character name from emotional core',
      ],
    },
    {
      day: 3,
      title: 'Character + scenes',
      tasks: [
        'Lock IP DNA with chosen name',
        'Pin Character Turbo / Photo-to-Cartoon anchor',
        'Generate pages from anchor',
      ],
    },
    {
      day: 4,
      title: 'Format + export',
      tasks: [
        'Canvas at KDP trim/bleed',
        'Upscale for print if needed (300 DPI target)',
        'Publication readiness score + continuity QC',
        'Interior + cover export checklist',
      ],
    },
    { day: 5, title: 'Listing setup', tasks: ['Title/subtitle/keywords/categories', 'Description + A+ plan', 'AI disclosure decision'] },
    { day: 6, title: 'Soft launch prep', tasks: ['Author Central', 'Compliant early readers plan', 'Optional short ads budget'] },
    { day: 7, title: 'Launch + learn', tasks: ['Publish', 'Watch BSR/orders', 'Note one fix for book 2'] },
  ],
  note: '⚠ “7 days” is a teaching skeleton — quality and KDP review times vary. Do not treat as a guarantee.',
}

export const MULTI_CHARACTER_METHOD = {
  id: 'multi_character_method',
  title: 'Multi-character scenes (3-part prompts)',
  sourceIds: ['S45'],
  bullets: [
    'Create a separate full-body front white-bg anchor for every cast member first.',
    'Never rely on one mega-prompt to invent a whole cast — identities will swap.',
    'Part 1 — Identity: name each character and link to their visual landmarks / anchor.',
    'Part 2 — Position: place them in space (left/right/behind) before any action.',
    'Part 3 — Action: give each character a distinct verb; avoid ambiguous “they”.',
    'Use Story Scene Pro for shared moments; Editor Pro to fix one character at a time.',
  ],
}

export const EXPRESSION_ARC = {
  id: 'expression_arc',
  title: 'Emotion / expression arc',
  sourceIds: ['S46'],
  hierarchy: [
    { id: 'primary', label: 'Primary emotions', tip: 'Full unambiguous beats (joy, fear, shock) for major turns' },
    { id: 'transitional', label: 'Transitional', tip: 'In-between states that show the shift (half-worried → hopeful)' },
    { id: 'micro', label: 'Micro-expressions', tip: 'Small brow/mouth cues for quieter pages' },
  ],
  acts: [
    { act: 1, label: 'Baseline', tip: 'Establish default mood before the challenge' },
    { act: 2, label: 'Oscillation', tip: 'Map challenge pages to clear expression changes' },
    { act: 3, label: 'Resolved growth', tip: 'End expression should show earned change' },
  ],
}

export const CONTINUITY_CHECKLIST = {
  id: 'continuity_checklist',
  title: 'Two-pass continuity QC',
  sourceIds: ['S47'],
  passes: [
    {
      id: 'pass_a',
      title: 'Pass A — Identity',
      items: [
        'Face landmarks match the anchor',
        'Hair / markings unchanged unless story says so',
        'Signature outfit colors match DNA',
        'Art style lock still holds (line, shading, palette)',
      ],
    },
    {
      id: 'pass_b',
      title: 'Pass B — Story craft',
      items: [
        'Expression matches the emotional beat sheet',
        'Camera / crop readable at thumbnail',
        'No accidental extra characters or morphing props',
        'Page turn still clear when text is added in Canvas',
      ],
    },
  ],
}

export const CHARACTER_DESIGN_PRINCIPLES = {
  id: 'character_design_principles',
  title: '7 principles of memorable character design',
  sourceIds: ['S48'],
  principles: [
    { id: 'one_idea', label: 'One clear idea', tip: 'Reduce the hero to a single simple sentence' },
    { id: 'silhouette', label: 'Silhouette readability', tip: 'Must read as a black shape at tiny size' },
    { id: 'shape', label: 'Shape language', tip: 'Circles / squares / triangles signal personality' },
    { id: 'exaggeration', label: 'Purposeful exaggeration', tip: 'Proportions emphasize traits, not noise' },
    { id: 'color', label: 'Controlled color & value', tip: 'Few strong colors; clear focal hierarchy' },
    { id: 'emotion', label: 'Emotion legibility', tip: 'Feelings readable without dialogue' },
    { id: 'repeat', label: 'Repeatability', tip: 'Easy to redraw in many poses without collapse' },
  ],
}

export const CAMERA_AND_BODY_TIPS = {
  id: 'camera_body_age',
  title: 'Camera, body type, and age cues',
  sourceIds: ['S49'],
  bullets: [
    'Pick a default camera early (eye-level medium for most picture books); change on purpose, not by accident.',
    'Describe body type with silhouette words (short/round, tall/skinny) inside DNA — not only in scene prompts.',
    'Age cues: keep proportions stable across pages; do not age the child up/down mid-book.',
    'Wide establishing shots for new places; closer shots for emotional peaks.',
  ],
}

export const COLORING_PAGE_WORKFLOW = {
  id: 'coloring_from_scenes',
  title: 'Coloring pages from story art',
  sourceIds: ['S50'],
  bullets: [
    'Finish the color story pages first from the pinned anchor.',
    'Derive line-art / coloring versions from approved pages (do not invent a new inconsistent character).',
    'Export clean black line on white for print; be honest in the listing about B&W vs color interiors.',
    'Optional path: Amazon Hub low/medium-content playbooks for listing A+ and categories.',
  ],
}

export const KDP_EARNINGS_REALISM = {
  id: 'kdp_earnings_realism',
  title: 'KDP earnings realism (⚠)',
  sourceIds: ['S51'],
  bullets: [
    'Income = copies × royalty − costs (ads, tools, time). There is no guaranteed children’s-book income.',
    'Many self-published titles sell few lifetime copies; treat “first week $X” stories as anecdotes.',
    'Catalog + series + Merch/school visits often matter more than one hero title.',
    'Verify current Kindle 70% / 35% tiers and print costs in the live KDP calculator — do not hardcode royalties.',
  ],
  note: '⚠ Third-party blog income figures are not StoryForge guarantees. Cross-check Amazon KDP Help.',
}

/** Preset chips for Studio Action / Expression / Outfit / Background editors. */
export const EDITOR_VARIATION_PRESETS = {
  editor_action: [
    { id: 'wave', label: 'Waving', brief: 'standing and waving hello cheerfully' },
    { id: 'run', label: 'Running', brief: 'running joyfully with arms out' },
    { id: 'jump', label: 'Jumping', brief: 'jumping in the air with excitement' },
    { id: 'sit', label: 'Sitting', brief: 'sitting calmly on the ground' },
    { id: 'reach', label: 'Reaching', brief: 'reaching up toward something wonderful' },
    { id: 'hug', label: 'Hugging', brief: 'giving a warm friendly hug' },
    { id: 'dance', label: 'Dancing', brief: 'dancing with happy energy' },
    { id: 'sleep', label: 'Sleeping', brief: 'lying down sleeping peacefully' },
  ],
  editor_expression: [
    { id: 'happy', label: 'Happy', brief: 'happy smiling face, bright eyes' },
    { id: 'sad', label: 'Sad', brief: 'gentle sad expression, soft eyes' },
    { id: 'surprised', label: 'Surprised', brief: 'surprised wide eyes and open mouth' },
    { id: 'excited', label: 'Excited', brief: 'excited sparkling eyes and big smile' },
    { id: 'worried', label: 'Worried', brief: 'worried brows, uncertain mouth' },
    { id: 'brave', label: 'Brave', brief: 'brave determined expression' },
    { id: 'curious', label: 'Curious', brief: 'curious tilted head, interested eyes' },
    { id: 'sleepy', label: 'Sleepy', brief: 'sleepy half-closed eyes, soft smile' },
  ],
  editor_outfit: [
    { id: 'pajamas', label: 'Pajamas', brief: 'wearing cozy bedtime pajamas' },
    { id: 'school', label: 'School clothes', brief: 'wearing neat school clothes' },
    { id: 'adventure', label: 'Adventure gear', brief: 'wearing adventure outdoor clothes and boots' },
    { id: 'rain', label: 'Raincoat', brief: 'wearing a bright raincoat and boots' },
    { id: 'party', label: 'Party outfit', brief: 'wearing a festive party outfit' },
    { id: 'winter', label: 'Winter coat', brief: 'wearing a warm winter coat and scarf' },
  ],
  editor_background: [
    { id: 'bedroom', label: 'Bedroom', brief: 'in a cozy child bedroom at bedtime' },
    { id: 'park', label: 'Park', brief: 'in a sunny playground park' },
    { id: 'forest', label: 'Forest', brief: 'in a magical friendly forest clearing' },
    { id: 'schoolyard', label: 'Schoolyard', brief: 'in a cheerful schoolyard' },
    { id: 'beach', label: 'Beach', brief: 'on a bright sandy beach by the sea' },
    { id: 'city', label: 'City street', brief: 'on a friendly city sidewalk' },
  ],
}

export const EDITOR_VARIATION_PLAYBOOKS = [
  {
    id: 'wf_action_editor',
    title: 'Action / pose variations',
    tool: 'editor_action',
    sourceIds: ['S52', 'S62'],
    bullets: [
      'Always start from the pinned anchor or an approved page of the same character.',
      'Change one verb phrase at a time (walking, sitting, jumping) while locking outfit and face.',
      'Prefer full-body visibility for picture-book clarity unless the beat needs a close-up.',
    ],
    presets: EDITOR_VARIATION_PRESETS.editor_action,
  },
  {
    id: 'wf_expression_editor',
    title: 'Expression variations',
    tool: 'editor_expression',
    sourceIds: ['S46', 'S52', 'S62'],
    bullets: [
      'Keep hairstyle and outfit fixed; change eyes / mouth / brows only.',
      'Map expressions to your emotional beat sheet before mass-generating.',
      'Primary emotions for big turns; micro-expressions for quiet pages.',
    ],
    presets: EDITOR_VARIATION_PRESETS.editor_expression,
  },
  {
    id: 'wf_outfit_editor',
    title: 'Outfit changes',
    tool: 'editor_outfit',
    sourceIds: ['S52', 'S62'],
    bullets: [
      'Outfit changes should be story-motivated (pajamas → school clothes) and noted in DNA “allowed to change”.',
      'Keep face, hair, and body proportions locked — only clothing changes.',
      'Restart from the pinned anchor when a new outfit must stay consistent across many pages.',
    ],
    presets: EDITOR_VARIATION_PRESETS.editor_outfit,
  },
  {
    id: 'wf_background_editor',
    title: 'Background / place changes',
    tool: 'editor_background',
    sourceIds: ['S52', 'S62'],
    bullets: [
      'New place = restart from the anchor when possible so old rooms do not ghost in.',
      'Keep character identity locked; describe the environment only.',
      'Backgrounds first in Canvas, then character layers, then text.',
    ],
    presets: EDITOR_VARIATION_PRESETS.editor_background,
  },
]

/** External learning index (links only — content stays on their site). */
export const EXTERNAL_LEARNING_INDEX = [
  {
    group: 'Overview',
    links: [
      { label: 'Neolemon Guides hub', url: 'https://www.neolemon.com/guides/' },
      { label: 'Neolemon home / product overview', url: 'https://www.neolemon.com/' },
      { label: 'Video tutorials', url: 'https://www.neolemon.com/tutorials/' },
      { label: 'Blog', url: 'https://www.neolemon.com/blog' },
      {
        label: 'Pricing (third-party — not StoryForge credits)',
        url: 'https://www.neolemon.com/pricing',
        warn: true,
      },
    ],
  },
  {
    group: 'Tools (third-party)',
    links: [
      { label: 'AI Cartoon Generator', url: 'https://www.neolemon.com/tools/ai-cartoon-generator' },
      { label: 'Photo to Cartoon', url: 'https://www.neolemon.com/tools/photo-to-cartoon' },
    ],
  },
  {
    group: 'High-value guides',
    links: [
      { label: 'Character Turbo guide', url: 'https://www.neolemon.com/guides/ai-cartoon-character-turbo-guide' },
      { label: 'Editor Pro guide', url: 'https://www.neolemon.com/guides/ai-editor-pro-guide' },
      { label: 'Story Scene Pro guide', url: 'https://www.neolemon.com/guides/story-scene-pro-guide' },
      { label: 'Canvas guide', url: 'https://www.neolemon.com/guides/ai-canvas-scene-builder' },
      { label: 'Kids drawing → character', url: 'https://www.neolemon.com/guides/kids-drawing-to-storybook-character' },
      { label: 'Bedtime story workflow', url: 'https://www.neolemon.com/guides/personalized-bedtime-story-book-ai' },
      { label: 'Illustration masterclass', url: 'https://www.neolemon.com/guides/illustrate-childrens-book-ai-masterclass' },
      { label: 'Prompt writing guide', url: 'https://www.neolemon.com/guides/how-to-write-perfect-ai-cartoon-character-prompt' },
    ],
  },
  {
    group: 'Legal (theirs — not StoryForge policy)',
    links: [
      { label: 'Terms of Service', url: 'https://www.neolemon.com/terms-of-service', warn: true },
      { label: 'Privacy Policy', url: 'https://www.neolemon.com/privacy-policy', warn: true },
      { label: 'Refund Policy', url: 'https://www.neolemon.com/refund-policy', warn: true },
    ],
  },
]

export function craftLibraryPayload() {
  return {
    meta: CRAFT_META,
    storytellingCompass: STORYTELLING_COMPASS,
    ipCharacterBuilder: ipCharacterPayload(),
    characterDna: CHARACTER_DNA_GUIDE,
    artStyles: ART_STYLE_GUIDE,
    coverDesign: COVER_DESIGN_RULES,
    ageWordCounts: AGE_WORD_COUNTS,
    sevenDayPlan: SEVEN_DAY_PLAN,
    multiCharacterMethod: MULTI_CHARACTER_METHOD,
    expressionArc: EXPRESSION_ARC,
    continuityChecklist: CONTINUITY_CHECKLIST,
    characterDesignPrinciples: CHARACTER_DESIGN_PRINCIPLES,
    cameraBodyAge: CAMERA_AND_BODY_TIPS,
    coloringWorkflow: COLORING_PAGE_WORKFLOW,
    kdpEarningsRealism: KDP_EARNINGS_REALISM,
    editorVariationPlaybooks: EDITOR_VARIATION_PLAYBOOKS,
    editorVariationPresets: EDITOR_VARIATION_PRESETS,
    externalLearningIndex: EXTERNAL_LEARNING_INDEX,
  }
}
