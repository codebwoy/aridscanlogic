const PROFILE_KEY = 'scanlogic_taxvault_profile'
const SETTINGS_KEY = 'scanlogic_taxvault_settings'

export const DEFAULT_PROFILE = {
  businessName: '',
  ownerName: '',
  taxId: '',
  vatNumber: '',
  address: '',
  businessType: 'sole_trader',
  homeCurrency: 'EUR',
  taxYearStartMonth: 1,
  accountantName: '',
  accountantEmail: '',
}

export const DEFAULT_SETTINGS = {
  mileageRatePerKm: 0.3,
  defaultCategory: 'Other Business Expense',
  autoOcr: true,
  recurringReminders: true,
}

export function loadTaxVaultProfile() {
  try {
    return { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}') }
  } catch {
    return { ...DEFAULT_PROFILE }
  }
}

import base44 from '@/lib/base44'

export async function syncTaxVaultProfileToCloud(profile) {
  try {
    const existing = await base44.entities.BusinessProfile.list({ module: 'taxvault' })
    const payload = { ...profile, module: 'taxvault' }
    if (existing[0]?.id) {
      await base44.entities.BusinessProfile.update(existing[0].id, payload)
    } else {
      await base44.entities.BusinessProfile.create(payload)
    }
  } catch {
    /* demo / offline — local profile still saved */
  }
}

export function saveTaxVaultProfile(profile) {
  const merged = { ...loadTaxVaultProfile(), ...profile }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(merged))
  syncTaxVaultProfileToCloud(merged)
  return merged
}

export function hasTaxVaultProfile() {
  const p = loadTaxVaultProfile()
  return !!(p.businessName?.trim() && p.ownerName?.trim())
}

export function loadTaxVaultSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveTaxVaultSettings(settings) {
  const merged = { ...loadTaxVaultSettings(), ...settings }
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged))
  return merged
}
