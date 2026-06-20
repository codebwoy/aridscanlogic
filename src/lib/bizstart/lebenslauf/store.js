import { emptyCV } from './schema'

const CV_KEY = 'scanlogic_bizstart_lebenslauf'

function read() {
  try {
    const v = localStorage.getItem(CV_KEY)
    return v ? JSON.parse(v) : null
  } catch {
    return null
  }
}

function write(data) {
  localStorage.setItem(CV_KEY, JSON.stringify(data))
}

export function loadCv() {
  const raw = read()
  if (!raw) return emptyCV()
  return { ...emptyCV(), ...raw }
}

export function saveCv(cv) {
  const payload = { ...cv, savedAt: new Date().toISOString() }
  write(payload)
  return payload
}

export function resetCv() {
  localStorage.removeItem(CV_KEY)
  return emptyCV()
}

export function cvSavedAt(cv) {
  if (!cv?.savedAt) return null
  try {
    return new Date(cv.savedAt).toLocaleString('de-DE', {
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

/** Prefill from BizStart info step */
export function importCvFromBizStart(formData) {
  const cv = loadCv()
  const street = [formData.street, formData.houseNumber].filter(Boolean).join(' ').trim()
  return saveCv({
    ...cv,
    vorname: cv.vorname || formData.firstName || '',
    nachname: cv.nachname || formData.lastName || '',
    job_title: cv.job_title || formData.intendedBusinessName || formData.businessActivityDescription?.slice(0, 80) || '',
    strasse: cv.strasse || street,
    plz: cv.plz || formData.plz || '',
    stadt: cv.stadt || formData.city || '',
    telefon: cv.telefon || formData.phone || '',
    email: cv.email || formData.email || '',
    geburtsdatum: cv.geburtsdatum || formData.dateOfBirth || '',
    nationalitaet: cv.nationalitaet || formData.nationality || '',
    unterschriftOrt: cv.unterschriftOrt || formData.city || '',
  })
}
