import { emptyAnschreiben, todayDeDE, anschreibenDisplayName } from './schema'
import { loadCv } from '@/lib/bizstart/lebenslauf/store'
import { cvDisplayName } from '@/lib/bizstart/lebenslauf/schema'

const KEY = 'scanlogic_bizstart_anschreiben'

function read() {
  try {
    const v = localStorage.getItem(KEY)
    return v ? JSON.parse(v) : null
  } catch {
    return null
  }
}

function write(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function loadAnschreiben() {
  const raw = read()
  if (!raw) return emptyAnschreiben()
  return { ...emptyAnschreiben(), ...raw }
}

export function saveAnschreiben(a) {
  const payload = { ...a, savedAt: new Date().toISOString() }
  write(payload)
  return payload
}

export function resetAnschreiben() {
  localStorage.removeItem(KEY)
  return emptyAnschreiben()
}

export function anschreibenSavedAt(a) {
  if (!a?.savedAt) return null
  try {
    return new Date(a.savedAt).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return null
  }
}

export function importAnschreibenFromCv(cv = loadCv()) {
  const a = loadAnschreiben()
  const ort = cv.stadt || a.stadt
  return saveAnschreiben({
    ...a,
    vorname: a.vorname || cv.vorname || '',
    nachname: a.nachname || cv.nachname || '',
    strasse: a.strasse || cv.strasse || '',
    plz: a.plz || cv.plz || '',
    stadt: a.stadt || cv.stadt || '',
    telefon: a.telefon || cv.telefon || '',
    email: a.email || cv.email || '',
    stellenTitel: a.stellenTitel || '',
    berufsbezeichnung: a.berufsbezeichnung || cv.job_title || '',
    ortDatum: a.ortDatum || (ort ? `${ort}, ${todayDeDE()}` : todayDeDE()),
    unterschriftName: a.unterschriftName || cvDisplayName(cv) || anschreibenDisplayName(a),
  })
}

export function importAnschreibenFromBizStart(formData) {
  let a = importAnschreibenFromCv()
  const street = [formData.street, formData.houseNumber].filter(Boolean).join(' ').trim()
  return saveAnschreiben({
    ...a,
    vorname: a.vorname || formData.firstName || '',
    nachname: a.nachname || formData.lastName || '',
    strasse: a.strasse || street,
    plz: a.plz || formData.plz || '',
    stadt: a.stadt || formData.city || '',
    telefon: a.telefon || formData.phone || '',
    email: a.email || formData.email || '',
    stellenTitel: a.stellenTitel || formData.intendedBusinessName || '',
    ortDatum: a.ortDatum || (formData.city ? `${formData.city}, ${todayDeDE()}` : todayDeDE()),
  })
}
