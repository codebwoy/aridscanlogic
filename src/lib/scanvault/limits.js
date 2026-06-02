import { listDocuments, listFolders } from './store'

const FREE_SCAN_LIMIT = 50
const FREE_PAGE_LIMIT = 5
const FREE_FOLDER_LIMIT = 3

export function isPremiumUser(user) {
  if (!user) return false
  if (user.plan === 'premium') {
    if (user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) < new Date()) {
      return false
    }
    return true
  }
  if (user.trialEndsAt && new Date(user.trialEndsAt) > new Date()) return true
  return false
}

export function canAddScan(user) {
  if (isPremiumUser(user)) return { ok: true }
  if (listDocuments().length >= FREE_SCAN_LIMIT) {
    return { ok: false, reason: 'scan_limit', message: 'Free plan allows 50 scans. Upgrade for unlimited.' }
  }
  return { ok: true }
}

export function canAddPage(user, currentPageCount) {
  if (isPremiumUser(user)) return { ok: true }
  if (currentPageCount >= FREE_PAGE_LIMIT) {
    return {
      ok: false,
      reason: 'page_limit',
      message: 'Upgrade to scan unlimited pages per document.',
    }
  }
  return { ok: true }
}

export function canCreateFolder(user) {
  if (isPremiumUser(user)) return { ok: true }
  const custom = listFolders().filter((f) => !f.isDefault)
  if (custom.length >= FREE_FOLDER_LIMIT) {
    return { ok: false, reason: 'folder_limit', message: 'Upgrade for unlimited folders.' }
  }
  return { ok: true }
}

export function hasWatermark(user) {
  return !isPremiumUser(user)
}

export function canBatchExport(user) {
  return isPremiumUser(user)
}

export function canCloudSync(user) {
  return isPremiumUser(user)
}
