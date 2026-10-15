/** Desktop-only studio gate — sync with PROOFFORGE_DESKTOP_MIN_WIDTH */
export const DESKTOP_MIN_WIDTH = 1024

export const DESKTOP_SURFACE = 'desktop'

export function isDesktopViewport(widthPx) {
  return Number(widthPx) >= DESKTOP_MIN_WIDTH
}

/** Safe for web bundle (no pdf-lib) — manuscript language picker fallbacks. */
export {
  BOOK_LANGUAGE_CODES,
  BOOK_LANGUAGES,
  DEFAULT_BOOK_LANGUAGE,
  bookLanguagesPayload,
  bookLanguageCultureHint,
  bookLanguageLabel,
  bookLanguageVarieties,
  normalizeBookLanguage,
  normalizeBookLanguageVariety,
} from './book-languages.js'
