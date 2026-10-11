/**
 * Story language catalogue for mono + bilingual picture books.
 * Primary + secondary are both selectable — not German-only.
 */

/** @typedef {{ code: string, label: string, nativeLabel?: string, script?: string, group: string }} StoryLanguage */

/** @type {StoryLanguage[]} */
export const STORY_LANGUAGES = [
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', group: 'european' },
  { code: 'en', label: 'English', nativeLabel: 'English', group: 'european' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', group: 'european' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', group: 'european' },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano', group: 'european' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português', group: 'european' },
  { code: 'nl', label: 'Dutch', nativeLabel: 'Nederlands', group: 'european' },
  { code: 'pl', label: 'Polish', nativeLabel: 'Polski', group: 'european' },
  { code: 'tr', label: 'Turkish', nativeLabel: 'Türkçe', group: 'european' },
  { code: 'uk', label: 'Ukrainian', nativeLabel: 'Українська', group: 'european' },
  { code: 'ru', label: 'Russian', nativeLabel: 'Русский', group: 'european' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', script: 'arab', group: 'mena' },
  { code: 'tw', label: 'Twi', nativeLabel: 'Twi', group: 'african' },
  { code: 'ak', label: 'Akan', nativeLabel: 'Akan', group: 'african' },
  { code: 'ee', label: 'Ewe', nativeLabel: 'Eʋegbe', group: 'african' },
  { code: 'ig', label: 'Igbo', nativeLabel: 'Igbo', group: 'african' },
  { code: 'yo', label: 'Yoruba', nativeLabel: 'Yorùbá', group: 'african' },
  { code: 'ha', label: 'Hausa', nativeLabel: 'Hausa', group: 'african' },
  { code: 'sw', label: 'Swahili', nativeLabel: 'Kiswahili', group: 'african' },
  { code: 'zu', label: 'Zulu', nativeLabel: 'isiZulu', group: 'african' },
  { code: 'xh', label: 'Xhosa', nativeLabel: 'isiXhosa', group: 'african' },
  { code: 'am', label: 'Amharic', nativeLabel: 'አማርኛ', script: 'ethi', group: 'african' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', script: 'deva', group: 'asian' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', script: 'beng', group: 'asian' },
  { code: 'zh', label: 'Chinese (Simplified)', nativeLabel: '中文', script: 'hans', group: 'asian' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語', script: 'jpan', group: 'asian' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어', script: 'kore', group: 'asian' },
]

export const STORY_LANGUAGE_CODES = STORY_LANGUAGES.map((l) => l.code)

/** Handy starter pairs — any primary+secondary combo is still allowed. */
export const LANGUAGE_PAIR_PRESETS = [
  { primary: 'de', secondary: 'tw', label: 'German–Twi' },
  { primary: 'de', secondary: 'ig', label: 'German–Igbo' },
  { primary: 'de', secondary: 'sw', label: 'German–Swahili' },
  { primary: 'de', secondary: 'ee', label: 'German–Ewe' },
  { primary: 'de', secondary: 'zu', label: 'German–Zulu' },
  { primary: 'de', secondary: 'ar', label: 'German–Arabic' },
  { primary: 'de', secondary: 'en', label: 'German–English' },
  { primary: 'de', secondary: 'fr', label: 'German–French' },
  { primary: 'es', secondary: 'en', label: 'Spanish–English' },
  { primary: 'es', secondary: 'ar', label: 'Spanish–Arabic' },
  { primary: 'es', secondary: 'tw', label: 'Spanish–Twi' },
  { primary: 'fr', secondary: 'en', label: 'French–English' },
  { primary: 'fr', secondary: 'ar', label: 'French–Arabic' },
  { primary: 'fr', secondary: 'sw', label: 'French–Swahili' },
  { primary: 'fr', secondary: 'ig', label: 'French–Igbo' },
  { primary: 'it', secondary: 'en', label: 'Italian–English' },
  { primary: 'it', secondary: 'ar', label: 'Italian–Arabic' },
  { primary: 'en', secondary: 'tw', label: 'English–Twi' },
  { primary: 'en', secondary: 'ig', label: 'English–Igbo' },
  { primary: 'en', secondary: 'sw', label: 'English–Swahili' },
  { primary: 'en', secondary: 'ar', label: 'English–Arabic' },
  { primary: 'en', secondary: 'es', label: 'English–Spanish' },
  { primary: 'en', secondary: 'fr', label: 'English–French' },
]

