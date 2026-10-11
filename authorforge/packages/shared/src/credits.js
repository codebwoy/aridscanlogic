/**
 * Credit price table — shown before every billable action.
 */

export const CREDIT_COSTS = {
  niche_search: 2,
  competitive_analysis: 4,
  title_variations: 1,
  persona_derive: 2,
  outline_generate: 6,
  outline_regenerate_subtree: 3,
  section_draft: 4,
  section_regenerate: 4,
  generate_all_chapter: 8,
  continuity_update: 0,
  fact_check_section: 3,
  originality_scan: 2,
  quality_report: 1,
  inline_edit: 1,
  cover_generate: 8,
  cover_revise: 4,
  cover_wrap: 3,
  aplus_module: 3,
  ad_script: 2,
  export_interior_pdf: 3,
  export_epub: 2,
  export_docx: 2,
  export_cover_pdf: 3,
  export_kdp_zip: 2,
  storefront_publish: 1,
  translation_chapter: 5,
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

/** Rough estimate for a 25–30k non-fiction book (section-by-section path). */
export function estimateBookCredits({
  chapters = 8,
  sectionsPerChapter = 4,
  includeCover = true,
  includeFactCheck = true,
} = {}) {
  const outline = CREDIT_COSTS.outline_generate
  const sections = chapters * sectionsPerChapter * CREDIT_COSTS.section_draft
  const fact = includeFactCheck ? chapters * sectionsPerChapter * CREDIT_COSTS.fact_check_section : 0
  const exportCost =
    CREDIT_COSTS.export_interior_pdf +
    CREDIT_COSTS.export_epub +
    CREDIT_COSTS.export_kdp_zip +
    (includeCover ? CREDIT_COSTS.export_cover_pdf + CREDIT_COSTS.cover_generate : 0)
  const total = outline + sections + fact + exportCost
  return {
    chapters,
    sectionsPerChapter,
    breakdown: { outline, sections, fact, exportCost },
    total,
    note: 'Estimate only — regenerations and inline edits add cost. LLM EUR cost tracked separately.',
  }
}
