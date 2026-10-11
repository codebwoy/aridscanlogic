import { createServer } from 'node:http'
import { URL } from 'node:url'
import { z } from 'zod'
import {
  PUBLISHING_SPECS,
  CREDIT_COSTS,
  estimateBookCredits,
  requiredBleedPixels,
  costFor,
  assessDisclosure,
  BOOK_FORMATS,
  PROMPT_TEMPLATES,
  RECIPES,
  GUIDES,
  COURSE_STEPS,
  MANUSCRIPT_PRINCIPLES,
  REFERENCE_BOOKS,
  READING_RESOURCES,
  COMMERCIAL_USE_STATEMENT,
  NAMED_TOOLS,
  CHARACTER_TURBO_ENGINES,
  TRACEABILITY,
  fillPrompt,
  PROGRESS_STEPS,
} from '@storyforge/shared'
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
import { submitJob, wireLocalJobHandlers } from './services/jobs.js'

assertRuntimeSecrets()
const store = createMemoryStore()
wireLocalJobHandlers(store)
await initQueue()

const limitSession = rateLimit({
  windowMs: 60_000,
  max: 20,
  keyFn: (r) => `sess:${r.socket.remoteAddress}`,
})
const limitApi = rateLimit({
  windowMs: 60_000,
  max: 120,
  keyFn: (r) => `api:${r.socket.remoteAddress}`,
})

const sessionBody = z.object({
  viewportWidth: z.number().int().positive(),
  externalRef: z.string().min(1).max(128).optional(),
})

const projectBody = z.object({
  title: z.string().min(1).max(200).optional(),
  language: z.enum(['de', 'en']).optional(),
  trim_id: z.string().max(32).optional(),
  paper_type: z.string().max(32).optional(),
  page_count: z.number().int().optional(),
  premise: z.string().max(2000).optional(),
  emotional_core: z.string().max(500).optional(),
  format_id: z.string().max(32).optional(),
  style_preset: z.string().max(64).optional(),
  turbo_engine: z.string().max(16).optional(),
  progress_step: z.string().max(32).optional(),
  course_progress: z.record(z.any()).optional(),
  meta: z.record(z.any()).optional(),
})

const pinBody = z.object({
  assetId: z.string().min(1).max(128).optional(),
  heroUrl: z.string().max(5_000_000).optional().nullable(),
  palette: z.array(z.any()).optional(),
  embedding: z.array(z.number()).optional().nullable(),
  name: z.string().max(120).optional(),
  engine: z.string().max(16).optional(),
})

const jobBody = z.object({
  type: z.string().min(1).max(64),
  projectId: z.string().uuid().optional().nullable(),
  inputs: z.record(z.any()).optional(),
})

const disclosureBody = z.object({
  projectId: z.string().uuid(),
  usedAi: z.boolean(),
  generationMode: z.enum(['prompt', 'enhance_hand_painted', 'mixed', 'unknown']),
})

const configPatchBody = z.object({
  value: z.string().max(4000).optional(),
  source_label: z.string().max(500).optional(),
  verified_note: z.string().max(1000).optional(),
})

