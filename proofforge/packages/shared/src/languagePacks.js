/**
 * Regional language packs — spelling, punctuation hints, false friends.
 * Applied contextually; never convert proper nouns / intentional dialect blindly.
 */

export const LANGUAGE_PACKS = {
  en: {
    us: {
      id: 'en-us',
      label: 'US English',
      spelling: [
        ['colour', 'color'],
        ['organise', 'organize'],
        ['centre', 'center'],
        ['favour', 'favor'],
        ['behaviour', 'behavior'],
        ['defence', 'defense'],
        ['travelling', 'traveling'],
        ['grey', 'gray'],
      ],
      false_friends: [],
      notes: ['Prefer US spelling/idiom when variety=us'],
    },
    uk: {
      id: 'en-uk',
      label: 'UK English',
      spelling: [
        ['color', 'colour'],
        ['organize', 'organise'],
        ['center', 'centre'],
        ['favor', 'favour'],
        ['behavior', 'behaviour'],
        ['defense', 'defence'],
        ['traveling', 'travelling'],
        ['gray', 'grey'],
      ],
      false_friends: [],
      notes: ['Prefer UK spelling/idiom when variety=uk'],
    },
    au: {
      id: 'en-au',
      label: 'Australian English',
      spelling: [
        ['color', 'colour'],
        ['organize', 'organise'],
        ['center', 'centre'],
        ['favor', 'favour'],
        ['behavior', 'behaviour'],
        ['defense', 'defence'],
        ['traveling', 'travelling'],
        ['gray', 'grey'],
      ],
      false_friends: [],
      notes: ['AU spelling largely aligns with UK; keep -ise/-our consistent'],
    },
    nz: {
      id: 'en-nz',
      label: 'New Zealand English',
      spelling: [
        ['color', 'colour'],
        ['organize', 'organise'],
        ['center', 'centre'],
        ['favor', 'favour'],
        ['behavior', 'behaviour'],
        ['defense', 'defence'],
        ['traveling', 'travelling'],
        ['gray', 'grey'],
      ],
      false_friends: [],
      notes: ['NZ spelling largely aligns with UK; keep -ise/-our consistent'],
    },
    ca: {
      id: 'en-ca',
      label: 'Canadian English',
      spelling: [
        ['colour', 'color'],
        ['organise', 'organize'],
        ['centre', 'center'],
        ['favour', 'favor'],
        ['behaviour', 'behavior'],
        ['defence', 'defense'],
        ['travelling', 'traveling'],
        ['grey', 'gray'],
      ],
      false_friends: [],
      notes: ['CA often mixes US/UK — pick one house style and stick to it'],
    },
  },
  de: {
    de: {
      id: 'de-de',
      label: 'German (Germany)',
      spelling: [],
      false_friends: [
        { bad: 'eventually', note: 'False friend — DE eventually ≠ endlich; use schließlich / irgendwann' },
        { bad: 'actual', note: 'False friend — actual ≠ aktuell; use eigentlich / tatsächlich' },
        { bad: 'become', note: 'False friend risk in DE–EN mix — become ≠ bekommen' },
        { bad: 'handy', note: 'In DE “Handy” means mobile phone — not English handy/useful' },
        { bad: 'gift', note: 'In DE Gift = poison — not English gift (Geschenk)' },
        {
          bad: 'okay',
          note: 'Anglicism — fine in dialogue; prefer in Ordnung / gut for formal narrative',
        },
      ],
      notes: [
        'Sie/du consistency by relationship',
        'Compound nouns and case endings',
        'ß in Germany Standard German (not Switzerland)',
        'Flag English calques and unmotivated Anglicisms',
      ],
    },
    at: {
      id: 'de-at',
      label: 'Austrian German',
      spelling: [],
      false_friends: [
        { bad: 'eventually', note: 'False friend — eventually ≠ endlich' },
        { bad: 'handy', note: 'Handy = mobile phone in DE/AT' },
      ],
      notes: ['Austrian Standard German vocabulary where it differs (Jänner, etc.)'],
    },
    ch: {
      id: 'de-ch',
      label: 'Swiss Standard German',
      spelling: [['ß', 'ss']],
      false_friends: [
        { bad: 'eventually', note: 'False friend — eventually ≠ endlich' },
      ],
      notes: ['Swiss Standard German often prefers ss over ß'],
    },
  },
  es: {
    latam: {
      id: 'es-latam',
      label: 'Latin American Spanish',
      spelling: [
        ['vosotros', 'ustedes'],
      ],
      false_friends: [
        { bad: 'embarazada', note: 'Means pregnant — not embarrassed (avergonzada/o)' },
        { bad: 'actualmente', note: 'Means currently — not actually (en realidad)' },
        { bad: 'success', note: 'English bleed — use éxito' },
        { bad: 'anyway', note: 'English bleed — use de todos modos / en fin' },
      ],
      notes: ['Avoid vosotros; ustedes plural', 'Keep LatAm lexicon', 'tú/usted locked'],
    },
    es: {
      id: 'es-es',
      label: 'Spain Spanish',
      spelling: [],
      false_friends: [
        { bad: 'embarazada', note: 'Means pregnant — not embarrassed' },
        { bad: 'actualmente', note: 'Means currently — not actually' },
        { bad: 'success', note: 'English bleed — use éxito' },
      ],
      notes: ['vosotros OK when natural', 'Peninsular lexicon'],
    },
  },
  fr: {
    fr: {
      id: 'fr-fr',
      label: 'France French',
      spelling: [],
      false_friends: [
        { bad: 'librairie', note: 'Bookshop — not library (bibliothèque)' },
        { bad: 'actuel', note: 'Means current — not actual/real (réel / véritable)' },
        { bad: 'eventually', note: 'English bleed — use finalement / tôt ou tard' },
        { bad: 'anyway', note: 'English bleed — use bref / enfin / de toute façon' },
      ],
      notes: ['tu/vous locked to relationships', 'Native cadence over calques'],
    },
    be: {
      id: 'fr-be',
      label: 'Belgian French',
      spelling: [],
      false_friends: [{ bad: 'librairie', note: 'Bookshop — not library (bibliothèque)' }],
      notes: ['Belgian French preferences where they differ'],
    },
    ca: {
      id: 'fr-ca',
      label: 'Canadian French',
      spelling: [],
      false_friends: [{ bad: 'librairie', note: 'Bookshop — not library (bibliothèque)' }],
      notes: ['Keep Canadian French consistent if chosen'],
    },
  },
  it: {
    it: {
      id: 'it-it',
      label: 'Italian',
      spelling: [],
      false_friends: [
        { bad: 'camera', note: 'Room — not camera (macchina fotografica / fotocamera)' },
        { bad: 'factory', note: 'English bleed — use fabbrica / stabilimento' },
        { bad: 'anyway', note: 'English bleed — use comunque / in ogni caso' },
        { bad: 'okay', note: 'Anglicism — fine in dialogue; prefer va bene in narrative' },
      ],
      notes: ['Natural spoken cadence', 'Avoid English plot skeleton with Italian labels only'],
    },
  },
  nl: {
    nl: {
      id: 'nl-nl',
      label: 'Netherlands Dutch',
      spelling: [],
      false_friends: [
        { bad: 'eventueel', note: 'Means possible/optional — not English eventually' },
        { bad: 'actueel', note: 'Means current/topical — not English actual' },
        { bad: 'anyway', note: 'English bleed — use hoe dan ook / in ieder geval' },
        { bad: 'okay', note: 'Anglicism — fine in dialogue; prefer goed / in orde in narrative' },
      ],
      notes: ['Nuchter tone; avoid melodrama', 'Flag unmotivated Anglicisms'],
    },
    be: {
      id: 'nl-be',
      label: 'Flemish',
      spelling: [],
      false_friends: [
        { bad: 'eventueel', note: 'Means possible/optional — not English eventually' },
        { bad: 'actueel', note: 'Means current/topical — not English actual' },
      ],
      notes: ['Belgian Dutch / Flemish preferences where they differ'],
    },
  },
}

