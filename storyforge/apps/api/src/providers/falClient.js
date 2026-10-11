/**
 * Minimal fal.ai HTTP client (no SDK dependency).
 * Docs: https://fal.ai/docs/documentation/model-apis/inference
 * Auth: Authorization: Key $FAL_KEY
 *
 * Production path uses the queue (subscribe-style poll) for reliability on
 * long jobs such as image-to-video.
 */

const FAL_RUN = 'https://fal.run'
const FAL_QUEUE = 'https://queue.fal.run'
const FAL_REST = 'https://rest.alpha.fal.ai'

export class FalClientError extends Error {
  constructor(message, { status = 502, code = 'fal_error', body = null } = {}) {
    super(message)
    this.name = 'FalClientError'
    this.status = status
    this.code = code
    this.body = body
  }
}

function authHeaders(key, extra = {}) {
  return {
    Authorization: `Key ${key}`,
    ...extra,
  }
}

/**
 * Direct synchronous call — fine for fast image models.
 * POST https://fal.run/{modelId}
 */
export async function falRun(key, modelId, input) {
  const res = await fetch(`${FAL_RUN}/${modelId}`, {
    method: 'POST',
    headers: authHeaders(key, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(input),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new FalClientError(body?.detail || body?.error || `fal.run failed (${res.status})`, {
      status: res.status >= 400 ? res.status : 502,
      body,
    })
  }
  return body
}

/**
 * Queue submit + poll until COMPLETED (recommended for video / slow models).
 * POST https://queue.fal.run/{modelId}
 */
export async function falSubscribe(key, modelId, input, opts = {}) {
  const maxMs = opts.maxMs ?? 8 * 60 * 1000
  const pollMs = opts.pollMs ?? 2500
  const started = Date.now()

  const submitRes = await fetch(`${FAL_QUEUE}/${modelId}`, {
    method: 'POST',
    headers: authHeaders(key, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(input),
  })
  const submitBody = await submitRes.json().catch(() => ({}))
  if (!submitRes.ok) {
    throw new FalClientError(
      submitBody?.detail || submitBody?.error || `fal queue submit failed (${submitRes.status})`,
      { status: submitRes.status >= 400 ? submitRes.status : 502, body: submitBody },
    )
  }

  const statusUrl = submitBody.status_url
  const responseUrl = submitBody.response_url
  const requestId = submitBody.request_id
  if (!statusUrl || !responseUrl) {
    // Some responses return the result immediately
    if (submitBody.images || submitBody.video || submitBody.image) return submitBody
    throw new FalClientError('fal queue response missing status_url / response_url', {
      body: submitBody,
    })
  }

  while (Date.now() - started < maxMs) {
    const stRes = await fetch(statusUrl, { headers: authHeaders(key) })
    const st = await stRes.json().catch(() => ({}))
    const status = st.status || st?.detail?.status
    if (status === 'COMPLETED') {
      const outRes = await fetch(responseUrl, { headers: authHeaders(key) })
      const out = await outRes.json().catch(() => ({}))
      if (!outRes.ok) {
        throw new FalClientError(out?.detail || out?.error || 'fal queue result failed', {
          status: outRes.status >= 400 ? outRes.status : 502,
          body: out,
        })
      }
      return out
    }
    if (status === 'FAILED' || status === 'CANCELLED') {
      throw new FalClientError(st?.error || st?.detail || `fal job ${status}`, {
        code: 'fal_job_failed',
        body: st,
      })
    }
    await new Promise((r) => setTimeout(r, pollMs))
  }

  throw new FalClientError(`fal job timed out after ${maxMs}ms (request_id=${requestId || '?'})`, {
    code: 'fal_timeout',
  })
}

/**
 * Upload a Buffer / data-URL so models that need a public image_url can use it.
 * Uses fal REST storage when available; falls back to returning the data URL.
 */
export async function falEnsurePublicUrl(key, imageUrlOrData) {
  const src = String(imageUrlOrData || '')
  if (!src) {
    throw new FalClientError('image url required', { status: 400, code: 'image_url_required' })
  }
  if (src.startsWith('http://') || src.startsWith('https://')) return src

  let buffer
  let contentType = 'image/png'
  if (src.startsWith('data:')) {
    const m = /^data:([^;]+);base64,(.+)$/s.exec(src)
    if (!m) {
      throw new FalClientError('invalid data URL', { status: 400, code: 'invalid_data_url' })
    }
    contentType = m[1] || contentType
    buffer = Buffer.from(m[2], 'base64')
  } else {
    buffer = Buffer.from(src)
  }

  // fal storage upload (REST alpha)
  try {
    const res = await fetch(`${FAL_REST}/storage/upload`, {
      method: 'POST',
      headers: authHeaders(key, {
        'Content-Type': contentType,
      }),
      body: buffer,
    })
    const body = await res.json().catch(() => ({}))
    const url = body?.access_url || body?.url || body?.file_url
    if (res.ok && url) return url
    console.warn('[fal] storage upload failed, trying data URL passthrough:', body?.detail || res.status)
  } catch (err) {
    console.warn('[fal] storage upload error:', err.message)
  }

  // Many fal image endpoints accept data URIs directly
  return src
}

export function falFirstImageUrl(body) {
  return (
    body?.images?.[0]?.url ||
    body?.image?.url ||
    body?.output?.url ||
    (typeof body?.image === 'string' ? body.image : null) ||
    null
  )
}

export function falFirstVideoUrl(body) {
  return (
    body?.video?.url ||
    body?.video_url ||
    body?.output?.video?.url ||
    body?.videos?.[0]?.url ||
    (typeof body?.video === 'string' ? body.video : null) ||
    null
  )
}
