import { patchBusinessPlanDraft, getBusinessPlanDraft } from '@/lib/bizstart/businessPlanDraft'
import { cvDisplayName, cvCompleteness, cvIsSubmissionReady } from '@/lib/bizstart/lebenslauf/schema'

const CV_ANNEX_MARKER = 'Anhang A: Lebenslauf'

/** Update business plan annexes list when CV is saved — strengthens funding/sponsor packages */
export function syncBusinessPlanAnnexesWithCv(formData, cv) {
  if (!formData) return {}
  const name = cvDisplayName(cv)
  const ready = cvIsSubmissionReady(cv)
  const draft = getBusinessPlanDraft(formData)
  let annexes = draft.annexes || ''

  const cvLine = ready
    ? `${CV_ANNEX_MARKER} (${name}) — tabellarischer Lebenslauf, ScanLogic BizStart`
    : name
      ? `${CV_ANNEX_MARKER} (Entwurf: ${name})`
      : CV_ANNEX_MARKER

  const lines = annexes
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !l.toLowerCase().startsWith('anhang a:') && !l.toLowerCase().includes('lebenslauf'))

  if (name || ready) {
    lines.unshift(cvLine)
  }

  const defaultRest = [
    'Anhang B: Angebot / Kostenvoranschlag (Equipment, Website …)',
    'Anhang C: Mietvertragsentwurf / Standortnachweis',
    'Anhang D: Marktanalyse / Referenzen',
  ]

  for (const d of defaultRest) {
    if (!lines.some((l) => l.startsWith(d.slice(0, 12)))) lines.push(d)
  }

  return {
    ...patchBusinessPlanDraft(formData, { annexes: lines.join('\n') }),
    lebenslaufCompleteness: cvCompleteness(cv),
    lebenslaufReady: ready,
  }
}

export function annexesMentionCv(formData) {
  const draft = getBusinessPlanDraft(formData)
  return (draft.annexes || '').toLowerCase().includes('lebenslauf')
}
