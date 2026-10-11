import { createServer } from 'node:http'
import { URL } from 'node:url'
import { z } from 'zod'
import {
  CREDIT_COSTS,
  estimateBookCredits,
  WIZARD_STEPS,
  PUBLISHING_SPECS,
  COMPLIANCE_CHECKLIST_DEFAULT,
  nextStepId,
  prevStepId,
  DEFAULT_BANNED_PHRASES,
} from '@authorforge/shared'
import { llmProviderStatus } from '@authorforge/llm'
import { focusTagCoverage, listPrompts } from '@authorforge/agents'
import { config, assertRuntimeSecrets } from './config.js'
import { createMemoryStore } from './db/memoryStore.js'
import { initQueue } from './queue/queues.js'
import { rateLimit } from './security/rateLimit.js'
import { issueDesktopSession } from './security/desktopSession.js'
import {
  sendJson,
  sendError,
  readJson,
  securityHeaders,
  cors,
  assertApiAccess,
  requireDesktop,
} from './http.js'
import { submitJob, wireLocalJobHandlers, getLlm, getMarket } from './services/jobs.js'
import { resolveExportArtifact, verifyExportToken } from './services/exportStore.js'
import { createStorefrontCheckout } from './services/stripeCheckout.js'
import { resolveWebDist, tryServeStatic } from './static.js'

assertRuntimeSecrets()
const store = createMemoryStore()
wireLocalJobHandlers(store)
await initQueue()
const webDist = config.serveStatic ? resolveWebDist() : null
if (webDist) {
  console.info(`[authorforge-api] static web dist: ${webDist}`)
}

const limitSession = rateLimit({
  windowMs: 60_000,
  max: 20,
  keyFn: (r) => `sess:${r.socket.remoteAddress}`,
})
const limitApi = rateLimit({
  windowMs: 60_000,
  max: 180,
  keyFn: (r) => `api:${r.socket.remoteAddress}`,
})

const sessionBody = z.object({
  viewportWidth: z.number().int().positive(),
  externalRef: z.string().min(1).max(128).optional(),
})

