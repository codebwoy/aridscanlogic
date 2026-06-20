import appApi from '@/lib/appApi'
import { aiLanguageInstruction } from '@/lib/ai/promptLanguage'
import { cvDisplayName } from './schema'

function stripAiWrapper(text) {
  if (!text) return ''
  let t = text.trim()
  if (t.startsWith('"') && t.endsWith('"')) t = t.slice(1, -1)
  if (t.startsWith('```')) {
    t = t.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '').trim()
  }
  return t
}

/** Collect CV + BizStart facts for AI context. */
export function buildCvContext(cv, formData = {}) {
  const lines = []
  const add = (label, val) => {
    if (val != null && String(val).trim()) lines.push(`${label}: ${String(val).trim()}`)
  }
  add('Name', cvDisplayName(cv))
  add('Berufsbezeichnung', cv.job_title)
  add('Profil (Entwurf)', cv.profil?.slice(0, 200))
  add('BizStart Tätigkeit', formData.businessActivityDescription)
  add('Geschäftsname', formData.intendedBusinessName || formData.businessName)
  add('Stadt', cv.stadt || formData.city)
  add('Sprachen', (cv.sprachen || []).map((s) => `${s.sprache} (${s.niveau})`).join(', '))
  add(
    'Letzte Position',
    cv.erfahrung?.[0] ? `${cv.erfahrung[0].titel} @ ${cv.erfahrung[0].unternehmen}` : ''
  )
  add(
    'Ausbildung',
    cv.ausbildung?.[0] ? `${cv.ausbildung[0].abschluss} — ${cv.ausbildung[0].institution}` : ''
  )
  return lines.length
    ? lines.join('\n')
    : '(Noch wenig Profildaten — Platzhalter verwenden, nichts erfinden.)'
}

export function getCvFieldValue(cv, fieldKey) {
  if (fieldKey === 'profil') return cv.profil || ''
  if (fieldKey === 'weitereKenntnisse') return cv.weitereKenntnisse || ''
  if (fieldKey === 'interessen') return cv.interessen || ''
  const exp = fieldKey.match(/^erfahrung:(\d+):aufgaben$/)
  if (exp) return cv.erfahrung?.[+exp[1]]?.aufgaben || ''
  const edu = fieldKey.match(/^ausbildung:(\d+):schwerpunkte$/)
  if (edu) return cv.ausbildung?.[+edu[1]]?.schwerpunkte || ''
  return ''
}

export function applyCvFieldValue(cv, fieldKey, value) {
  if (fieldKey === 'profil') return { ...cv, profil: value }
  if (fieldKey === 'weitereKenntnisse') return { ...cv, weitereKenntnisse: value }
  if (fieldKey === 'interessen') return { ...cv, interessen: value }
  const exp = fieldKey.match(/^erfahrung:(\d+):aufgaben$/)
  if (exp) {
    const i = +exp[1]
    const erfahrung = [...(cv.erfahrung || [])]
    erfahrung[i] = { ...erfahrung[i], aufgaben: value }
    return { ...cv, erfahrung }
  }
  const edu = fieldKey.match(/^ausbildung:(\d+):schwerpunkte$/)
  if (edu) {
    const i = +edu[1]
    const ausbildung = [...(cv.ausbildung || [])]
    ausbildung[i] = { ...ausbildung[i], schwerpunkte: value }
    return { ...cv, ausbildung }
  }
  return cv
}

/** All text fields eligible for ScanLogic AI polish. */
export function listPolishableCvFields(cv) {
  const fields = []
  if (cv.profil?.trim()) {
    fields.push({ key: 'profil', title: 'Profil / Kurzprofil' })
  }
  ;(cv.erfahrung || []).forEach((e, i) => {
    if (e.aufgaben?.trim()) {
      fields.push({
        key: `erfahrung:${i}:aufgaben`,
        title: `Berufserfahrung — Aufgaben${e.titel?.trim() ? `: ${e.titel}` : ''}`,
      })
    }
  })
  ;(cv.ausbildung || []).forEach((e, i) => {
    if (e.schwerpunkte?.trim()) {
      fields.push({
        key: `ausbildung:${i}:schwerpunkte`,
        title: `Ausbildung — Schwerpunkte${e.abschluss?.trim() ? `: ${e.abschluss}` : ''}`,
      })
    }
  })
  if (cv.weitereKenntnisse?.trim()) {
    fields.push({ key: 'weitereKenntnisse', title: 'Weitere Kenntnisse' })
  }
  if (cv.interessen?.trim()) {
    fields.push({ key: 'interessen', title: 'Interessen' })
  }
  return fields
}

