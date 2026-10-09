/**
 * Browser client for /api/ebay — uses apiFetch; tokens in sessionStorage.
 */

import { apiFetch } from '@/lib/apiFetch'
import {
  clearEbayAuth,
  consumeOauthState,
  createOauthState,
  ebayTokenNeedsRefresh,
  loadEbayAuth,
  saveEbayAuth,
} from './authStore'

async function parseJson(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data.error || data.message || `HTTP ${res.status}`
    const err = new Error(msg)
    err.status = res.status
    err.details = data.details || data.errors
    throw err
  }
  return data
}

export async function fetchEbayStatus() {
  const res = await apiFetch('/api/ebay/status')
  return parseJson(res)
}

async function ensureAccessToken() {
  let auth = loadEbayAuth()
  if (!auth?.refresh_token && !auth?.access_token) {
    throw new Error('eBay nicht verbunden.')
  }
  if (auth.access_token && !ebayTokenNeedsRefresh()) {
    return auth.access_token
  }
  if (!auth.refresh_token) {
    throw new Error('eBay-Sitzung abgelaufen — bitte erneut verbinden.')
  }
  const res = await apiFetch('/api/ebay/oauth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: auth.refresh_token }),
  })
  const data = await parseJson(res)
  saveEbayAuth({
    access_token: data.access_token,
    refresh_token: data.refresh_token || auth.refresh_token,
    expires_in: data.expires_in,
    sandbox: auth.sandbox,
  })
  return data.access_token
}

/**
 * Open eBay consent popup and wait for postMessage with tokens.
 */
export function connectEbayAccount() {
  return new Promise(async (resolve, reject) => {
    try {
      const state = createOauthState()
      const startRes = await apiFetch(`/api/ebay/oauth/start?state=${encodeURIComponent(state)}`)
      const { url, sandbox } = await parseJson(startRes)

      const popup = window.open(url, 'scanlogic_ebay_oauth', 'width=520,height=720')
      if (!popup) {
        reject(new Error('Popup blockiert — bitte Popups für diese Seite erlauben.'))
        return
      }

      const timeout = setTimeout(() => {
        cleanup()
        reject(new Error('eBay-Anmeldung zeitüberschritten.'))
      }, 5 * 60_000)

      function cleanup() {
        clearTimeout(timeout)
        window.removeEventListener('message', onMessage)
      }

      function onMessage(event) {
        const data = event.data
        if (!data || data.type !== 'scanlogic-ebay-oauth') return
        // Accept same-origin messages; callback page may be same host
        if (event.origin !== window.location.origin && event.source !== popup) {
          // still accept if from our popup (sandbox redirects back to our API host)
          if (event.source !== popup) return
        }
        cleanup()
        try {
          popup.close()
        } catch {
          /* ignore */
        }
        if (!data.ok) {
          reject(new Error(data.error || 'eBay OAuth fehlgeschlagen'))
          return
        }
        if (!consumeOauthState(data.state)) {
          reject(new Error('Ungültiger OAuth-State (CSRF-Schutz).'))
          return
        }
        const auth = saveEbayAuth({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_in: data.expires_in,
          sandbox: !!sandbox,
        })
        resolve(auth)
      }

      window.addEventListener('message', onMessage)
    } catch (err) {
      reject(err)
    }
  })
}

export function disconnectEbayAccount() {
  clearEbayAuth()
}

export async function fetchEbayPolicies() {
  const token = await ensureAccessToken()
  const res = await apiFetch('/api/ebay/policies?marketplace_id=EBAY_DE', {
    headers: { 'X-Ebay-User-Token': token },
  })
  return parseJson(res)
}

export async function publishListingToEbay(payload) {
  const auth = loadEbayAuth()
  // Dry-run can skip token if not connected — server also short-circuits
  if (payload?.dry_run === true && !auth?.access_token && !auth?.refresh_token) {
    return {
      ok: true,
      dry_run: true,
      sku: payload.sku,
      offerId: payload.offerId || `dry-offer-${payload.sku}`,
      listingId: `dry-${Date.now()}`,
      marketplaceId: payload.marketplaceId || 'EBAY_DE',
    }
  }
  const token = await ensureAccessToken()
  const res = await apiFetch('/api/ebay/publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Ebay-User-Token': token,
    },
    body: JSON.stringify({
      ...payload,
      refresh_token: auth?.refresh_token,
    }),
  })
  return parseJson(res)
}

/** Update price/qty on an existing offer (stock sync). */
export async function reviseEbayOffer(payload) {
  const auth = loadEbayAuth()
  if (payload?.dry_run === true && !auth?.access_token && !auth?.refresh_token) {
    return { ok: true, dry_run: true, ...payload }
  }
  const token = await ensureAccessToken()
  const res = await apiFetch('/api/ebay/revise', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Ebay-User-Token': token,
    },
    body: JSON.stringify({
      ...payload,
      refresh_token: auth?.refresh_token,
    }),
  })
  return parseJson(res)
}

