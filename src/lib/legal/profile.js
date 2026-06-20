/**
 * Unified business profile for legal document generation.
 * Merges legal store profile, BizStart form data, DocDraft profile, and questionnaire.
 */

import { loadFormData } from '@/lib/bizstart/store'
import { getActiveProfile } from '@/lib/docdraft/store'
import { loadLegalData, DEFAULT_LEGAL_PROFILE } from './store'

const STRUCTURE_LABELS = {
  freiberufler: 'Freiberufler',
  einzelunternehmer: 'Einzelunternehmer',
  kleinunternehmer: 'Kleinunternehmer (§19 UStG)',
  gbr: 'GbR',
  ug: 'UG (haftungsbeschränkt)',
  gmbh: 'GmbH',
}

export const LEGAL_STRUCTURE_OPTIONS = [
  { id: 'freiberufler', labelDe: 'Freiberufler', labelEn: 'Freiberufler' },
  { id: 'einzelunternehmer', labelDe: 'Einzelunternehmer', labelEn: 'Sole trader' },
  { id: 'kleinunternehmer', labelDe: 'Kleinunternehmer (§19 UStG)', labelEn: 'Kleinunternehmer (§19)' },
  { id: 'gbr', labelDe: 'GbR', labelEn: 'GbR' },
  { id: 'ug', labelDe: 'UG (haftungsbeschränkt)', labelEn: 'UG' },
  { id: 'gmbh', labelDe: 'GmbH', labelEn: 'GmbH' },
]

/** Required Impressum fields for validation hints */
export const IMPRESSUM_REQUIRED_KEYS = [
  'firstName',
  'lastName',
  'street',
  'plz',
  'city',
  'email',
  'phone',
]

export function initLegalProfileFields(formData = {}) {
  const biz = { ...loadFormData(), ...formData }
  const dd = getActiveProfile() || {}
  const stored = loadLegalData().profile

  const website =
    stored.website ||
    loadLegalData().questionnaire?.websiteUrl ||
    biz.website ||
    dd.website ||
    ''

  return {
    ...DEFAULT_LEGAL_PROFILE,
    firstName: stored.firstName || biz.firstName || '',
    lastName: stored.lastName || biz.lastName || '',
    businessName:
      stored.businessName ||
      biz.intendedBusinessName ||
      biz.businessName ||
      dd.businessName ||
      '',
    legalStructure:
      stored.legalStructure || biz.businessStructure || dd.legalStructure || 'einzelunternehmer',
    street: stored.street || biz.street || dd.street || '',
    houseNumber: stored.houseNumber || biz.houseNumber || dd.houseNumber || '',
    plz: stored.plz || biz.plz || dd.plz || '',
    city: stored.city || biz.city || dd.city || '',
    country: stored.country || dd.country || 'Deutschland',
    email: stored.email || biz.email || dd.email || '',
    phone: stored.phone || biz.phone || dd.phone || '',
    website,
    steuernummer: stored.steuernummer || biz.steuernummer || dd.steuernummer || '',
    ustIdNr: stored.ustIdNr || biz.ustIdNr || dd.ustIdNr || '',
    handelsregister: stored.handelsregister || biz.handelsregister || '',
    activityDescription:
      stored.activityDescription || biz.businessActivityDescription || '',
  }
}

export function profileFieldsToBizStartPatch(fields) {
  return {
    firstName: fields.firstName,
    lastName: fields.lastName,
    intendedBusinessName: fields.businessName,
    businessName: fields.businessName,
    businessStructure: fields.legalStructure,
    street: fields.street,
    houseNumber: fields.houseNumber,
    plz: fields.plz,
    city: fields.city,
    email: fields.email,
    phone: fields.phone,
    website: fields.website,
    steuernummer: fields.steuernummer,
    ustIdNr: fields.ustIdNr,
    handelsregister: fields.handelsregister,
    businessActivityDescription: fields.activityDescription,
  }
}

export function getMissingProfileFields(fields, keys = IMPRESSUM_REQUIRED_KEYS) {
  return keys.filter((k) => !String(fields[k] || '').trim())
}

export function buildLegalProfile(overrides = {}) {
  const stored = loadLegalData().profile
  const biz = loadFormData()
  const dd = getActiveProfile() || {}
  const legal = loadLegalData()
  const q = { ...legal.questionnaire, ...overrides.questionnaire }

  const firstName = overrides.firstName ?? stored.firstName ?? biz.firstName ?? ''
  const lastName = overrides.lastName ?? stored.lastName ?? biz.lastName ?? ''
  const ownerName =
    overrides.ownerName ??
    ([firstName, lastName].filter(Boolean).join(' ') || dd.ownerName || '')

  const businessName =
    overrides.businessName ??
    stored.businessName ??
    biz.intendedBusinessName ??
    biz.businessName ??
    dd.businessName ??
    ownerName

  const structure =
    overrides.legalStructure ??
    stored.legalStructure ??
    biz.businessStructure ??
    dd.legalStructure ??
    'einzelunternehmer'

  const website =
    overrides.website ??
    stored.website ??
    q.websiteUrl ??
    biz.website ??
    dd.website ??
    ''

  return {
    ownerName,
    firstName,
    lastName,
    businessName,
    legalStructure: structure,
    legalStructureLabel: STRUCTURE_LABELS[structure] || structure,
    street: overrides.street ?? stored.street ?? biz.street ?? dd.street ?? '',
    houseNumber: overrides.houseNumber ?? stored.houseNumber ?? biz.houseNumber ?? dd.houseNumber ?? '',
    plz: overrides.plz ?? stored.plz ?? biz.plz ?? dd.plz ?? '',
    city: overrides.city ?? stored.city ?? biz.city ?? dd.city ?? '',
    country: overrides.country ?? stored.country ?? dd.country ?? 'Deutschland',
    email: overrides.email ?? stored.email ?? biz.email ?? dd.email ?? '',
    phone: overrides.phone ?? stored.phone ?? biz.phone ?? dd.phone ?? '',
    website,
    steuernummer: overrides.steuernummer ?? stored.steuernummer ?? biz.steuernummer ?? dd.steuernummer ?? '',
    ustIdNr: overrides.ustIdNr ?? stored.ustIdNr ?? biz.ustIdNr ?? dd.ustIdNr ?? '',
    taxId: overrides.taxId ?? biz.taxId ?? '',
    handelsregister: overrides.handelsregister ?? stored.handelsregister ?? biz.handelsregister ?? '',
    activityDescription:
      overrides.activityDescription ??
      stored.activityDescription ??
      biz.businessActivityDescription ??
      '',
    questionnaire: q,
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

export function buildLegalProfileFromFields(profileFields, questionnaire = {}) {
  return buildLegalProfile({
    ...profileFields,
    questionnaire: {
      ...questionnaire,
      websiteUrl: profileFields.website || questionnaire.websiteUrl,
    },
  })
}

export function syncLegalFromBizStart(formData) {
  return buildLegalProfile({
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
    website: formData.website,
    steuernummer: formData.steuernummer,
    ustIdNr: formData.ustIdNr,
    taxId: formData.taxId,
    activityDescription: formData.businessActivityDescription,
    handelsregister: formData.handelsregister,
  })
}
