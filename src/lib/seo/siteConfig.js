/** Public site URL (no trailing slash). Override with VITE_SITE_URL for custom domains. */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || 'https://codebwoy.github.io/aridscanlogic'
).replace(/\/$/, '')

export const SITE_NAME = 'ScanLogic Business Suite'
export const SITE_TAGLINE = 'Dokumente scannen, Steuern, Rechnungen, Verträge & KI-Coach'

export const DEFAULT_DESCRIPTION =
  'ScanLogic Business Suite: mobile Dokumenten-Scanner (OCR), Tax Vault für Belege & Fahrtenbuch, DocDraft für Rechnungen, Contract Safe für Verträge und Herr Müller KI für Finanzen, Steuern & Recht. Kostenlos im Browser — PWA installierbar.'

export const DEFAULT_KEYWORDS = [
  'ScanLogic',
  'Dokumentenscanner',
  'OCR',
  'Belegscanner',
  'Tax Vault',
  'Steuer App',
  'Rechnung schreiben',
  'DocDraft',
  'Vertrag Vorlage',
  'KMU Software',
  'Freelancer Tools',
  'Herr Müller KI',
  'Business Suite',
  'Kleinunternehmer',
  'Fahrtenbuch App',
].join(', ')

export const PAGE_SEO = {
  suite: {
    title: 'ScanLogic — Business Suite | Scan, Steuern, Rechnungen & KI',
    description: DEFAULT_DESCRIPTION,
  },
  docs: {
    title: 'Docs — Dokument scannen & OCR | ScanLogic',
    description:
      'Mehrseitiger Dokumentenscan mit KI-OCR, Ordnern und Export. Belege direkt an Tax Vault oder Rechnungen an DocDraft senden.',
  },
  tax: {
    title: 'Tax Vault — Belege, Fahrtenbuch & Steuerübersicht | ScanLogic',
    description:
      'Belege scannen, Ausgaben kategorisieren, Kilometer buchen und Steuer-Schätzungen für Ihr Unternehmen — inkl. BizStart Germany.',
  },
  docdraft: {
    title: 'DocDraft — Angebote & Rechnungen | ScanLogic',
    description:
      'Angebote und Rechnungen mit MwSt, Kunden- und Produktkatalog, wiederkehrende Rechnungen und PDF-Export.',
  },
  contracts: {
    title: 'Contract Safe — Verträge & E-Signatur | ScanLogic',
    description:
      'Deutsche Vertragsvorlagen (NDA, Freelance, SaaS), Designer, Signatur-Flow und Audit-Protokoll.',
  },
  lawyer: {
    title: 'Lawyer AI — Herr Müller Business-Coach | ScanLogic',
    description:
      'KI-Mentor für Finanzen, Steuern, Recht und Strategie — 13 Bereiche. Bildungs-Coaching, kein Ersatz für Anwalt oder Steuerberater.',
  },
  settings: {
    title: 'Einstellungen | ScanLogic Business Suite',
    description: 'Profil, Premium, Supabase-Sync, PWA-Installation und ScanVault Scanner.',
  },
  scanvault: {
    title: 'ScanVault — Dokumenten-Scanner App | ScanLogic',
    description:
      'Fokussierter Scanner mit Kantenerkennung, Ordnern, Share-Links und Backup — ideal für unterwegs.',
  },
}

export function absoluteUrl(path = '/') {
  const p = path.startsWith('/') ? path : `/${path}`
  const base = import.meta.env.BASE_URL || '/'
  const basePath = base.endsWith('/') ? base.slice(0, -1) : base
  if (basePath && basePath !== '/' && p.startsWith(basePath)) {
    return `${SITE_URL}${p}`
  }
  const joined = `${basePath === '/' ? '' : basePath}${p === '/' ? '' : p}` || ''
  return `${SITE_URL}${joined || '/'}`
}