async function authHeaders(extra = {}) {
  const auth = loadEbayAuth()
  const token = await ensureAccessToken()
  return {
    'Content-Type': 'application/json',
    'X-Ebay-User-Token': token,
    ...extra,
  }
}

export async function fetchEbayOrders({ days = 14, limit = 50 } = {}) {
  const headers = await authHeaders()
  const res = await apiFetch(`/api/ebay/orders?days=${days}&limit=${limit}`, { headers })
  return parseJson(res)
}

export async function shipEbayOrder(payload) {
  const auth = loadEbayAuth()
  if (payload?.dry_run === true && !auth?.access_token && !auth?.refresh_token) {
    return {
      ok: true,
      dry_run: true,
      orderId: payload.orderId,
      fulfillmentId: `dry-ful-${Date.now()}`,
      trackingNumber: payload.trackingNumber,
      shippingCarrierCode: payload.shippingCarrierCode,
    }
  }
  const headers = await authHeaders()
  const res = await apiFetch(`/api/ebay/orders/${encodeURIComponent(payload.orderId)}/ship`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ...payload,
      refresh_token: auth?.refresh_token,
    }),
  })
  return parseJson(res)
}

export async function fetchEbayInquiries({ limit = 25, inquiry_status = 'OPEN' } = {}) {
  const headers = await authHeaders()
  const q = new URLSearchParams({
    limit: String(limit),
    inquiry_status,
    marketplace_id: 'EBAY_DE',
  })
  const res = await apiFetch(`/api/ebay/inquiries?${q}`, { headers })
  return parseJson(res)
}

export async function replyEbayInquiry(payload) {
  const auth = loadEbayAuth()
  if (payload?.dry_run === true && !auth?.access_token && !auth?.refresh_token) {
    return { ok: true, dry_run: true, inquiryId: payload.inquiryId }
  }
  const headers = await authHeaders()
  const res = await apiFetch(
    `/api/ebay/inquiries/${encodeURIComponent(payload.inquiryId)}/reply`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message: payload.message,
        human_approved: payload.human_approved === true,
        dry_run: !!payload.dry_run,
        marketplace_id: 'EBAY_DE',
        refresh_token: auth?.refresh_token,
      }),
    }
  )
  return parseJson(res)
}

export async function fetchEbayPrivileges() {
  const headers = await authHeaders()
  const res = await apiFetch('/api/ebay/privileges', { headers })
  return parseJson(res)
}

export async function fetchEbayStandards({ program = 'PROGRAM_DE' } = {}) {
  const headers = await authHeaders()
  const res = await apiFetch(`/api/ebay/standards?program=${encodeURIComponent(program)}`, {
    headers,
  })
  return parseJson(res)
}

export async function suggestEbayCategory(query, marketplaceId = 'EBAY_DE') {
  const headers = await authHeaders()
  const q = new URLSearchParams({
    q: String(query || '').slice(0, 200),
    marketplace_id: marketplaceId,
  })
  const res = await apiFetch(`/api/ebay/taxonomy/suggest?${q}`, { headers })
  return parseJson(res)
}

export async function fetchEbayReturns({ limit = 25, return_state = '' } = {}) {
  const headers = await authHeaders()
  const q = new URLSearchParams({ limit: String(limit), marketplace_id: 'EBAY_DE' })
  if (return_state) q.set('return_state', return_state)
  const res = await apiFetch(`/api/ebay/returns?${q}`, { headers })
  return parseJson(res)
}

export async function fetchEbayCancellations({ limit = 25 } = {}) {
  const headers = await authHeaders()
  const q = new URLSearchParams({ limit: String(limit), marketplace_id: 'EBAY_DE' })
  const res = await apiFetch(`/api/ebay/cancellations?${q}`, { headers })
  return parseJson(res)
}

export async function fetchEbayOffers({ limit = 50, marketplace_id = 'EBAY_DE' } = {}) {
  const headers = await authHeaders()
  const q = new URLSearchParams({ limit: String(limit), marketplace_id })
  const res = await apiFetch(`/api/ebay/offers?${q}`, { headers })
  return parseJson(res)
}

export async function endEbayOffer({ offerId, dry_run = true } = {}) {
  const auth = loadEbayAuth()
  if (dry_run && !auth?.access_token && !auth?.refresh_token) {
    return { ok: true, dry_run: true, offerId, ended: true }
  }
  const headers = await authHeaders()
  const res = await apiFetch(`/api/ebay/offers/${encodeURIComponent(offerId)}/end`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ dry_run: !!dry_run, refresh_token: auth?.refresh_token }),
  })
  return parseJson(res)
}

export async function fetchEbayCoverage() {
  const res = await apiFetch('/api/ebay/coverage')
  return parseJson(res)
}
