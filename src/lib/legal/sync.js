/**
 * Sync legal profile data across BizStart, DocDraft, and legal store.
 */

import { saveProfile, getActiveProfile, ensureDefaultProfile } from '@/lib/docdraft/store'
import { loadLegalData, saveQuestionnaire, saveLegalProfile } from './store'
import { buildLegalProfileFromFields, profileFieldsToBizStartPatch } from './profile'

export function persistLegalProfile(profileFields, formData = {}, onUpdateForm) {
  saveLegalProfile(profileFields)
  saveQuestionnaire({
    websiteUrl: profileFields.website || '',
  })

  const patch = profileFieldsToBizStartPatch(profileFields)
  onUpdateForm?.(patch)

  ensureDefaultProfile()
  const profile = getActiveProfile()
  if (profile) {
    saveProfile({
      ...profile,
      businessName: profileFields.businessName || profile.businessName,
      legalStructure: profileFields.legalStructure || profile.legalStructure,
      street: profileFields.street,
      houseNumber: profileFields.houseNumber,
      plz: profileFields.plz,
      city: profileFields.city,
      country: profileFields.country,
      email: profileFields.email,
      phone: profileFields.phone,
      website: profileFields.website,
      steuernummer: profileFields.steuernummer,
      ustIdNr: profileFields.ustIdNr,
    })
  }

  return buildLegalProfileFromFields(profileFields, loadLegalData().questionnaire)
}

export function syncLegalToDocDraft(formData = {}, profileFields = null) {
  const legal = loadLegalData()
  const fields = profileFields || legal.profile
  return persistLegalProfile(fields, formData)
}

export function getLegalDraftsForContracts() {
  const legal = loadLegalData()
  return legal.drafts
}
