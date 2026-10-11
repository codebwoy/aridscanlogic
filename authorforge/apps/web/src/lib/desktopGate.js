import { DESKTOP_MIN_WIDTH, isDesktopViewport } from '@authorforge/shared'

export { DESKTOP_MIN_WIDTH, isDesktopViewport }

export function useViewportWidth() {
  if (typeof window === 'undefined') return 0
  return window.innerWidth
}
