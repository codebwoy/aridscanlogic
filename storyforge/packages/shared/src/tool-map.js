/**
 * Named Launchpad tools (S5–S9) → StoryForge job types / surfaces.
 * Labels are overridable via ConfigValue; ids stay stable.
 */

export const NAMED_TOOLS = {
  character_turbo: {
    id: 'character_turbo',
    label: 'Character Turbo',
    jobType: 'character_turbo',
    sourceIds: ['S5'],
    description:
      'Create the main character as a full-body, front-facing image on a white background. Requires locked IP Character DNA (merch-ready gate). Use theme-aware name ideas before locking.',
  },
  character_name_ideas: {
    id: 'character_name_ideas',
    label: 'Theme-aware names',
    jobType: null,
    surface: 'ip_character',
    sourceIds: ['S61'],
    description:
      'Generate short, shoutable names tied to book emotional core, cultural enrichment, and DNA trait — suggestions only, not trademark advice.',
  },
  editor_pro: {
    id: 'editor_pro',
    label: 'Editor Pro',
    jobType: 'editor_pro',
    sourceIds: ['S6'],
    description: 'Generate scene-by-scene illustrations, always starting from the pinned anchor.',
  },
  story_scene_pro: {
    id: 'story_scene_pro',
    label: 'Story Scene Pro',
    jobType: 'story_scene_pro',
    sourceIds: ['S7'],
    description: 'Combine two characters into a single scene.',
  },
  photo_to_cartoon: {
    id: 'photo_to_cartoon',
    label: 'Photo to Cartoon',
    jobType: 'photo_to_cartoon',
    sourceIds: ['S8'],
    description: 'Turn a real photo into a consistent cartoon character (consent required).',
  },
  canvas: {
    id: 'canvas',
    label: 'Canvas',
    jobType: null,
    surface: 'layout',
    sourceIds: ['S9', 'S60'],
    description:
      'Layout at KDP trim sizes, story text, publication readiness score (print + continuity + copy + KDP Previewer sign-off), and print export.',
  },
  publication_readiness: {
    id: 'publication_readiness',
    label: 'Publication readiness',
    jobType: 'publication_readiness',
    surface: 'canvas',
    sourceIds: ['S60'],
    description:
      'Free checklist score before KDP upload — not a guarantee of Amazon acceptance or editorial perfection.',
  },
  editor_action: {
    id: 'editor_action',
    label: 'Action Editor',
    jobType: 'editor_action',
    sourceIds: ['S52', 'S62', 'S6'],
    description:
      'Change pose/action from a pinned anchor without rewriting character identity (face, hair, outfit stay locked).',
  },
  editor_expression: {
    id: 'editor_expression',
    label: 'Expression Editor',
    jobType: 'editor_expression',
    sourceIds: ['S46', 'S52', 'S62'],
    description: 'Change facial emotion while locking hair, outfit, and face proportions.',
  },
  editor_outfit: {
    id: 'editor_outfit',
    label: 'Outfit Editor',
    jobType: 'editor_outfit',
    sourceIds: ['S52', 'S62'],
    description:
      'Change what the character is wearing (pajamas, school clothes, adventure gear) while keeping face and body identity.',
  },
  editor_background: {
    id: 'editor_background',
    label: 'Background Editor',
    jobType: 'editor_background',
    sourceIds: ['S52', 'S62', 'S6'],
    description:
      'Place the same character into a new environment; prefer restarting from the pinned anchor for new settings.',
  },
  variation_editors: {
    id: 'variation_editors',
    label: 'Editors',
    jobType: null,
    surface: 'studio',
    sourceIds: ['S52', 'S62'],
    description:
      'Action, Expression, Outfit, and Background editors — each changes one axis while identity stays locked to the pinned Character Turbo anchor.',
  },
  export_flipbook: {
    id: 'export_flipbook',
    label: 'Digital flipbook',
    jobType: 'export_flipbook',
    sourceIds: ['S63'],
    description:
      'Shareable HTML flipbook ZIP (page turns + story text) for online sharing — not a KDP print file.',
  },
  story_text: {
    id: 'story_text',
    label: 'Write manuscript',
    jobType: 'story_text',
    sourceIds: ['S64'],
    description:
      'Draft short picture-book lines for every page from emotional core + character (0 credits). Edit before KDP.',
  },
  illustrate_all_pages: {
    id: 'illustrate_all_pages',
    label: 'Illustrate all pages',
    jobType: 'illustrate_all_pages',
    sourceIds: ['S65'],
    description:
      'Generate every page scene from the pinned Character Turbo anchor and per-page briefs (batch).',
  },
  upscale_all_pages: {
    id: 'upscale_all_pages',
    label: 'Upscale all pages',
    jobType: 'upscale_all_pages',
    sourceIds: ['S65'],
    description: 'Run 2.5× / KDP bleed upscale on every page that already has art.',
  },
  listing_description: {
    id: 'listing_description',
    label: 'KDP description',
    jobType: null,
    surface: 'canvas',
    sourceIds: ['S67'],
    description:
      'Build a 5-part Amazon book description (hook, story promise, SEL benefit, real review only, CTA) from your project facts.',
  },
  cover_studio: {
    id: 'cover_studio',
    label: 'Cover Studio',
    jobType: 'generate_cover_art',
    surface: 'canvas',
    sourceIds: ['S68', 'S54', 'S42'],
    description:
      'Professional KDP paperback cover: title-safe front art from Character Turbo, typography overlay, BACK|SPINE|FRONT wrap PDF with barcode reserve (Amazon G201953020).',
  },
  scene_to_video: {
    id: 'scene_to_video',
    label: 'Scene → Video',
    jobType: 'scene_to_video',
    sourceIds: ['S53'],
    description:
      'Animate an approved page still with short motion. Always starts from a pinned scene — never invents a new character from text alone.',
  },
}

/** Engine versions for Character Turbo (S5). */
export const CHARACTER_TURBO_ENGINES = [
  { id: 'v3', label: 'Turbo V3', default: true },
  { id: 'v2', label: 'Turbo V2 (legacy projects)' },
  { id: 'v1', label: 'Turbo V1 (legacy projects)' },
]

export function defaultTurboEngine() {
  return CHARACTER_TURBO_ENGINES.find((e) => e.default)?.id || 'v3'
}

export function toolById(id) {
  return NAMED_TOOLS[id] || null
}
