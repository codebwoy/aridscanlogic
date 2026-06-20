import appApi from '@/lib/appApi'
import { aiLanguageInstruction } from '@/lib/ai/promptLanguage'
import { loadCv } from '@/lib/bizstart/lebenslauf/store'
import {
  anschreibenDisplayName,
  buildAnrede,
  defaultBetreff,
  normalizeEinleitung,
  BEWERBUNGS_TYP_OPTIONS,
} from './schema'

const POLISHABLE = [
  { key: 'betreff', title: 'Betreffzeile' },
  { key: 'einleitung', title: 'Einleitung' },
  { key: 'hauptteil', title: 'Hauptteil — Qualifikation & Ergebnisse' },
  { key: 'motivation', title: 'Motivation — Warum dieses Unternehmen?' },
  { key: 'schlussteil', title: 'Schlussteil — Verfügbarkeit & Gehalt' },
]

function stripAiWrapper(text) {
  if (!text) return ''
  let t = text.trim()
  if (t.startsWith('"') && t.endsWith('"')) t = t.slice(1, -1)
  if (t.startsWith('```')) {
    t = t.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '').trim()
  }
  return t
}

function typLabel(id) {
  return BEWERBUNGS_TYP_OPTIONS.find((x) => x.id === id)?.label || id
}

export function buildAnschreibenContext(a, formData = {}, cv = loadCv()) {
  const lines = []
  const add = (l, v) => {
    if (v?.trim()) lines.push(`${l}: ${v.trim()}`)
  }
  add('Bewerber', anschreibenDisplayName(a))
  add('Ziel', typLabel(a.bewerbungsTyp))
  add('Stelle / Projekt', a.stellenTitel)
  add('Unternehmen', a.firma)
  add('Ansprechpartner', a.ansprechpartnerNachname)
  add('Referenz', a.referenzNr)
  add('Quelle', a.quelle)
  add('Lebenslauf Profil', cv.profil?.slice(0, 300))
  add('Letzte Position', cv.erfahrung?.[0]?.titel)
  add('BizStart Tätigkeit', formData.businessActivityDescription)
  add('Geschäftsname', formData.intendedBusinessName)
  return lines.length ? lines.join('\n') : '(Wenig Kontext — keine Fakten erfinden.)'
}

export function getAnschreibenFieldValue(a, key) {
  if (key === 'betreff') return a.betreff || defaultBetreff(a)
  return a[key] || ''
}

export function applyAnschreibenFieldValue(a, key, value) {
  return { ...a, [key]: value }
}

export function listPolishableAnschreibenFields(a) {
  return POLISHABLE.filter((f) => getAnschreibenFieldValue(a, f.key)?.trim())
}

export function countPolishableAnschreibenFields(a) {
  return listPolishableAnschreibenFields(a).length
}

export function isAnschreibenAiComplete(a) {
  const needed = listPolishableAnschreibenFields(a).map((f) => f.key)
  if (!needed.length) return false
  const polished = a.anschreibenAiPolished || {}
  return needed.every((k) => polished[k])
}

