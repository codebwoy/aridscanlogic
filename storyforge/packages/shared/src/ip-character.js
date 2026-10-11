/**
 * IP Character Builder — merch-ready DNA before Character Turbo.
 * Enforces silhouette / one-colour / one-trait / short-name rules.
 * Does not claim fame or sales outcomes.
 */

export const IP_CHARACTER_META = {
  id: 'ip_character_builder',
  title: 'IP Character Builder (merch-ready DNA)',
  sourceIds: ['S58'],
  disclaimer:
    '⚠ Locking DNA makes characters recognisable and Merch-ready — it does not guarantee fame, TV deals, or merchandise demand. Series + distribution still matter.',
  note: 'Design for a T-shirt silhouette first, then generate Character Turbo from the locked DNA. Use theme-aware name ideas to link the hero to your book’s emotional core.',
}

/** Signature colour tokens — keep simple for merch print. */
export const IP_SIGNATURE_COLORS = [
  { id: 'blue', label: 'Blue' },
  { id: 'green', label: 'Green' },
  { id: 'yellow', label: 'Yellow' },
  { id: 'orange', label: 'Orange' },
  { id: 'red', label: 'Red' },
  { id: 'pink', label: 'Pink' },
  { id: 'purple', label: 'Purple' },
  { id: 'teal', label: 'Teal' },
  { id: 'brown', label: 'Brown' },
  { id: 'gold', label: 'Gold' },
  { id: 'cream', label: 'Cream' },
  { id: 'black_white', label: 'Black & white accent' },
]

export const IP_EMOTIONAL_HOOKS = [
  { id: 'belonging', label: 'Belonging' },
  { id: 'courage', label: 'Courage' },
  { id: 'curiosity', label: 'Curiosity' },
  { id: 'kindness', label: 'Kindness / helping' },
  { id: 'love', label: 'Love / comfort' },
  { id: 'bravery_change', label: 'Trying new things' },
  { id: 'pride', label: 'Pride in who I am' },
]

/** Short name ideas — suggestions only; author chooses / invents. */
export const IP_NAME_SUGGESTIONS = [
  { name: 'Kofi', note: '1–2 syllables · easy DE/EN' },
  { name: 'Ama', note: 'Short · warm' },
  { name: 'Kwame', note: '2 syllables' },
  { name: 'Abena', note: '2–3 syllables' },
  { name: 'Luna', note: 'Classic picture-book' },
  { name: 'Milo', note: 'Soft · European' },
  { name: 'Nia', note: 'Short · cross-lingual' },
  { name: 'Timo', note: 'DE-friendly' },
  { name: 'Sena', note: 'Short · bright' },
  { name: 'Yao', note: '1 syllable · strong chant' },
  { name: 'Esi', note: 'Short' },
  { name: 'Leo', note: '1–2 syllables' },
  { name: 'Mira', note: 'Soft · bilingual shelves' },
  { name: 'Jamal', note: '2 syllables' },
  { name: 'Zuri', note: 'Short · memorable' },
]

/** Checklist items that must be affirmed before lock. */
export const MERCH_READY_CHECKS = [
  {
    id: 'silhouette',
    label: 'Silhouette test',
    description: 'A child could recognise this character as a black shape at thumbnail size',
  },
  {
    id: 'simple_shapes',
    label: 'Simple shapes',
    description: 'Big clear shapes — not intricate patterns or tiny details that die on a tee',
  },
  {
    id: 'one_colour_role',
    label: 'One colour + one role',
    description: 'One signature colour and one defining personality trait',
  },
  {
    id: 'signature_object',
    label: 'Signature object',
    description: 'One recurring prop kids can ask for by name',
  },
  {
    id: 'tee_first',
    label: 'Tee-shirt first',
    description: 'I designed this for a T-shirt / Merch PNG, not only a busy book scene',
  },
  {
    id: 'series_intent',
    label: 'Series intent',
    description: 'This hero is meant for multiple books / adventures, not a one-off cast',
  },
]

export const IP_DNA_FIELDS = [
  { key: 'name', label: 'Character name', required: true, max: 40 },
  { key: 'signatureColor', label: 'Signature colour', required: true, max: 40 },
  { key: 'definingTrait', label: 'Defining trait', required: true, max: 80 },
  { key: 'signatureObject', label: 'Signature object', required: true, max: 80 },
  { key: 'emotionalHook', label: 'Universal emotional hook', required: true, max: 80 },
  { key: 'culturalEnrichment', label: 'Cultural enrichment (optional)', required: false, max: 200 },
  { key: 'silhouetteNote', label: 'Silhouette note', required: true, max: 200 },
  { key: 'ageBand', label: 'Age band', required: false, max: 40 },
  { key: 'archetype', label: 'Role / archetype', required: false, max: 80 },
  { key: 'seriesId', label: 'Series id (optional)', required: false, max: 64 },
]

export function emptyIpCharacter(overrides = {}) {
  return {
    name: '',
    signatureColor: 'blue',
    definingTrait: '',
    signatureObject: '',
    emotionalHook: 'belonging',
    culturalEnrichment: '',
    silhouetteNote: '',
    ageBand: '3–7',
    archetype: 'hero',
    seriesId: '',
    merchChecks: Object.fromEntries(MERCH_READY_CHECKS.map((c) => [c.id, false])),
    locked_at: null,
    updated_at: null,
    ...overrides,
  }
}

