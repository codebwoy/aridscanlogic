/** German Anschreiben (cover letter) — DIN 5008 data model */

export const BEWERBUNGS_TYP_OPTIONS = [
  { id: 'job', label: 'Stellenbewerbung' },
  { id: 'foerderung', label: 'Förderung / Zuschuss' },
  { id: 'award', label: 'Wettbewerb / Auszeichnung' },
  { id: 'bank', label: 'Bank / Kredit' },
  { id: 'gruendung', label: 'Gründung / Selbstständigkeit' },
  { id: 'general', label: 'Allgemein' },
]

export const ANREDE_OPTIONS = [
  { id: 'frau', label: 'Frau' },
  { id: 'herr', label: 'Herr' },
  { id: 'neutral', label: 'Damen und Herren (neutral)' },
]

export function todayDeDE() {
  return new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function emptyAnschreiben() {
  return {
    vorname: '',
    nachname: '',
    berufsbezeichnung: '',
    strasse: '',
    plz: '',
    stadt: '',
    telefon: '',
    email: '',
    firma: '',
    abteilung: 'Personalabteilung',
    ansprechpartnerAnrede: 'neutral',
    ansprechpartnerNachname: '',
    firmaStrasse: '',
    firmaPlz: '',
    firmaStadt: '',
    ortDatum: '',
    bewerbungsTyp: 'job',
    stellenTitel: '',
    referenzNr: '',
    quelle: '',
    betreff: '',
    einleitung: '',
    hauptteil: '',
    motivation: '',
    schlussteil: '',
    grussformel: 'Mit freundlichen Grüßen',
    unterschriftName: '',
    anlagenHinweis: 'Anlagen',
    anschreibenAiPolished: {},
    anschreibenAiComplete: false,
  }
}

export function anschreibenDisplayName(a) {
  return [a.vorname, a.nachname].filter(Boolean).join(' ').trim()
}

export function anschreibenSlug(a) {
  const name = anschreibenDisplayName(a) || 'Anschreiben'
  return name.replace(/[^\wäöüß-]+/gi, '_').slice(0, 40)
}

export function buildAnrede(a) {
  const nachname = a.ansprechpartnerNachname?.trim()
  if (nachname && a.ansprechpartnerAnrede === 'frau') {
    return `Sehr geehrte Frau ${nachname},`
  }
  if (nachname && a.ansprechpartnerAnrede === 'herr') {
    return `Sehr geehrter Herr ${nachname},`
  }
  return 'Sehr geehrte Damen und Herren,'
}

/** Lowercase first letter for DIN Anrede convention — use on preview/export/AI only, not while typing. */
export function normalizeEinleitung(text) {
  if (!text?.trim()) return ''
  const t = text.trim()
  if (t.length > 0 && t[0] === t[0].toUpperCase() && t[0] !== t[0].toLowerCase()) {
    return t[0].toLowerCase() + t.slice(1)
  }
  return t
}

export function defaultBetreff(a) {
  if (a.betreff?.trim()) return a.betreff.trim()
  const parts = []
  if (a.stellenTitel?.trim()) parts.push(`Bewerbung als ${a.stellenTitel.trim()}`)
  if (a.referenzNr?.trim()) parts.push(`Ref.-Nr. ${a.referenzNr.trim()}`)
  if (a.quelle?.trim()) parts.push(`Ihre Stellenausschreibung auf ${a.quelle.trim()}`)
  return parts.join(' — ') || ''
}

export function anschreibenCompleteness(a) {
  if (!a) return 0
  let earned = 0
  let total = 0
  const req = (val, w = 1) => {
    total += w
    if (typeof val === 'string' && val.trim()) earned += w
  }
  req(anschreibenDisplayName(a), 2)
  req(a.strasse, 1)
  req(a.email, 1)
  req(a.firma, 2)
  req(a.firmaStadt, 1)
  req(a.ortDatum, 1)
  req(a.betreff || defaultBetreff(a), 2)
  req(a.einleitung, 3)
  req(a.hauptteil, 3)
  req(a.schlussteil, 2)
  req(a.motivation, 1)
  return total > 0 ? Math.min(100, Math.round((earned / total) * 100)) : 0
}

export function anschreibenIsSubmissionReady(a) {
  return anschreibenCompleteness(a) >= 75 && !!a.einleitung?.trim() && !!a.hauptteil?.trim()
}
