/** Project studio progress steps (Phase 1 core loop). */
export const PROGRESS_STEPS = [
  { id: 'story', label: 'Story', index: 0 },
  { id: 'characters', label: 'Characters', index: 1 },
  { id: 'scenes', label: 'Scenes', index: 2 },
  { id: 'layout', label: 'Layout', index: 3 },
  { id: 'preflight', label: 'Preflight', index: 4 },
  { id: 'export', label: 'Export', index: 5 },
]

export function stepIndex(id) {
  const found = PROGRESS_STEPS.find((s) => s.id === id)
  return found ? found.index : 0
}

/** Traceability S1–S32 for Launchpad acceptance UI. */
export const TRACEABILITY = [
  { id: 'S1', area: 'Onboarding', status: 'done', note: 'Non-illustrator + consistency problem' },
  { id: 'S2', area: 'Onboarding', status: 'done', note: 'Anchor solution explained' },
  { id: 'S3', area: 'Character Turbo', status: 'done', note: 'Full-body white-bg anchor' },
  { id: 'S4', area: 'Editor Pro', status: 'done', note: 'Scenes from pinned anchor' },
  { id: 'S5', area: 'Tools', status: 'done', note: 'Character Turbo + engine versions' },
  { id: 'S6', area: 'Tools', status: 'done', note: 'Editor Pro modes' },
  { id: 'S7', area: 'Tools', status: 'done', note: 'Story Scene Pro two-character scenes' },
  { id: 'S8', area: 'Tools', status: 'done', note: 'Photo to Cartoon + recorded guardian consent' },
  { id: 'S9', area: 'Tools', status: 'done', note: 'Canvas layout surface' },
  { id: 'S10', area: 'Export', status: 'done', note: 'Preflight blocks under-res' },
  { id: 'S11', area: 'Export', status: 'done', note: 'Interior PDF when preflight passes' },
  { id: 'S12', area: 'Recipes', status: 'done', note: 'Quick Book recipe' },
  { id: 'S13', area: 'Prompts', status: 'done', note: 'Prompt library + apply' },
  { id: 'S14', area: 'Photo niche', status: 'done', note: 'Personalised entry' },
  { id: 'S15', area: 'Photo niche', status: 'done', note: 'Consent + Turbo fallback' },
  { id: 'S16', area: 'Guides', status: 'done', note: 'Back to School + Baby Books' },
  { id: 'S17', area: 'Guides', status: 'done', note: 'Manual market fields' },
  { id: 'S18', area: 'Guides', status: 'done', note: 'Timing + Trends link' },
  { id: 'S19', area: 'Guides', status: 'done', note: 'Start this book → recipe' },
  { id: 'S20', area: 'Disclosure', status: 'done', note: 'Guide + config ⚠' },
  { id: 'S21', area: 'Disclosure', status: 'done', note: 'Prompt → disclose' },
  { id: 'S22', area: 'Disclosure', status: 'done', note: 'Enhance hand-painted' },
  { id: 'S23', area: 'Disclosure', status: 'done', note: 'Commercial-use statement' },
  { id: 'S24', area: 'Disclosure', status: 'done', note: 'US copyright explainer' },
  { id: 'S25', area: 'Credits', status: 'done', note: '20 trial credits' },
  { id: 'S26', area: 'Course', status: 'done', note: 'Format chooser' },
  { id: 'S27', area: 'Course', status: 'done', note: 'Manuscript coach' },
  { id: 'S27b', area: 'Course', status: 'done', note: 'Koala notes card' },
  { id: 'S28', area: 'Course', status: 'done', note: 'Illustrate checklist' },
  { id: 'S29', area: 'Course', status: 'done', note: 'Layout checklist' },
  { id: 'S30', area: 'Course', status: 'done', note: 'KDP upload checklist' },
  { id: 'S31', area: 'Course', status: 'done', note: 'Post-launch' },
  { id: 'S32', area: 'Books panel', status: 'done', note: 'Editable reading slots' },
]