export async function rewriteAnschreibenField({
  lang = 'de',
  fieldTitle,
  text,
  a,
  formData,
  fieldKey,
}) {
  if (!text?.trim()) return text || ''

  const isBetreff = fieldKey === 'betreff'
  const isEinleitung = fieldKey === 'einleitung'

  const prompt = `${aiLanguageInstruction(lang)}

You are ScanLogic AI — writing assistant for a German Anschreiben (cover letter) following DIN 5008.

Section: "${fieldTitle}"
Application type: ${typLabel(a.bewerbungsTyp)}
Recipient: ${a.firma || '(company not set)'}
Salutation will be: ${buildAnrede(a)}

Rules:
- Professional, factual, polite German (Telc B2 Beruf / workplace level)
- ONE page total when all sections combined — be concise
- Keep ALL facts, numbers, dates, company names, salary figures exactly as written
- Do NOT invent employers, achievements, or qualifications
- Never use real personal names as examples — use only facts from Context or [PLATZHALTER]
- No markdown, no "Betreff:" prefix in betreff field, no salutation in body sections
${isBetreff ? '- Output ONLY the bold subject line text (job title, ref no., source)' : ''}
${isEinleitung ? '- Start with lowercase first letter (follows comma after Anrede). Max 2–3 sentences. No fluff.' : ''}
${fieldKey === 'hauptteil' ? '- 1–2 paragraphs: Problem-Action-Result, link to job requirements. Do not repeat CV verbatim.' : ''}
${fieldKey === 'motivation' ? '- Brief: why THIS company, show research. 2–4 sentences.' : ''}
${fieldKey === 'schlussteil' ? '- Include earliest start date / notice period and salary expectation if mentioned in draft.' : ''}
- Output ONLY the rewritten section text

Context:
${buildAnschreibenContext(a, formData)}

Original draft:
${text.trim()}`

  const res = await appApi.integrations.Core.InvokeLLM({ prompt })
  const raw = res?.text || res?.content || text
  let out = stripAiWrapper(raw) || text.trim()
  if (isEinleitung) out = normalizeEinleitung(out)
  return out
}

export async function polishAnschreiben(a, lang = 'de', formData = {}, { onFieldDone } = {}) {
  let next = { ...a }
  const polished = { ...(a.anschreibenAiPolished || {}) }
  for (const field of listPolishableAnschreibenFields(a)) {
    const text = getAnschreibenFieldValue(next, field.key)
    const rewritten = await rewriteAnschreibenField({
      lang,
      fieldTitle: field.title,
      text,
      a: next,
      formData,
      fieldKey: field.key,
    })
    next = applyAnschreibenFieldValue(next, field.key, rewritten)
    polished[field.key] = true
    onFieldDone?.(field.key, field.title)
  }
  return {
    ...next,
    anschreibenAiPolished: polished,
    anschreibenAiComplete: listPolishableAnschreibenFields(a).length > 0,
    anschreibenAiPolishedAt: new Date().toISOString(),
  }
}

export async function generateAnschreibenSection(a, sectionKey, formData = {}, lang = 'de') {
  const cv = loadCv()
  const ctx = buildAnschreibenContext(a, formData, cv)
  const prompts = {
    einleitung: `Write ONLY the Einleitung (2–3 sentences) for a German Anschreiben. Start lowercase after Anrede comma. Type: ${typLabel(a.bewerbungsTyp)}. Facts:\n${ctx}`,
    hauptteil: `Write ONLY the Hauptteil (1–2 paragraphs, PAR-Framework) for a German Anschreiben. Facts:\n${ctx}`,
    motivation: `Write ONLY the Motivation paragraph (why this company). Facts:\n${ctx}`,
    schlussteil: `Write ONLY the Schlussteil with availability/start date placeholder and optional salary. Facts:\n${ctx}`,
  }
  const prompt = `${aiLanguageInstruction(lang)}\n\nYou are ScanLogic AI.\n\n${prompts[sectionKey] || prompts.einleitung}\n\nNo invented facts. Never use real personal names — use [PLATZHALTER] if data is missing.`
  const res = await appApi.integrations.Core.InvokeLLM({ prompt })
  let out = stripAiWrapper(res?.text || res?.content || '')
  if (sectionKey === 'einleitung') out = normalizeEinleitung(out)
  return out
}

export async function generateFullAnschreibenDraft(a, formData = {}, lang = 'de') {
  const keys = ['einleitung', 'hauptteil', 'motivation', 'schlussteil']
  let next = { ...a }
  for (const key of keys) {
    if (!getAnschreibenFieldValue(next, key)?.trim()) {
      const text = await generateAnschreibenSection(next, key, formData, lang)
      next = applyAnschreibenFieldValue(next, key, text)
    }
  }
  if (!next.betreff?.trim() && next.stellenTitel) {
    next.betreff = defaultBetreff(next)
  }
  next.unterschriftName = next.unterschriftName || anschreibenDisplayName(next)
  return next
}
