/**
 * Credit price table — shown before every billable action.
 * Text tools are free (fair use enforced server-side).
 */

export const CREDIT_COSTS = {
  character_bible_draft: 2,
  character_bible_final: 6,
  /** Launchpad S5 — maps to Character Bible final with Turbo engine */
  character_turbo: 6,
  scene_draft: 1,
  scene_final: 4,
  /** Launchpad S6 — scene from pinned anchor */
  editor_pro: 4,
  /** Launchpad S7 — two-character scene from anchors */
  story_scene_pro: 5,
  /** Launchpad S8 — requires guardian consent record */
  photo_to_cartoon: 6,
  editor_action: 1,
  editor_expression: 1,
  editor_background: 1,
  editor_erase: 1,
  editor_reframe: 1,
  /** Image-to-video from an approved pinned scene still (fal Kling etc.) */
  scene_to_video: 12,
  upscale_print: 2,
  consistency_rescore: 0,
  story_text: 0,
  preflight: 0,
  export_interior_pdf: 3,
  export_cover_pdf: 3,
  export_source_zip: 1,
  /** Launchpad content surfaces — always free */
  launchpad_guide: 0,
  launchpad_course: 0,
  launchpad_prompt_library: 0,
  launchpad_disclosure: 0,
  launchpad_craft: 0,
}

export const FREE_ACTIONS = new Set(
  Object.entries(CREDIT_COSTS)
    .filter(([, c]) => c === 0)
    .map(([k]) => k)
)

export function costFor(action) {
  if (!(action in CREDIT_COSTS)) return null
  return CREDIT_COSTS[action]
}

/** Rough project estimate for a picture book. */
export function estimateBookCredits({
  pages = 32,
  characters = 1,
  draftRatio = 0.6,
  includeCover = true,
} = {}) {
  const bible = characters * CREDIT_COSTS.character_bible_final
  const draftScenes = Math.round(pages * draftRatio) * CREDIT_COSTS.scene_draft
  const finalScenes = Math.round(pages * (1 - draftRatio)) * CREDIT_COSTS.scene_final
  const exportCost =
    CREDIT_COSTS.export_interior_pdf +
    (includeCover ? CREDIT_COSTS.export_cover_pdf : 0) +
    CREDIT_COSTS.export_source_zip
  const total = bible + draftScenes + finalScenes + exportCost
  return {
    pages,
    characters,
    breakdown: { bible, draftScenes, finalScenes, exportCost },
    total,
    note: 'Estimate only — regenerations and editor passes add cost.',
  }
}
