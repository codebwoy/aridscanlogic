/** User preference: include ScanLogic header/footer on generated PDFs (default: off). */

const STORAGE_KEY = 'scanlogic_document_branding'

export function isDocumentBrandingEnabled() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'branded'
  } catch {
    return false
  }
}

export function setDocumentBrandingPreference(enabled) {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'branded' : 'clean')
  } catch {
    /* ignore */
  }
}

/** @param {boolean|'full'|'clean'|'branded'|undefined} override */
export function resolvePdfBranding(override) {
  if (override === true || override === 'full' || override === 'branded') return 'full'
  if (override === false || override === 'clean') return 'clean'
  return isDocumentBrandingEnabled() ? 'full' : 'clean'
}

export function disclaimerForBranding(brandedText, cleanText, branding) {
  return resolvePdfBranding(branding) === 'full' ? brandedText : cleanText
}
