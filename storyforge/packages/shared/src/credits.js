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
  editor_outfit: 1,
  editor_background: 1,
  editor_erase: 1,
  editor_reframe: 1,
  /** Image-to-video from an approved pinned scene still (fal Kling etc.) */
  scene_to_video: 12,
  upscale_print: 2,
  consistency_rescore: 0,
  /** Local manuscript draft for all pages (edit before KDP) */
  story_text: 0,
  /** 5-part KDP listing description from project facts (0 credits) */
  listing_description: 0,
  /** Subtitle + ≤7 keywords + age + category ideas (0 credits) */
  listing_metadata: 0,
  /**
   * Title-safe front cover art from pinned Character Turbo (Replicate/fal).
   * Typography + wrap PDF still via export_cover_pdf.
   */
  generate_cover_art: 5,
  /**
   * Batch illustrate every page from pinned anchor + briefs.
   * Charged dynamically: pages × editor_pro (see resolveJobCost).
   */
  illustrate_all_pages: 0,
  /** Batch 2.5× print upscale for pages with art — dynamic × upscale_print */
  upscale_all_pages: 0,
  /** Theme-aware IP name ideas (local generator — 0 credits) */
  character_name_ideas: 0,
  preflight: 0,
  /** Checklist score: print + continuity + copy + KDP Previewer sign-off */
  publication_readiness: 0,
  export_interior_pdf: 3,
  export_cover_pdf: 3,
  export_source_zip: 1,
  /** Transparent / Merch-sized PNG from pinned Character Turbo anchor */
  export_merch_png: 1,
  /** Self-contained HTML digital flipbook ZIP (share online — not print KDP) */
  export_flipbook: 1,
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

/** Dynamic credit cost for batch jobs (illustrate / upscale all pages). */
export function resolveJobCost(type, { pageCount = 32, pagesWithArt = 0, skipExisting = false } = {}) {
  if (type === 'illustrate_all_pages') {
    const n = Math.max(1, Number(pageCount) || 32)
    const skip = skipExisting ? Math.min(n, Math.max(0, Number(pagesWithArt) || 0)) : 0
    return Math.max(0, n - skip) * CREDIT_COSTS.editor_pro
  }
  if (type === 'upscale_all_pages') {
    return Math.max(0, Number(pagesWithArt) || 0) * CREDIT_COSTS.upscale_print
  }
  return costFor(type)
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
  const coverArt = includeCover ? CREDIT_COSTS.generate_cover_art : 0
  const exportCost =
    CREDIT_COSTS.export_interior_pdf +
    (includeCover ? CREDIT_COSTS.export_cover_pdf : 0) +
    CREDIT_COSTS.export_source_zip
  const total = bible + draftScenes + finalScenes + coverArt + exportCost
  return {
    pages,
    characters,
    breakdown: { bible, draftScenes, finalScenes, coverArt, exportCost },
    total,
    note: 'Estimate only — regenerations and editor passes add cost.',
  }
}
