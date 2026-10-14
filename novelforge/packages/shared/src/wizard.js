/** Resumable fiction wizard steps — persist step id per book */

export const WIZARD_STEPS = [
  { id: 'genre', number: 1, title: 'Genre & Niche', optional: false, phase: 1 },
  { id: 'premise', number: 2, title: 'Premise & Promise', optional: false, phase: 1 },
  { id: 'cast', number: 3, title: 'Cast', optional: false, phase: 1 },
  { id: 'world', number: 4, title: 'World & Setting', optional: false, phase: 1 },
  { id: 'plot', number: 5, title: 'Plot Beats', optional: false, phase: 1 },
  { id: 'title_opt', number: 6, title: 'Title Options', optional: false, phase: 1 },
  { id: 'voice', number: 7, title: 'Voice / POV / Tense', optional: false, phase: 1 },
  { id: 'outline', number: 8, title: 'Outline', optional: false, phase: 2 },
  { id: 'writing', number: 9, title: 'Writing', optional: false, phase: 3 },
  { id: 'continuity', number: 10, title: 'Continuity Edit', optional: false, phase: 4 },
  { id: 'formatting', number: 11, title: 'Formatting', optional: false, phase: 5 },
  { id: 'metadata', number: 12, title: 'Metadata', optional: false, phase: 5 },
  { id: 'cover', number: 13, title: 'Cover', optional: false, phase: 6 },
  { id: 'publish', number: 14, title: 'Publish', optional: false, phase: 7 },
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
