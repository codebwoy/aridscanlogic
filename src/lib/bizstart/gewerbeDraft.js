/** Gewerbe wizard uses an isolated draft — never auto-fills from BizStart profile. */

export const GEWERBE_DRAFT_KEYS = [
  'gewerbeRegistrationType',
  'gewerbeLegalForm',
  'firstName',
  'lastName',
  'gender',
  'birthNameDiffers',
  'birthName',
  'birthDay',
  'birthMonth',
  'birthYear',
  'dateOfBirth',
  'birthplace',
  'nationality',
  'street',
  'houseNumber',
  'plz',
  'city',
  'phone',
  'email',
  'businessAddressSameAsHome',
  'businessStreet',
  'businessHouseNumber',
  'businessPlz',
  'businessCity',
  'businessActivityDescription',
  'isSecondaryOccupation',
  'startDay',
  'startMonth',
  'startYear',
  'businessStartDate',
  'businessTypeCategory',
  'employeesFullTime',
  'employeesPartTime',
  'gewerbeSignatureDataUrl',
  'gewerbeIdDocumentUrl',
  'gewerbeIdLater',
  'gewerbePrivacyAccepted',
  'gewerbeDraftAccepted',
]

const PROFILE_SOURCE_KEYS = [
  'firstName',
  'lastName',
  'dateOfBirth',
  'nationality',
  'street',
  'houseNumber',
  'plz',
  'city',
  'phone',
  'email',
  'businessActivityDescription',
  'businessStartDate',
]

export function getGewerbeDraft(formData) {
  return formData?.gewerbeDraft || {}
}

export function patchGewerbeDraft(current, patch) {
  return { gewerbeDraft: { ...getGewerbeDraft(current), ...patch } }
}

/** Merge draft into form for PDF export after wizard completion. */
export function mergeGewerbeForExport(formData) {
  const draft = getGewerbeDraft(formData)
  return { ...formData, ...draft }
}

export function importProfileIntoGewerbeDraft(formData) {
  const imported = {}
  for (const key of PROFILE_SOURCE_KEYS) {
    if (formData[key] != null && formData[key] !== '') imported[key] = formData[key]
  }
  if (formData.dateOfBirth) {
    const [y, m, d] = String(formData.dateOfBirth).split('-')
    if (d) imported.birthDay = d
    if (m) imported.birthMonth = m
    if (y) imported.birthYear = y
  }
  if (formData.businessStartDate) {
    const [y, m, d] = String(formData.businessStartDate).split('-')
    if (d) imported.startDay = d
    if (m) imported.startMonth = m
    if (y) imported.startYear = y
  }
  return { ...formData, ...patchGewerbeDraft(formData, imported), gewerbeDraftInitialized: true }
}

export function emptyGewerbeDraftPatch() {
  return { gewerbeDraft: {}, gewerbeDraftInitialized: true }
}