const bookBody = z.object({
  working_title: z.string().min(1).max(200).optional(),
  subtitle: z.string().max(300).optional(),
  author_name: z.string().max(120).optional(),
  genre: z.string().max(64).optional(),
  topic: z.string().max(4000).optional(),
  // Short kids / novella projects need low floors; long non-fiction still capped.
  target_words: z.number().int().min(500).max(120000).optional(),
  chapter_count: z.number().int().min(1).max(40).optional(),
  structure_type: z.string().max(64).optional(),
  language: z.enum(['en', 'de']).optional(),
  trim_size: z.string().max(32).optional(),
  wizard_step: z.string().max(64).optional(),
  bible: z.record(z.any()).optional(),
  persona: z.any().optional(),
  competitors: z.array(z.any()).optional(),
  resources: z.array(z.any()).optional(),
  outline: z.any().optional(),
  sections: z.record(z.any()).optional(),
  story_slots: z.array(z.any()).optional(),
  claims: z.array(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
  formatting: z.record(z.any()).optional(),
  compliance: z.record(z.any()).optional(),
  status: z.string().max(32).optional(),
})

const jobBody = z.object({
  type: z.string().min(1).max(64),
  bookId: z.string().uuid().optional().nullable(),
  inputs: z.record(z.any()).optional(),
})

const server = createServer(async (req, res) => {
  securityHeaders(res)
  cors(req, res)
  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
  const path = url.pathname

  try {
    if (path === '/health') {
      sendJson(res, 200, {
        ok: true,
        service: 'authorforge-api',
        llm: llmProviderStatus(getLlm()),
        market: { id: getMarket().id },
        budget_eur_default: config.bookBudgetEur,
        hybrid: Boolean(webDist),
        persist: {
          enabled: Boolean(store.persistEnabled),
          path: store.persistPath || null,
        },
      })
      return
    }

    // SPA + assets (hybrid prod) — before API auth
    if (!path.startsWith('/v1') && webDist && tryServeStatic(req, res, webDist, path)) {
      return
    }

    if (!path.startsWith('/v1')) {
      sendError(res, 404, 'Not found', 'not_found')
      return
    }

    if (!assertApiAccess(req, res)) return
    if (!limitApi(req, res)) return

    if (path === '/v1/session/desktop' && req.method === 'POST') {
      if (!limitSession(req, res)) return
      const body = sessionBody.parse(await readJson(req))
      const user = await store.ensureUser(body.externalRef || 'local-dev')
      const session = issueDesktopSession({
        userId: user.id,
        viewportWidth: body.viewportWidth,
        userAgent: req.headers['user-agent'] || '',
      })
      const balance = await store.getBalance(user.id)
      sendJson(res, 200, {
        token: session.token,
        expiresAt: session.expiresAt,
        user: { id: user.id, org_id: user.org_id, locale: user.locale },
        credits: balance,
        trial_credits: config.trialCredits,
      })
      return
    }

    if (path === '/v1/specs' && req.method === 'GET') {
      sendJson(res, 200, {
        publishing: PUBLISHING_SPECS,
        compliance: COMPLIANCE_CHECKLIST_DEFAULT,
        credits: CREDIT_COSTS,
        estimate: estimateBookCredits(),
        wizard: WIZARD_STEPS,
        prompts: listPrompts(),
        banned_phrases_default: DEFAULT_BANNED_PHRASES,
        llm: llmProviderStatus(getLlm()),
        book_budget_eur: config.bookBudgetEur,
      })
      return
    }

    // Public storefront (no desktop session)
    if (path.startsWith('/v1/store/') && req.method === 'GET' && !path.includes('download')) {
      const slug = decodeURIComponent(path.slice('/v1/store/'.length).split('/')[0] || '')
      if (!slug || slug === 'checkout') {
        /* fall through for POST checkout */
      } else {
        const match = await store.findPublishedBySlug(slug)
        if (!match) {
          sendError(res, 404, 'Storefront not found', 'not_found')
          return
        }
        const sample = (match.storefront.sample_keys || [])
          .map((k) => match.sections?.[k])
          .filter(Boolean)
          .map((s) => ({
            title: s.title,
            content_md: String(s.content_md || '').slice(0, 4000),
          }))
        sendJson(res, 200, {
          slug: match.storefront.slug,
          title: match.working_title,
          subtitle: match.subtitle,
          author: match.author_name,
          price_cents: match.storefront.price_cents,
          currency: match.storefront.currency,
          theme: match.storefront.theme,
          key_selling_points: match.bible?.key_selling_points || [],
          bio: match.persona?.bio_draft || '',
          sample,
          jsonld: {
            '@context': 'https://schema.org',
            '@type': 'Book',
            name: match.working_title,
            author: { '@type': 'Person', name: match.author_name || 'Author' },
            offers: {
              '@type': 'Offer',
              price: (match.storefront.price_cents / 100).toFixed(2),
              priceCurrency: (match.storefront.currency || 'EUR').toUpperCase(),
            },
          },
        })
        return
      }
    }

    if (path === '/v1/store/checkout' && req.method === 'POST') {
      const body = z
        .object({
          slug: z.string().min(1).max(64),
          email: z.string().email().optional(),
          successUrl: z.string().url().optional(),
          cancelUrl: z.string().url().optional(),
        })
        .parse(await readJson(req))
      const match = await store.findPublishedBySlug(body.slug)
      if (!match?.storefront) {
        sendError(res, 404, 'Storefront not found', 'not_found')
        return
      }
      const origin = req.headers.origin || config.webOrigins[0] || 'http://127.0.0.1:5181'
      const result = await createStorefrontCheckout({
        store,
        book: match,
        email: body.email,
        successUrl:
          body.successUrl ||
          `${origin}/?view=store&slug=${encodeURIComponent(body.slug)}&paid=1`,
        cancelUrl: body.cancelUrl || `${origin}/?view=store&slug=${encodeURIComponent(body.slug)}`,
      })
      sendJson(res, 200, result)
      return
    }

    if (path === '/v1/store/download' && req.method === 'GET') {
      const token = url.searchParams.get('token') || ''
      const row = await store.getDownloadToken(token)
      if (!row || Date.now() > row.exp) {
        sendError(res, 403, 'Invalid or expired download token', 'forbidden')
        return
      }
      await store.consumeDownloadToken(token)
      const book = await store.getBookById(row.bookId)
      if (!book) {
        sendError(res, 404, 'Book missing', 'not_found')
        return
      }
      const chapters = Object.values(book.sections || {}).map((s) => `# ${s.title}\n\n${s.content_md}`)
      sendJson(res, 200, {
        title: book.working_title,
        format: 'markdown',
        content: chapters.join('\n\n---\n\n'),
        remaining_note: 'Token limited-use; regenerate via purchase if exhausted.',
      })
      return
    }

    if (path.startsWith('/v1/exports/') && req.method === 'GET') {
      const id = path.split('/')[3]
      const token = url.searchParams.get('token') || ''
      if (!verifyExportToken(token, id)) {
        sendError(res, 403, 'Invalid export token', 'forbidden')
        return
      }
      const art = await resolveExportArtifact(store, id)
      if (!art) {
        sendError(res, 404, 'Export not found', 'not_found')
        return
      }
      const buf = Buffer.from(art.bytes, 'base64')
      const ctype =
        art.format === 'epub'
          ? 'application/epub+zip'
          : art.format === 'kdp_zip'
            ? 'application/zip'
            : art.format === 'docx'
              ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              : art.format?.includes('svg') || art.format?.startsWith('aplus_') || art.format === 'cover_svg'
                ? 'image/svg+xml'
                : 'application/pdf'
      const ext =
        art.format === 'epub'
          ? 'epub'
          : art.format === 'kdp_zip'
            ? 'zip'
            : art.format === 'docx'
              ? 'docx'
              : ctype === 'image/svg+xml'
                ? 'svg'
                : 'pdf'
      res.writeHead(200, {
        'Content-Type': ctype,
        'Content-Length': buf.length,
        'Content-Disposition': `attachment; filename="authorforge-${art.format}-${id.slice(0, 8)}.${ext}"`,
        'Cache-Control': 'no-store',
      })
      res.end(buf)
      return
    }

    // ─── Desktop-authenticated routes ───────────────────────────────────────
    const session = requireDesktop(req, res)
    if (!session) return
    const userId = session.sub

    if (path === '/v1/me' && req.method === 'GET') {
      const credits = await store.getBalance(userId)
      const spentToday = await store.getSpentToday(userId)
      const library = await store.listBooks(userId)
      sendJson(res, 200, {
        userId,
        credits,
        spentToday,
        dailyCap: config.dailyCreditCap,
        llm: llmProviderStatus(getLlm()),
        library: { count: library.length },
        persist: {
          enabled: Boolean(store.persistEnabled),
          path: store.persistPath || null,
        },
      })
      return
    }

    if (path === '/v1/credits/grant-dev' && req.method === 'POST') {
      if (config.isProd) {
        sendError(res, 403, 'Not available in production', 'forbidden')
        return
      }
      await store.appendLedger({ userId, delta: 100, reason: 'dev_grant', meta: { local: true } })
      sendJson(res, 200, { credits: await store.getBalance(userId) })
      return
    }

    if (path === '/v1/books' && req.method === 'GET') {
      sendJson(res, 200, { books: await store.listBooks(userId) })
      return
    }

    if (path === '/v1/books' && req.method === 'POST') {
      const body = bookBody.parse(await readJson(req))
      const book = await store.createBook(userId, {
        ...body,
        bible: {
          banned_phrases: DEFAULT_BANNED_PHRASES,
          ...(body.bible || {}),
        },
      })
      sendJson(res, 201, { book })
      return
    }

    if (path === '/v1/books/import' && req.method === 'POST') {
      const body = await readJson(req)
      const book = await store.importBook(userId, body)
      sendJson(res, 201, { book })
      return
    }

    const bookMatch = path.match(/^\/v1\/books\/([^/]+)(.*)$/)
    if (bookMatch) {
      const bookId = bookMatch[1]
      const rest = bookMatch[2] || ''
      const book = await store.getBook(userId, bookId)
      if (!book) {
        sendError(res, 404, 'Book not found', 'not_found')
        return
      }

      if (rest === '' && req.method === 'GET') {
        sendJson(res, 200, { book })
        return
      }

      if (rest === '' && req.method === 'PATCH') {
        const body = bookBody.parse(await readJson(req))
        const updated = await store.updateBook(userId, bookId, body)
        sendJson(res, 200, { book: updated })
        return
      }

      if (rest === '' && req.method === 'DELETE') {
        const ok = await store.deleteBook(userId, bookId)
        if (!ok) {
          sendError(res, 404, 'Book not found', 'not_found')
          return
        }
        sendJson(res, 200, { ok: true })
        return
      }

      if (rest === '/step' && req.method === 'POST') {
        const body = z
          .object({
            direction: z.enum(['next', 'prev', 'set']),
            step: z.string().optional(),
          })
          .parse(await readJson(req))
        let step = book.wizard_step
        if (body.direction === 'next') step = nextStepId(step) || step
        else if (body.direction === 'prev') step = prevStepId(step) || step
        else if (body.direction === 'set' && body.step) step = body.step
        const updated = await store.updateBook(userId, bookId, { wizard_step: step })
        sendJson(res, 200, { book: updated })
        return
      }

      if (rest === '/lock-bible' && req.method === 'POST') {
        const bible = {
          ...book.bible,
          version: (book.bible?.version || 0) + 1,
          locked_at: new Date().toISOString(),
        }
        const updated = await store.updateBook(userId, bookId, {
          bible,
          status: 'bible_locked',
          wizard_step: 'details',
        })
        sendJson(res, 200, { book: updated })
        return
      }

      if (rest === '/coverage' && req.method === 'GET') {
        const tags = book.bible?.focus_tags || []
        const coverage = focusTagCoverage(tags, book.outline?.chapters || [])
        sendJson(res, 200, { coverage })
        return
      }

      if (rest === '/section' && req.method === 'PATCH') {
        const body = z
          .object({
            sectionKey: z.string().min(1),
            content_md: z.string(),
            status: z.string().optional(),
          })
          .parse(await readJson(req))
        const prev = book.sections?.[body.sectionKey] || {}
        const section = {
          ...prev,
          content_md: body.content_md,
          status: body.status || 'edited',
          version: (prev.version || 0) + 1,
          versions: [
            ...(prev.versions || []).slice(-9),
            { version: (prev.version || 0) + 1, content_md: body.content_md, at: new Date().toISOString() },
          ],
        }
        const sections = { ...(book.sections || {}), [body.sectionKey]: section }
        const updated = await store.updateBook(userId, bookId, { sections })
        sendJson(res, 200, { book: updated, section })
        return
      }

      if (rest === '/story-slot' && req.method === 'POST') {
        const body = z
          .object({
            index: z.number().int().nonnegative(),
            user_supplied_text: z.string().max(20000),
            status: z.enum(['filled', 'skipped']).default('filled'),
          })
          .parse(await readJson(req))
        const slots = [...(book.story_slots || [])]
        if (!slots[body.index]) {
          sendError(res, 400, 'Story slot index invalid', 'bad_request')
          return
        }
        slots[body.index] = {
          ...slots[body.index],
          user_supplied_text: body.user_supplied_text,
          status: body.status,
        }
        const updated = await store.updateBook(userId, bookId, { story_slots: slots })
        sendJson(res, 200, { book: updated })
        return
      }

      if (rest === '/claim' && req.method === 'POST') {
        const body = z
          .object({
            index: z.number().int().nonnegative(),
            verification_status: z.enum(['verified', 'unverified', 'failed', 'user_confirmed']),
          })
          .parse(await readJson(req))
        const claims = [...(book.claims || [])]
        if (!claims[body.index]) {
          sendError(res, 400, 'Claim index invalid', 'bad_request')
          return
        }
        claims[body.index] = {
          ...claims[body.index],
          verification_status: body.verification_status,
        }
        const updated = await store.updateBook(userId, bookId, { claims })
        sendJson(res, 200, { book: updated })
        return
      }

      if (rest === '/compliance' && req.method === 'POST') {
        const body = z
          .object({
            checklist: z.array(z.any()).optional(),
            ai_disclosure: z.record(z.any()).optional(),
            passed: z.boolean().optional(),
            export_override: z.boolean().optional(),
          })
          .parse(await readJson(req))
        const compliance = {
          ...book.compliance,
          ...body,
          updated_at: new Date().toISOString(),
        }
        const updated = await store.updateBook(userId, bookId, { compliance })
        sendJson(res, 200, { book: updated })
        return
      }

      if (rest === '/export-gate' && req.method === 'GET') {
        const pendingSlots = (book.story_slots || []).filter((s) => s.status === 'pending')
        const unresolvedClaims = (book.claims || []).filter(
          (c) => c.verification_status === 'unverified' || c.verification_status === 'failed'
        )
        const softBlock = pendingSlots.length > 0 || unresolvedClaims.length > 0
        sendJson(res, 200, {
          softBlock,
          pendingSlots: pendingSlots.length,
          unresolvedClaims: unresolvedClaims.length,
          overrideAllowed: true,
          warning:
            'Export unlocked with override — you remain responsible for facts, rights, and KDP disclosure.',
          budget: {
            llm_cost_usd: book.llm_cost_usd,
            budget_eur: config.bookBudgetEur,
            over_budget: book.llm_cost_usd > config.bookBudgetEur,
          },
        })
        return
      }
    }

    if (path === '/v1/jobs' && req.method === 'POST') {
      const body = jobBody.parse(await readJson(req))
      if (!(body.type in CREDIT_COSTS)) {
        sendError(res, 400, `Unknown job type: ${body.type}`, 'bad_request')
        return
      }
      const job = await submitJob(store, {
        userId,
        type: body.type,
        bookId: body.bookId || null,
        inputs: body.inputs || {},
      })
      sendJson(res, 202, {
        job,
        cost_credits: CREDIT_COSTS[body.type],
      })
      return
    }

    if (path.startsWith('/v1/jobs/') && req.method === 'GET') {
      const id = path.split('/')[3]
      const job = await store.getJob(userId, id)
      if (!job) {
        sendError(res, 404, 'Job not found', 'not_found')
        return
      }
      sendJson(res, 200, { job })
      return
    }

    if (path === '/v1/admin/stats' && req.method === 'GET') {
      sendJson(res, 200, { stats: await store.adminStats(), note: 'Local admin snapshot' })
      return
    }

    sendError(res, 404, 'Not found', 'not_found')
  } catch (e) {
    if (e?.name === 'ZodError') {
      sendError(res, 400, e.errors?.[0]?.message || 'Invalid request', 'validation')
      return
    }
    const status = e.status || 500
    sendError(res, status, e.message || 'Server error', e.code)
  }
})

function flushLibraryOnExit(signal) {
  try {
    const ok = store.flushPersist?.()
    console.info(`[authorforge-api] flushed library on ${signal} (ok=${ok})`)
  } catch (e) {
    console.warn(`[authorforge-api] flush on ${signal} failed`, e.message)
  }
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    flushLibraryOnExit(signal)
    server.close(() => process.exit(0))
    setTimeout(() => process.exit(0), 1500).unref?.()
  })
}

server.listen(config.port, config.host, () => {
  console.info(
    `[authorforge-api] http://${config.host}:${config.port} (static=${Boolean(webDist)} llm=${config.llmProvider} persist=${store.persistEnabled ? 'on' : 'off'})`
  )
})