const pageBody = z.object({
  text_content: z.string().max(4000).optional(),
  illustration_brief: z.string().max(2000).optional(),
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
    if (path === '/health' && req.method === 'GET') {
      sendJson(res, 200, {
        ok: true,
        service: 'storyforge-api',
        desktopMinWidth: config.desktopMinWidth,
        specsLastVerified: PUBLISHING_SPECS.lastVerified,
      })
      return
    }

    if (!path.startsWith('/v1/')) {
      sendError(res, 404, 'Not found')
      return
    }

    if (!assertApiAccess(req, res)) return
    if (!limitApi(req, res)) return

    if (path === '/v1/specs' && req.method === 'GET') {
      sendJson(res, 200, {
        specs: PUBLISHING_SPECS,
        creditCosts: CREDIT_COSTS,
        desktopMinWidth: config.desktopMinWidth,
        progressSteps: PROGRESS_STEPS,
        tools: NAMED_TOOLS,
        turboEngines: CHARACTER_TURBO_ENGINES,
      })
      return
    }

    if (path === '/v1/session/desktop' && req.method === 'POST') {
      if (!limitSession(req, res)) return
      const body = sessionBody.parse(await readJson(req))
      const user = await store.ensureUser(body.externalRef || 'local-dev')
      try {
        const session = issueDesktopSession({
          userId: user.id,
          viewportWidth: body.viewportWidth,
          userAgent: req.headers['user-agent'] || '',
        })
        const bal = await store.getBalance(user.id)
        sendJson(res, 200, {
          ...session,
          userId: user.id,
          credits: bal,
          trialCredits: config.trialCredits,
          disclaimer: PUBLISHING_SPECS.disclaimers.aiRights,
          notAffiliated: PUBLISHING_SPECS.disclaimers.notAffiliated,
          onboarding: {
            freeCredits: config.trialCredits,
            sourceId: 'S25',
            message: `New accounts start with ${config.trialCredits} free credits to test before paying.`,
          },
        })
      } catch (e) {
        sendError(res, e.status || 403, e.message, e.code || 'desktop_required')
      }
      return
    }

    // Public launchpad seed (read-only) before auth — still behind API access for non-local
    if (path === '/v1/launchpad' && req.method === 'GET') {
      const cfg = await store.getConfigValues()
      sendJson(res, 200, {
        guides: GUIDES,
        recipes: RECIPES,
        prompts: PROMPT_TEMPLATES,
        courseSteps: COURSE_STEPS,
        formats: BOOK_FORMATS,
        manuscriptPrinciples: MANUSCRIPT_PRINCIPLES,
        referenceBooks: REFERENCE_BOOKS,
        readingResources: READING_RESOURCES,
        commercialUse: COMMERCIAL_USE_STATEMENT,
        tools: NAMED_TOOLS,
        config: cfg,
        traceability: TRACEABILITY,
        notAffiliated: PUBLISHING_SPECS.disclaimers.notAffiliated,
      })
      return
    }

    const session = requireDesktop(req, res)
    if (!session) return
    const userId = session.sub

    if (path === '/v1/me' && req.method === 'GET') {
      sendJson(res, 200, {
        userId,
        credits: await store.getBalance(userId),
        spentToday: await store.getSpentToday(userId),
        dailyCap: config.dailyCreditCap,
        surface: session.surface,
        trialCredits: config.trialCredits,
      })
      return
    }

    if (path === '/v1/credits/ledger' && req.method === 'GET') {
      sendJson(res, 200, { entries: await store.listLedger(userId) })
      return
    }

    if (path === '/v1/credits/estimate' && req.method === 'GET') {
      const pages = Number(url.searchParams.get('pages') || 32)
      const characters = Number(url.searchParams.get('characters') || 1)
      sendJson(res, 200, estimateBookCredits({ pages, characters }))
      return
    }

    if (path === '/v1/projects' && req.method === 'GET') {
      sendJson(res, 200, { projects: await store.listProjects(userId) })
      return
    }

    if (path === '/v1/projects' && req.method === 'POST') {
      const body = projectBody.parse(await readJson(req))
      const project = await store.createProject(userId, body)
      sendJson(res, 201, { project })
      return
    }

    const projectMatch = path.match(/^\/v1\/projects\/([^/]+)(.*)$/)
    if (projectMatch) {
      const id = projectMatch[1]
      const rest = projectMatch[2] || ''

      if (rest === '' && req.method === 'GET') {
        const project = await store.getProject(userId, id)
        if (!project) return sendError(res, 404, 'Project not found')
        const reqPx = requiredBleedPixels(project.trim_id)
        sendJson(res, 200, {
          project,
          printRequirements: reqPx,
          specsLastVerified: PUBLISHING_SPECS.lastVerified,
          disclosure: await store.getDisclosure(userId, id),
        })
        return
      }

      if (rest === '' && req.method === 'PATCH') {
        const body = projectBody.parse(await readJson(req))
        const project = await store.updateProject(userId, id, body)
        if (!project) return sendError(res, 404, 'Project not found')
        sendJson(res, 200, { project })
        return
      }

      if (rest === '/pin' && req.method === 'POST') {
        const body = pinBody.parse(await readJson(req))
        const project = await store.pinAnchor(userId, id, body)
        if (!project) return sendError(res, 404, 'Project not found')
        sendJson(res, 200, { project, pinned: project.pinned_anchor })
        return
      }

      if (rest === '/consent' && req.method === 'POST') {
        const body = z
          .object({
            guardian_name: z.string().min(1).max(120),
            relationship: z.string().min(1).max(80),
            acknowledged_guardian: z.literal(true),
            acknowledged_no_model_training: z.literal(true),
          })
          .parse(await readJson(req))
        const consent = await store.addPhotoConsent(userId, id, body)
        if (!consent) return sendError(res, 404, 'Project not found')
        sendJson(res, 201, {
          consent: {
            id: consent.id,
            created_at: consent.created_at,
            acknowledged_guardian: true,
            acknowledged_no_model_training: true,
          },
        })
        return
      }

      if (rest === '/consent' && req.method === 'GET') {
        const consent = await store.getPhotoConsent(userId, id)
        sendJson(res, 200, {
          consent: consent
            ? { id: consent.id, created_at: consent.created_at }
            : null,
        })
        return
      }

      const pageMatch = rest.match(/^\/pages\/(\d+)$/)
      if (pageMatch && req.method === 'PATCH') {
        const pageIndex = Number(pageMatch[1])
        const body = pageBody.parse(await readJson(req))
        const page = await store.setPage(userId, id, pageIndex, body)
        if (!page) return sendError(res, 404, 'Page not found')
        sendJson(res, 200, { page })
        return
      }
    }

    if (path === '/v1/jobs' && req.method === 'POST') {
      const body = jobBody.parse(await readJson(req))
      const cost = costFor(body.type)
      try {
        const job = await submitJob(store, {
          userId,
          type: body.type,
          projectId: body.projectId,
          inputs: body.inputs || {},
        })
        sendJson(res, 202, {
          job,
          charged: cost,
          balance: await store.getBalance(userId),
        })
      } catch (e) {
        sendError(res, e.status || 500, e.message, e.code)
      }
      return
    }

    if (path.startsWith('/v1/jobs/') && req.method === 'GET') {
      const id = path.split('/')[3]
      const job = await store.getJob(userId, id)
      if (!job) return sendError(res, 404, 'Job not found')
      sendJson(res, 200, { job })
      return
    }

    if (path === '/v1/disclosure/assess' && req.method === 'POST') {
      const body = disclosureBody.parse(await readJson(req))
      const result = assessDisclosure(body)
      const saved = await store.saveDisclosure(userId, body.projectId, {
        usedAi: body.usedAi,
        generationMode: body.generationMode,
        ...result,
      })
      if (!saved) return sendError(res, 404, 'Project not found')
      const cfg = await store.getConfigValues()
      sendJson(res, 200, {
        assessment: saved,
        configClaims: {
          confidential: cfg.map.kdp_ai_disclosure_confidential,
          requiredSince: cfg.map.kdp_ai_disclosure_required_since,
          usCopyright: cfg.map.us_copyright_ai_explainer,
        },
        commercialUse: COMMERCIAL_USE_STATEMENT,
        guidanceOnly: true,
      })
      return
    }

    if (path === '/v1/prompts/fill' && req.method === 'POST') {
      const body = z
        .object({
          templateId: z.string(),
          vars: z.record(z.string()).optional(),
        })
        .parse(await readJson(req))
      const tpl = PROMPT_TEMPLATES.find((p) => p.id === body.templateId)
      if (!tpl) return sendError(res, 404, 'Template not found')
      sendJson(res, 200, {
        template: tpl,
        filled: fillPrompt(tpl.text, body.vars || {}),
      })
      return
    }

    if (path === '/v1/admin/config' && req.method === 'GET') {
      sendJson(res, 200, await store.getConfigValues())
      return
    }

    if (path.startsWith('/v1/admin/config/') && req.method === 'PATCH') {
      const key = decodeURIComponent(path.slice('/v1/admin/config/'.length))
      const body = configPatchBody.parse(await readJson(req))
      const updated = await store.setConfigValue(key, body)
      if (!updated) return sendError(res, 404, 'Unknown config key')
      sendJson(res, 200, { value: updated })
      return
    }

    if (path === '/v1/billing/stripe/webhook' && req.method === 'POST') {
      if (!config.stripe.webhookSecret) {
        return sendError(res, 503, 'Stripe not configured')
      }
      await readJson(req, { maxBytes: 2_000_000 })
      sendJson(res, 200, { received: true, note: 'Wire stripe.webhooks.constructEvent next' })
      return
    }

    sendError(res, 404, 'Not found')
  } catch (err) {
    if (err?.name === 'ZodError') {
      return sendError(res, 400, 'Invalid request', 'validation_error')
    }
    if (err?.status) return sendError(res, err.status, err.message)
    console.error('[storyforge-api]', err)
    sendError(res, 500, 'Internal error')
  }
})

server.listen(config.port, config.host, () => {
  console.info(
    `[storyforge-api] http://${config.host}:${config.port} (desktop ≥${config.desktopMinWidth}px)`
  )
})
