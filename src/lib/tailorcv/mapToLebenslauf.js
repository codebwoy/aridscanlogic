/**
 * Map TailorCV structured candidate ↔ BizStart Lebenslauf / Anschreiben.
 */

import { emptyCV, emptyExperience, emptyEducation } from '@/lib/bizstart/lebenslauf/schema'
import { emptyAnschreiben, todayDeDE } from '@/lib/bizstart/anschreiben/schema'
import { emptyCandidateCv, normalizeCandidateCv } from './schema'

function splitName(fullName = '') {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return { vorname: '', nachname: '' }
  if (parts.length === 1) return { vorname: parts[0], nachname: '' }
  return { vorname: parts.slice(0, -1).join(' '), nachname: parts[parts.length - 1] }
}

function parseLocation(location = '') {
  const loc = String(location).trim()
  if (!loc) return { stadt: '', plz: '', strasse: '' }
  const plzMatch = loc.match(/\b(\d{5})\b/)
  const plz = plzMatch ? plzMatch[1] : ''
  let rest = plz ? loc.replace(plz, '').replace(/,\s*,/g, ',').trim() : loc
  rest = rest.replace(/^[,.\s]+|[,.\s]+$/g, '')
  // "Berlin" or "Strasse 1, 10115 Berlin"
  const commaParts = rest.split(',').map((s) => s.trim()).filter(Boolean)
  if (commaParts.length >= 2) {
    return { strasse: commaParts[0], plz, stadt: commaParts[commaParts.length - 1] }
  }
  return { strasse: '', plz, stadt: rest || '' }
}

/** Lebenslauf store → TailorCV candidate JSON. */
export function lebenslaufToCandidate(cv = emptyCV()) {
  const name = [cv.vorname, cv.nachname].filter(Boolean).join(' ').trim()
  const location = [cv.strasse, [cv.plz, cv.stadt].filter(Boolean).join(' ')].filter(Boolean).join(', ')
  const skills = []
  ;(cv.itSkills || []).forEach((s) => {
    if (s.software?.trim()) skills.push(`${s.software}${s.niveau ? ` (${s.niveau})` : ''}`)
  })
  ;(cv.sprachen || []).forEach((s) => {
    if (s.sprache?.trim()) skills.push(`${s.sprache}${s.niveau ? ` (${s.niveau})` : ''}`)
  })
  if (cv.weitereKenntnisse?.trim()) {
    cv.weitereKenntnisse
      .split(/[,;\n]/)
      .map((x) => x.trim())
      .filter(Boolean)
      .forEach((x) => skills.push(x))
  }

  return normalizeCandidateCv({
    contact: {
      name,
      email: cv.email || '',
      phone: cv.telefon || '',
      location,
      linkedin: cv.linkedin || '',
    },
    summary: cv.profil || '',
    skills,
    experience: (cv.erfahrung || []).map((e) => ({
      title: e.titel || '',
      company: e.unternehmen || '',
      location: e.stadt || '',
      start_date: e.von || '',
      end_date: e.bis || '',
      bullets: String(e.aufgaben || '')
        .split(/\n/)
        .map((b) => b.replace(/^[-•*]\s*/, '').trim())
        .filter(Boolean),
    })),
    education: (cv.ausbildung || []).map((e) => ({
      degree: e.abschluss || '',
      institution: e.institution || '',
      start_date: e.von || '',
      end_date: e.bis || '',
    })),
    certifications: (cv.weiterbildung || [])
      .map((w) => [w.jahr, w.titel, w.anbieter].filter(Boolean).join(' — '))
      .filter(Boolean),
    projects: [],
  })
}

/** Plain-text snapshot of Lebenslauf for paste/parse fallback. */
export function lebenslaufToPlainText(cv = emptyCV()) {
  const c = lebenslaufToCandidate(cv)
  const lines = []
  if (c.contact.name) lines.push(c.contact.name)
  if (cv.job_title) lines.push(cv.job_title)
  ;[c.contact.email, c.contact.phone, c.contact.location, c.contact.linkedin]
    .filter(Boolean)
    .forEach((x) => lines.push(x))
  lines.push('')
  if (c.summary) {
    lines.push('Profil', c.summary, '')
  }
  if (c.experience.length) {
    lines.push('Berufserfahrung')
    c.experience.forEach((e) => {
      lines.push(`${e.start_date} – ${e.end_date || 'heute'}: ${e.title} — ${e.company}`)
      e.bullets.forEach((b) => lines.push(`- ${b}`))
      lines.push('')
    })
  }
  if (c.education.length) {
    lines.push('Ausbildung')
    c.education.forEach((e) => {
      lines.push(`${e.start_date} – ${e.end_date}: ${e.degree} — ${e.institution}`)
    })
    lines.push('')
  }
  if (c.skills.length) {
    lines.push('Kenntnisse', c.skills.join(', '), '')
  }
  if (c.certifications.length) {
    lines.push('Weiterbildung', ...c.certifications.map((x) => `- ${x}`))
  }
  return lines.join('\n').trim()
}

