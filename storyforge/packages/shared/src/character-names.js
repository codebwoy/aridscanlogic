/**
 * Theme-aware character name generator for StoryForge IP DNA.
 * Short, shoutable, DE/EN-friendly names tied to emotional core / culture.
 * Suggestions only — not trademark or legal clearance.
 */

import { assessCharacterName, IP_EMOTIONAL_HOOKS, IP_NAME_SUGGESTIONS } from './ip-character.js'

export const CHARACTER_NAME_META = {
  id: 'character_name_generator',
  title: 'Theme-aware name ideas',
  sourceIds: ['S58', 'S61'],
  disclaimer:
    'Name ideas are suggestions for kids IP branding — not trademark advice, Amazon ranking claims, or cultural certification. Always verify meaning and spelling with a trusted speaker when using living languages.',
  rules: [
    'Prefer 1–2 syllables kids can shout',
    'Soft / singable ending when possible (vowel or soft consonant)',
    'Relate to emotional core, trait, or cultural enrichment of the book',
    'Keep DE + EN pronounceable for bilingual shelves',
    'Unique-feeling within your series — still verify trademarks yourself',
  ],
}

/** Curated cultural / day names with meaning notes (Ghanaian day-name tradition + short cross-lingual). */
export const CULTURAL_NAME_BANK = [
  { name: 'Kofi', meaning: 'Friday-born (Akan)', hooks: ['courage', 'pride', 'belonging'], tags: ['ghana', 'akan', 'twi'] },
  { name: 'Ama', meaning: 'Saturday-born (Akan, female)', hooks: ['love', 'belonging', 'kindness'], tags: ['ghana', 'akan', 'twi'] },
  { name: 'Kwame', meaning: 'Saturday-born (Akan, male)', hooks: ['pride', 'courage', 'bravery_change'], tags: ['ghana', 'akan'] },
  { name: 'Abena', meaning: 'Tuesday-born (Akan, female)', hooks: ['curiosity', 'kindness'], tags: ['ghana', 'akan'] },
  { name: 'Kwaku', meaning: 'Wednesday-born (Akan, male)', hooks: ['curiosity', 'courage'], tags: ['ghana', 'akan'] },
  { name: 'Akua', meaning: 'Wednesday-born (Akan, female)', hooks: ['curiosity', 'love'], tags: ['ghana', 'akan'] },
  { name: 'Yaw', meaning: 'Thursday-born (Akan, male)', hooks: ['courage', 'bravery_change'], tags: ['ghana', 'akan'] },
  { name: 'Yaa', meaning: 'Thursday-born (Akan, female)', hooks: ['courage', 'pride'], tags: ['ghana', 'akan'] },
  { name: 'Kwesi', meaning: 'Sunday-born (Akan, male)', hooks: ['belonging', 'pride'], tags: ['ghana', 'akan'] },
  { name: 'Akosua', meaning: 'Sunday-born (Akan, female)', hooks: ['belonging', 'love'], tags: ['ghana', 'akan'] },
  { name: 'Esi', meaning: 'Sunday-born short form', hooks: ['belonging', 'kindness'], tags: ['ghana', 'akan'] },
  { name: 'Kojo', meaning: 'Monday-born (Akan, male)', hooks: ['curiosity', 'courage'], tags: ['ghana', 'akan'] },
  { name: 'Adjoa', meaning: 'Monday-born (Akan, female)', hooks: ['kindness', 'love'], tags: ['ghana', 'akan'] },
  { name: 'Nana', meaning: 'Elder / grandparent honorific — warm elder energy', hooks: ['belonging', 'love', 'pride'], tags: ['ghana', 'akan'] },
  { name: 'Sena', meaning: 'Short bright form; easy DE/EN', hooks: ['curiosity', 'kindness'], tags: ['cross', 'ghana'] },
  { name: 'Zuri', meaning: 'Beautiful (Swahili) — soft vowel ending', hooks: ['pride', 'love', 'belonging'], tags: ['swahili', 'east_africa'] },
  { name: 'Nia', meaning: 'Purpose (Swahili / Nguzo Saba)', hooks: ['pride', 'bravery_change', 'courage'], tags: ['swahili'] },
  { name: 'Ayo', meaning: 'Joy (Yoruba)', hooks: ['love', 'kindness', 'belonging'], tags: ['yoruba', 'west_africa'] },
  { name: 'Tayo', meaning: 'Worth / joy compound (Yoruba short)', hooks: ['pride', 'belonging'], tags: ['yoruba'] },
  { name: 'Imani', meaning: 'Faith (Swahili)', hooks: ['courage', 'belonging'], tags: ['swahili'] },
]

