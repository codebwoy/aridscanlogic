import appApi from '@/lib/appApi'
import { loadTaxVaultProfile, loadTaxVaultSettings, saveTaxVaultProfile } from './profile'

const BACKUP_VERSION = 1

export async function exportEncryptedBackup(passphrase) {
  if (!passphrase || passphrase.length < 8) {
    throw new Error('Passphrase must be at least 8 characters')
  }
  const [receipts, mileage] = await Promise.all([
    appApi.entities.Receipt.list(),
    appApi.entities.MileageLog.list(),
  ])
  const payload = JSON.stringify({
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    profile: loadTaxVaultProfile(),
    settings: loadTaxVaultSettings(),
    receipts,
    mileage,
  })
  const encrypted = await encryptText(payload, passphrase)
  const blob = new Blob([encrypted], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `tax_vault_backup_${new Date().toISOString().slice(0, 10)}.tvbackup`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importEncryptedBackup(file, passphrase) {
  const text = await file.text()
  const json = await decryptText(text, passphrase)
  const data = JSON.parse(json)
  for (const r of data.receipts || []) {
    const { id, ...rest } = r
    await appApi.entities.Receipt.create(rest)
  }
  for (const m of data.mileage || []) {
    const { id, ...rest } = m
    await appApi.entities.MileageLog.create(rest)
  }
  if (data.profile) {
    saveTaxVaultProfile(data.profile)
  }
  return data
}

async function encryptText(plain, passphrase) {
  const enc = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(passphrase, salt)
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plain))
  const out = new Uint8Array(salt.length + iv.length + cipher.byteLength)
  out.set(salt, 0)
  out.set(iv, salt.length)
  out.set(new Uint8Array(cipher), salt.length + iv.length)
  return btoa(String.fromCharCode(...out))
}

async function decryptText(b64, passphrase) {
  const raw = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
  const salt = raw.slice(0, 16)
  const iv = raw.slice(16, 28)
  const data = raw.slice(28)
  const key = await deriveKey(passphrase, salt)
  const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
  return new TextDecoder().decode(dec)
}

async function deriveKey(passphrase, salt) {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 310_000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}
