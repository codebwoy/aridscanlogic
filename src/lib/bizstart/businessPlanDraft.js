import {
  defaultRevenueLines,
  defaultOperatingCosts,
  defaultPrivateCosts,
  defaultInvestments,
} from './businessPlanConfig'

export function getBusinessPlanDraft(formData) {
  return formData?.businessPlanDraft || {}
}

export function patchBusinessPlanDraft(current, patch) {
  return { businessPlanDraft: { ...getBusinessPlanDraft(current), ...patch } }
}

export function mergeBusinessPlanForExport(formData) {
  const draft = getBusinessPlanDraft(formData)
  return { ...formData, ...draft }
}

export function emptyBusinessPlanDraftPatch() {
  return { businessPlanDraft: {}, businessPlanDraftInitialized: true }
}

export function defaultBusinessPlanDraft() {
  const year = new Date().getFullYear()
  return {
    planStartMonth: String(new Date().getMonth() + 1).padStart(2, '0'),
    planStartYear: String(year),
    planEndMonth: '09',
    planEndYear: String(year + 2),
    planAudience: 'general',
    revenueLines: defaultRevenueLines(),
    operatingCosts: defaultOperatingCosts(),
    privateCosts: defaultPrivateCosts(),
    investments: defaultInvestments(),
    foundingCosts: '',
    equityCapital: '',
    loanAmount: '',
    loanInterest: '',
    loanTerm: '',
    financeAssumptions: '',
    hoursPerWeek: '',
    workingModel: 'part_time',
    planPdfBranding: 'clean',
  }
}

const PROFILE_KEYS = [
  'intendedBusinessName',
  'businessName',
  'businessActivityDescription',
  'firstName',
  'lastName',
  'city',
  'businessStructure',
  'expectedRevenueYear1',
  'expectedProfitYear1',
  'email',
  'phone',
]

export function importProfileIntoBusinessPlanDraft(formData) {
  const draft = getBusinessPlanDraft(formData)
  const imported = {}
  for (const key of PROFILE_KEYS) {
    if (formData[key] != null && formData[key] !== '') imported[key] = formData[key]
  }
  if (formData.intendedBusinessName || formData.businessName) {
    imported.planTitle = formData.intendedBusinessName || formData.businessName
  }
  if (formData.businessActivityDescription && !draft.production) {
    imported.production = formData.businessActivityDescription
  }
  if (formData.city && !draft.location) {
    imported.location = formData.city
  }
  if (formData.businessStructure && !draft.legalFormNotes) {
    imported.legalFormNotes = formData.businessStructure
  }
  if (formData.expectedRevenueYear1 && draft.revenueLines?.[0]) {
    imported.revenueLines = draft.revenueLines.map((row, i) =>
      i === 0 ? { ...row, y1: String(formData.expectedRevenueYear1) } : row
    )
  }
  const founder = [formData.firstName, formData.lastName].filter(Boolean).join(' ')
  if (founder && !draft.foundersTeam) imported.foundersTeam = founder

  return {
    ...formData,
    ...patchBusinessPlanDraft(formData, imported),
    businessPlanDraftInitialized: true,
  }
}

export function initBusinessPlanDraft(formData) {
  if (formData.businessPlanDraftInitialized) {
    const draft = getBusinessPlanDraft(formData)
    const patch = {}
    if (!draft.planAudience) patch.planAudience = 'general'
    if (!draft.revenueLines?.length) patch.revenueLines = defaultRevenueLines()
    if (!draft.operatingCosts?.length) patch.operatingCosts = defaultOperatingCosts()
    if (!draft.privateCosts?.length) patch.privateCosts = defaultPrivateCosts()
    if (!draft.investments?.length) patch.investments = defaultInvestments()
    if (Object.keys(patch).length) return patchBusinessPlanDraft(formData, patch)
    return {}
  }
  return {
    ...patchBusinessPlanDraft(formData, {
      ...defaultBusinessPlanDraft(),
      ...(formData.intendedBusinessName || formData.businessName
        ? { planTitle: formData.intendedBusinessName || formData.businessName }
        : {}),
    }),
    businessPlanDraftInitialized: true,
  }
}
