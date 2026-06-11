const KEY = 'scanlogic_lawyer_language'

export function getLawyerLanguage() {
  try {
    return localStorage.getItem(KEY) === 'en' ? 'en' : 'de'
  } catch {
    return 'de'
  }
}

export function saveLawyerLanguage(lang) {
  try {
    localStorage.setItem(KEY, lang === 'en' ? 'en' : 'de')
  } catch {
    /* ignore */
  }
}
