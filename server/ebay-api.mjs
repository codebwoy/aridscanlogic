/**
 * eBay OAuth + Sell Inventory publish proxy.
 * Client/secret stay server-side; user tokens are returned to the browser popup via postMessage.
 */

import { clientSafeError } from './security.mjs'

const MAX_BODY_BYTES = 2 * 1024 * 1024
const UPSTREAM_TIMEOUT_MS = 45_000

const DEFAULT_SCOPES = [
  'https://api.ebay.com/oauth/api_scope/sell.inventory',
  'https://api.ebay.com/oauth/api_scope/sell.account',
  'https://api.ebay.com/oauth/api_scope/sell.fulfillment',
].join(' ')

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        reject(new Error('Request body too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

async function readRequestBody(req) {
  if (req.body != null) {
    if (typeof req.body === 'string') return req.body
    if (Buffer.isBuffer(req.body)) return req.body.toString('utf8')
    if (typeof req.body === 'object') return JSON.stringify(req.body)
  }
  return readBody(req)
}

function json(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(payload))
}

function resolveEbayConfig(getConfig) {
  const cfg = typeof getConfig === 'function' ? getConfig() : getConfig || {}
  const clientId = String(cfg.clientId || process.env.EBAY_CLIENT_ID || '').trim()
  const clientSecret = String(cfg.clientSecret || process.env.EBAY_CLIENT_SECRET || '').trim()
  const ruName = String(cfg.ruName || process.env.EBAY_RU_NAME || '').trim()
  const env = String(cfg.env || process.env.EBAY_ENV || 'production').trim().toLowerCase()
  const sandbox = env === 'sandbox'
  const scopes = String(cfg.scopes || process.env.EBAY_SCOPES || DEFAULT_SCOPES).trim()
  return {
    clientId,
    clientSecret,
    ruName,
    sandbox,
    scopes,
    configured: clientId.length > 5 && clientSecret.length > 5 && ruName.length > 3,
    authBase: sandbox ? 'https://auth.sandbox.ebay.com' : 'https://auth.ebay.com',
    apiBase: sandbox ? 'https://api.sandbox.ebay.com' : 'https://api.ebay.com',
  }
}

function basicAuthHeader(clientId, clientSecret) {
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`, 'utf8').toString('base64')}`
}

async function ebayFetch(url, options = {}) {
  const controller = new AbortController()
  const timeoutId = setTimeout(
    () => controller.abort(new Error('upstream_timeout')),
    UPSTREAM_TIMEOUT_MS
  )
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    const text = await res.text()
    let data = null
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      data = { raw: text?.slice(0, 500) }
    }
    return { ok: res.ok, status: res.status, data }
  } finally {
    clearTimeout(timeoutId)
  }
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function oauthSuccessHtml({ accessToken, refreshToken, expiresIn, tokenType, state, appOrigin }) {
  const payload = {
    type: 'scanlogic-ebay-oauth',
    ok: true,
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresIn,
    token_type: tokenType || 'User Access Token',
    state: state || '',
  }
  const jsonPayload = JSON.stringify(payload).replace(/</g, '\\u003c')
  const origin = escapeHtml(appOrigin || '*')
  return `<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"/><title>eBay verbunden</title></head>
<body style="font-family:system-ui;background:#0f172a;color:#e2e8f0;padding:2rem;text-align:center">
<p>eBay-Konto verbunden. Dieses Fenster schließt sich automatisch…</p>
<script>
(function(){
  var payload = ${jsonPayload};
  var targetOrigin = ${JSON.stringify(appOrigin || '*')};
  try {
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(payload, targetOrigin === '*' ? '*' : targetOrigin);
    }
  } catch (e) {}
  setTimeout(function(){ window.close(); }, 600);
})();
</script>
<p style="font-size:12px;color:#94a3b8">Origin: ${origin}</p>
</body></html>`
}

function oauthErrorHtml(message) {
  return `<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"/><title>eBay Fehler</title></head>
<body style="font-family:system-ui;background:#0f172a;color:#fecaca;padding:2rem;text-align:center">
<p>${escapeHtml(message)}</p>
<script>
try {
  if (window.opener && !window.opener.closed) {
    window.opener.postMessage({ type: 'scanlogic-ebay-oauth', ok: false, error: ${JSON.stringify(String(message || 'OAuth failed'))} }, '*');
  }
} catch (e) {}
</script>
</body></html>`
}

