import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { URL } from 'node:url'

process.env.NOVELFORGE_PERSIST = '0'
process.env.NOVELFORGE_LLM_PROVIDER = 'fake'

const { createMemoryStore } = await import('../src/db/memoryStore.js')
const {
  persistExportArtifact,
  resolveExportArtifact,
  signExportToken,
  verifyExportToken,
} = await import('../src/services/exportStore.js')

test('export token signs and verifies for matching id', () => {
  const id = '9212fa85-27bb-44df-9128-f5cf76483e2c'
  const token = signExportToken(id)
  assert.ok(token.includes('.'))
  assert.equal(verifyExportToken(token, id), true)
  assert.equal(verifyExportToken(token, '00000000-0000-0000-0000-000000000000'), false)
  assert.equal(verifyExportToken('bad.token', id), false)
})

test('persistExportArtifact returns downloadable url + bytes roundtrip', async () => {
  const store = createMemoryStore({ persist: false })
  const bytes = Buffer.from('%PDF-1.4 fake')
  const art = await persistExportArtifact(store, {
    bookId: 'book-1',
    format: 'interior_pdf',
    bytes,
    meta: { pageCount: 3 },
  })
  assert.ok(art.id)
  assert.ok(art.token)
  assert.match(art.url, new RegExp(`^/v1/exports/${art.id}\\?token=`))
  assert.equal(verifyExportToken(art.token, art.id), true)
  const saved = await resolveExportArtifact(store, art.id)
  assert.ok(saved)
  assert.equal(Buffer.from(saved.bytes, 'base64').toString('utf8'), '%PDF-1.4 fake')
})

test('GET /v1/exports serves bytes with valid token and no Origin', async () => {
  const store = createMemoryStore({ persist: false })
  const payload = Buffer.from('%PDF-1.4 export-http-test')
  const art = await persistExportArtifact(store, {
    bookId: 'book-1',
    format: 'interior_pdf',
    bytes: payload,
    meta: { pageCount: 1 },
  })

  const server = createServer(async (req, res) => {
    const url = new URL(req.url || '/', 'http://127.0.0.1')
    if (!url.pathname.startsWith('/v1/exports/') || req.method !== 'GET') {
      res.writeHead(404)
      res.end()
      return
    }
    // Intentionally no Origin / session check — mirrors production export gate
    const id = url.pathname.split('/')[3]
    const token = url.searchParams.get('token') || ''
    if (!verifyExportToken(token, id)) {
      res.writeHead(403, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Invalid export token' }))
      return
    }
    const row = await resolveExportArtifact(store, id)
    if (!row) {
      res.writeHead(404)
      res.end()
      return
    }
    const buf = Buffer.from(row.bytes, 'base64')
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Length': buf.length,
      'Content-Disposition': `attachment; filename="novelforge-interior_pdf-${id.slice(0, 8)}.pdf"`,
    })
    res.end(buf)
  })

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const { port } = server.address()
  try {
    const res = await fetch(`http://127.0.0.1:${port}${art.url}`, { cache: 'no-store' })
    assert.equal(res.status, 200)
    assert.equal(res.headers.get('content-type'), 'application/pdf')
    assert.match(res.headers.get('content-disposition') || '', /attachment/)
    const body = Buffer.from(await res.arrayBuffer())
    assert.equal(body.toString('utf8'), '%PDF-1.4 export-http-test')

    const bad = await fetch(`http://127.0.0.1:${port}/v1/exports/${art.id}?token=nope`, {
      cache: 'no-store',
    })
    assert.equal(bad.status, 403)
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
})
