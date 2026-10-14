import { useEffect, useMemo, useState } from 'react'
import { isDesktopViewport } from './lib/desktopGate'
import DesktopGate from './pages/DesktopGate'
import Studio from './pages/Studio'
import Storefront from './pages/Storefront'

function parseView() {
  const params = new URLSearchParams(window.location.search)
  const hash = (window.location.hash || '').replace(/^#/, '')
  const view = params.get('view') || hash || 'studio'
  const slug = params.get('slug') || ''
  const lang = params.get('lang') === 'de' ? 'de' : 'en'
  return { view, slug, lang }
}

export default function App() {
  const initial = useMemo(() => parseView(), [])
  const [view, setView] = useState(initial.view)
  const [slug, setSlug] = useState(initial.slug)
  const [lang] = useState(initial.lang)
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    const onHash = () => {
      const p = parseView()
      setView(p.view)
      setSlug(p.slug)
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('hashchange', onHash)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('hashchange', onHash)
    }
  }, [])

  // Public storefront readable on any width
  if (view === 'store' && slug) {
    return <Storefront slug={slug} />
  }

  if (!isDesktopViewport(width)) {
    return <DesktopGate lang={lang} />
  }

  return <Studio lang={lang} />
}
