import appApi from '@/lib/appApi'
import { aiLanguageInstruction } from '@/lib/ai/promptLanguage'
import { bpT } from '@/lib/bizstart/businessPlanI18n'
import { PLAN_AUDIENCES, getAudiencePlaybook } from '@/lib/bizstart/businessPlanGuidelines'

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

function parseJsonFromAi(raw) {
  const text = stripAiWrapper(raw?.text || raw?.content || raw || '')
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1) return null
  try {
    return JSON.parse(text.slice(start, end + 1))
  } catch {
    return null
  }
}

/** Collect known facts from BizStart profile + draft for AI context. */
export function buildBusinessPlanProfileContext(formData, draft) {
  const lines = []
  const add = (label, val) => {
    if (val != null && String(val).trim()) lines.push(`${label}: ${String(val).trim()}`)
  }
  add('Business / plan title', draft.planTitle || formData.intendedBusinessName || formData.businessName)
  add('Activity', formData.businessActivityDescription || draft.production)
  add('Founder', [formData.firstName, formData.lastName].filter(Boolean).join(' '))
  add('City', formData.city || draft.location)
  add('Legal form', formData.businessStructure || draft.legalFormNotes)
  add('Expected revenue year 1', formData.expectedRevenueYear1 || draft.revenueLines?.[0]?.y1)
  add('Expected profit year 1', formData.expectedProfitYear1)
  add('Working model', draft.workingModel)
  add('Hours per week', draft.hoursPerWeek)
  add('Offer (draft)', draft.offer)
  add('Customers (draft)', draft.customers)
  add('Market (draft)', draft.market)
  add('Competencies (draft)', draft.competencies)
  return lines.length ? lines.join('\n') : '(No profile data yet — use placeholders where facts are missing.)'
}

export function buildStaticAudienceStrategy(audienceId, lang) {
  const book = getAudiencePlaybook(audienceId, lang)
  return {
    audience: audienceId || 'general',
    generatedAt: new Date().toISOString(),
    prioritySteps: book.prioritySteps,
    summaryFocus: book.summaryFocus,
    tone: book.tone,
    aiEnhanced: false,
  }
}

/**
 * Audience-specific strategy: which sections to stress + summary focus.
 * Falls back to static playbook if LLM unavailable.
 */
export async function generateAudienceStrategy({ lang, planAudience, planTitle, formData, draft }) {
  const audience = planAudience || 'general'
  const staticBase = buildStaticAudienceStrategy(audience, lang)
  const profileContext = buildBusinessPlanProfileContext(formData, draft)

  const prompt = `${aiLanguageInstruction(lang)}

You are ScanLogic AI — business plan strategist for German self-employment.

The founder is writing a business plan for this target reader: "${audienceLabel(audience, lang)}".
Business title: ${planTitle || '(not set yet)'}

Known facts (use only these — do not invent):
${profileContext}

Return ONLY valid JSON (no markdown fences) with this shape:
{
  "prioritySteps": ["summary", "finances", ...],
  "summaryFocus": ["bullet 1", "bullet 2", ...],
  "tone": "one sentence describing writing tone for this reader"
}

Rules:
- prioritySteps: 5–7 step IDs from this list only: meta, summary, production, customers, idea, market, values, sales, organization, competencies, partners, company, risks, finances, annexes
- Order by importance for the target reader (most important first)
- summaryFocus: 4–5 short bullets in ${lang === 'de' ? 'German' : 'English'} — what the executive summary must emphasise
- tone: one sentence in ${lang === 'de' ? 'German' : 'English'}`

  try {
    const res = await appApi.integrations.Core.InvokeLLM({ prompt })
    const parsed = parseJsonFromAi(res)
    const validSteps = new Set([
      'meta', 'summary', 'production', 'customers', 'idea', 'market', 'values', 'sales',
      'organization', 'competencies', 'partners', 'company', 'risks', 'finances', 'annexes',
    ])
    const prioritySteps = (parsed?.prioritySteps || []).filter((s) => validSteps.has(s))
    const summaryFocus = (parsed?.summaryFocus || []).filter((s) => typeof s === 'string' && s.trim())

    return {
      audience,
      generatedAt: new Date().toISOString(),
      prioritySteps: prioritySteps.length >= 3 ? prioritySteps : staticBase.prioritySteps,
      summaryFocus: summaryFocus.length >= 2 ? summaryFocus : staticBase.summaryFocus,
      tone: parsed?.tone?.trim() || staticBase.tone,
      aiEnhanced: true,
    }
  } catch {
    return staticBase
  }
}

/**
 * Generate executive summary draft tailored to the selected audience.
 */
export async function generateTargetedSummary({ lang, planAudience, planTitle, formData, draft, strategy }) {
  const audience = planAudience || 'general'
  const strat = strategy || buildStaticAudienceStrategy(audience, lang)
  const profileContext = buildBusinessPlanProfileContext(formData, draft)
  const focusList = (strat.summaryFocus || []).map((b, i) => `${i + 1}. ${b}`).join('\n')

  const prompt = `${aiLanguageInstruction(lang)}

You are ScanLogic AI — writing the executive summary of a German self-employment business plan.

Target reader: "${audienceLabel(audience, lang)}"
Business title: ${planTitle || '(set a business name)'}
Writing tone: ${strat.tone || ''}

The summary MUST emphasise:
${focusList}

Known facts (use ONLY these — do NOT invent clients, contracts, revenue, or qualifications):
${profileContext}

Rules:
- Write 4–7 short paragraphs in ${lang === 'de' ? 'German' : 'English'}
- Persuasive but honest — use [PLATZHALTER] or [YOUR …] where data is missing
- No markdown headings, bold, or bullet lists — flowing prose only
- No preamble — output ONLY the executive summary text
- Tailor language to what ${audienceLabel(audience, lang)} cares about most`

  const res = await appApi.integrations.Core.InvokeLLM({ prompt })
  const raw = res?.text || res?.content || ''
  return stripAiWrapper(raw) || ''
}

export function getActiveAudienceStrategy(draft, lang) {
  if (draft.planAudienceStrategy?.audience === draft.planAudience && draft.planAudienceStrategy?.prioritySteps?.length) {
    return draft.planAudienceStrategy
  }
  return buildStaticAudienceStrategy(draft.planAudience, lang)
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
