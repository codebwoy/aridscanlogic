import { useEffect, useRef } from 'react'

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'

export function useFocusTrap(active) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const root = containerRef.current
    if (!root) return

    const previouslyFocused = document.activeElement
    const focusables = () => [...root.querySelectorAll(FOCUSABLE)]
    focusables()[0]?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        root.dispatchEvent(new CustomEvent('modal-escape', { bubbles: true }))
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    root.addEventListener('keydown', onKeyDown)
    return () => {
      root.removeEventListener('keydown', onKeyDown)
      if (previouslyFocused?.focus) previouslyFocused.focus()
    }
  }, [active])

  return containerRef
}
