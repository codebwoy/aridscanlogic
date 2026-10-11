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
      'Create the main character as a full-body, front-facing image on a white background.',
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
    sourceIds: ['S9'],
    description: 'Layout at KDP trim sizes, text, speech bubbles, page-by-page export.',
  },
  editor_action: {
    id: 'editor_action',
    label: 'Action Editor',
    jobType: 'editor_action',
    sourceIds: ['S52', 'S6'],
    description: 'Change pose/action from a pinned anchor without rewriting character identity.',
  },
  editor_expression: {
    id: 'editor_expression',
    label: 'Expression Editor',
    jobType: 'editor_expression',
    sourceIds: ['S46', 'S52'],
    description: 'Change facial emotion while locking hair, outfit, and face proportions.',
  },
  editor_background: {
    id: 'editor_background',
    label: 'Background / outfit Editor',
    jobType: 'editor_background',
    sourceIds: ['S52', 'S6'],
    description: 'Story-motivated outfit or place changes; prefer restarting from the anchor for new settings.',
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
