import { getSessionUser, saveSessionUser } from './store'
import { hashPassword, verifyPassword, isPasswordHash } from '@/lib/security/password'

const ACCOUNTS_KEY = 'scanvault_accounts'

function loadAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveAccounts(users) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(users))
}

function stripPassword(user) {
  const { password: _, passwordHash: __, ...safe } = user
  return safe
}

async function migrateAccountPassword(account, plainPassword) {
  if (isPasswordHash(account.password) || isPasswordHash(account.passwordHash)) return account
  const passwordHash = await hashPassword(plainPassword)
  const { password: _, ...rest } = account
  return { ...rest, passwordHash }
}

export async function loginWithEmail(email, password) {
  const users = loadAccounts()
  const idx = users.findIndex((u) => u.email === email)
  if (idx < 0) throw new Error('Invalid email or password')

  const account = users[idx]
  const stored = account.passwordHash || account.password
  const valid = await verifyPassword(password, stored)
  if (!valid) throw new Error('Invalid email or password')

  if (!isPasswordHash(stored)) {
    users[idx] = await migrateAccountPassword(account, password)
    saveAccounts(users)
  }

  const safe = stripPassword(users[idx])
  saveSessionUser(safe)
  return safe
}

export async function registerUser({ name, email, password }) {
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters')
  }
  const users = loadAccounts()
  if (users.some((u) => u.email === email)) throw new Error('Email already registered')

  const passwordHash = await hashPassword(password)
  const user = {
    id: `u-${crypto.randomUUID()}`,
    name,
    email,
    passwordHash,
    avatarUrl: '',
    plan: 'free',
    trialEndsAt: null,
    subscriptionExpiresAt: null,
    storageUsedBytes: 0,
    scanCount: 0,
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  saveAccounts(users)
  const safe = stripPassword(user)
  saveSessionUser(safe)
  return safe
}

export function loginWithGoogle() {
  const user = {
    id: `google-${crypto.randomUUID()}`,
    name: 'Google User',
    email: 'user@gmail.com',
    avatarUrl: '',
    plan: 'free',
    storageUsedBytes: 0,
    scanCount: 0,
    createdAt: new Date().toISOString(),
  }
  saveSessionUser(user)
  return user
}

export function startPremiumTrial(user) {
  const trialEnds = new Date()
  trialEnds.setDate(trialEnds.getDate() + 3)
  const updated = {
    ...user,
    plan: 'premium',
    trialEndsAt: trialEnds.toISOString(),
  }
  saveSessionUser(updated)
  return updated
}

export function getCurrentUser() {
  return getSessionUser()
}
