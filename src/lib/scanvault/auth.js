import { getSessionUser, saveSessionUser } from './store'

export function loginWithEmail(email, password) {
  const users = JSON.parse(localStorage.getItem('scanvault_accounts') || '[]')
  const found = users.find((u) => u.email === email && u.password === password)
  if (!found) throw new Error('Invalid email or password')
  const { password: _, ...safe } = found
  saveSessionUser(safe)
  return safe
}

export function registerUser({ name, email, password }) {
  const users = JSON.parse(localStorage.getItem('scanvault_accounts') || '[]')
  if (users.some((u) => u.email === email)) throw new Error('Email already registered')
  const user = {
    id: `u-${Date.now()}`,
    name,
    email,
    password,
    avatarUrl: '',
    plan: 'free',
    trialEndsAt: null,
    subscriptionExpiresAt: null,
    storageUsedBytes: 0,
    scanCount: 0,
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  localStorage.setItem('scanvault_accounts', JSON.stringify(users))
  const { password: _, ...safe } = user
  saveSessionUser(safe)
  return safe
}

export function loginWithGoogle() {
  const user = {
    id: `google-${Date.now()}`,
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
