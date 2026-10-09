/**
 * Local order queue + sync from eBay Fulfillment API.
 */

import { fetchEbayOrders, shipEbayOrder } from '../ebay/client'
import { loadCatalog } from '../catalog/store'
import { notifySeller } from './notifications'

export const ORDER_STATUS = {
  NEW: 'NEW',
  PENDING_SUPPLIER: 'PENDING_SUPPLIER',
  ORDERED_SUPPLIER: 'ORDERED_SUPPLIER',
  SHIPPED: 'SHIPPED',
  ISSUE: 'ISSUE',
  CANCELLED: 'CANCELLED',
}

const ORDERS_KEY = 'scanlogic_listingengine_orders'

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

export function emptyLocalOrder(overrides = {}) {
  const now = new Date().toISOString()
  return {
    id: overrides.id || `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    orderId: '',
    buyerUsername: '',
    creationDate: null,
    orderFulfillmentStatus: '',
    localStatus: ORDER_STATUS.NEW,
    lineItems: [],
    shipTo: {},
    total: null,
    currency: 'EUR',
    maxEstimatedDeliveryDate: null,
    supplierOrderedAt: null,
    supplierNotes: '',
    trackingNumber: '',
    shippingCarrierCode: '',
    shippedAt: null,
    fulfillmentId: '',
    lastError: '',
    handlingAlert: false,
    dry_run_shipped: false,
    updated_at: now,
    ...overrides,
  }
}

function mapRemoteToLocal(remote, existing = null) {
  const base = existing || emptyLocalOrder({ orderId: remote.orderId })
  let localStatus = base.localStatus
  if (remote.cancelStatus && /cancel/i.test(String(remote.cancelStatus))) {
    localStatus = ORDER_STATUS.CANCELLED
  } else if (
    remote.orderFulfillmentStatus === 'FULFILLED' ||
    (remote.shippingFulfillments || []).length
  ) {
    localStatus = ORDER_STATUS.SHIPPED
  } else if (localStatus === ORDER_STATUS.NEW || !existing) {
    localStatus = ORDER_STATUS.PENDING_SUPPLIER
  }

  const tracking =
    remote.shippingFulfillments?.[0]?.shipmentTrackingNumber || base.trackingNumber || ''
  const carrier =
    remote.shippingFulfillments?.[0]?.shippingCarrierCode || base.shippingCarrierCode || ''

  const deadline = remote.maxEstimatedDeliveryDate
    ? new Date(remote.maxEstimatedDeliveryDate).getTime()
    : null
  const handlingAlert =
    localStatus !== ORDER_STATUS.SHIPPED &&
    localStatus !== ORDER_STATUS.CANCELLED &&
    deadline != null &&
    deadline - Date.now() < 48 * 60 * 60 * 1000

  return emptyLocalOrder({
    ...base,
    orderId: remote.orderId,
    buyerUsername: remote.buyerUsername || base.buyerUsername,
    creationDate: remote.creationDate,
    orderFulfillmentStatus: remote.orderFulfillmentStatus,
    localStatus,
    lineItems: remote.lineItems || [],
    shipTo: remote.shipTo || {},
    total: remote.total,
    currency: remote.currency || 'EUR',
    maxEstimatedDeliveryDate: remote.maxEstimatedDeliveryDate,
    trackingNumber: tracking,
    shippingCarrierCode: carrier,
    fulfillmentId: remote.shippingFulfillments?.[0]?.fulfillmentId || base.fulfillmentId,
    handlingAlert,
    updated_at: new Date().toISOString(),
  })
}

export function loadOrders() {
  const raw = readJson(ORDERS_KEY, null)
  if (!raw || typeof raw !== 'object') return { version: 1, orders: [], updated_at: null }
  return {
    version: 1,
    orders: Array.isArray(raw.orders) ? raw.orders.map((o) => emptyLocalOrder(o)) : [],
    updated_at: raw.updated_at || null,
  }
}

export function saveOrders(orders) {
  const next = {
    version: 1,
    orders: orders.map((o) => emptyLocalOrder(o)),
    updated_at: new Date().toISOString(),
  }
  writeJson(ORDERS_KEY, next)
  return next
}

export function updateOrder(orderId, patch) {
  const state = loadOrders()
  const orders = state.orders.map((o) =>
    o.orderId === orderId
      ? emptyLocalOrder({ ...o, ...patch, updated_at: new Date().toISOString() })
      : o
  )
  return saveOrders(orders)
}

/** Match order line SKUs to catalog products. */
export function enrichOrdersWithCatalog(orders) {
  const catalog = loadCatalog()
  const bySku = new Map(catalog.products.map((p) => [p.supplier_sku, p]))
  const byEbaySku = new Map(
    catalog.products.filter((p) => p.ebay_sku).map((p) => [p.ebay_sku, p])
  )
  return orders.map((o) => ({
    ...o,
    lineItems: (o.lineItems || []).map((li) => {
      const match = bySku.get(li.sku) || byEbaySku.get(li.sku)
      return {
        ...li,
        catalog_title: match?.title || '',
        catalog_supplier_sku: match?.supplier_sku || '',
        catalog_cost: match?.supplier_cost || '',
      }
    }),
  }))
}

export async function syncOrdersFromEbay({ days = 14, limit = 50 } = {}) {
  const data = await fetchEbayOrders({ days, limit })
  const remote = data.orders || []
  const state = loadOrders()
  const byId = new Map(state.orders.map((o) => [o.orderId, o]))
  for (const r of remote) {
    if (!r?.orderId) continue
    byId.set(r.orderId, mapRemoteToLocal(r, byId.get(r.orderId)))
  }
  const orders = enrichOrdersWithCatalog([...byId.values()]).sort((a, b) =>
    String(b.creationDate || '').localeCompare(String(a.creationDate || ''))
  )
  const saved = saveOrders(orders)
  const alerts = saved.orders.filter((o) => o.handlingAlert)
  if (alerts.length) {
    notifySeller(
      'handling',
      `${alerts.length} Bestellung(en) nahe Handling-Frist: ${alerts
        .slice(0, 3)
        .map((o) => o.orderId)
        .join(', ')}`
    ).catch(() => {})
  }
  return saved
}

export function markOrderedFromSupplier(orderId, notes = '') {
  return updateOrder(orderId, {
    localStatus: ORDER_STATUS.ORDERED_SUPPLIER,
    supplierOrderedAt: new Date().toISOString(),
    supplierNotes: notes,
    lastError: '',
  })
}

export function markOrderIssue(orderId, message) {
  return updateOrder(orderId, {
    localStatus: ORDER_STATUS.ISSUE,
    lastError: String(message || 'issue'),
  })
}

/**
 * Upload tracking to eBay (or dry-run) and mark SHIPPED locally.
 */
export async function uploadTracking({
  orderId,
  trackingNumber,
  shippingCarrierCode,
  dryRun = true,
}) {
  const state = loadOrders()
  const order = state.orders.find((o) => o.orderId === orderId)
  if (!order) throw new Error('Order not found locally — sync first.')
  const lineItems = (order.lineItems || []).map((li) => ({
    lineItemId: li.lineItemId,
    quantity: li.quantity || 1,
  }))
  if (!lineItems.length) throw new Error('Order has no line items')

  const result = await shipEbayOrder({
    orderId,
    trackingNumber,
    shippingCarrierCode,
    lineItems,
    dry_run: !!dryRun,
  })

  return updateOrder(orderId, {
    localStatus: ORDER_STATUS.SHIPPED,
    trackingNumber,
    shippingCarrierCode,
    shippedAt: new Date().toISOString(),
    fulfillmentId: result.fulfillmentId || '',
    dry_run_shipped: !!dryRun,
    lastError: '',
    handlingAlert: false,
  })
}

export const COMMON_CARRIERS = [
  { code: 'DHL', label: 'DHL' },
  { code: 'DPD', label: 'DPD' },
  { code: 'Hermes', label: 'Hermes / Evri' },
  { code: 'UPS', label: 'UPS' },
  { code: 'FedEx', label: 'FedEx' },
  { code: 'DeutschePost', label: 'Deutsche Post' },
  { code: 'Other', label: 'Other' },
]

/** Practice order for dry-run: sync → mark supplier → tracking (no live eBay sale needed). */
export function addSampleDryRunOrder() {
  const catalog = loadCatalog()
  const sampleProduct = catalog.products[0]
  const sku = sampleProduct?.ebay_sku || sampleProduct?.supplier_sku || 'WH-001'
  const title =
    sampleProduct?.title || 'LED Schreibtischlampe Schwarz 10W (Sample)'
  const in48h = new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString()
  const orderId = `SAMPLE-${Date.now().toString(36).toUpperCase()}`

  const order = emptyLocalOrder({
    orderId,
    buyerUsername: 'demo_kaeufer_de',
    creationDate: new Date().toISOString(),
    orderFulfillmentStatus: 'NOT_STARTED',
    localStatus: ORDER_STATUS.PENDING_SUPPLIER,
    lineItems: [
      {
        lineItemId: `li-${orderId}`,
        sku,
        title,
        quantity: 1,
        catalog_title: title,
        catalog_supplier_sku: sampleProduct?.supplier_sku || sku,
        catalog_cost: sampleProduct?.supplier_cost || '12.50',
      },
    ],
    shipTo: {
      fullName: 'Max Mustermann',
      addressLine1: 'Musterstraße 1',
      addressLine2: '',
      city: 'Berlin',
      stateOrProvince: 'BE',
      postalCode: '10115',
      countryCode: 'DE',
      phone: '',
      email: '',
    },
    total: { value: '29.99', currency: 'EUR' },
    currency: 'EUR',
    maxEstimatedDeliveryDate: in48h,
    handlingAlert: true,
    supplierNotes: 'dry-run sample — not a real eBay order',
  })

  const state = loadOrders()
  return saveOrders([order, ...state.orders.filter((o) => !String(o.orderId).startsWith('SAMPLE-'))])
}

export function clearSampleOrders() {
  const state = loadOrders()
  return saveOrders(state.orders.filter((o) => !String(o.orderId).startsWith('SAMPLE-')))
}
