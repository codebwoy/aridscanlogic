/**
 * Sync legal profile data across BizStart, DocDraft, and legal store.
 */

import { saveProfile, getActiveProfile, ensureDefaultProfile } from '@/lib/docdraft/store'
import { loadLegalData, saveQuestionnaire } from './store'
import { buildLegalProfile } from './profile'

export function syncLegalToDocDraft(formData = {}) {
  ensureDefaultProfile()
  const profile = getActiveProfile()
  const legal = loadLegalData()
  const merged = buildLegalProfile({
    firstName: formData.firstName,
    lastName: formData.lastName,
    businessName: formData.intendedBusinessName || formData.businessName,
    legalStructure: formData.businessStructure,
    street: formData.street,
    houseNumber: formData.houseNumber,
    plz: formData.plz,
    city: formData.city,
    email: formData.email,
    phone: formData.phone,
    steuernummer: formData.steuernummer,
    ustIdNr: formData.ustIdNr,
    website: legal.questionnaire?.websiteUrl || formData.website,
  })

  if (profile) {
    saveProfile({
      ...profile,
      businessName: merged.businessName || profile.businessName,
      legalStructure: merged.legalStructure,
      street: merged.street,
      houseNumber: merged.houseNumber,
      plz: merged.plz,
      city: merged.city,
      email: merged.email,
      phone: merged.phone,
      website: merged.website,
      steuernummer: merged.steuernummer,
      ustIdNr: merged.ustIdNr,
    })
  }

  if (formData.website && !legal.questionnaire?.websiteUrl) {
    saveQuestionnaire({ websiteUrl: formData.website })
  }

  return merged
}

export function getLegalDraftsForContracts() {
  const legal = loadLegalData()
  return legal.drafts
}
