import base44 from '@/lib/base44'
import { saveProfile, getActiveProfile, ensureDefaultProfile } from '@/lib/docdraft/store'

const FORM_KEY = 'scanlogic_bizstart_form'
const STEP_KEY = 'scanlogic_bizstart_steps'
const VAT_KEY = 'scanlogic_german_vat_settings'
const DOCS_KEY = 'scanlogic_registration_docs'

function read(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function loadFormData() {
  return read(FORM_KEY, {})
}

export function saveFormData(data) {
  const merged = { ...loadFormData(), ...data, lastUpdatedAt: new Date().toISOString() }
  write(FORM_KEY, merged)
  return merged
}

export function loadStepStatus() {
  return read(STEP_KEY, {})
}

export function setStepStatus(stepId, status, extra = {}) {
  const all = loadStepStatus()
  all[stepId] = { status, updatedAt: new Date().toISOString(), ...extra }
  write(STEP_KEY, all)
  return all
}

export function loadVatSettings() {
  return read(VAT_KEY, {
    vatScheme: 'kleinunternehmer',
    vatFilingFrequency: 'quarterly',
    currentYearRevenue: 0,
    skrVersion: 'SKR03',
  })
}

export function saveVatSettings(settings) {
  const merged = { ...loadVatSettings(), ...settings }
  write(VAT_KEY, merged)
  return merged
}

export function loadRegistrationDocs() {
  return read(DOCS_KEY, [])
}

export function addRegistrationDoc(doc) {
  const list = loadRegistrationDocs()
  list.push({
    id: `rd-${Date.now()}`,
    permanent: true,
    ...doc,
    uploadedAt: new Date().toISOString(),
  })
  write(DOCS_KEY, list)
  return list
}

export async function loadBusinessRegistration() {
  const regs = await base44.entities.BusinessRegistration.list()
  return regs[0] || null
}

export async function syncRegistrationToTaxVault(formData, stepStatus) {
  const structure = formData.businessStructure || 'einzelunternehmer'
  const existing = await loadBusinessRegistration()

  const payload = {
    business_structure: structure,
    registration_status:
      stepStatus.complete?.status === 'confirmed' ? 'completed' : 'in_progress',
    gewerbe_status: stepStatus.gewerbe?.status || existing?.gewerbe_status || 'not_started',
    finanzamt_status: stepStatus.finanzamt?.status || existing?.finanzamt_status || 'not_started',
    handelsregister_status: stepStatus.handelsregister?.status || 'not_applicable',
    ihk_status: stepStatus.ihk?.status || 'not_started',
    vat_status: formData.vatScheme === 'kleinunternehmer' ? 'kleinunternehmer' : 'standard',
    steuernummer: formData.steuernummer || existing?.steuernummer || '',
    ust_id_nr: formData.ustIdNr || existing?.ust_id_nr || '',
    gewerbeschein_url: stepStatus.gewerbe?.gewerbescheinUrl || '',
  }

  let reg
  if (existing?.id) {
    reg = await base44.entities.BusinessRegistration.update(existing.id, payload)
  } else {
    reg = await base44.entities.BusinessRegistration.create(payload)
  }

  ensureDefaultProfile()
  const profile = getActiveProfile()
  if (profile) {
    saveProfile({
      ...profile,
      businessName: formData.businessName || formData.intendedBusinessName || profile.businessName,
      legalStructure: structure,
      street: formData.street,
      houseNumber: formData.houseNumber,
      plz: formData.plz,
      city: formData.city,
      steuernummer: formData.steuernummer || profile.steuernummer,
      ustIdNr: formData.ustIdNr || profile.ustIdNr,
      iban: formData.iban || profile.iban,
      bic: formData.bic || profile.bic,
      isKleinunternehmer: formData.vatScheme === 'kleinunternehmer',
      email: formData.email || profile.email,
      phone: formData.phone || profile.phone,
    })
  }

  saveVatSettings({
    vatScheme: formData.vatScheme || 'kleinunternehmer',
    vatFilingFrequency: formData.vatFilingFrequency || 'quarterly',
    ustIdNr: formData.ustIdNr,
    currentYearRevenue: formData.currentYearRevenue || 0,
  })

  return reg
}

export async function seedPersonalizedDeadlines(formData) {
  const year = new Date().getFullYear()
  const existing = await base44.entities.TaxDeadline.list()
  if (existing.length > 5) return existing

  const freq = formData.vatFilingFrequency || 'quarterly'
  const deadlines = [
    {
      deadline_name: 'Einkommensteuererklärung',
      due_date: `${year + 1}-07-31`,
      is_filed: false,
      category: 'ESt',
    },
    {
      deadline_name: 'Gewerbesteuererklärung',
      due_date: `${year + 1}-05-31`,
      is_filed: false,
      category: 'Gewerbe',
    },
  ]

  if (formData.vatScheme !== 'kleinunternehmer') {
    deadlines.push({
      deadline_name: 'Umsatzsteuervoranmeldung Q1',
      due_date: `${year}-04-10`,
      is_filed: false,
      category: 'USt',
    })
    if (freq === 'monthly') {
      deadlines.push({
        deadline_name: 'USt-Voranmeldung (monatlich)',
        due_date: `${year}-${String(new Date().getMonth() + 2).padStart(2, '0')}-10`,
        is_filed: false,
        category: 'USt',
      })
    }
  }

  for (const d of deadlines) {
    await base44.entities.TaxDeadline.create(d)
  }
  return base44.entities.TaxDeadline.list()
}