function pathnameOf(req) {
  try {
    return new URL(req.url || '/', 'http://localhost').pathname
  } catch {
    return (req.url || '').split('?')[0]
  }
}

function queryOf(req) {
  try {
    return new URL(req.url || '/', 'http://localhost').searchParams
  } catch {
    return new URLSearchParams()
  }
}

function getUserToken(req, body) {
  const header = String(req.headers['x-ebay-user-token'] || '').trim()
  if (header) return header
  const auth = String(req.headers.authorization || '')
  if (auth.toLowerCase().startsWith('ebay ')) return auth.slice(5).trim()
  if (body?.access_token) return String(body.access_token).trim()
  return ''
}

async function exchangeCode(cfg, code) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: cfg.ruName,
  })
  return ebayFetch(`${cfg.apiBase}/identity/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: basicAuthHeader(cfg.clientId, cfg.clientSecret),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })
}

async function refreshAccessToken(cfg, refreshToken) {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    scope: cfg.scopes,
  })
  return ebayFetch(`${cfg.apiBase}/identity/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: basicAuthHeader(cfg.clientId, cfg.clientSecret),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })
}

async function ebayApi(cfg, userToken, method, path, jsonBody, extraHeaders = {}) {
  const headers = {
    Authorization: `Bearer ${userToken}`,
    'Content-Type': 'application/json',
    'Content-Language': 'de-DE',
    Accept: 'application/json',
    ...extraHeaders,
  }
  return ebayFetch(`${cfg.apiBase}${path}`, {
    method,
    headers,
    body: jsonBody != null ? JSON.stringify(jsonBody) : undefined,
  })
}

async function resolveUserToken(cfg, req, body) {
  let userToken = getUserToken(req, body)
  if (!userToken && body?.refresh_token) {
    const refreshed = await refreshAccessToken(cfg, String(body.refresh_token).trim())
    if (refreshed.ok && refreshed.data?.access_token) {
      userToken = refreshed.data.access_token
    }
  }
  return userToken || ''
}

function mapFulfillmentOrder(raw) {
  if (!raw || typeof raw !== 'object') return null
  const shipTo = raw.fulfillmentStartInstructions?.[0]?.shippingStep?.shipTo || {}
  const addr = shipTo.contactAddress || {}
  const lineItems = Array.isArray(raw.lineItems)
    ? raw.lineItems.map((li) => ({
        lineItemId: String(li.lineItemId || ''),
        sku: String(li.sku || ''),
        title: String(li.title || '').slice(0, 200),
        quantity: Number(li.quantity) || 1,
        lineItemCost: li.lineItemCost || null,
        total: li.total || null,
      }))
    : []
  return {
    orderId: String(raw.orderId || ''),
    creationDate: raw.creationDate || null,
    lastModifiedDate: raw.lastModifiedDate || null,
    orderFulfillmentStatus: String(raw.orderFulfillmentStatus || ''),
    orderPaymentStatus: String(raw.orderPaymentStatus || ''),
    cancelStatus: raw.cancelStatus?.cancelState || null,
    buyerUsername: raw.buyer?.username || '',
    total: raw.pricingSummary?.total || raw.totalFeeBasisAmount || null,
    currency: raw.pricingSummary?.total?.currency || 'EUR',
    lineItems,
    shipTo: {
      fullName: shipTo.fullName || '',
      addressLine1: addr.addressLine1 || '',
      addressLine2: addr.addressLine2 || '',
      city: addr.city || '',
      stateOrProvince: addr.stateOrProvince || '',
      postalCode: addr.postalCode || '',
      countryCode: addr.countryCode || '',
      phone: shipTo.primaryPhone?.phoneNumber || '',
      email: shipTo.email || '',
    },
    maxEstimatedDeliveryDate:
      raw.fulfillmentStartInstructions?.[0]?.maxEstimatedDeliveryDate || null,
    minEstimatedDeliveryDate:
      raw.fulfillmentStartInstructions?.[0]?.minEstimatedDeliveryDate || null,
    shippingFulfillments: Array.isArray(raw.shippingFulfillments)
      ? raw.shippingFulfillments.map((f) => ({
          fulfillmentId: f.fulfillmentId,
          shipmentTrackingNumber: f.shipmentTrackingNumber,
          shippingCarrierCode: f.shippingCarrierCode,
          shippedDate: f.shippedDate,
        }))
      : [],
  }
}

