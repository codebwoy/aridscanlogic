/**
 * Generic German template placeholders — never real personal data.
 * Used for empty form hints and preview-only filler (not exported).
 */

export const BEWERBUNG_TEMPLATE = {
  vorname: 'Max',
  nachname: 'Mustermann',
  fullName: 'Max Mustermann',
  berufsbezeichnung: 'Berufsbezeichnung',
  jobTitle: 'Berufsbezeichnung',
  strasse: 'Musterstraße 1',
  plz: '12345',
  stadt: 'Musterstadt',
  telefon: '030 0000000',
  email: 'max.mustermann@beispiel.de',
  firma: 'Muster GmbH',
  abteilung: 'Personalabteilung',
  ansprechpartnerNachname: 'Musterfrau',
  firmaStrasse: 'Beispielweg 10',
  firmaPlz: '10115',
  firmaStadt: 'Berlin',
  ortDatum: 'Musterstadt, TT.MM.JJJJ',
  stellenTitel: 'Stellenbezeichnung',
  referenzNr: '00000',
  quelle: 'Stellenportal',
  betreff: 'Bewerbung als Stellenbezeichnung — Ref.-Nr. 00000',
  einleitung: 'als erfahrener Fachmann mit relevanter Berufserfahrung verfolge ich Ihre Ausschreibung mit Interesse.',
  hauptteil:
    'In meiner bisherigen Tätigkeit konnte ich nachweisbare Ergebnisse erzielen. Diese Erfahrung möchte ich gezielt in Ihr Team einbringen.',
  motivation: 'Ihr Unternehmen überzeugt mich durch seinen fachlichen Schwerpunkt und seine Entwicklungsperspektive.',
  schlussteil:
    'Für eine Arbeitsaufnahme stehe ich Ihnen nach Vereinbarung zur Verfügung. Meine Gehaltsvorstellung nennen wir gerne im persönlichen Gespräch.',
  unterschriftName: 'Max Mustermann',
  anlagenHinweis: 'Anlagen',
}

function pick(userVal, templateVal) {
  const v = typeof userVal === 'string' ? userVal.trim() : userVal
  return v ? userVal : templateVal
}

/** Preview-only merge — exports must use raw user data, not this. */
export function anschreibenForPreview(a) {
  if (!a) return { ...BEWERBUNG_TEMPLATE, _isTemplate: true }
  const t = BEWERBUNG_TEMPLATE
  const merged = {
    ...a,
    vorname: pick(a.vorname, t.vorname),
    nachname: pick(a.nachname, t.nachname),
    berufsbezeichnung: pick(a.berufsbezeichnung, t.berufsbezeichnung),
    strasse: pick(a.strasse, t.strasse),
    plz: pick(a.plz, t.plz),
    stadt: pick(a.stadt, t.stadt),
    telefon: pick(a.telefon, t.telefon),
    email: pick(a.email, t.email),
    firma: pick(a.firma, t.firma),
    abteilung: pick(a.abteilung, t.abteilung),
    ansprechpartnerNachname: pick(a.ansprechpartnerNachname, t.ansprechpartnerNachname),
    firmaStrasse: pick(a.firmaStrasse, t.firmaStrasse),
    firmaPlz: pick(a.firmaPlz, t.firmaPlz),
    firmaStadt: pick(a.firmaStadt, t.firmaStadt),
    ortDatum: pick(a.ortDatum, t.ortDatum),
    stellenTitel: pick(a.stellenTitel, t.stellenTitel),
    betreff: pick(a.betreff, t.betreff),
    einleitung: pick(a.einleitung, t.einleitung),
    hauptteil: pick(a.hauptteil, t.hauptteil),
    motivation: pick(a.motivation, t.motivation),
    schlussteil: pick(a.schlussteil, t.schlussteil),
    unterschriftName: pick(a.unterschriftName, t.unterschriftName),
    anlagenHinweis: pick(a.anlagenHinweis, t.anlagenHinweis),
  }
  merged._placeholderKeys = Object.keys(a || {}).filter((k) => {
    const v = a[k]
    return (typeof v !== 'string' || !v.trim()) && k in t
  })
  return merged
}

/** Preview-only merge for Lebenslauf. */
export function cvForPreview(cv) {
  if (!cv) return { ...BEWERBUNG_TEMPLATE, job_title: BEWERBUNG_TEMPLATE.jobTitle, _isTemplate: true }
  const t = BEWERBUNG_TEMPLATE
  return {
    ...cv,
    vorname: pick(cv.vorname, t.vorname),
    nachname: pick(cv.nachname, t.nachname),
    job_title: pick(cv.job_title, t.jobTitle),
    strasse: pick(cv.strasse, t.strasse),
    plz: pick(cv.plz, t.plz),
    stadt: pick(cv.stadt, t.stadt),
    telefon: pick(cv.telefon, t.telefon),
    email: pick(cv.email, t.email),
    profil: pick(cv.profil, 'Kurzprofil — hier Ihre Stärken und Schwerpunkte beschreiben.'),
    unterschriftName: pick(cv.unterschriftName, t.unterschriftName),
    unterschriftOrt: pick(cv.unterschriftOrt, t.stadt),
    unterschriftDatum: pick(cv.unterschriftDatum, t.ortDatum.split(', ')[1] || 'TT.MM.JJJJ'),
  }
}

export function isPlaceholderField(obj, key, raw) {
  if (!raw) return true
  const v = typeof raw[key] === 'string' ? raw[key].trim() : raw[key]
  return !v
}

export function hasAnschreibenUserData(a) {
  const name = [a?.vorname, a?.nachname].filter((x) => x?.trim()).join(' ').trim()
  return Boolean(name)
}

export function hasCvUserData(cv) {
  const name = [cv?.vorname, cv?.nachname].filter((x) => x?.trim()).join(' ').trim()
  return Boolean(name)
}