/** Theme names — personality / story-job hints (not cultural day names). */
export const THEME_NAME_BANK = [
  { name: 'Sunny', meaning: 'Warmth and positivity', hooks: ['love', 'belonging', 'kindness'], themes: ['sun', 'warm', 'happy', 'light', 'freund'] },
  { name: 'Chase', meaning: 'Action / pursuit energy', hooks: ['courage', 'bravery_change'], themes: ['run', 'chase', 'police', 'hero', 'schnell'] },
  { name: 'Pip', meaning: 'Tiny playful chant name', hooks: ['curiosity', 'kindness'], themes: ['small', 'play', 'pip', 'klein'] },
  { name: 'Luna', meaning: 'Moon / bedtime calm', hooks: ['love', 'belonging'], themes: ['moon', 'night', 'sleep', 'bed', 'mond', 'nacht'] },
  { name: 'Milo', meaning: 'Soft European picture-book feel', hooks: ['curiosity', 'kindness'], themes: ['friend', 'soft', 'freund'] },
  { name: 'Timo', meaning: 'DE-friendly short name', hooks: ['courage', 'curiosity'], themes: ['school', 'schule', 'deutsch', 'germany'] },
  { name: 'Mira', meaning: 'Wonder / looking — bilingual shelves', hooks: ['curiosity'], themes: ['look', 'wonder', 'star', 'sehen', 'staunen'] },
  { name: 'Leo', meaning: 'Brave little lion energy', hooks: ['courage', 'pride'], themes: ['lion', 'brave', 'mut', 'löwe'] },
  { name: 'Niko', meaning: 'Friendly DE/EN short form', hooks: ['belonging', 'kindness'], themes: ['friend', 'school', 'freund'] },
  { name: 'Bibi', meaning: 'Repetitive toddler chant', hooks: ['love', 'belonging'], themes: ['baby', 'chant', 'rhyme', 'lied'] },
  { name: 'Kito', meaning: 'Jewel / precious (Swahili root feel)', hooks: ['pride', 'love'], themes: ['gift', 'precious', 'treasure', 'geschenk'] },
  { name: 'Remi', meaning: 'Soft vowel ending, easy bilingual', hooks: ['curiosity', 'kindness'], themes: ['music', 'song', 'sing', 'lied'] },
  { name: 'Sami', meaning: 'Warm helper vibe', hooks: ['kindness', 'belonging'], themes: ['help', 'friend', 'helfen'] },
  { name: 'Tari', meaning: 'Short chant; pairs with drum/rhythm stories', hooks: ['courage', 'pride'], themes: ['drum', 'music', 'rhythm', 'trommel', 'beat'] },
  { name: 'Luma', meaning: 'Light / glow hybrid feel', hooks: ['curiosity', 'love'], themes: ['light', 'glow', 'star', 'licht'] },
]

/** Syllable parts for invented hybrids (culturally rooted sound + DE/EN ease). */
const HYBRID_ONSETS = ['Ko', 'Ka', 'A', 'Na', 'Sa', 'Zo', 'Ti', 'Mi', 'Lu', 'Ya', 'Be', 'Jo', 'Pe', 'Ri', 'Tu']
const HYBRID_NUCLEI = ['fi', 'ma', 'me', 'ni', 'no', 'ri', 'si', 'ya', 'jo', 'ku', 'ba', 'lo', 'mi', 'to', 'na']

const HOOK_KEYWORDS = {
  belonging: ['belong', 'home', 'welcome', 'family', 'together', 'heim', 'zusammen', 'willkommen'],
  courage: ['courage', 'brave', 'fear', 'mut', 'angst', 'tapfer', 'overcom'],
  curiosity: ['curious', 'ask', 'wonder', 'discover', 'neugierig', 'fragen', 'entdeck'],
  kindness: ['kind', 'help', 'share', 'helfen', 'teilen', 'freundlich'],
  love: ['love', 'comfort', 'hug', 'liebe', 'kuschel', 'herz'],
  bravery_change: ['change', 'new', 'try', 'wachsen', 'neu', 'versuch', 'first day', 'schule'],
  pride: ['pride', 'identity', 'who i am', 'stolz', 'selbst'],
}

export function hasSoftEnding(name) {
  const n = String(name || '').trim().toLowerCase()
  if (!n) return false
  return /[aeiouäöüy]$/i.test(n) || /[mn]$/i.test(n)
}

function normalizeHook(hook) {
  const raw = String(hook || '').trim().toLowerCase()
  if (!raw) return 'belonging'
  const known = IP_EMOTIONAL_HOOKS.find((h) => h.id === raw || h.label.toLowerCase() === raw)
  return known?.id || raw
}

function blobFromContext(ctx = {}) {
  return [
    ctx.emotionalCore,
    ctx.emotionalHook,
    ctx.definingTrait,
    ctx.culturalEnrichment,
    ctx.bookTitle,
    ctx.premise,
    ctx.refrain,
  ]
    .map((x) => String(x || '').toLowerCase())
    .join(' ')
}