/**
 * Merge tailored candidate into existing Lebenslauf (preserve photo, personal DE fields).
 * Produces German tabular Lebenslauf field layout.
 */
export function candidateToLebenslauf(candidate, baseCv = emptyCV(), jobInput = {}) {
  const c = normalizeCandidateCv(candidate)
  const { vorname, nachname } = splitName(c.contact.name)
  const loc = parseLocation(c.contact.location)

  // Reverse-chronological when dates are comparable (DE tabular norm)
  const experience = [...c.experience].sort((a, b) => compareDePeriod(b.start_date, a.start_date))
  const education = [...c.education].sort((a, b) => compareDePeriod(b.start_date, a.start_date))

  const next = {
    ...emptyCV(),
    ...baseCv,
    vorname: vorname || baseCv.vorname || '',
    nachname: nachname || baseCv.nachname || '',
    job_title: jobInput.job_title?.trim() || baseCv.job_title || experience[0]?.title || '',
    email: c.contact.email || baseCv.email || '',
    telefon: c.contact.phone || baseCv.telefon || '',
    linkedin: c.contact.linkedin || baseCv.linkedin || '',
    strasse: loc.strasse || baseCv.strasse || '',
    plz: loc.plz || baseCv.plz || '',
    stadt: loc.stadt || baseCv.stadt || '',
    profil: c.summary || baseCv.profil || '',
    erfahrung: experience.length
      ? experience.map((e) => ({
          ...emptyExperience(),
          titel: e.title,
          unternehmen: e.company,
          stadt: e.location,
          von: e.start_date,
          bis: e.end_date,
          aufgaben: e.bullets.join('\n'),
        }))
      : baseCv.erfahrung || [],
    ausbildung: education.length
      ? education.map((e) => ({
          ...emptyEducation(),
          abschluss: e.degree,
          institution: e.institution,
          von: e.start_date,
          bis: e.end_date,
        }))
      : baseCv.ausbildung || [],
    weitereKenntnisse: c.skills.length ? c.skills.join(', ') : baseCv.weitereKenntnisse || '',
  }
  return next
}

/** Rough period compare for DE dates (YYYY, MM.YYYY, MM/YYYY, YYYY-MM). */
function compareDePeriod(a, b) {
  const na = periodSortKey(a)
  const nb = periodSortKey(b)
  if (na === nb) return 0
  return na > nb ? 1 : -1
}

function periodSortKey(raw) {
  const s = String(raw || '').trim().toLowerCase()
  if (!s || /heute|current|present|jetzt|laufend/.test(s)) return 999999
  const m = s.match(/(\d{4})[./-]?(\d{1,2})?/) || s.match(/(\d{1,2})[./](\d{4})/)
  if (!m) return 0
  if (m[0].match(/^\d{4}/)) {
    const y = parseInt(m[1], 10)
    const mo = m[2] ? parseInt(m[2], 10) : 1
    return y * 100 + mo
  }
  const mo = parseInt(m[1], 10)
  const y = parseInt(m[2], 10)
  return y * 100 + mo
}

/**
 * Apply cover letter + job context onto Anschreiben (DIN sections).
 * Splits body into einleitung / hauptteil / motivation / schlussteil heuristically.
 */
export function coverLetterToAnschreiben(letterBody, jobInput = {}, base = emptyAnschreiben()) {
  const paragraphs = String(letterBody || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  let einleitung = ''
  let hauptteil = ''
  let motivation = ''
  let schlussteil = ''

  if (paragraphs.length === 0) {
    // keep empties
  } else if (paragraphs.length === 1) {
    hauptteil = paragraphs[0]
  } else if (paragraphs.length === 2) {
    einleitung = paragraphs[0]
    hauptteil = paragraphs[1]
  } else if (paragraphs.length === 3) {
    einleitung = paragraphs[0]
    hauptteil = paragraphs[1]
    schlussteil = paragraphs[2]
  } else {
    einleitung = paragraphs[0]
    hauptteil = paragraphs.slice(1, -2).join('\n\n')
    motivation = paragraphs[paragraphs.length - 2]
    schlussteil = paragraphs[paragraphs.length - 1]
  }

  const title = jobInput.job_title || ''
  const company = jobInput.company || ''

  return {
    ...emptyAnschreiben(),
    ...base,
    bewerbungsTyp: 'job',
    stellenTitel: title || base.stellenTitel || '',
    firma: company || base.firma || '',
    ortDatum: base.ortDatum || `${base.stadt || ''}, ${todayDeDE()}`.replace(/^,\s*/, ''),
    betreff:
      base.betreff ||
      (title
        ? `Bewerbung als ${title}${company ? ` — ${company}` : ''}`
        : base.betreff || ''),
    einleitung: einleitung || base.einleitung || '',
    hauptteil: hauptteil || base.hauptteil || '',
    motivation: motivation || base.motivation || '',
    schlussteil: schlussteil || base.schlussteil || '',
  }
}

export function emptyMappedCandidate() {
  return emptyCandidateCv()
}
