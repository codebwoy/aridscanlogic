/**
 * Unified business profile for legal document generation.
 * Merges BizStart form data, DocDraft profile, and legal questionnaire.
 */

import { loadFormData } from '@/lib/bizstart/store'
import { getActiveProfile } from '@/lib/docdraft/store'
import { loadLegalData } from './store'

const STRUCTURE_LABELS = {
  freiberufler: 'Freiberufler',
  einzelunternehmer: 'Einzelunternehmer',
  kleinunternehmer: 'Kleinunternehmer (§19 UStG)',
  gbr: 'GbR',
  ug: 'UG (haftungsbeschränkt)',
  gmbh: 'GmbH',
}

export function buildLegalProfile(overrides = {}) {
  const biz = loadFormData()
  const dd = getActiveProfile() || {}
  const legal = loadLegalData()
  const q = legal.questionnaire

  const firstName = overrides.firstName ?? biz.firstName ?? ''
  const lastName = overrides.lastName ?? biz.lastName ?? ''
  const ownerName = [firstName, lastName].filter(Boolean).join(' ') || dd.ownerName || ''

  const businessName =
    overrides.businessName ??
    biz.intendedBusinessName ??
    biz.businessName ??
    dd.businessName ??
    ownerName

  const structure =
    overrides.legalStructure ?? biz.businessStructure ?? dd.legalStructure ?? 'einzelunternehmer'

  return {
    ownerName,
    firstName,
    lastName,
    businessName,
    legalStructure: structure,
    legalStructureLabel: STRUCTURE_LABELS[structure] || structure,
    street: overrides.street ?? biz.street ?? dd.street ?? '',
    houseNumber: overrides.houseNumber ?? biz.houseNumber ?? dd.houseNumber ?? '',
    plz: overrides.plz ?? biz.plz ?? dd.plz ?? '',
    city: overrides.city ?? biz.city ?? dd.city ?? '',
    country: overrides.country ?? dd.country ?? 'Deutschland',
    email: overrides.email ?? biz.email ?? dd.email ?? '',
    phone: overrides.phone ?? biz.phone ?? dd.phone ?? '',
    website: overrides.website ?? q.websiteUrl ?? dd.website ?? '',
    steuernummer: overrides.steuernummer ?? biz.steuernummer ?? dd.steuernummer ?? '',
    ustIdNr: overrides.ustIdNr ?? biz.ustIdNr ?? dd.ustIdNr ?? '',
    taxId: overrides.taxId ?? biz.taxId ?? '',
    handelsregister: overrides.handelsregister ?? biz.handelsregister ?? '',
    activityDescription:
      overrides.activityDescription ?? biz.businessActivityDescription ?? '',
    questionnaire: { ...q, ...overrides.questionnaire },
  }
}

export function formatAddress(profile) {
  const parts = [
    [profile.street, profile.houseNumber].filter(Boolean).join(' '),
    [profile.plz, profile.city].filter(Boolean).join(' '),
    profile.country,
  ].filter(Boolean)
  return parts.join(', ')
}

export function syncLegalFromBizStart(formData) {
  const profile = buildLegalProfile({
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
    taxId: formData.taxId,
  })
  return profile
}