export const BILINGUAL_LAYOUTS = [
  {
    id: 'stacked',
    label: 'Stacked',
    description: 'Primary above secondary on the same page',
  },
  {
    id: 'side_by_side',
    label: 'Side by side',
    description: 'Primary left, secondary right on the same page',
  },
  {
    id: 'alternating',
    label: 'Alternating order',
    description: 'Both languages on the page; order swaps each page',
  },
]

export const BILINGUAL_LAYOUT_IDS = BILINGUAL_LAYOUTS.map((l) => l.id)

const languageByCode = new Map(STORY_LANGUAGES.map((l) => [l.code, l]))

export function isStoryLanguageCode(code) {
  return languageByCode.has(String(code || '').trim().toLowerCase())
}

export function getStoryLanguage(code) {
  return languageByCode.get(String(code || '').trim().toLowerCase()) || null
}

export function languageLabel(code) {
  const lang = getStoryLanguage(code)
  if (!lang) return code || ''
  return lang.nativeLabel && lang.nativeLabel !== lang.label
    ? `${lang.label} (${lang.nativeLabel})`
    : lang.label
}

/**
 * Normalize pair fields. Empty/null secondary ⇒ monolingual.
 * @returns {{ ok: true, primary: string, secondary: string|null, bilingual: boolean, layout: string, secondary_verified: boolean } | { ok: false, error: string }}
 */
export function normalizeLanguagePair({
  primary,
  secondary = null,
  layout = 'stacked',
  secondary_verified = false,
} = {}) {
  const p = String(primary || '')
    .trim()
    .toLowerCase()
  const sRaw = secondary == null || secondary === '' ? null : String(secondary).trim().toLowerCase()
  if (!isStoryLanguageCode(p)) {
    return { ok: false, error: `Unsupported primary language: ${primary}` }
  }
  if (sRaw && !isStoryLanguageCode(sRaw)) {
    return { ok: false, error: `Unsupported secondary language: ${secondary}` }
  }
  if (sRaw && sRaw === p) {
    return { ok: false, error: 'Primary and secondary languages must differ' }
  }
  const layoutId = BILINGUAL_LAYOUT_IDS.includes(layout) ? layout : 'stacked'
  return {
    ok: true,
    primary: p,
    secondary: sRaw,
    bilingual: Boolean(sRaw),
    layout: layoutId,
    secondary_verified: Boolean(secondary_verified),
  }
}

export function formatLanguagePairLabel(primary, secondary = null) {
  if (!secondary) return languageLabel(primary)
  return `${languageLabel(primary)} · ${languageLabel(secondary)}`
}

/**
 * Resolve which texts to draw and in which order for a page.
 * @returns {{ lines: Array<{ role: 'primary'|'secondary', code: string, text: string }>, layout: string }}
 */
export function resolvePageTextLines({
  primaryCode,
  secondaryCode = null,
  primaryText = '',
  secondaryText = '',
  layout = 'stacked',
  pageIndex = 0,
} = {}) {
  const primary = {
    role: 'primary',
    code: primaryCode,
    text: String(primaryText || '').trim(),
  }
  const secondary = {
    role: 'secondary',
    code: secondaryCode,
    text: String(secondaryText || '').trim(),
  }
  if (!secondaryCode) {
    return { lines: primary.text ? [primary] : [], layout: 'stacked' }
  }
  const layoutId = BILINGUAL_LAYOUT_IDS.includes(layout) ? layout : 'stacked'
  let ordered = [primary, secondary]
  if (layoutId === 'alternating' && pageIndex % 2 === 1) {
    ordered = [secondary, primary]
  }
  return {
    lines: ordered.filter((l) => l.text),
    layout: layoutId,
  }
}

/** Canvas / manuscript helper — single string preview. */
export function composeDisplayText(page, project) {
  const primary = project?.language || 'de'
  const secondary = project?.secondary_language || null
  const layout = project?.bilingual_layout || 'stacked'
  const resolved = resolvePageTextLines({
    primaryCode: primary,
    secondaryCode: secondary,
    primaryText: page?.text_content || '',
    secondaryText: page?.text_secondary || '',
    layout,
    pageIndex: page?.page_index ?? 0,
  })
  if (!resolved.lines.length) return ''
  if (resolved.layout === 'side_by_side' && resolved.lines.length === 2) {
    return `${resolved.lines[0].text}  |  ${resolved.lines[1].text}`
  }
  return resolved.lines.map((l) => l.text).join('\n\n')
}

export function languagesPayload() {
  return {
    languages: STORY_LANGUAGES,
    codes: STORY_LANGUAGE_CODES,
    presets: LANGUAGE_PAIR_PRESETS,
    layouts: BILINGUAL_LAYOUTS,
  }
}