export function countPolishableCvFields(cv) {
  return listPolishableCvFields(cv).length
}

export function isCvAiComplete(cv) {
  const needed = listPolishableCvFields(cv).map((f) => f.key)
  if (!needed.length) return false
  const polished = cv.cvAiPolished || {}
  return needed.every((k) => polished[k])
}

/**
 * Rewrite one CV section — tabellarischer Lebenslauf, German Bewerbung tone.
 */
export async function rewriteLebenslaufField({
  lang = 'de',
  fieldTitle,
  text,
  cv,
  formData,
  fieldKey,
}) {
  if (!text?.trim()) return text || ''

  const isBullets =
    fieldKey?.includes(':aufgaben') ||
    fieldKey?.includes(':schwerpunkte') ||
    fieldKey === 'weitereKenntnisse'

  const prompt = `${aiLanguageInstruction(lang)}

You are ScanLogic AI — writing assistant for a German tabellarischer Lebenslauf (CV) in a professional job-application context (Telc B2 Beruf / workplace German).

Rewrite this section: "${fieldTitle}".

Rules:
- Professional, concise German suitable for employers, banks, and funding agencies
- Keep ALL facts, dates, company names, job titles, numbers, and qualifications exactly as written
- Do NOT invent employers, degrees, certificates, or achievements
- ${isBullets ? 'Output one task/skill per line (no bullet characters — the app adds bullets). Keep the same number of points unless merging duplicates.' : 'Use short, clear sentences; 3–5 sentences for Profil; brief phrase for Interessen.'}
- No markdown, no headings, no quotes around the output
- Output ONLY the rewritten text

Applicant context (facts only):
${buildCvContext(cv, formData)}
${cv.job_title ? `Target role / Berufsbezeichnung: ${cv.job_title}` : ''}

Original draft:
${text.trim()}`

  const res = await appApi.integrations.Core.InvokeLLM({ prompt })
  const raw = res?.text || res?.content || text
  return stripAiWrapper(raw) || text.trim()
}

/** Polish all filled CV text sections. */
export async function polishLebenslaufCv(cv, lang = 'de', formData = {}, { onFieldDone } = {}) {
  const updates = { cvAiPolished: { ...(cv.cvAiPolished || {}) } }
  let next = { ...cv }
  const fields = listPolishableCvFields(cv)

  for (const field of fields) {
    const text = getCvFieldValue(next, field.key)
    const rewritten = await rewriteLebenslaufField({
      lang,
      fieldTitle: field.title,
      text,
      cv: next,
      formData,
      fieldKey: field.key,
    })
    next = applyCvFieldValue(next, field.key, rewritten)
    updates.cvAiPolished[field.key] = true
    onFieldDone?.(field.key, field.title)
  }

  return {
    ...next,
    ...updates,
    cvAiComplete: fields.length > 0,
    cvAiPolishedAt: new Date().toISOString(),
  }
}

/** Generate Profil draft from existing CV + BizStart data (optional helper). */
export async function generateCvProfil(cv, formData = {}, lang = 'de') {
  const prompt = `${aiLanguageInstruction(lang)}

You are ScanLogic AI — writing the "Profil" section (3–5 sentences) for a German tabellarischer Lebenslauf.

Known facts ONLY:
${buildCvContext(cv, formData)}

Rules:
- 3–5 sentences in German, professional B2 workplace tone
- Summarise qualifications, target role, and value for employers
- Do NOT invent employers, degrees, or years of experience
- Use [PLATZHALTER] where data is missing
- Output ONLY the Profil text — no heading`

  const res = await appApi.integrations.Core.InvokeLLM({ prompt })
  return stripAiWrapper(res?.text || res?.content || '')
}
