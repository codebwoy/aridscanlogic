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
      ],
      notes: ['Sie/du consistency', 'Compound nouns', 'ß in DE (not CH)'],
    },
    at: {
      id: 'de-at',
      label: 'Austrian German',
      spelling: [],
      false_friends: [],
      notes: ['Austrian Standard German vocabulary where it differs'],
    },
    ch: {
      id: 'de-ch',
      label: 'Swiss Standard German',
      spelling: [['ß', 'ss']],
      false_friends: [],
      notes: ['Swiss Standard German often prefers ss over ß'],
    },
  },
  es: {
    latam: {
      id: 'es-latam',
      label: 'Latin American Spanish',
      spelling: [],
      false_friends: [{ bad: 'embarazada', note: 'Means pregnant — not embarrassed' }],
      notes: ['Avoid vosotros; ustedes plural', 'Keep LatAm lexicon'],
    },
    es: {
      id: 'es-es',
      label: 'Spain Spanish',
      spelling: [],
      false_friends: [],
      notes: ['vosotros OK when natural'],
    },
  },
  fr: {
    fr: {
      id: 'fr-fr',
      label: 'France French',
      spelling: [],
      false_friends: [{ bad: 'librairie', note: 'Bookshop — not library (bibliothèque)' }],
      notes: ['tu/vous locked to relationships'],
    },
    be: { id: 'fr-be', label: 'Belgian French', spelling: [], false_friends: [], notes: [] },
    ca: { id: 'fr-ca', label: 'Canadian French', spelling: [], false_friends: [], notes: [] },
  },
  it: {
    it: {
      id: 'it-it',
      label: 'Italian',
      spelling: [],
      false_friends: [{ bad: 'camera', note: 'Room — not camera (macchina fotografica)' }],
      notes: ['Natural spoken cadence'],
    },
  },
  nl: {
    nl: {
      id: 'nl-nl',
      label: 'Netherlands Dutch',
      spelling: [],
      false_friends: [],
      notes: ['Nuchter tone; avoid melodrama'],
    },
    be: { id: 'nl-be', label: 'Flemish', spelling: [], false_friends: [], notes: [] },
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
