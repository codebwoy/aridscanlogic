/** Lexicons for deterministic style reports (inspired by PWA/AutoCrit categories — original lists). */

export const FILLER_WORDS = Object.freeze([
  'just',
  'really',
  'very',
  'quite',
  'rather',
  'actually',
  'basically',
  'literally',
  'simply',
  'definitely',
  'probably',
  'maybe',
  'somehow',
  'somewhat',
  'that',
])

export const WEAK_ADVERBS = Object.freeze([
  'suddenly',
  'quickly',
  'slowly',
  'quietly',
  'angrily',
  'happily',
  'sadly',
  'softly',
  'loudly',
  'completely',
  'totally',
  'extremely',
  'slightly',
])

export const CLICHES_EN = Object.freeze([
  'at the end of the day',
  'only time will tell',
  'in the nick of time',
  'better late than never',
  'all of a sudden',
  'as luck would have it',
  'needless to say',
  'for what it\'s worth',
  'time stood still',
  'heart skipped a beat',
  'blood ran cold',
  'like a deer in headlights',
  'calm before the storm',
  'crystal clear',
  'think outside the box',
])

export const CLICHES_DE = Object.freeze([
  'auf den Punkt gebracht',
  'das ist der Gipfel',
  'kein Blatt vor den Mund',
  'wie ein Blitz aus heiterem Himmel',
])

export const CLICHES_FR = Object.freeze([
  'au bout du compte',
  'il neigeait des cordes',
  'tomber des nues',
])

export const CLICHES_ES = Object.freeze([
  'al fin y al cabo',
  'ni corto ni perezoso',
  'más vale tarde que nunca',
])

export const CLICHES_IT = Object.freeze([
  'alla fine dei conti',
  'meglio tardi che mai',
  'cadere dalle nuvole',
])

export const GENERIC_DESCRIPTORS = Object.freeze([
  'nice',
  'good',
  'bad',
  'great',
  'amazing',
  'beautiful',
  'wonderful',
  'terrible',
  'interesting',
  'important',
  'special',
])

export const DIALOGUE_TAG_VERBS = Object.freeze([
  'said',
  'asked',
  'replied',
  'whispered',
  'shouted',
  'murmured',
  'exclaimed',
  'answered',
  'noted',
  'stated',
  'declared',
  'muttered',
  'screamed',
  'yelled',
])

/** PWA Style Report — emotion tells (“telling” feelings instead of showing). */
export const EMOTION_TELLS = Object.freeze([
  'felt angry',
  'felt sad',
  'felt happy',
  'felt scared',
  'felt nervous',
  'was angry',
  'was sad',
  'was happy',
  'was afraid',
  'was terrified',
  'was excited',
  'was worried',
  'she was furious',
  'he was furious',
  'she felt',
  'he felt',
  'they felt',
  'a wave of',
  'filled with emotion',
  'couldn\'t help but feel',
])

/** PWA Style Report — hidden verbs (make/give/take + noun). */
export const HIDDEN_VERB_PATTERNS = Object.freeze([
  { re: /\b(?:make|makes|made|making)\s+(?:a\s+)?(?:decision|choice|attempt|promise|announcement)\b/gi, label: 'make + noun' },
  { re: /\b(?:give|gives|gave|giving)\s+(?:a\s+)?(?:smile|nod|shrug|look|sigh|response)\b/gi, label: 'give + noun' },
  { re: /\b(?:take|takes|took|taking)\s+(?:a\s+)?(?:look|breath|step|walk|decision)\b/gi, label: 'take + noun' },
  { re: /\b(?:have|has|had|having)\s+(?:a\s+)?(?:conversation|discussion|argument)\b/gi, label: 'have + noun' },
])

export function clichesForLanguage(lang) {
  if (lang === 'de') return [...CLICHES_EN, ...CLICHES_DE]
  if (lang === 'fr') return [...CLICHES_EN, ...CLICHES_FR]
  if (lang === 'es') return [...CLICHES_EN, ...CLICHES_ES]
  if (lang === 'it') return [...CLICHES_EN, ...CLICHES_IT]
  return [...CLICHES_EN]
}
