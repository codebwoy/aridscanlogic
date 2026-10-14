/**
 * Credit price table — shown before every billable action.
 */

export const CREDIT_COSTS = {
  genre_search: 2,
  premise_generate: 3,
  cast_generate: 3,
  plot_generate: 4,
  title_variations: 1,
  outline_generate: 6,
  outline_regenerate_subtree: 3,
  outline_expand_chapter: 3,
  section_draft: 4,
  section_regenerate: 4,
  generate_all_chapter: 8,
  continuity_scan: 2,
  continuity_update: 0,
  inline_edit: 1,
  cover_generate: 8,
  cover_revise: 4,
  cover_wrap: 3,
  metadata_generate: 2,
  export_interior_pdf: 3,
  export_epub: 2,
  export_docx: 2,
  export_cover_pdf: 3,
  export_kdp_zip: 2,
  import_manuscript: 2,
  wizard_assist: 0,
  compliance_checklist: 0,
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

/** Rough estimate for a ~70–90k novel (section-by-section path). */
export function estimateBookCredits({
  chapters = 20,
  sectionsPerChapter = 3,
  includeCover = true,
} = {}) {
  const outline = CREDIT_COSTS.outline_generate
  const bible =
    CREDIT_COSTS.premise_generate +
    CREDIT_COSTS.cast_generate +
    CREDIT_COSTS.plot_generate +
    CREDIT_COSTS.title_variations
  const sections = chapters * sectionsPerChapter * CREDIT_COSTS.section_draft
  const exportCost =
    CREDIT_COSTS.export_interior_pdf +
    CREDIT_COSTS.export_epub +
    CREDIT_COSTS.export_kdp_zip +
    (includeCover ? CREDIT_COSTS.export_cover_pdf + CREDIT_COSTS.cover_generate : 0)
  const total = bible + outline + sections + exportCost
  return {
    chapters,
    sectionsPerChapter,
    breakdown: { bible, outline, sections, exportCost },
    total,
    note: 'Estimate only — regenerations and inline edits add cost. LLM EUR cost tracked separately.',
  }
}
