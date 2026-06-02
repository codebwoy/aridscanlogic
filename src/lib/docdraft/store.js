/**
 * DocDraft data layer — business profiles, clients, products, documents, payments, audit.
 * Persists to localStorage; syncs documents to base44.entities.DocDraftDocument for Tax Vault.
 */

import base44 from '@/lib/base44'
import { DEFAULT_PROFILE } from './constants'
import { consumeNextNumber } from './numbering'

const KEYS = {
  profiles: 'scanlogic_dd_profiles',
  activeProfile: 'scanlogic_dd_active_profile',
  clients: 'scanlogic_dd_clients',
  products: 'scanlogic_dd_products',
  payments: 'scanlogic_dd_payments',
  audit: 'scanlogic_dd_audit',
  settings: 'scanlogic_dd_settings',
}

function uid(prefix = 'dd') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null')
  } catch {
    return null
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

// ——— Profiles ———
export function loadProfiles() {
  const p = read(KEYS.profiles)
  return Array.isArray(p) ? p : []
}

export function getActiveProfileId() {
  return read(KEYS.activeProfile) || loadProfiles()[0]?.id || null
}

export function setActiveProfileId(id) {
  write(KEYS.activeProfile, id)
}

export function getActiveProfile() {
  const id = getActiveProfileId()
  const profiles = loadProfiles()
  return profiles.find((p) => p.id === id) || profiles[0] || null
}

export function saveProfile(profile) {
  const profiles = loadProfiles()
  const data = {
    ...DEFAULT_PROFILE,
    ...profile,
    id: profile.id || uid('prof'),
    updatedAt: new Date().toISOString(),
  }
  if (!data.createdAt) data.createdAt = data.updatedAt
  const idx = profiles.findIndex((p) => p.id === data.id)
  if (idx >= 0) profiles[idx] = data
  else profiles.push(data)
  write(KEYS.profiles, profiles)
  if (!getActiveProfileId()) setActiveProfileId(data.id)
  return data
}

export function deleteProfile(id) {
  write(
    KEYS.profiles,
    loadProfiles().filter((p) => p.id !== id)
  )
}

export function ensureDefaultProfile() {
  let profiles = loadProfiles()
  if (profiles.length === 0) {
    const legacy = tryImportLegacyProfile()
    const p = saveProfile(legacy || { businessName: 'My Business' })
    profiles = [p]
  }
  if (!getActiveProfileId()) setActiveProfileId(profiles[0].id)
  return getActiveProfile()
}

function tryImportLegacyProfile() {
  try {
    const raw = JSON.parse(localStorage.getItem('scanlogic_docdraft_profile') || '{}')
    if (!raw.company_name && !raw.businessName) return null
    return {
      businessName: raw.company_name || raw.businessName || '',
      steuernummer: raw.steuernummer || '',
      ustIdNr: raw.ust_id_nr || raw.ustIdNr || '',
      iban: raw.iban || '',
      bic: raw.bic || '',
      isKleinunternehmer: raw.is_kleinunternehmer ?? raw.kleinunternehmer ?? false,
      email: raw.email || '',
      street: raw.address || raw.street || '',
      city: raw.city || '',
    }
  } catch {
    return null
  }
}

// ——— Clients (per profile) ———
export function loadClients(profileId) {
  const all = read(KEYS.clients) || {}
  return all[profileId] || []
}

export function saveClient(profileId, client) {
  const all = read(KEYS.clients) || {}
  const list = all[profileId] || []
  const data = {
    clientType: 'business',
    tags: [],
    ...client,
    id: client.id || uid('cli'),
    customerNumber: client.customerNumber || `KD-${String(list.length + 1).padStart(4, '0')}`,
    businessProfileId: profileId,
  }
  const idx = list.findIndex((c) => c.id === data.id)
  if (idx >= 0) list[idx] = data
  else list.push(data)
  all[profileId] = list
  write(KEYS.clients, all)
  return data
}

export function getClient(profileId, clientId) {
  return loadClients(profileId).find((c) => c.id === clientId)
}

export function deleteClient(profileId, clientId) {
  const all = read(KEYS.clients) || {}
  all[profileId] = (all[profileId] || []).filter((c) => c.id !== clientId)
  write(KEYS.clients, all)
}

// ——— Products (per profile) ———
export function loadProducts(profileId) {
  const all = read(KEYS.products) || {}
  return all[profileId] || []
}

export function saveProduct(profileId, product) {
  const all = read(KEYS.products) || {}
  const list = all[profileId] || []
  const data = {
    unit: 'piece',
    isActive: true,
    vatRate: 19,
    ...product,
    id: product.id || uid('prd'),
    businessProfileId: profileId,
  }
  const idx = list.findIndex((p) => p.id === data.id)
  if (idx >= 0) list[idx] = data
  else list.push(data)
  all[profileId] = list
  write(KEYS.products, all)
  return data
}

export function deleteProduct(profileId, productId) {
  const all = read(KEYS.products) || {}
  all[profileId] = (all[profileId] || []).filter((p) => p.id !== productId)
  write(KEYS.products, all)
}

// ——— Documents ———
export async function loadDocuments(profileId) {
  const all = await base44.entities.DocDraftDocument.list()
  return all.filter((d) => !d.profile_id || d.profile_id === profileId)
}

export function addAuditEntry(documentId, action, details = '') {
  const all = read(KEYS.audit) || []
  all.push({
    id: uid('aud'),
    documentId,
    action,
    details,
    performedAt: new Date().toISOString(),
  })
  write(KEYS.audit, all)
}

export function getAuditLog(documentId) {
  return (read(KEYS.audit) || []).filter((a) => a.documentId === documentId)
}

export async function saveDocument(doc, profile) {
  const payload = {
    ...doc,
    profile_id: profile.id,
    updated_date: new Date().toISOString(),
  }
  let saved
  if (doc.id) {
    saved = await base44.entities.DocDraftDocument.update(doc.id, payload)
    addAuditEntry(doc.id, 'updated', doc.status)
  } else {
    saved = await base44.entities.DocDraftDocument.create(payload)
    addAuditEntry(saved.id, 'created', doc.document_type)
  }
  return saved
}

export function reserveDocumentNumber(profile, documentType) {
  const { number, sequences } = consumeNextNumber(profile, documentType)
  const updated = saveProfile({ ...profile, sequences })
  return { number, profile: updated }
}

// ——— Payments ———
export function loadPayments(documentId) {
  const all = read(KEYS.payments) || {}
  return all[documentId] || []
}

export function addPayment(documentId, payment) {
  const all = read(KEYS.payments) || {}
  const list = all[documentId] || []
  const entry = { id: uid('pay'), ...payment, createdAt: new Date().toISOString() }
  list.push(entry)
  all[documentId] = list
  write(KEYS.payments, all)
  addAuditEntry(documentId, 'payment_recorded', `€${payment.amount}`)
  return entry
}

export function getTotalPaid(documentId) {
  return loadPayments(documentId).reduce((s, p) => s + (Number(p.amount) || 0), 0)
}

// ——— Stats ———
export function computeDocStats(documents) {
  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()

  let invoicedMonth = 0
  let paidMonth = 0
  let outstanding = 0
  let overdueCount = 0
  const statusCounts = { paid: 0, pending: 0, overdue: 0, draft: 0 }

  documents.forEach((d) => {
    const gross = d.total_gross || 0
    const issue = d.issue_date ? new Date(d.issue_date) : null
    const due = d.due_date ? new Date(d.due_date) : null
    const paid = d.status === 'paid'
    const isFinalized = d.status && d.status !== 'draft'

    if (issue && issue.getMonth() === month && issue.getFullYear() === year && isFinalized) {
      invoicedMonth += gross
    }
    if (paid && issue && issue.getMonth() === month && issue.getFullYear() === year) {
      paidMonth += gross
    }
    if (['sent', 'viewed', 'partially_paid', 'overdue'].includes(d.status)) {
      outstanding += gross - getTotalPaid(d.id)
    }
    if (d.status === 'overdue' || (due && due < now && !paid && isFinalized)) {
      overdueCount++
      statusCounts.overdue++
    } else if (paid) statusCounts.paid++
    else if (d.status === 'draft') statusCounts.draft++
    else if (isFinalized) statusCounts.pending++
  })

  return { invoicedMonth, paidMonth, outstanding, overdueCount, statusCounts }
}

export function loadSettings() {
  return read(KEYS.settings) || { gobdMode: true, autoReminders: false }
}

export function saveSettings(settings) {
  write(KEYS.settings, { ...loadSettings(), ...settings })
}
