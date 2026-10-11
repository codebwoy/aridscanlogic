import { randomUUID } from 'node:crypto'
import { hmacSign, safeEqual } from '../security/crypto.js'
import { config } from '../config.js'

export function signExportToken(exportId) {
  const exp = Date.now() + config.exportTtlMs
  const payload = Buffer.from(JSON.stringify({ id: exportId, exp })).toString('base64url')
  const sig = hmacSign(config.sessionSecret, payload)
  return `${payload}.${sig}`
}

export function verifyExportToken(token, exportId) {
  if (!token || !token.includes('.')) return false
  const [payload, sig] = token.split('.')
  const expected = hmacSign(config.sessionSecret, payload)
  if (!safeEqual(sig, expected)) return false
  try {
    const body = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (body.id !== exportId) return false
    if (Date.now() > body.exp) return false
    return true
  } catch {
    return false
  }
}

export async function persistExportArtifact(store, { bookId, format, bytes, meta = {} }) {
  const id = randomUUID()
  const artifact = {
    id,
    bookId,
    format,
    bytes: Buffer.from(bytes).toString('base64'),
    meta,
    created_at: new Date().toISOString(),
  }
  await store.saveExport(id, artifact)
  const token = signExportToken(id)
  return { id, token, url: `/v1/exports/${id}?token=${token}`, meta }
}

export function resolveExportArtifact(store, id) {
  return store.getExport(id)
}
