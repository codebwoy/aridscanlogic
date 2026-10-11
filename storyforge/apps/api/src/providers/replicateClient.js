/**
 * Minimal Replicate HTTP client (no SDK). Keys stay server-side.
 * Docs: https://replicate.com/docs/reference/http
 */

export class ReplicateError extends Error {
  constructor(message, { status, body } = {}) {
    super(message)
    this.name = 'ReplicateError'
    this.status = status || 502
    this.code = 'replicate_error'
    this.body = body
  }
}

export async function runReplicateModel({
  token,
  model,
  input,
  timeoutMs = 180_000,
  pollMs = 1500,
}) {
  if (!token) {
    throw new ReplicateError('REPLICATE_API_TOKEN is not set', { status: 503 })
  }
  if (!model) {
    throw new ReplicateError('Replicate model id missing', { status: 500 })
  }

  const createUrl = model.includes(':')
    ? 'https://api.replicate.com/v1/predictions'
    : `https://api.replicate.com/v1/models/${model}/predictions`

  const createBody = model.includes(':')
    ? { version: model.split(':')[1], input }
    : { input }

  const createRes = await fetch(createUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Prefer: 'wait=60',
    },
    body: JSON.stringify(createBody),
  })

  let prediction = await createRes.json().catch(() => ({}))
  if (!createRes.ok) {
    throw new ReplicateError(
      prediction?.detail || prediction?.error || `Replicate create failed (${createRes.status})`,
      { status: createRes.status >= 400 ? createRes.status : 502, body: prediction }
    )
  }

  const started = Date.now()
  while (prediction?.status === 'starting' || prediction?.status === 'processing') {
    if (Date.now() - started > timeoutMs) {
      throw new ReplicateError('Replicate prediction timed out', { status: 504, body: prediction })
    }
    await sleep(pollMs)
    const getRes = await fetch(prediction.urls.get, {
      headers: { Authorization: `Bearer ${token}` },
    })
    prediction = await getRes.json().catch(() => ({}))
    if (!getRes.ok) {
      throw new ReplicateError(
        prediction?.detail || `Replicate poll failed (${getRes.status})`,
        { status: 502, body: prediction }
      )
    }
  }

  if (prediction.status !== 'succeeded') {
    throw new ReplicateError(
      prediction?.error || `Replicate prediction ${prediction?.status || 'failed'}`,
      { status: 502, body: prediction }
    )
  }

  return prediction
}

/** Normalize Replicate output to a single HTTPS (or data) image URL. */
export function firstImageUrl(output) {
  if (!output) return null
  if (typeof output === 'string') return output
  if (Array.isArray(output)) {
    for (const item of output) {
      const u = firstImageUrl(item)
      if (u) return u
    }
    return null
  }
  if (typeof output === 'object') {
    if (typeof output.url === 'string') return output.url
    if (typeof output.image === 'string') return output.image
  }
  return null
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}
