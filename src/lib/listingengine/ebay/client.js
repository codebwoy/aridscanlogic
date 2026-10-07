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
