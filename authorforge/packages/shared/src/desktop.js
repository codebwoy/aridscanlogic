/** Desktop-only studio gate — sync with AUTHORFORGE_DESKTOP_MIN_WIDTH */
export const DESKTOP_MIN_WIDTH = 1024

export const DESKTOP_SURFACE = 'desktop'

export function isDesktopViewport(widthPx) {
  return Number(widthPx) >= DESKTOP_MIN_WIDTH
}
