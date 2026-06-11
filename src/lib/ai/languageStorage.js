const KEY = 'scanlogic_ai_language'
const LEGACY_KEY = 'scanlogic_lawyer_language'

export function getAiLanguage() {
  try {
    const v = localStorage.getItem(KEY) || localStorage.getItem(LEGACY_KEY)
    return v === 'en' ? 'en' : 'de'
  } catch {
    return 'de'
  }
}

export function saveAiLanguage(lang) {
  try {
    const next = lang === 'en' ? 'en' : 'de'
    localStorage.setItem(KEY, next)
    localStorage.setItem(LEGACY_KEY, next)
  } catch {
    /* ignore */
  }
}

/** @deprecated use getAiLanguage */
export const getLawyerLanguage = getAiLanguage

/** @deprecated use saveAiLanguage */
export const saveLawyerLanguage = saveAiLanguage
