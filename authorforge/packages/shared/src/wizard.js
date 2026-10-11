/** Resumable wizard steps — persist step id per book */

export const WIZARD_STEPS = [
  { id: 'niche', number: 1, title: 'Niche Hunter', optional: true, phase: 8 },
  { id: 'competitive', number: 2, title: 'Competitive Advantage', optional: true, phase: 8 },
  { id: 'basics', number: 3, title: 'Book Basics', optional: false, phase: 2 },
  { id: 'comps', number: 4, title: 'Comparable Titles', optional: false, phase: 2 },
  { id: 'positioning', number: 5, title: 'Positioning', optional: false, phase: 2 },
  { id: 'title_opt', number: 6, title: 'Title & Subtitle', optional: false, phase: 2 },
  { id: 'resources', number: 7, title: 'Resources', optional: false, phase: 2 },
  { id: 'persona', number: 8, title: 'Author Persona', optional: false, phase: 2 },
  { id: 'focus_tags', number: 9, title: 'Focus Tags', optional: false, phase: 2 },
  { id: 'summary', number: 10, title: 'Book Summary Lock', optional: false, phase: 2 },
  { id: 'details', number: 11, title: 'Book Details', optional: false, phase: 2 },
  { id: 'bio', number: 12, title: 'Author Bio', optional: false, phase: 2 },
  { id: 'outline', number: 13, title: 'Outline', optional: false, phase: 2 },
  { id: 'writing', number: 14, title: 'Writing', optional: false, phase: 3 },
  { id: 'edit_verify', number: 15, title: 'Edit & Verify', optional: false, phase: 4 },
  { id: 'formatting', number: 16, title: 'Formatting', optional: false, phase: 5 },
  { id: 'metadata', number: 17, title: 'Metadata & Description', optional: false, phase: 5 },
  { id: 'cover', number: 18, title: 'Cover', optional: false, phase: 6 },
  { id: 'publish', number: 19, title: 'Publish', optional: false, phase: 7 },
]

export const BOOK_STATUSES = [
  'draft',
  'bible_locked',
  'outlined',
  'writing',
  'editing',
  'export_ready',
  'published',
]

export function stepIndex(stepId) {
  return WIZARD_STEPS.findIndex((s) => s.id === stepId)
}

export function nextStepId(stepId) {
  const i = stepIndex(stepId)
  if (i < 0 || i >= WIZARD_STEPS.length - 1) return null
  return WIZARD_STEPS[i + 1].id
}

export function prevStepId(stepId) {
  const i = stepIndex(stepId)
  if (i <= 0) return null
  return WIZARD_STEPS[i - 1].id
}
