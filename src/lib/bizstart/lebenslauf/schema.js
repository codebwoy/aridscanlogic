/** German tabular CV (Lebenslauf) — data model & constants */

export const FAMILIENSTAND_OPTIONS = [
  'ledig',
  'verheiratet',
  'geschieden',
  'verwitwet',
  'eingetragene Lebenspartnerschaft',
]

export const FUEHRERSCHEIN_OPTIONS = [
  'Kein',
  'Klasse B',
  'Klasse B + eigener PKW',
  'Klasse A',
  'Klasse C',
  'Klasse BE',
]

export const LANGUAGE_LEVELS = [
  'Muttersprache',
  'C2',
  'C1',
  'B2',
  'B1',
  'A2',
  'A1',
  'Grundkenntnisse',
]

export const IT_LEVELS = ['Experte', 'Fortgeschritten', 'Grundkenntnisse']

export function todayDeDE() {
  return new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function emptyExperience() {
  return { von: '', bis: '', titel: '', unternehmen: '', stadt: '', branche: '', aufgaben: '' }
}

export function emptyEducation() {
  return { von: '', bis: '', abschluss: '', institution: '', stadt: '', note: '', schwerpunkte: '' }
}

export function emptyTraining() {
  return { jahr: '', titel: '', anbieter: '' }
}

export function emptyLanguage() {
  return { sprache: '', niveau: 'B2', zertifikat: '' }
}

export function emptyITSkill() {
  return { software: '', niveau: 'Grundkenntnisse' }
}

export function emptyVolunteering() {
  return { zeitraum: '', taetigkeit: '', organisation: '' }
}

/** @returns {import('./types').CV} */
export function emptyCV() {
  return {
    vorname: '',
    nachname: '',
    job_title: '',
    strasse: '',
    plz: '',
    stadt: '',
    telefon: '',
    email: '',
    linkedin: '',
    geburtsdatum: '',
    geburtsort: '',
    nationalitaet: '',
    familienstand: 'ledig',
    fuehrerschein: 'Kein',
    photo: '',
    profil: '',
    erfahrung: [],
    ausbildung: [],
    weiterbildung: [],
    sprachen: [],
    itSkills: [],
    weitereKenntnisse: '',
    ehrenamt: [],
    interessen: '',
    unterschriftOrt: '',
    unterschriftDatum: todayDeDE(),
    unterschriftName: '',
  }
}

export function cvDisplayName(cv) {
  return [cv.vorname, cv.nachname].filter(Boolean).join(' ').trim()
}

export function cvSlug(cv) {
  const name = cvDisplayName(cv) || 'Lebenslauf'
  return name.replace(/[^\wäöüß-]+/gi, '_').slice(0, 40)
}

/** 0–100 completeness for funding readiness */
export function cvCompleteness(cv) {
  if (!cv) return 0
  let earned = 0
  let total = 0
  const req = (val, w = 1) => {
    total += w
    if (typeof val === 'string' && val.trim()) earned += w
  }
  req(cv.vorname, 2)
  req(cv.nachname, 2)
  req(cv.email, 1)
  req(cv.telefon, 1)
  req(cv.strasse, 1)
  req(cv.plz, 1)
  req(cv.stadt, 1)
  req(cv.profil, 3)
  req(cv.geburtsdatum, 1)
  req(cv.unterschriftOrt, 1)
  total += 3
  if (cv.erfahrung?.length && cv.erfahrung.some((e) => e.titel?.trim())) earned += 3
  total += 2
  if (cv.ausbildung?.length && cv.ausbildung.some((e) => e.abschluss?.trim())) earned += 2
  total += 1
  if (cv.sprachen?.length && cv.sprachen.some((s) => s.sprache?.trim())) earned += 1
  return total > 0 ? Math.min(100, Math.round((earned / total) * 100)) : 0
}

export function cvIsSubmissionReady(cv) {
  return cvCompleteness(cv) >= 70 && cvDisplayName(cv).length > 0
}
