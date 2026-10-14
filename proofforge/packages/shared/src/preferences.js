/**
 * Writing preference toggles (Grammarly-style category on/off).
 * Default: all enabled. Author can disable noisy categories.
 */

export const PREFERENCE_KEYS = Object.freeze([
  { id: 'grammar', label: 'Grammar & mechanics', default: true },
  { id: 'localization', label: 'Regional language', default: true },
  { id: 'repetition', label: 'Repetition', default: true },
  { id: 'style_adverbs', label: 'Adverbs', default: true },
  { id: 'style_cliches', label: 'Clichés', default: true },
  { id: 'style_filler', label: 'Filler words', default: true },
  { id: 'pacing', label: 'Pacing heuristics', default: true },
  { id: 'dialogue', label: 'Dialogue patterns', default: true },
  { id: 'naturalness', label: 'Naturalness (AI)', default: true },
  { id: 'structure', label: 'Structure / fiction-nonfiction', default: true },
  { id: 'kdp_technical', label: 'KDP technical', default: true },
])

export function defaultPreferences() {
  return Object.fromEntries(PREFERENCE_KEYS.map((p) => [p.id, p.default]))
}

export function filterFindingsByPreferences(findings, prefs = {}) {
  const p = { ...defaultPreferences(), ...prefs }
  return (findings || []).filter((f) => {
    const cat = f.category
    const sub = f.subcategory
    if (cat === 'grammar' || cat === 'spelling' || cat === 'punctuation') return p.grammar !== false
    if (cat === 'localization') return p.localization !== false
    if (cat === 'repetition') return p.repetition !== false
    if (cat === 'naturalness') return p.naturalness !== false
    if (cat === 'structure' && sub === 'pacing') return p.pacing !== false
    if (cat === 'structure') return p.structure !== false
    if (cat === 'style' && sub === 'adverb') return p.style_adverbs !== false
    if (cat === 'style' && sub === 'cliche') return p.style_cliches !== false
    if (cat === 'style' && sub === 'filler') return p.style_filler !== false
    if (cat === 'style') return true
    if (cat === 'kdp_technical' || cat === 'kdp_policy') return p.kdp_technical !== false
    if (cat === 'consistency') return p.structure !== false
    return true
  })
}

export function preferencesPayload() {
  return { keys: PREFERENCE_KEYS.map((k) => ({ ...k })), defaults: defaultPreferences() }
}
