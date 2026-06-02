import { DEFAULT_DESCRIPTION, DEFAULT_KEYWORDS, PAGE_SEO, SITE_NAME, absoluteUrl } from './siteConfig'

function setMeta(name, content, attr = 'name') {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel, href) {
  if (!href) return
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * @param {'suite'|'docs'|'tax'|'docdraft'|'contracts'|'lawyer'|'settings'|'scanvault'} pageKey
 */
export function applySeo(pageKey = 'suite') {
  const page = PAGE_SEO[pageKey] || PAGE_SEO.suite
  const title = page.title
  const description = page.description || DEFAULT_DESCRIPTION
  const url = absoluteUrl('/')

  document.title = title
  setMeta('description', description)
  setMeta('keywords', DEFAULT_KEYWORDS)
  setMeta('robots', 'index, follow, max-image-preview:large')
  setLink('canonical', url)

  setMeta('og:title', title, 'property')
  setMeta('og:description', description, 'property')
  setMeta('og:url', url, 'property')
  setMeta('og:type', 'website', 'property')
  setMeta('og:site_name', SITE_NAME, 'property')
  setMeta('og:locale', 'de_DE', 'property')
  setMeta('og:image', absoluteUrl('/og-image.png'), 'property')
  setMeta('og:image:alt', 'ScanLogic Business Suite Logo', 'property')

  setMeta('twitter:card', 'summary_large_image')
  setMeta('twitter:title', title)
  setMeta('twitter:description', description)
  setMeta('twitter:image', absoluteUrl('/og-image.png'))
}
