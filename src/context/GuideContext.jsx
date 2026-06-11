import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const GuideContext = createContext(null)
const SEEN_KEY = 'scanlogic_guide_intro_seen'

export function GuideProvider({ children, activeModule = 'docs' }) {
  const [open, setOpen] = useState(false)
  const [focusModule, setFocusModule] = useState(null)
  const openGuide = useCallback((moduleId) => {
    setFocusModule(moduleId ?? null)
    setOpen(true)
  }, [])

  const closeGuide = useCallback(() => setOpen(false), [])

  useEffect(() => {
    try {
      if (localStorage.getItem(SEEN_KEY)) return
      const t = window.setTimeout(() => {
        setOpen(true)
        setFocusModule('docs')
        localStorage.setItem(SEEN_KEY, '1')
      }, 1200)
      return () => window.clearTimeout(t)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo(
    () => ({
      open,
      focusModule: focusModule ?? activeModule,
      activeModule,
      openGuide,
      closeGuide,
    }),
    [open, focusModule, activeModule, openGuide, closeGuide]
  )

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>
}

export function useGuide() {
  const ctx = useContext(GuideContext)
  if (!ctx) throw new Error('useGuide must be used within GuideProvider')
  return ctx
}

export function useGuideOptional() {
  return useContext(GuideContext)
}
