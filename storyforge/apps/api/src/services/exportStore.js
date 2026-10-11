import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
  readdirSync,
} from 'node:fs'
import { join, dirname } from 'node:path'
import { randomUUID } from 'node:crypto'
import { hmacSign, safeEqual } from '../security/crypto.js'
import { config } from '../config.js'
import { resolveDataPath } from '../db/persist.js'

/** Default TTL for signed download links (2 hours). */
const DEFAULT_TTL_MS = 2 * 60 * 60 * 1000

function exportsRoot() {
  const base = resolveDataPath(process.env.STORYFORGE_DATA_PATH || undefined)
  const dataDir = base.endsWith('.json') ? dirname(base) : base
  const root = join(dataDir, 'exports')
  mkdirSync(root, { recursive: true })
  return root
}

function signingSecret() {
  return config.sessionSecret || 'storyforge-dev-export-secret-not-for-prod'
}

function guessMime(filename) {
  if (/\.pdf$/i.test(filename)) return 'application/pdf'
  if (/\.zip$/i.test(filename)) return 'application/zip'
  if (/\.json$/i.test(filename)) return 'application/json'
  if (/\.png$/i.test(filename)) return 'image/png'
  if (/\.txt$/i.test(filename)) return 'text/plain'
  return 'application/octet-stream'
}

export function signExportToken({ id, userId, expiresAt }) {
  const payload = `${id}.${userId}.${expiresAt}`
  const sig = hmacSign(signingSecret(), payload)
  return `${expiresAt}.${sig}`
}

export function verifyExportToken(id, userId, token) {
  if (!token || !id || !userId) return false
  const parts = String(token).split('.')
  if (parts.length !== 2) return false
  const expiresAt = Number(parts[0])
  const sig = parts[1]
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false
  const expected = hmacSign(signingSecret(), `${id}.${userId}.${expiresAt}`)
  return safeEqual(sig, expected)
}

/**
 * Persist bytes + sidecar meta; return signed download descriptor.
 */
export function persistExport({ bytes, filename, mime, userId, meta = {} }) {
  const id = randomUUID()
  const buf = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes)
  const root = exportsRoot()
  const safeName = String(filename || 'export.bin').replace(/[^a-zA-Z0-9._-]+/g, '_')
  const diskName = `${id}-${safeName}`
  writeFileSync(join(root, diskName), buf)

  const expiresAtMs = Date.now() + (Number(process.env.STORYFORGE_EXPORT_TTL_MS) || DEFAULT_TTL_MS)
  const expiresAt = new Date(expiresAtMs).toISOString()
  const token = signExportToken({ id, userId, expiresAt: expiresAtMs })

  writeFileSync(
    join(root, `${id}.meta.json`),
    JSON.stringify(
      {
        userId,
        mime: mime || guessMime(safeName),
        filename: safeName,
        createdAt: new Date().toISOString(),
        expiresAt,
        ...meta,
      },
      null,
      2
    )
  )

  return {
    exportId: id,
    filename: safeName,
    mime: mime || guessMime(safeName),
    byteLength: buf.length,
    expiresAt,
    downloadPath: `/v1/exports/${id}?token=${encodeURIComponent(token)}`,
    token,
  }
}

export function resolveExportArtifact(exportId) {
  const root = exportsRoot()
  if (!existsSync(root)) return null
  const entries = readdirSync(root)
  const match = entries.find((f) => f.startsWith(`${exportId}-`) && !f.endsWith('.meta.json'))
  if (!match) return null
  const metaPath = join(root, `${exportId}.meta.json`)
  let meta = {}
  if (existsSync(metaPath)) {
    try {
      meta = JSON.parse(readFileSync(metaPath, 'utf8'))
    } catch {
      meta = {}
    }
  }
  return {
    bytes: readFileSync(join(root, match)),
    filename: match.slice(exportId.length + 1),
    mime: meta.mime || guessMime(match),
    meta,
    userId: meta.userId,
  }
}

/** Attach signed download fields onto a PDF/ZIP result; omit huge dataUrls from job JSON. */
export function attachSignedDownload(result, { userId, stripDataUrlAbove = 1_500_000 } = {}) {
  if (!result) return result
  let bytes
  if (result.bytes) {
    bytes = Buffer.isBuffer(result.bytes) ? result.bytes : Buffer.from(result.bytes)
  } else if (result.dataUrl) {
    const b64 = String(result.dataUrl).split(',')[1] || ''
    bytes = Buffer.from(b64, 'base64')
  } else {
    return result
  }
  const artifact = persistExport({
    bytes,
    filename: result.filename || 'export.bin',
    mime: result.mime || 'application/octet-stream',
    userId,
    meta: { kind: result.kind || 'file' },
  })
  const out = {
    ...result,
    exportId: artifact.exportId,
    downloadPath: artifact.downloadPath,
    downloadUrl: artifact.downloadPath,
    expiresAt: artifact.expiresAt,
    signed: true,
    byteLength: artifact.byteLength,
  }
  delete out.bytes
  if (out.dataUrl && out.dataUrl.length > stripDataUrlAbove) {
    delete out.dataUrl
    out.dataUrlOmitted = true
  }
  return out
}
