import { getApplicableSteps, STEP_LABELS } from '@/lib/bizstart/steps'
import { getBusinessPlanDraft } from '@/lib/bizstart/businessPlanDraft'
import { computeStaticReadiness } from '@/lib/bizstart/businessPlanReadiness'

const STATUS_WEIGHT = {
  confirmed: 1,
  submitted: 0.85,
  in_progress: 0.4,
  not_started: 0,
}

function stepLabel(stepId, lang) {
  const labels = STEP_LABELS[lang] || STEP_LABELS.en
  return labels[stepId] || stepId
}

function statusOf(stepStatus, stepId) {
  return stepStatus?.[stepId]?.status || 'not_started'
}

export function buildFounderCommandCenter(formData, stepStatus, lang = 'de') {
  const structure = formData.businessStructure || 'einzelunternehmer'
  const steps = getApplicableSteps(structure, formData).filter((s) => s.id !== 'complete')

  const stepRows = steps.map((step) => {
    const status = statusOf(stepStatus, step.id)
    return {
      id: step.id,
      label: stepLabel(step.id, lang),
      status,
      estMin: step.estMin,
      weight: STATUS_WEIGHT[status] ?? 0,
    }
  })

  const registrationScore =
    stepRows.length > 0
      ? Math.round((stepRows.reduce((sum, s) => sum + s.weight, 0) / stepRows.length) * 100)
      : 0

  const draft = getBusinessPlanDraft(formData)
  const planReadiness = computeStaticReadiness(draft, lang)
  const planStarted = formData.businessPlanComplete || formData.businessPlanWizardStep > 0

  const nextSteps = stepRows
    .filter((s) => s.status !== 'confirmed' && s.status !== 'submitted')
    .slice(0, 3)

  const blockers = []
  if (planStarted && planReadiness.score < 65) {
    blockers.push({
      id: 'plan-gaps',
      label: lang === 'de' ? 'Businessplan-Lücken schließen' : 'Close business plan gaps',
      detail:
        lang === 'de'
          ? `${planReadiness.gaps.length} Abschnitt(e) für ${planReadiness.audienceLabel} ausfüllen`
          : `Fill ${planReadiness.gaps.length} section(s) for ${planReadiness.audienceLabel}`,
      screen: 'businessPlan',
    })
  }
  if (!formData.businessName?.trim() && !formData.tradeName?.trim()) {
    blockers.push({
      id: 'profile-name',
      label: lang === 'de' ? 'Geschäftsname ergänzen' : 'Add business name',
      detail: lang === 'de' ? 'Im Profil-Schritt erfassen' : 'Complete the info step',
      screen: 'info',
    })
  }
  for (const row of nextSteps) {
    if (row.status === 'not_started') {
      blockers.push({
        id: `step-${row.id}`,
        label: row.label,
        detail: lang === 'de' ? 'Noch nicht begonnen' : 'Not started yet',
        screen: row.id === 'structure' ? 'structure' : row.id,
      })
      break
    }
  }

  const overallScore = planStarted
    ? Math.round(registrationScore * 0.55 + planReadiness.score * 0.45)
    : registrationScore

  return {
    overallScore,
    registrationScore,
    planReadiness,
    planStarted,
    planComplete: !!formData.businessPlanComplete,
    planTitle: draft.planTitle?.trim() || '',
    planAudience: planReadiness.audienceLabel,
    nextSteps,
    blockers: blockers.slice(0, 4),
    structure,
  }
}