function sanitizeSku(raw) {
  const s = String(raw || '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50)
  return s || `sl-${Date.now()}`
}

function sanitizePublishBody(raw) {
  if (!raw || typeof raw !== 'object') throw new Error('Invalid publish body')
  const sku = sanitizeSku(raw.sku)
  const title = String(raw.title || '').trim().slice(0, 80)
  const description = String(raw.description || '').trim().slice(0, 500_000)
  const categoryId = String(raw.categoryId || '').replace(/\D/g, '').slice(0, 20)
  const merchantLocationKey = String(raw.merchantLocationKey || '')
    .trim()
    .slice(0, 36)
  const fulfillmentPolicyId = String(raw.fulfillmentPolicyId || '').trim().slice(0, 64)
  const paymentPolicyId = String(raw.paymentPolicyId || '').trim().slice(0, 64)
  const returnPolicyId = String(raw.returnPolicyId || '').trim().slice(0, 64)
  const currency = String(raw.currency || 'EUR').trim().slice(0, 3).toUpperCase() || 'EUR'
  const price = String(raw.price || '').trim()
  const quantity = Math.min(99999, Math.max(1, Number.parseInt(String(raw.quantity || '1'), 10) || 1))
  const condition = String(raw.condition || 'NEW').trim().slice(0, 40) || 'NEW'
  const marketplaceId = String(raw.marketplaceId || 'EBAY_DE').trim().slice(0, 20) || 'EBAY_DE'
  const aspects =
    raw.aspects && typeof raw.aspects === 'object' && !Array.isArray(raw.aspects)
      ? Object.fromEntries(
          Object.entries(raw.aspects)
            .slice(0, 40)
            .map(([k, v]) => [
              String(k).slice(0, 64),
              (Array.isArray(v) ? v : [v])
                .map((x) => String(x).slice(0, 120))
                .filter(Boolean)
                .slice(0, 10),
            ])
            .filter(([, vals]) => vals.length)
        )
      : {}
  const imageUrls = Array.isArray(raw.imageUrls)
    ? raw.imageUrls
        .map((u) => String(u).trim())
        .filter((u) => /^https:\/\//i.test(u))
        .slice(0, 12)
    : []
  const ean = String(raw.ean || '')
    .replace(/\D/g, '')
    .slice(0, 14)

  if (!title) throw new Error('title required')
  if (!description) throw new Error('description required')
  if (!categoryId) throw new Error('categoryId required')
  if (!merchantLocationKey) throw new Error('merchantLocationKey required')
  if (!fulfillmentPolicyId || !paymentPolicyId || !returnPolicyId) {
    throw new Error('business policy IDs required')
  }
  if (!price || Number.isNaN(Number(price)) || Number(price) <= 0) {
    throw new Error('valid price required')
  }

  return {
    sku,
    title,
    description,
    categoryId,
    merchantLocationKey,
    fulfillmentPolicyId,
    paymentPolicyId,
    returnPolicyId,
    currency,
    price: Number(price).toFixed(2),
    quantity,
    condition,
    marketplaceId,
    aspects,
    imageUrls,
    ean,
  }
}

export async function handleEbayRequest(req, res, { getConfig } = {}) {
  const pathname = pathnameOf(req)
  if (!pathname.startsWith('/api/ebay')) return false

  const cfg = resolveEbayConfig(getConfig)
  const method = (req.method || 'GET').toUpperCase()
  const qs = queryOf(req)

  try {
    // GET /api/ebay/status
    if (pathname === '/api/ebay/status' && method === 'GET') {
      json(res, 200, {
        configured: cfg.configured,
        sandbox: cfg.sandbox,
        marketplace: 'EBAY_DE',
      })
      return true
    }

    if (!cfg.configured) {
      if (pathname === '/api/ebay/oauth/callback') {
        res.statusCode = 503
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(oauthErrorHtml('eBay API ist auf dem Server nicht konfiguriert (EBAY_CLIENT_ID / SECRET / RU_NAME).'))
        return true
      }
      json(res, 503, {
        error:
          'eBay not configured. Set EBAY_CLIENT_ID, EBAY_CLIENT_SECRET, EBAY_RU_NAME in server .env',
      })
      return true
    }

    // GET /api/ebay/oauth/start?state=
    if (pathname === '/api/ebay/oauth/start' && method === 'GET') {
      const state = String(qs.get('state') || '').slice(0, 128)
      if (!state || state.length < 8) {
        json(res, 400, { error: 'state required' })
        return true
      }
      const url = new URL(`${cfg.authBase}/oauth2/authorize`)
      url.searchParams.set('client_id', cfg.clientId)
      url.searchParams.set('response_type', 'code')
      url.searchParams.set('redirect_uri', cfg.ruName)
      url.searchParams.set('scope', cfg.scopes)
      url.searchParams.set('state', state)
      json(res, 200, { url: url.toString(), sandbox: cfg.sandbox })
      return true
    }

    // GET /api/ebay/oauth/callback
    if (pathname === '/api/ebay/oauth/callback' && method === 'GET') {
      const err = qs.get('error')
      const code = qs.get('code')
      const state = qs.get('state') || ''
      const appOrigin = String(process.env.EBAY_APP_ORIGIN || qs.get('app_origin') || '').trim()

      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.setHeader('Cache-Control', 'no-store')

      if (err) {
        res.statusCode = 400
        res.end(oauthErrorHtml(qs.get('error_description') || err))
        return true
      }
      if (!code) {
        res.statusCode = 400
        res.end(oauthErrorHtml('Kein Authorization-Code von eBay erhalten.'))
        return true
      }

      const tokenRes = await exchangeCode(cfg, code)
      if (!tokenRes.ok || !tokenRes.data?.access_token) {
        res.statusCode = 502
        res.end(
          oauthErrorHtml(
            tokenRes.data?.error_description ||
              tokenRes.data?.error ||
              'Token-Austausch mit eBay fehlgeschlagen.'
          )
        )
        return true
      }

      res.statusCode = 200
      res.end(
        oauthSuccessHtml({
          accessToken: tokenRes.data.access_token,
          refreshToken: tokenRes.data.refresh_token || '',
          expiresIn: tokenRes.data.expires_in || 7200,
          tokenType: tokenRes.data.token_type,
          state,
          appOrigin: appOrigin || undefined,
        })
      )
      return true
    }

    // POST /api/ebay/oauth/refresh
    if (pathname === '/api/ebay/oauth/refresh' && method === 'POST') {
      const raw = await readRequestBody(req)
      const body = JSON.parse(raw || '{}')
      const refreshToken = String(body.refresh_token || '').trim()
      if (!refreshToken) {
        json(res, 400, { error: 'refresh_token required' })
        return true
      }
      const tokenRes = await refreshAccessToken(cfg, refreshToken)
      if (!tokenRes.ok || !tokenRes.data?.access_token) {
        json(res, 502, {
          error: tokenRes.data?.error_description || tokenRes.data?.error || 'Refresh failed',
        })
        return true
      }
      json(res, 200, {
        access_token: tokenRes.data.access_token,
        refresh_token: tokenRes.data.refresh_token || refreshToken,
        expires_in: tokenRes.data.expires_in || 7200,
        token_type: tokenRes.data.token_type,
      })
      return true
    }

    // GET /api/ebay/policies — needs user token
    if (pathname === '/api/ebay/policies' && method === 'GET') {
      const userToken = getUserToken(req, null)
      if (!userToken) {
        json(res, 401, { error: 'eBay user token required (X-Ebay-User-Token)' })
        return true
      }
      const marketplace = String(qs.get('marketplace_id') || 'EBAY_DE')
      const [fulfillment, payment, returns, locations] = await Promise.all([
        ebayApi(
          cfg,
          userToken,
          'GET',
          `/sell/account/v1/fulfillment_policy?marketplace_id=${encodeURIComponent(marketplace)}`
        ),
        ebayApi(
          cfg,
          userToken,
          'GET',
          `/sell/account/v1/payment_policy?marketplace_id=${encodeURIComponent(marketplace)}`
        ),
        ebayApi(
          cfg,
          userToken,
          'GET',
          `/sell/account/v1/return_policy?marketplace_id=${encodeURIComponent(marketplace)}`
        ),
        ebayApi(cfg, userToken, 'GET', '/sell/inventory/v1/location?limit=50'),
      ])

      const mapPolicies = (r, key) => {
        const list = r.data?.[key] || r.data?.policies || []
        return Array.isArray(list)
          ? list.map((p) => ({
              id: p.fulfillmentPolicyId || p.paymentPolicyId || p.returnPolicyId || p.policyId,
              name: p.name || p.policyName || p.id,
              marketplaceId: p.marketplaceId,
            }))
          : []
      }

      json(res, 200, {
        fulfillment: mapPolicies(fulfillment, 'fulfillmentPolicies'),
        payment: mapPolicies(payment, 'paymentPolicies'),
        return: mapPolicies(returns, 'returnPolicies'),
        locations: (locations.data?.locations || []).map((loc) => ({
          key: loc.merchantLocationKey,
          name: loc.name || loc.merchantLocationKey,
          status: loc.merchantLocationStatus,
        })),
        errors: [fulfillment, payment, returns, locations]
          .filter((r) => !r.ok)
          .map((r) => r.data?.errors?.[0]?.message || r.data?.error || `HTTP ${r.status}`),
      })
      return true
    }

    // POST /api/ebay/publish
    if (pathname === '/api/ebay/publish' && method === 'POST') {
      const raw = await readRequestBody(req)
      const body = JSON.parse(raw || '{}')
      let userToken = getUserToken(req, body)

      if (!userToken && body.refresh_token) {
        const refreshed = await refreshAccessToken(cfg, String(body.refresh_token).trim())
        if (refreshed.ok && refreshed.data?.access_token) {
          userToken = refreshed.data.access_token
        }
      }
      if (!userToken) {
        json(res, 401, { error: 'eBay user token required' })
        return true
      }

      if (body.human_approved !== true) {
        json(res, 403, { error: 'human_approved required before publish' })
        return true
      }
      if (body.compliance_blocked === true) {
        json(res, 403, { error: 'compliance blocked — cannot publish' })
        return true
      }

      const pub = sanitizePublishBody(body)

      // Dry-run: validate payload only — no upstream Inventory calls
      if (body.dry_run === true) {
        json(res, 200, {
          ok: true,
          dry_run: true,
          sku: pub.sku,
          offerId: body.offerId ? String(body.offerId).trim() : `dry-offer-${pub.sku}`,
          listingId: `dry-${Date.now()}`,
          marketplaceId: pub.marketplaceId,
          sandbox: cfg.sandbox,
        })
        return true
      }

      const inventoryItem = {
        availability: {
          shipToLocationAvailability: { quantity: pub.quantity },
        },
        condition: pub.condition,
        product: {
          title: pub.title,
          description: pub.description,
          aspects: pub.aspects,
          ...(pub.imageUrls.length ? { imageUrls: pub.imageUrls } : {}),
          ...(pub.ean ? { ean: [pub.ean] } : {}),
        },
      }

      const putItem = await ebayApi(
        cfg,
        userToken,
        'PUT',
        `/sell/inventory/v1/inventory_item/${encodeURIComponent(pub.sku)}`,
        inventoryItem
      )
      if (!putItem.ok && putItem.status !== 204) {
        json(res, 502, {
          error: 'inventory_item failed',
          details: putItem.data?.errors || putItem.data,
        })
        return true
      }

      const offerBody = {
        sku: pub.sku,
        marketplaceId: pub.marketplaceId,
        format: 'FIXED_PRICE',
        availableQuantity: pub.quantity,
        categoryId: pub.categoryId,
        listingDescription: pub.description,
        listingPolicies: {
          fulfillmentPolicyId: pub.fulfillmentPolicyId,
          paymentPolicyId: pub.paymentPolicyId,
          returnPolicyId: pub.returnPolicyId,
        },
        pricingSummary: {
          price: { currency: pub.currency, value: pub.price },
        },
        merchantLocationKey: pub.merchantLocationKey,
      }

      let offerId = body.offerId ? String(body.offerId).trim() : ''
      if (!offerId) {
        const createOffer = await ebayApi(cfg, userToken, 'POST', '/sell/inventory/v1/offer', offerBody)
        if (!createOffer.ok) {
          // If offer exists for SKU, try to find it
          const listed = await ebayApi(
            cfg,
            userToken,
            'GET',
            `/sell/inventory/v1/offer?sku=${encodeURIComponent(pub.sku)}&marketplace_id=${encodeURIComponent(pub.marketplaceId)}`
          )
          offerId = listed.data?.offers?.[0]?.offerId || ''
          if (!offerId) {
            json(res, 502, {
              error: 'create offer failed',
              details: createOffer.data?.errors || createOffer.data,
            })
            return true
          }
          // Update existing offer
          const upd = await ebayApi(
            cfg,
            userToken,
            'PUT',
            `/sell/inventory/v1/offer/${encodeURIComponent(offerId)}`,
            offerBody
          )
          if (!upd.ok && upd.status !== 204) {
            json(res, 502, {
              error: 'update offer failed',
              details: upd.data?.errors || upd.data,
            })
            return true
          }
        } else {
          offerId = createOffer.data?.offerId
        }
      } else {
        const upd = await ebayApi(
          cfg,
          userToken,
          'PUT',
          `/sell/inventory/v1/offer/${encodeURIComponent(offerId)}`,
          offerBody
        )
        if (!upd.ok && upd.status !== 204) {
          json(res, 502, {
            error: 'update offer failed',
            details: upd.data?.errors || upd.data,
          })
          return true
        }
      }

      if (!offerId) {
        json(res, 502, { error: 'no offerId returned' })
        return true
      }

      const published = await ebayApi(
        cfg,
        userToken,
        'POST',
        `/sell/inventory/v1/offer/${encodeURIComponent(offerId)}/publish`
      )
      if (!published.ok) {
        json(res, 502, {
          error: 'publish offer failed',
          offerId,
          details: published.data?.errors || published.data,
        })
        return true
      }

      json(res, 200, {
        ok: true,
        sku: pub.sku,
        offerId,
        listingId: published.data?.listingId || null,
        marketplaceId: pub.marketplaceId,
        sandbox: cfg.sandbox,
      })
      return true
    }

    // POST /api/ebay/revise — update quantity and/or price on an existing offer
    if (pathname === '/api/ebay/revise' && method === 'POST') {
      const raw = await readRequestBody(req)
      const body = JSON.parse(raw || '{}')
      let userToken = getUserToken(req, body)
      if (!userToken && body.refresh_token) {
        const refreshed = await refreshAccessToken(cfg, String(body.refresh_token).trim())
        if (refreshed.ok && refreshed.data?.access_token) {
          userToken = refreshed.data.access_token
        }
      }
      if (!userToken) {
        json(res, 401, { error: 'eBay user token required' })
        return true
      }

      const sku = sanitizeSku(body.sku)
      const offerId = String(body.offerId || '').trim()
      if (!offerId) {
        json(res, 400, { error: 'offerId required' })
        return true
      }

      const quantity = Math.min(
        99999,
        Math.max(0, Number.parseInt(String(body.quantity ?? '0'), 10) || 0)
      )
      const price =
        body.price != null && body.price !== ''
          ? Number(body.price).toFixed(2)
          : null
      const currency = String(body.currency || 'EUR').trim().slice(0, 3).toUpperCase() || 'EUR'

      if (body.dry_run === true) {
        json(res, 200, {
          ok: true,
          dry_run: true,
          sku,
          offerId,
          quantity,
          price,
        })
        return true
      }

      const offerUpdate = {
        offerId,
        availableQuantity: quantity,
      }
      if (price != null && Number(price) > 0) {
        offerUpdate.price = { currency, value: price }
      }

      const bulk = await ebayApi(
        cfg,
        userToken,
        'POST',
        '/sell/inventory/v1/bulk_update_price_quantity',
        {
          requests: [
            {
              sku,
              shipToLocationAvailability: { quantity },
              offers: [offerUpdate],
            },
          ],
        }
      )
      if (!bulk.ok) {
        json(res, 502, {
          error: 'bulk_update_price_quantity failed',
          details: bulk.data?.errors || bulk.data?.responses || bulk.data,
        })
        return true
      }

      let withdrawn = false
      if (quantity === 0 && body.end_when_zero !== false) {
        const wd = await ebayApi(
          cfg,
          userToken,
          'POST',
          `/sell/inventory/v1/offer/${encodeURIComponent(offerId)}/withdraw`
        )
        withdrawn = !!wd.ok
      }

      json(res, 200, {
        ok: true,
        sku,
        offerId,
        quantity,
        price,
        withdrawn,
        sandbox: cfg.sandbox,
        details: bulk.data?.responses || null,
      })
      return true
    }

    // GET /api/ebay/orders — Fulfillment API getOrders
    if (pathname === '/api/ebay/orders' && method === 'GET') {
      const userToken = await resolveUserToken(cfg, req, null)
      if (!userToken) {
        json(res, 401, { error: 'eBay user token required' })
        return true
      }
      const limit = Math.min(50, Math.max(1, Number.parseInt(qs.get('limit') || '25', 10) || 25))
      const days = Math.min(90, Math.max(1, Number.parseInt(qs.get('days') || '14', 10) || 14))
      const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
      const filter = `creationdate:[${start}..]`
      const path = `/sell/fulfillment/v1/order?limit=${limit}&filter=${encodeURIComponent(filter)}`
      const result = await ebayApi(cfg, userToken, 'GET', path)
      if (!result.ok) {
        json(res, 502, {
          error: 'getOrders failed',
          details: result.data?.errors || result.data,
        })
        return true
      }
      const orders = Array.isArray(result.data?.orders)
        ? result.data.orders.map(mapFulfillmentOrder).filter(Boolean)
        : []
      json(res, 200, {
        ok: true,
        orders,
        total: result.data?.total || orders.length,
        sandbox: cfg.sandbox,
      })
      return true
    }

    // GET /api/ebay/orders/:orderId
    if (pathname.startsWith('/api/ebay/orders/') && method === 'GET') {
      const orderId = decodeURIComponent(pathname.slice('/api/ebay/orders/'.length)).split('/')[0]
      if (!orderId || orderId.includes('/')) {
        json(res, 400, { error: 'orderId required' })
        return true
      }
      const userToken = await resolveUserToken(cfg, req, null)
      if (!userToken) {
        json(res, 401, { error: 'eBay user token required' })
        return true
      }
      const result = await ebayApi(
        cfg,
        userToken,
        'GET',
        `/sell/fulfillment/v1/order/${encodeURIComponent(orderId)}`
      )
      if (!result.ok) {
        json(res, 502, {
          error: 'getOrder failed',
          details: result.data?.errors || result.data,
        })
        return true
      }
      json(res, 200, {
        ok: true,
        order: mapFulfillmentOrder(result.data),
        sandbox: cfg.sandbox,
      })
      return true
    }

    // POST /api/ebay/orders/:orderId/ship — createShippingFulfillment
    if (
      pathname.match(/^\/api\/ebay\/orders\/[^/]+\/ship$/) &&
      method === 'POST'
    ) {
      const orderId = decodeURIComponent(
        pathname.replace(/^\/api\/ebay\/orders\//, '').replace(/\/ship$/, '')
      )
      const raw = await readRequestBody(req)
      const body = JSON.parse(raw || '{}')
      const userToken = await resolveUserToken(cfg, req, body)
      if (!userToken) {
        json(res, 401, { error: 'eBay user token required' })
        return true
      }

      const trackingNumber = String(body.trackingNumber || '')
        .trim()
        .slice(0, 50)
      const shippingCarrierCode = String(body.shippingCarrierCode || body.carrierCode || '')
        .trim()
        .slice(0, 50)
      const lineItems = Array.isArray(body.lineItems)
        ? body.lineItems
            .map((li) => ({
              lineItemId: String(li.lineItemId || '').trim(),
              quantity: Math.max(1, Number.parseInt(String(li.quantity || '1'), 10) || 1),
            }))
            .filter((li) => li.lineItemId)
            .slice(0, 20)
        : []

      if (!trackingNumber || !shippingCarrierCode) {
        json(res, 400, { error: 'trackingNumber and shippingCarrierCode required' })
        return true
      }
      if (!lineItems.length) {
        json(res, 400, { error: 'lineItems required' })
        return true
      }

      if (body.dry_run === true) {
        json(res, 200, {
          ok: true,
          dry_run: true,
          orderId,
          trackingNumber,
          shippingCarrierCode,
          fulfillmentId: `dry-ful-${Date.now()}`,
        })
        return true
      }

      const shipBody = {
        lineItems,
        shippedDate: body.shippedDate || new Date().toISOString(),
        shippingCarrierCode,
        trackingNumber,
      }

      const result = await ebayApi(
        cfg,
        userToken,
        'POST',
        `/sell/fulfillment/v1/order/${encodeURIComponent(orderId)}/shipping_fulfillment`,
        shipBody
      )
      if (!result.ok && result.status !== 201) {
        json(res, 502, {
          error: 'createShippingFulfillment failed',
          details: result.data?.errors || result.data,
        })
        return true
      }

      json(res, 200, {
        ok: true,
        orderId,
        fulfillmentId: result.data?.fulfillmentId || null,
        trackingNumber,
        shippingCarrierCode,
        sandbox: cfg.sandbox,
      })
      return true
    }

    // GET /api/ebay/inquiries — Post-Order inquiry search (buyer CS)
    if (pathname === '/api/ebay/inquiries' && method === 'GET') {
      const userToken = await resolveUserToken(cfg, req, null)
      if (!userToken) {
        json(res, 401, { error: 'eBay user token required' })
        return true
      }
      const marketplace = String(qs.get('marketplace_id') || 'EBAY_DE')
      const limit = Math.min(50, Math.max(1, Number.parseInt(qs.get('limit') || '25', 10) || 25))
      const status = String(qs.get('inquiry_status') || 'OPEN').trim()
      const q = new URLSearchParams()
      q.set('limit', String(limit))
      if (status) q.set('inquiry_status', status)
      const result = await ebayApi(
        cfg,
        userToken,
        'GET',
        `/post-order/v2/inquiry/search?${q.toString()}`,
        null,
        { 'X-EBAY-C-MARKETPLACE-ID': marketplace }
      )
      if (!result.ok) {
        json(res, 502, {
          error: 'inquiry search failed',
          details: result.data?.errors || result.data,
          hint: 'Post-Order may need re-consent; you can still add CS cases manually.',
        })
        return true
      }
      const members = result.data?.members || result.data?.inquiries || []
      const inquiries = (Array.isArray(members) ? members : []).map((inq) => ({
        inquiryId: String(inq.inquiryId || inq.inquiryid || ''),
        itemId: String(inq.itemId || inq.item_id || ''),
        transactionId: String(inq.transactionId || ''),
        buyer: inq.buyer || inq.buyer_login_name || '',
        seller: inq.seller || '',
        inquiryStatus: inq.inquiryStatusEnum || inq.status || '',
        creationDate: inq.creationDate?.value || inq.creationDate || null,
        lastModifiedDate: inq.lastModifiedDate?.value || inq.lastModifiedDate || null,
        claimAmount: inq.claimAmount || null,
        inquiryDetails: inq.inquiryDetails || null,
      }))
      json(res, 200, { ok: true, inquiries, sandbox: cfg.sandbox })
      return true
    }

    // POST /api/ebay/inquiries/:id/reply — send inquiry message (human-approved)
    if (pathname.match(/^\/api\/ebay\/inquiries\/[^/]+\/reply$/) && method === 'POST') {
      const inquiryId = decodeURIComponent(
        pathname.replace(/^\/api\/ebay\/inquiries\//, '').replace(/\/reply$/, '')
      )
      const raw = await readRequestBody(req)
      const body = JSON.parse(raw || '{}')
      const userToken = await resolveUserToken(cfg, req, body)
      if (!userToken) {
        json(res, 401, { error: 'eBay user token required' })
        return true
      }
      if (body.human_approved !== true) {
        json(res, 403, { error: 'human_approved required before sending CS reply' })
        return true
      }
      const message = String(body.message || body.body || '')
        .trim()
        .slice(0, 2000)
      if (!message) {
        json(res, 400, { error: 'message required' })
        return true
      }
      if (body.dry_run === true) {
        json(res, 200, { ok: true, dry_run: true, inquiryId, message })
        return true
      }
      const marketplace = String(body.marketplace_id || 'EBAY_DE')
      const result = await ebayApi(
        cfg,
        userToken,
        'POST',
        `/post-order/v2/inquiry/${encodeURIComponent(inquiryId)}/send_message`,
        { message: { content: message } },
        { 'X-EBAY-C-MARKETPLACE-ID': marketplace }
      )
      if (!result.ok && result.status !== 204) {
        json(res, 502, {
          error: 'send inquiry message failed',
          details: result.data?.errors || result.data,
        })
        return true
      }
      json(res, 200, { ok: true, inquiryId, sandbox: cfg.sandbox })
      return true
    }

    json(res, 404, { error: 'Not found' })
    return true
  } catch (err) {
    if (err?.message === 'Request body too large') {
      json(res, 413, { error: 'Payload too large' })
      return true
    }
    json(res, 500, { error: clientSafeError(err, process.env.NODE_ENV !== 'production') })
    return true
  }
}

export function createEbayApiMiddleware(getConfig) {
  return async function ebayApiMiddleware(req, res, next) {
    const pathname = pathnameOf(req)
    if (!pathname.startsWith('/api/ebay')) return next()
    const handled = await handleEbayRequest(req, res, { getConfig })
    if (!handled) next()
  }
}
