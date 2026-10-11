/**
 * Launch StoryForge desktop studio from ScanLogic (Amazon Hub).
 * Mobile / narrow viewports must not open the editor — show messaging instead.
 */

export const STORYFORGE_DESKTOP_MIN_WIDTH = 1024

export function getStoryforgeWebUrl() {
  const raw = (import.meta.env.VITE_STORYFORGE_URL || 'http://127.0.0.1:5180').trim()
  return raw.replace(/\/$/, '')
}

export function isStoryforgeDesktopViewport(width = typeof window !== 'undefined' ? window.innerWidth : 0) {
  return Number(width) >= STORYFORGE_DESKTOP_MIN_WIDTH
}

/**
 * @param {{ view?: 'studio' | 'launchpad' }} [opts]
 * @returns {{ opened: boolean, reason?: 'mobile' | 'popup_blocked', url?: string }}
 */
export function launchStoryforgeDesktop(opts = {}) {
  if (!isStoryforgeDesktopViewport()) {
    return { opened: false, reason: 'mobile' }
  }
  const base = getStoryforgeWebUrl()
  const view = opts.view === 'launchpad' ? 'launchpad' : 'studio'
  const url = `${base}/?view=${view}#${view}`
  const win = window.open(url, 'storyforge_studio', 'noopener,noreferrer')
  if (!win) return { opened: false, reason: 'popup_blocked', url }
  return { opened: true, url }
}
