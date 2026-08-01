/**
 * Post-generation guardrail: flag entities in tailored CV that were not in the source.
 * Surfaces "please verify" items — does not auto-reject.
 */

import { normalizeCandidateCv } from './schema'

function norm(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9äöüß\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function collectEntities(cv) {
  const c = normalizeCandidateCv(cv)
  const companies = new Set()
  const titles = new Set()
  const dates = new Set()
  const degrees = new Set()
  const institutions = new Set()
  const metrics = new Set()
  const certifications = new Set()

  const metricRe = /\b\d+([.,]\d+)?\s*(%|€|eur|usd|\$|k|m|mio|million|tausend)?\b/gi

  c.experience.forEach((e) => {
    if (e.company) companies.add(norm(e.company))
    if (e.title) titles.add(norm(e.title))
    if (e.start_date) dates.add(norm(e.start_date))
    if (e.end_date) dates.add(norm(e.end_date))
    e.bullets.forEach((b) => {
      const matches = b.match(metricRe) || []
      matches.forEach((m) => metrics.add(norm(m)))
    })
  })

  c.education.forEach((e) => {
    if (e.degree) degrees.add(norm(e.degree))
    if (e.institution) institutions.add(norm(e.institution))
    if (e.start_date) dates.add(norm(e.start_date))
    if (e.end_date) dates.add(norm(e.end_date))
  })

  c.certifications.forEach((cert) => {
    if (cert) certifications.add(norm(cert))
  })

  if (c.contact.name) {
    /* name changes are unusual — track separately if needed */
  }

  return { companies, titles, dates, degrees, institutions, metrics, certifications }
}

function findNew(sourceSet, tailoredSet) {
  const out = []
  tailoredSet.forEach((v) => {
    if (!v) return
    if (!sourceSet.has(v)) {
      // soft match: allow if any source entity contains / is contained
      let soft = false
      sourceSet.forEach((s) => {
        if (!s) return
        if (s.includes(v) || v.includes(s)) soft = true
      })
      if (!soft) out.push(v)
    }
  })
  return out
}

/**
 * @returns {{ flags: Array<{ type: string, value: string, message: string }>, ok: boolean }}
 */
export function validateNoFabrication(sourceCv, tailoredCv) {
  const source = collectEntities(sourceCv)
  const tailored = collectEntities(tailoredCv)
  const flags = []

  const pushAll = (type, values, messageDe) => {
    values.forEach((value) => {
      flags.push({
        type,
        value,
        message: messageDe.replace('{v}', value),
      })
    })
  }

  pushAll(
    'company',
    findNew(source.companies, tailored.companies),
    'Neuer Arbeitgeber „{v}" — bitte prüfen (nicht in der Quell-CV gefunden).'
  )
  pushAll(
    'title',
    findNew(source.titles, tailored.titles),
    'Neue Berufsbezeichnung „{v}" — bitte prüfen.'
  )
  pushAll(
    'degree',
    findNew(source.degrees, tailored.degrees),
    'Neuer Abschluss „{v}" — bitte prüfen.'
  )
  pushAll(
    'institution',
    findNew(source.institutions, tailored.institutions),
    'Neue Bildungseinrichtung „{v}" — bitte prüfen.'
  )
  pushAll(
    'certification',
    findNew(source.certifications, tailored.certifications),
    'Neue Zertifizierung „{v}" — bitte prüfen.'
  )
  pushAll(
    'metric',
    findNew(source.metrics, tailored.metrics),
    'Neue Kennzahl „{v}" — bitte prüfen (Zahlen nicht erfinden).'
  )
  pushAll(
    'date',
    findNew(source.dates, tailored.dates),
    'Neues Datum „{v}" — bitte prüfen.'
  )

  return { flags, ok: flags.length === 0 }
}
