import appApi from '@/lib/appApi'
import { aiLanguageInstruction } from '@/lib/ai/promptLanguage'
import { bpT, bpStepLabel } from '@/lib/bizstart/businessPlanI18n'
import { getAudiencePlaybook, PLAN_AUDIENCES } from '@/lib/bizstart/businessPlanGuidelines'
import { BP_TEXT_FIELDS, buildBusinessPlanProfileContext } from '@/lib/bizstart/businessPlanAi'
import { loadCv } from '@/lib/bizstart/lebenslauf/store'
import { cvIsSubmissionReady } from '@/lib/bizstart/lebenslauf/schema'
import { loadAnschreiben } from '@/lib/bizstart/anschreiben/store'
import { anschreibenIsSubmissionReady } from '@/lib/bizstart/anschreiben/schema'

const FIELD_WEIGHT = {
  summary: 12,
  production: 6,
  customers: 6,
  offer: 5,
  benefit: 5,
  market: 8,
  values: 4,
  sales: 6,
  organization: 4,
  competencies: 8,
  partners: 4,
  foundersTeam: 6,
  location: 3,
  legalFormNotes: 4,
  risks: 8,
  financeAssumptions: 10,
  profitabilityNotes: 8,
  liquidityNotes: 8,
  capitalNotes: 6,
  annexes: 4,
}

function audienceLabelLocal(id, lang) {
  const a = PLAN_AUDIENCES.find((x) => x.id === id)
  if (!a) return id
  return lang === 'de' ? a.de : a.en
}

function hasFinanceNumbers(draft) {
  const hasRev = draft.revenueLines?.some((r) => r.y1 || r.y2 || r.y3)
  const hasCost = draft.operatingCosts?.some((r) => r.y1 || r.y2 || r.y3)
  return !!(hasRev && hasCost)
}

function fieldFilled(draft, key) {
  const val = draft[key]
  return typeof val === 'string' && val.trim().length > 10
}

export function computeStaticReadiness(draft, lang = 'de') {
  const audience = draft.planAudience || 'general'
  const playbook = getAudiencePlaybook(audience, lang)
  const prioritySet = new Set(playbook.prioritySteps || [])

  const gaps = []
  let earned = 0
  let possible = 0

  for (const field of BP_TEXT_FIELDS) {
    const base = FIELD_WEIGHT[field.key] || 4
    const weight = prioritySet.has(field.key) ? base * 1.5 : base
    possible += weight
    if (fieldFilled(draft, field.key)) {
      earned += weight
    } else if (prioritySet.has(field.key) || field.key === 'summary') {
      gaps.push({ id: field.key, label: bpT(lang, field.titleKey), priority: 'high' })
    }
  }

  if (prioritySet.has('finances') || ['bank', 'investor', 'employment'].includes(audience)) {
    possible += 15
    if (hasFinanceNumbers(draft)) earned += 15
    else gaps.push({ id: 'finances', label: bpStepLabel('finances', lang), priority: 'high' })
  }

  possible += 5
  if (draft.planTitle?.trim()) earned += 5
  else gaps.unshift({ id: 'planTitle', label: bpT(lang, 'planTitle'), priority: 'high' })

  if (['bank', 'investor', 'award', 'sponsor', 'employment'].includes(audience)) {
    possible += 8
    if (cvIsSubmissionReady(loadCv())) earned += 8
    else if ((draft.annexes || '').toLowerCase().includes('lebenslauf')) earned += 3
    else
      gaps.push({
        id: 'lebenslauf',
        label: lang === 'de' ? 'Lebenslauf (Anhang A)' : 'CV (annex A)',
        priority: 'high',
      })

    possible += 6
    if (anschreibenIsSubmissionReady(loadAnschreiben())) earned += 6
    else if ((draft.annexes || '').toLowerCase().includes('anschreiben')) earned += 2
    else
      gaps.push({
        id: 'anschreiben',
        label: lang === 'de' ? 'Anschreiben (DIN 5008)' : 'Cover letter (DIN 5008)',
        priority: audience === 'employment' ? 'high' : 'medium',
      })
  }

  const score = possible > 0 ? Math.min(100, Math.round((earned / possible) * 100)) : 0
  const uniqueGaps = gaps.filter((g, i, arr) => arr.findIndex((x) => x.id === g.id) === i).slice(0, 8)

  return {
    score,
    audience,
    audienceLabel: audienceLabelLocal(audience, lang),
    gaps: uniqueGaps,
    computedAt: new Date().toISOString(),
  }
}

function parseJsonFromAi(raw) {
  const text = (raw?.text || raw?.content || raw || '').trim()
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1) return null
  try {
    return JSON.parse(text.slice(start, end + 1))
  } catch {
    return null
  }
}

export async function assessBusinessPlanReadiness(formData, draft, lang = 'de') {
  const staticResult = computeStaticReadiness(draft, lang)
  const playbook = getAudiencePlaybook(draft.planAudience || 'general', lang)

  try {
    const prompt = `${aiLanguageInstruction(lang)}

You are ScanLogic AI — business plan readiness assessor for German self-employment.

Target reader: "${staticResult.audienceLabel}"
Current readiness score: ${staticResult.score}/100
Priority sections: ${(playbook.prioritySteps || []).join(', ')}
Known gaps: ${staticResult.gaps.map((g) => g.id).join(', ') || 'none'}

Profile & draft:
${buildBusinessPlanProfileContext(formData, draft)}

Return ONLY valid JSON:
{
  "score": ${staticResult.score},
  "headline": "one sentence in ${lang === 'de' ? 'German' : 'English'}",
  "gaps": [{ "id": "key", "title": "label", "action": "fix", "priority": "high|medium|low" }],
  "strengths": ["bullet"]
}

Keep score exactly ${staticResult.score}. Max 6 gaps. No invented facts.`

    const res = await appApi.integrations.Core.InvokeLLM({ prompt })
    const parsed = parseJsonFromAi(res)
    if (parsed?.gaps?.length) {
      return {
        ...staticResult,
        headline: parsed.headline || '',
        strengths: (parsed.strengths || []).filter(Boolean),
        gaps: parsed.gaps.map((g) => ({
          id: g.id,
          label: g.title || g.id,
          action: g.action,
          priority: g.priority || 'medium',
        })),
        aiEnhanced: true,
      }
    }
  } catch {
    /* static fallback */
  }

  return {
    ...staticResult,
    headline:
      lang === 'de'
        ? staticResult.score >= 75
          ? 'Gute Basis — noch wenige Lücken schließen.'
          : 'Weiter ausfüllen — Schwerpunkt auf Zielgruppe legen.'
        : staticResult.score >= 75
          ? 'Solid base — close a few remaining gaps.'
          : 'Keep filling in — focus on your target reader.',
    strengths: [],
    gaps: staticResult.gaps.map((g) => ({
      ...g,
      action: lang === 'de' ? `Abschnitt „${g.label}" ausfüllen.` : `Complete the "${g.label}" section.`,
    })),
    aiEnhanced: false,
  }
}

export function readinessLevel(score, lang) {
  if (score >= 85) return lang === 'de' ? 'Einreichungsreif' : 'Submission-ready'
  if (score >= 65) return lang === 'de' ? 'Gute Basis' : 'Good foundation'
  if (score >= 40) return lang === 'de' ? 'In Arbeit' : 'In progress'
  return lang === 'de' ? 'Gerade gestartet' : 'Just started'
}

export function readinessColor(score) {
  if (score >= 85) return 'text-emerald-600'
  if (score >= 65) return 'text-brand-600'
  if (score >= 40) return 'text-amber-600'
  return 'text-slate-500'
}