export function getLanguagePack(lang, variety) {
  const byLang = LANGUAGE_PACKS[lang] || {}
  return byLang[variety] || byLang[Object.keys(byLang)[0]] || null
}

/**
 * Deterministic localization findings from spelling pairs (word-boundary).
 */
export function localizationFindings(section, lang, variety) {
  const pack = getLanguagePack(lang, variety)
  if (!pack) return []
  const text = section?.content_md || ''
  const out = []
  for (const [wrong, right] of pack.spelling || []) {
    if (wrong.length === 1) {
      // char-level (e.g. ß → ss for CH) — only flag if variety prefers replacement
      if (text.includes(wrong)) {
        out.push({
          category: 'localization',
          subcategory: 'regional_spelling',
          severity: 'suggestion',
          title: `Regional spelling (${pack.label})`,
          explanation: `Found “${wrong}”. For ${pack.label}, prefer “${right}” where appropriate (proper nouns exempt).`,
          original_excerpt: wrong,
          suggested_correction: right,
          reason: `language_pack:${pack.id}`,
          confidence: 0.7,
          objective: false,
          section_key: section.key,
          chapter: section.title,
        })
      }
      continue
    }
    const re = new RegExp(`\\b${escapeRe(wrong)}\\b`, 'gi')
    let m
    let hits = 0
    while ((m = re.exec(text)) && hits < 5) {
      hits += 1
      out.push({
        category: 'localization',
        subcategory: 'regional_spelling',
        severity: 'minor',
        title: `Regional spelling → ${right}`,
        explanation: `“${m[0]}” may not match ${pack.label}. Suggested: “${right}” (skip if intentional / proper noun).`,
        original_excerpt: m[0],
        suggested_correction: rightCase(m[0], right),
        reason: `language_pack:${pack.id}`,
        confidence: 0.75,
        objective: true,
        section_key: section.key,
        chapter: section.title,
      })
    }
  }
  for (const ff of pack.false_friends || []) {
    const re = new RegExp(`\\b${escapeRe(ff.bad)}\\b`, 'i')
    const m = text.match(re)
    if (m) {
      out.push({
        category: 'localization',
        subcategory: 'false_friend',
        severity: 'needs_verification',
        title: `Possible false friend: ${ff.bad}`,
        explanation: ff.note,
        original_excerpt: m[0],
        suggested_correction: '',
        reason: `language_pack:${pack.id}`,
        confidence: 0.55,
        objective: false,
        section_key: section.key,
        chapter: section.title,
      })
    }
  }
  return out
}

function escapeRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function rightCase(original, replacement) {
  if (original === original.toUpperCase()) return replacement.toUpperCase()
  if (original[0] === original[0].toUpperCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1)
  }
  return replacement
}

export function languagePacksPayload() {
  const out = {}
  for (const [lang, varieties] of Object.entries(LANGUAGE_PACKS)) {
    out[lang] = Object.fromEntries(
      Object.entries(varieties).map(([code, pack]) => [
        code,
        { id: pack.id, label: pack.label, notes: pack.notes || [], spelling_pairs: (pack.spelling || []).length },
      ])
    )
  }
  return out
}
