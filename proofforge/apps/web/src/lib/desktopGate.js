import { DESKTOP_MIN_WIDTH } from '@proofforge/shared'

export function isDesktop() {
  return typeof window !== 'undefined' && window.innerWidth >= DESKTOP_MIN_WIDTH
}

export { DESKTOP_MIN_WIDTH }
