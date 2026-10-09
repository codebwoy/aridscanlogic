/**
 * Catalog persistence — localStorage (same pattern as listing session).
 */

import {
  emptyCatalogState,
  normalizeCatalogProduct,
  normalizeCatalogSettings,
  effectiveDailyCap,
} from './schema'

const CATALOG_KEY = 'scanlogic_listingengine_catalog'
const DAILY_PUBLISH_KEY = 'scanlogic_listingengine_daily_publish'

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function loadCatalog() {
  const raw = readJson(CATALOG_KEY, null)
  if (!raw || typeof raw !== 'object') return emptyCatalogState()
  return {
    version: 1,
    settings: normalizeCatalogSettings(raw.settings || {}),
    products: Array.isArray(raw.products)
      ? raw.products.map(normalizeCatalogProduct)
      : [],
    publish_log: Array.isArray(raw.publish_log) ? raw.publish_log.slice(-200) : [],
    updated_at: raw.updated_at || null,
  }
}

export function saveCatalog(patch = {}) {
  const current = loadCatalog()
  const next = {
    version: 1,
    settings: patch.settings
      ? normalizeCatalogSettings({ ...current.settings, ...patch.settings })
      : current.settings,
    products: Array.isArray(patch.products)
      ? patch.products.map(normalizeCatalogProduct)
      : current.products,
    publish_log: Array.isArray(patch.publish_log)
      ? patch.publish_log.slice(-200)
      : current.publish_log,
    updated_at: new Date().toISOString(),
  }
  writeJson(CATALOG_KEY, next)
  return next
}

export function upsertProducts(products) {
  const catalog = loadCatalog()
  const byId = new Map(catalog.products.map((p) => [p.id, p]))
  const bySku = new Map(
    catalog.products.filter((p) => p.supplier_sku).map((p) => [p.supplier_sku, p])
  )
  for (const incoming of products.map(normalizeCatalogProduct)) {
    const existing =
      (incoming.id && byId.get(incoming.id)) ||
      (incoming.supplier_sku && bySku.get(incoming.supplier_sku))
    if (existing) {
      const merged = normalizeCatalogProduct({
        ...existing,
        ...incoming,
        id: existing.id,
        updated_at: new Date().toISOString(),
      })
      byId.set(existing.id, merged)
    } else {
      byId.set(incoming.id, incoming)
    }
  }
  return saveCatalog({ products: [...byId.values()] })
}

export function updateProduct(id, patch) {
  const catalog = loadCatalog()
  const products = catalog.products.map((p) =>
    p.id === id
      ? normalizeCatalogProduct({ ...p, ...patch, updated_at: new Date().toISOString() })
      : p
  )
  return saveCatalog({ products })
}

export function removeProducts(ids) {
  const set = new Set(ids)
  const catalog = loadCatalog()
  return saveCatalog({ products: catalog.products.filter((p) => !set.has(p.id)) })
}

export function clearCatalogProducts() {
  return saveCatalog({ products: [], publish_log: [] })
}

export function appendPublishLog(entry) {
  const catalog = loadCatalog()
  const publish_log = [
    ...catalog.publish_log,
    { at: new Date().toISOString(), ...entry },
  ].slice(-200)
  return saveCatalog({ publish_log })
}

export function getDailyPublishUsage() {
  const raw = readJson(DAILY_PUBLISH_KEY, {})
  const day = todayKey()
  if (raw.day !== day) return { day, count: 0, errors: 0 }
  return {
    day,
    count: Number(raw.count) || 0,
    errors: Number(raw.errors) || 0,
  }
}

export function recordDailyPublish({ success = true } = {}) {
  const usage = getDailyPublishUsage()
  const day = todayKey()
  const next = {
    day,
    count: usage.day === day ? usage.count + (success ? 1 : 0) : success ? 1 : 0,
    errors: usage.day === day ? usage.errors + (success ? 0 : 1) : success ? 0 : 1,
  }
  writeJson(DAILY_PUBLISH_KEY, next)
  return next
}

export function remainingPublishSlots(settings) {
  const cap = effectiveDailyCap(settings || loadCatalog().settings)
  const usage = getDailyPublishUsage()
  return Math.max(0, cap - usage.count)
}

export function bumpCleanDayOrReset(hadErrors) {
  const catalog = loadCatalog()
  const settings = { ...catalog.settings }
  if (hadErrors) {
    settings.consecutive_clean_days = 0
  } else {
    settings.consecutive_clean_days = (settings.consecutive_clean_days || 0) + 1
  }
  return saveCatalog({ settings })
}
