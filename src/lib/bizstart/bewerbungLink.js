import { patchBusinessPlanDraft, getBusinessPlanDraft } from '@/lib/bizstart/businessPlanDraft'
import { cvDisplayName, cvCompleteness, cvIsSubmissionReady } from '@/lib/bizstart/lebenslauf/schema'
import {
  anschreibenDisplayName,
  anschreibenCompleteness,
  anschreibenIsSubmissionReady,
} from '@/lib/bizstart/anschreiben/schema'

/** Sync annexes + readiness flags when CV and/or cover letter change. */
export function syncBewerbungDocuments(formData, { cv, anschreiben } = {}) {
  if (!formData) return {}
  const draft = getBusinessPlanDraft(formData)
  const cvName = cv ? cvDisplayName(cv) : ''
  const cvReady = cv ? cvIsSubmissionReady(cv) : false
  const letterName = anschreiben ? anschreibenDisplayName(anschreiben) : ''
  const letterReady = anschreiben ? anschreibenIsSubmissionReady(anschreiben) : false

  const lines = (draft.annexes || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .filter(
      (l) =>
        !l.toLowerCase().startsWith('anhang a:') &&
        !l.toLowerCase().startsWith('anhang b:') &&
        !l.toLowerCase().includes('lebenslauf') &&
        !l.toLowerCase().includes('anschreiben') &&
        !l.toLowerCase().includes('motivationsschreiben')
    )

  const cvLine = cvReady
    ? `Anhang A: Lebenslauf (${cvName}) — tabellarisch, ScanLogic BizStart`
    : cvName
      ? `Anhang A: Lebenslauf (Entwurf: ${cvName})`
      : 'Anhang A: Lebenslauf'

  const letterLine = letterReady
    ? `Anhang B: Anschreiben (${letterName}) — DIN 5008, ScanLogic BizStart`
    : letterName
      ? `Anhang B: Anschreiben (Entwurf: ${letterName})`
      : 'Anhang B: Anschreiben / Motivationsschreiben'

  if (cvName || cvReady) lines.unshift(cvLine)
  if (letterName || letterReady) lines.splice(1, 0, letterLine)

  const defaults = [
    'Anhang C: Businessplan (Auszug oder Vollversion)',
    'Anhang D: Angebot / Kostenvoranschlag',
    'Anhang E: Referenzen / Zeugnisse',
  ]
  for (const d of defaults) {
    if (!lines.some((l) => l.startsWith(d.slice(0, 12)))) lines.push(d)
  }

  const patch = {
    ...patchBusinessPlanDraft(formData, { annexes: lines.join('\n') }),
  }
  if (cv) {
    patch.lebenslaufCompleteness = cvCompleteness(cv)
    patch.lebenslaufReady = cvReady
  }
  if (anschreiben) {
    patch.anschreibenCompleteness = anschreibenCompleteness(anschreiben)
    patch.anschreibenReady = letterReady
  }
  return patch
}

/** @deprecated use syncBewerbungDocuments */
export function syncBusinessPlanAnnexesWithCv(formData, cv) {
  return syncBewerbungDocuments(formData, { cv })
}

export function bewerbungPackStatus(formData) {
  const draft = getBusinessPlanDraft(formData)
  return {
    planTitle: draft.planTitle?.trim() || '',
    planAudience: draft.planAudience || 'general',
    annexes: draft.annexes || '',
  }
}
