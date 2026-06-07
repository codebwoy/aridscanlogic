const VALID_TABS = new Set(['docs', 'tax', 'docdraft', 'contracts', 'lawyer', 'settings'])

export function tabFromHash() {
  const hash = window.location.hash.replace(/^#/, '')
  return VALID_TABS.has(hash) ? hash : 'docs'
}

export function setTabHash(tab) {
  if (!VALID_TABS.has(tab)) return
  const next = `#${tab}`
  if (window.location.hash !== next) {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${next}`)
  }
}

export function subscribeTabHash(onTab) {
  const handler = () => onTab(tabFromHash())
  window.addEventListener('hashchange', handler)
  return () => window.removeEventListener('hashchange', handler)
}

export { VALID_TABS }