/** Rough toddler-friendly name coach (1–2 syllables preferred). */
export function assessCharacterName(name) {
  const raw = String(name || '').trim()
  const tips = []
  if (!raw) {
    return { ok: false, score: 0, syllables: 0, tips: ['Enter a short name kids can shout'] }
  }
  if (/\s/.test(raw)) {
    tips.push('Prefer a single first name (1–2 syllables), not a full phrase')
  }
  if (raw.length > 10) {
    tips.push('Shorter names (≤10 letters) are easier for toddlers')
  }
  if (!/^[A-Za-zÀ-ÿĀ-žА-яΑ-ω\u0600-\u06FF'’-]+$/u.test(raw.replace(/\s/g, ''))) {
    tips.push('Use letters only — avoid numbers/symbols in the spoken name')
  }
  const syllables = estimateSyllables(raw)
  if (syllables > 2) {
    tips.push('Aim for 1–2 syllables (JJ, Chase, Kofi, Ama)')
  } else if (syllables === 1) {
    tips.push('One syllable — strong for chanting and Merch')
  } else {
    tips.push('Two syllables — classic kids-IP length')
  }
  const score = Math.max(
    0,
    100 - (syllables > 2 ? (syllables - 2) * 25 : 0) - (raw.length > 10 ? 15 : 0) - (/\s/.test(raw) ? 20 : 0),
  )
  return {
    ok: Boolean(raw) && syllables > 0 && syllables <= 3,
    score,
    syllables,
    tips,
  }
}

function estimateSyllables(word) {
  const w = String(word || '')
    .toLowerCase()
    .replace(/[^a-zà-ÿ]/gi, '')
  if (!w) return 0
  // Simple EN heuristic; still useful as a coach for short African / European names
  const groups = w.match(/[aeiouyàáâãäåèéêëìíîïòóôõöùúûü]+/gi)
  let n = groups ? groups.length : 1
  if (w.endsWith('e') && n > 1) n -= 1
  return Math.max(1, n)
}

/**
 * @returns {{ ok: true, dna: object } | { ok: false, error: string, missing?: string[] }}
 */
export function normalizeIpCharacter(input = {}) {
  const base = emptyIpCharacter()
  const dna = {
    ...base,
    ...input,
    merchChecks: {
      ...base.merchChecks,
      ...(input.merchChecks && typeof input.merchChecks === 'object' ? input.merchChecks : {}),
    },
  }
  dna.name = String(dna.name || '').trim().slice(0, 40)
  dna.signatureColor = String(dna.signatureColor || '').trim().slice(0, 40)
  dna.definingTrait = String(dna.definingTrait || '').trim().slice(0, 80)
  dna.signatureObject = String(dna.signatureObject || '').trim().slice(0, 80)
  dna.emotionalHook = String(dna.emotionalHook || '').trim().slice(0, 80)
  dna.culturalEnrichment = String(dna.culturalEnrichment || '').trim().slice(0, 200)
  dna.silhouetteNote = String(dna.silhouetteNote || '').trim().slice(0, 200)
  dna.ageBand = String(dna.ageBand || '').trim().slice(0, 40)
  dna.archetype = String(dna.archetype || '').trim().slice(0, 80)
  dna.seriesId = String(dna.seriesId || '').trim().slice(0, 64)
  return { ok: true, dna }
}

export function validateIpCharacterForLock(input = {}) {
  const { dna } = normalizeIpCharacter(input)
  const missing = []
  for (const field of IP_DNA_FIELDS.filter((f) => f.required)) {
    if (!String(dna[field.key] || '').trim()) missing.push(field.key)
  }
  const unchecked = MERCH_READY_CHECKS.filter((c) => !dna.merchChecks?.[c.id]).map((c) => c.id)
  const nameCoach = assessCharacterName(dna.name)
  if (!nameCoach.ok) missing.push('name')
  if (missing.length || unchecked.length) {
    return {
      ok: false,
      error: 'Complete required DNA fields and all merch-ready checks before locking',
      missing,
      unchecked,
      nameCoach,
      dna,
    }
  }
  return { ok: true, dna, nameCoach }
}

export function isIpCharacterLocked(projectOrDna) {
  const dna = projectOrDna?.ip_character || projectOrDna
  return Boolean(dna?.locked_at)
}

/** Prompt fragment for Character Turbo / Photo to Cartoon. */
export function buildTurboDescriptionFromDna(dna) {
  if (!dna?.name) return 'friendly child character, simple bold shapes, merch-ready silhouette'
  const color = dna.signatureColor || 'bright'
  const trait = dna.definingTrait || 'kind'
  const object = dna.signatureObject || 'favorite toy'
  const hook = dna.emotionalHook || 'belonging'
  const sil = dna.silhouetteNote || 'big round readable silhouette'
  const culture = dna.culturalEnrichment
    ? ` Cultural enrichment (secondary): ${dna.culturalEnrichment}.`
    : ''
  return [
    `Merch-ready kids IP character: signature colour ${color}, defining trait "${trait}", always carries ${object}.`,
    `Emotional core: ${hook}. Silhouette: ${sil}.`,
    'Radical simplicity — bold flat shapes, minimal facial detail, high contrast, readable as a black silhouette,',
    'plain white background, full body front-facing, suitable for T-shirt print.',
    culture,
  ]
    .filter(Boolean)
    .join(' ')
}

export function ipCharacterPayload() {
  return {
    meta: IP_CHARACTER_META,
    fields: IP_DNA_FIELDS,
    colors: IP_SIGNATURE_COLORS,
    emotionalHooks: IP_EMOTIONAL_HOOKS,
    merchChecks: MERCH_READY_CHECKS,
    nameSuggestions: IP_NAME_SUGGESTIONS,
    nameGenerator: {
      id: 'character_name_generator',
      surface: 'ip_character',
      sourceIds: ['S61'],
      note: 'Theme-aware names from book emotional core + DNA — see characterNames payload / Studio IP Builder',
    },
    empty: emptyIpCharacter(),
  }
}
