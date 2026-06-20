import appApi from '@/lib/appApi'
import { aiLanguageInstruction } from '@/lib/ai/promptLanguage'
import { bpT } from '@/lib/bizstart/businessPlanI18n'
import { PLAN_AUDIENCES } from '@/lib/bizstart/businessPlanGuidelines'

/** Text fields ScanLogic AI can rewrite for the business plan. */
export const BP_TEXT_FIELDS = [
  { key: 'summary', titleKey: 'summaryTitle' },
  { key: 'production', titleKey: 'productionTitle' },
  { key: 'customers', titleKey: 'customersTitle' },
  { key: 'offer', titleKey: 'offer' },
  { key: 'benefit', titleKey: 'benefit' },
  { key: 'market', titleKey: 'marketTitle' },
  { key: 'values', titleKey: 'valuesTitle' },
  { key: 'sales', titleKey: 'salesTitle' },
  { key: 'organization', titleKey: 'organizationTitle' },
  { key: 'competencies', titleKey: 'competenciesTitle' },
  { key: 'partners', titleKey: 'partnersTitle' },
  { key: 'foundersTeam', titleKey: 'foundersTeam' },
  { key: 'location', titleKey: 'location' },
  { key: 'legalFormNotes', titleKey: 'legalForm' },
  { key: 'risks', titleKey: 'risksTitle' },
  { key: 'financeAssumptions', titleKey: 'financeAssumptions' },
  { key: 'profitabilityNotes', titleKey: 'profitabilitySection' },
  { key: 'liquidityNotes', titleKey: 'liquiditySection' },
  { key: 'capitalNotes', titleKey: 'capitalNotesSection' },
  { key: 'annexes', titleKey: 'annexesTitle' },
]

function audienceLabel(id, lang) {
  const a = PLAN_AUDIENCES.find((x) => x.id === id)
  if (!a) return id || ''
  return lang === 'de' ? a.de : a.en
}

function stripAiWrapper(text) {
  if (!text) return ''
  let t = text.trim()
  if (t.startsWith('"') && t.endsWith('"')) t = t.slice(1, -1)
  if (t.startsWith('```')) {
    t = t.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '').trim()
  }
  return t
}

/**
 * Rewrite one business plan section via ScanLogic AI (Anthropic proxy).
 */
export async function rewriteBusinessPlanField({
  lang,
  fieldTitle,
  text,
  planTitle,
  planAudience,
  stepContext,
}) {
  if (!text?.trim()) return text || ''

  const prompt = `${aiLanguageInstruction(lang)}

You are ScanLogic AI — the writing assistant inside ScanLogic Business Suite for German self-employment business plans.

Rewrite the following business plan section: "${fieldTitle}".
Rules:
- Professional, clear, persuasive tone suitable for banks, IHK, or funding agencies
- Keep ALL facts, numbers, names, dates, and prices exactly as the user wrote them
- Do NOT invent clients, revenue, qualifications, or contracts
- Use short paragraphs; numbered lists only where they improve readability
- No markdown headings (#), no bold/italic markers, no quotes around the output
- Output ONLY the rewritten section text — no preamble or explanation
${planTitle ? `- Business plan title: ${planTitle}` : ''}
${planAudience ? `- Target reader: ${audienceLabel(planAudience, lang)}` : ''}
${stepContext ? `- Section context: ${stepContext}` : ''}

Original draft:
${text.trim()}`

  const res = await appApi.integrations.Core.InvokeLLM({ prompt })
  const raw = res?.text || res?.content || text
  return stripAiWrapper(raw) || text.trim()
}

/** Rewrite all non-empty text sections; returns patch for businessPlanDraft. */
export async function polishBusinessPlanDraft(draft, lang, { onFieldStart, onFieldDone } = {}) {
  const updates = {}
  const polished = { ...(draft.businessPlanAiPolished || {}) }
  const fields = BP_TEXT_FIELDS.filter((f) => draft[f.key]?.trim())

  for (const field of fields) {
    onFieldStart?.(field.key, fields.length)
    const title = bpT(lang, field.titleKey)
    const rewritten = await rewriteBusinessPlanField({
      lang,
      fieldTitle: title,
      text: draft[field.key],
      planTitle: draft.planTitle,
      planAudience: draft.planAudience,
    })
    updates[field.key] = rewritten
    polished[field.key] = true
    onFieldDone?.(field.key, rewritten)
  }

  return {
    ...updates,
    businessPlanAiPolished: polished,
    businessPlanAiComplete: fields.length > 0,
    businessPlanAiPolishedAt: new Date().toISOString(),
  }
}

export function countPolishableFields(draft) {
  return BP_TEXT_FIELDS.filter((f) => draft[f.key]?.trim()).length
}

export function isBusinessPlanAiComplete(draft) {
  const needed = BP_TEXT_FIELDS.filter((f) => draft[f.key]?.trim()).map((f) => f.key)
  if (!needed.length) return false
  const polished = draft.businessPlanAiPolished || {}
  return needed.every((k) => polished[k])
}