function detectHookFromText(text, fallback = 'belonging') {
  const t = String(text || '').toLowerCase()
  let best = fallback
  let bestScore = 0
  for (const [hook, words] of Object.entries(HOOK_KEYWORDS)) {
    let s = 0
    for (const w of words) if (t.includes(w)) s += 1
    if (s > bestScore) {
      bestScore = s
      best = hook
    }
  }
  return best
}

function cultureBoost(tags, blob) {
  let s = 0
  if (/twi|akan|ghana|kente|accra|kumasi|ga\b/.test(blob)) {
    if (tags.some((t) => ['ghana', 'akan', 'twi'].includes(t))) s += 3
  }
  if (/swahili|kenya|tanzania/.test(blob)) {
    if (tags.includes('swahili')) s += 3
  }
  if (/yoruba|nigeria/.test(blob)) {
    if (tags.includes('yoruba')) s += 3
  }
  if (/deutsch|german|germany|schule|berlin/.test(blob)) {
    if (tags.includes('cross') || /timo|niko|milo/i.test(tags.join(' '))) s += 1
  }
  return s
}

function scoreCandidate(entry, ctx) {
  const hook = normalizeHook(ctx.emotionalHook || detectHookFromText(blobFromContext(ctx)))
  const blob = blobFromContext(ctx)
  const coach = assessCharacterName(entry.name)
  let theme = 0
  if (entry.hooks?.includes(hook)) theme += 4
  if (entry.themes) {
    for (const t of entry.themes) if (blob.includes(t)) theme += 2
  }
  theme += cultureBoost(entry.tags || [], blob)
  if (hasSoftEnding(entry.name)) theme += 1
  if (coach.syllables === 1 || coach.syllables === 2) theme += 2
  if (coach.syllables > 2) theme -= 4
  const total = coach.score * 0.55 + theme * 8
  return { coach, theme, total, hook }
}

function inventHybrid(seedNum, hook) {
  const o = HYBRID_ONSETS[seedNum % HYBRID_ONSETS.length]
  const n = HYBRID_NUCLEI[(seedNum * 7 + hook.length) % HYBRID_NUCLEI.length]
  let name = `${o}${n}`
  // Avoid accidental triple letters / awkward length
  name = name.replace(/(.)\1\1+/g, '$1$1').slice(0, 8)
  // Capitalize
  name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
  return name
}

