import { loadTaxVaultProfile } from '@/lib/taxvault/profile'
import { loadFormData, loadVatSettings } from '@/lib/bizstart/store'
import { DEFAULT_HEBESATZ } from '@/lib/taxCalculations'
import {
  estimateHealthInsuranceMonthly,
  krankenkasseRegistrationDueDate,
  shouldShowKrankenkasseDeadline,
} from '@/lib/taxvault/krankenkasse'

/** Unified Gewerbe overhead config from Tax Vault profile + BizStart progress */
export function loadTaxOverheadConfig() {
  const profile = loadTaxVaultProfile()
  const form = loadFormData()
  const vat = loadVatSettings()

  const healthInsuranceType =
    profile.healthInsuranceType || form.healthInsuranceType || 'pending'
  const expectedProfitYear1 =
    Number(profile.expectedProfitYear1) ||
    Number(form.expectedProfitYear1) ||
    0
  const hebesatz = Number(profile.gewerbesteuerHebesatz) || DEFAULT_HEBESATZ
  const vatScheme = profile.vatScheme || vat.vatScheme || form.vatScheme || 'kleinunternehmer'
  const businessStructure = profile.businessStructure || form.businessStructure || ''

  const healthEstimate = estimateHealthInsuranceMonthly({
    healthInsuranceType,
    expectedProfitYear1,
    zusatzbeitragPct: profile.healthInsuranceZusatzbeitrag ?? form.healthInsuranceZusatzbeitrag,
    healthInsuranceAge: profile.healthInsuranceAge ?? form.healthInsuranceAge ?? 35,
    annualProfit: expectedProfitYear1,
  })

  const mergedForm = { ...form, healthInsuranceType, healthInsuranceStatus: profile.healthInsuranceStatus || form.healthInsuranceStatus }
  const showKrankenkasseDeadline = shouldShowKrankenkasseDeadline(mergedForm)
  const krankenkasseDueDate = showKrankenkasseDeadline ? krankenkasseRegistrationDueDate(mergedForm) : null

  return {
    businessName: profile.businessName || form.intendedBusinessName || form.businessName || '',
    businessStructure,
    vatScheme,
    isKleinunternehmer: vatScheme === 'kleinunternehmer',
    steuernummer: profile.taxId || form.steuernummer || '',
    ustIdNr: profile.vatNumber || form.ustIdNr || vat.ustIdNr || '',
    hebesatz,
    expectedProfitYear1,
    vatFilingFrequency: profile.vatFilingFrequency || vat.vatFilingFrequency || form.vatFilingFrequency || 'quarterly',
    healthInsuranceType,
    healthInsurerName: profile.healthInsurerName || form.healthInsurerName || '',
    healthInsuranceStatus: profile.healthInsuranceStatus || form.healthInsuranceStatus || 'not_started',
    healthInsuranceMemberId: profile.healthInsuranceMemberId || form.healthInsuranceMemberId || '',
    healthInsuranceZusatzbeitrag: profile.healthInsuranceZusatzbeitrag ?? form.healthInsuranceZusatzbeitrag ?? 1.7,
    healthInsuranceAge: profile.healthInsuranceAge ?? form.healthInsuranceAge ?? 35,
    healthEstimate,
    krankenkasseDueDate,
    showKrankenkasseDeadline,
    bizStartComplete: form.businessStructure && form.healthInsuranceType,
  }
}
