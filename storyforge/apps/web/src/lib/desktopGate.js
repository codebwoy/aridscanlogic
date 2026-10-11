import { DESKTOP_MIN_WIDTH, isDesktopViewport } from '@storyforge/shared'

export function getViewportWidth() {
  return typeof window !== 'undefined' ? window.innerWidth : 0
}

export function checkDesktopGate() {
  const width = getViewportWidth()
  return {
    ok: isDesktopViewport(width),
    width,
    minWidth: DESKTOP_MIN_WIDTH,
  }
}