function mulberry32(a) {
  return function next() {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashSeed(str) {
  let h = 2166136261
  const s = String(str || 'storyforge')
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * @param {object} [ctx]
 * @param {string} [ctx.emotionalCore]
 * @param {string} [ctx.emotionalHook]
 * @param {string} [ctx.definingTrait]
 * @param {string} [ctx.culturalEnrichment]
 * @param {string} [ctx.bookTitle]
 * @param {string} [ctx.premise]
 * @param {string} [ctx.refrain]
 * @param {number} [ctx.count]
 * @param {string|number} [ctx.seed]
 * @param {string[]} [ctx.exclude]
 */
export function generateCharacterNames(ctx = {}) {
  const count = Math.min(12, Math.max(4, Number(ctx.count) || 8))
  const exclude = new Set(
    (ctx.exclude || []).map((n) => String(n || '').trim().toLowerCase()).filter(Boolean),
  )
  const hook = normalizeHook(ctx.emotionalHook || detectHookFromText(blobFromContext(ctx)))
  const seed =
    typeof ctx.seed === 'number'
      ? ctx.seed >>> 0
      : hashSeed(
          [ctx.seed ?? 0, ctx.bookTitle, ctx.emotionalCore, hook, ctx.definingTrait, ctx.culturalEnrichment].join(
            '|',
          ),
        )
  const rand = mulberry32(seed)

  const scored = []

  for (const entry of CULTURAL_NAME_BANK) {
    const { coach, total, hook: matchedHook } = scoreCandidate(entry, { ...ctx, emotionalHook: hook })
    if (!coach.ok || coach.syllables > 2) continue
    if (exclude.has(entry.name.toLowerCase())) continue
    scored.push({
      name: entry.name,
      kind: 'cultural',
      meaning: entry.meaning,
      score: Math.round(total),
      coachScore: coach.score,
      syllables: coach.syllables,
      softEnding: hasSoftEnding(entry.name),
      why: whyLine({
        kind: 'cultural',
        meaning: entry.meaning,
        hook: matchedHook,
        trait: ctx.definingTrait,
        core: ctx.emotionalCore,
        soft: hasSoftEnding(entry.name),
      }),
    })
  }

  for (const entry of THEME_NAME_BANK) {
    const { coach, total, hook: matchedHook } = scoreCandidate(entry, { ...ctx, emotionalHook: hook })
    if (!coach.ok || coach.syllables > 2) continue
    if (exclude.has(entry.name.toLowerCase())) continue
    scored.push({
      name: entry.name,
      kind: 'theme',
      meaning: entry.meaning,
      score: Math.round(total),
      coachScore: coach.score,
      syllables: coach.syllables,
      softEnding: hasSoftEnding(entry.name),
      why: whyLine({
        kind: 'theme',
        meaning: entry.meaning,
        hook: matchedHook,
        trait: ctx.definingTrait,
        core: ctx.emotionalCore,
        soft: hasSoftEnding(entry.name),
      }),
    })
  }

  // Invent a few hybrids rooted in short open syllables
  for (let i = 0; i < 10; i++) {
    const n = inventHybrid(Math.floor(rand() * 10000) + i * 13, hook)
    const coach = assessCharacterName(n)
    if (!coach.ok || coach.syllables > 2 || n.length < 3) continue
    if (exclude.has(n.toLowerCase())) continue
    if (scored.some((s) => s.name.toLowerCase() === n.toLowerCase())) continue
    const soft = hasSoftEnding(n)
    scored.push({
      name: n,
      kind: 'hybrid',
      meaning: 'Invented short form — culturally rooted sounds, DE/EN easy',
      score: Math.round(coach.score * 0.55 + (soft ? 12 : 6) + (hook ? 8 : 0)),
      coachScore: coach.score,
      syllables: coach.syllables,
      softEnding: soft,
      why: whyLine({
        kind: 'hybrid',
        meaning: 'Invented but short and singable',
        hook,
        trait: ctx.definingTrait,
        core: ctx.emotionalCore,
        soft,
      }),
    })
  }

  // Always keep classic catalogue as fallback fillers
  for (const s of IP_NAME_SUGGESTIONS) {
    if (scored.some((x) => x.name === s.name)) continue
    if (exclude.has(s.name.toLowerCase())) continue
    const coach = assessCharacterName(s.name)
    if (!coach.ok) continue
    scored.push({
      name: s.name,
      kind: 'catalogue',
      meaning: s.note,
      score: coach.score,
      coachScore: coach.score,
      syllables: coach.syllables,
      softEnding: hasSoftEnding(s.name),
      why: `${s.note}. Fits toddler / Merch shout rules.`,
    })
  }

  scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))

  // Diversify kinds in the top batch
  const picked = diversifyPick(scored, count, rand)

  return {
    hook,
    seed,
    count: picked.length,
    ideas: picked,
    rules: CHARACTER_NAME_META.rules,
    disclaimer: CHARACTER_NAME_META.disclaimer,
    generatedAt: new Date().toISOString(),
  }
}

function whyLine({ kind, meaning, hook, trait, core, soft }) {
  const bits = []
  if (kind === 'cultural') bits.push(`Cultural meaning: ${meaning}`)
  else if (kind === 'theme') bits.push(`Theme hint: ${meaning}`)
  else if (kind === 'hybrid') bits.push(meaning)
  else bits.push(meaning)
  const hookLabel = IP_EMOTIONAL_HOOKS.find((h) => h.id === hook)?.label || hook
  if (hookLabel) bits.push(`pairs with emotional hook “${hookLabel}”`)
  if (core && String(core).trim()) bits.push(`echoes your book core`)
  if (trait && String(trait).trim()) bits.push(`works with trait “${String(trait).trim().slice(0, 40)}”`)
  if (soft) bits.push('soft/singable ending')
  return bits.filter(Boolean).join(' · ')
}

function diversifyPick(scored, count, rand) {
  const out = []
  const used = new Set()
  const kinds = ['cultural', 'theme', 'hybrid', 'catalogue']
  // First pass: one of each kind if available
  for (const kind of kinds) {
    const hit = scored.find((s) => s.kind === kind && !used.has(s.name.toLowerCase()))
    if (hit) {
      out.push(hit)
      used.add(hit.name.toLowerCase())
    }
  }
  // Fill by score with light shuffle among near-ties
  const rest = scored.filter((s) => !used.has(s.name.toLowerCase()))
  while (out.length < count && rest.length) {
    const topBand = rest.slice(0, Math.min(5, rest.length))
    const pick = topBand[Math.floor(rand() * topBand.length)]
    const idx = rest.indexOf(pick)
    rest.splice(idx, 1)
    out.push(pick)
    used.add(pick.name.toLowerCase())
  }
  return out.slice(0, count)
}

export function characterNamesPayload() {
  return {
    meta: CHARACTER_NAME_META,
    culturalBankSize: CULTURAL_NAME_BANK.length,
    themeBankSize: THEME_NAME_BANK.length,
    sample: generateCharacterNames({
      emotionalHook: 'belonging',
      emotionalCore: 'finding friends',
      seed: 42,
      count: 6,
    }),
  }
}
