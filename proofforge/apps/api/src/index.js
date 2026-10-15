import http from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'
import {
  BOOK_LANGUAGE_CODES,
  bookLanguagesPayload,
  editModesPayload,
  bookTypesPayload,
  publishingTargetsPayload,
  DESKTOP_MIN_WIDTH,
  productPayload,
  estimateProofreadCredits,
  languagePacksPayload,
  kdpRulesPayload,
  preferencesPayload,
  documentDomainPayload,
  manuscriptAnalysisPayload,
  reportCatalogPayload,
  MANUSCRIPT_WORD_MIN,
  MANUSCRIPT_WORD_MAX,
  buildJsonReport,
  buildCsvFindings,
  buildMarkdownReport,
  buildCorrectedManuscript,
  buildCorrectedEpub,
  buildCorrectedDocx,
  buildPrintPdf,
  buildReportPdf,
  buildPlainTextManuscript,
  buildEbookHtml,
  buildRtfManuscript,
  kdpUploadChecklist,
  resolveEntitlement,
} from '@proofforge/shared'
import { createPlagiarismProvider } from '@proofforge/agents'
import { createLlmProvider, createVerifyProvider, llmProviderStatus } from '@proofforge/llm'
import { config, assertRuntimeSecrets } from './config.js'
import { createMemoryStore } from './db/memoryStore.js'
import { createJobRunner } from './services/jobs.js'
import { extractManuscript } from './services/ingest.js'
import { issueDesktopSession, extractBearer, verifyDesktopSession } from './security/desktopSession.js'
import { rateLimit } from './security/rateLimit.js'
import { audit, listAudit } from './security/auditLog.js'
import {
  sendJson,
  sendError,
  readJson,
  securityHeaders,
  cors,
  assertApiAccess,
  isLocalSocket,
} from './http.js'

assertRuntimeSecrets()

const __dirname = dirname(fileURLToPath(import.meta.url))
const store = createMemoryStore({
  persist: process.env.PROOFFORGE_PERSIST === '0' ? false : undefined,
})
const jobs = createJobRunner(store)
const LOCAL_USER = 'local-author'
const limit = rateLimit({
  windowMs: 60_000,
  max: config.rateLimitMax,
  keyFn: (req) => req.socket?.remoteAddress || 'unknown',
})

const createSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  subtitle: z.string().max(200).optional(),
  author_name: z.string().max(120).optional(),
  intended_tone: z.string().max(120).optional(),
  style_guide: z.string().max(4000).optional(),
  formality: z.enum(['casual', 'neutral', 'formal']).optional(),
  language: z.enum(/** @type {[string, ...string[]]} */ ([...BOOK_LANGUAGE_CODES])).optional(),
  language_variety: z.string().optional(),
  book_type: z.string().optional(),
  edit_mode: z.string().optional(),
  publishing_target: z.string().optional(),
  audience: z.string().optional(),
  document_domain: z.string().optional(),
  genre_comparison: z.string().optional(),
  author_goals: z.string().optional(),
  translation_mode: z.boolean().optional(),
  source_language: z.string().optional(),
  reading_level: z.string().max(80).optional(),
  character_list: z.array(z.string()).optional(),
  glossary: z
    .array(
      z.union([
        z.string(),
        z.object({
          term: z.string().optional(),
          preferred: z.string().optional(),
          aliases: z.array(z.string()).optional(),
        }),
      ])
    )
    .optional(),
  translation_glossary: z
    .array(
      z.union([
        z.string(),
        z.object({
          term: z.string().optional(),
          preferred: z.string().optional(),
          aliases: z.array(z.string()).optional(),
        }),
      ])
    )
    .optional(),
  chapter_critique: z.boolean().optional(),
  plagiarism_consent: z.boolean().optional(),
  manuscript_text: z.string().optional(),
  sections: z
    .array(
      z.object({
        key: z.string().optional(),
        title: z.string().optional(),
        content_md: z.string().optional(),
        content: z.string().optional(),
        order: z.number().optional(),
      })
    )
    .optional(),
  source: z.string().optional(),
  source_book_id: z.string().optional(),
  source_studio: z.string().optional(),
})

function mime(path) {
  const map = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.png': 'image/png',
  }
  return map[extname(path)] || 'application/octet-stream'
}

function serveStatic(req, res) {
  if (!config.serveStatic) return false
  const webDist = join(__dirname, '../../web/dist')
  if (!existsSync(webDist)) return false
  let path = req.url?.split('?')[0] || '/'
  if (path === '/') path = '/index.html'
  const file = join(webDist, path.replace(/^\//, ''))
  if (!file.startsWith(webDist) || !existsSync(file)) {
    const index = join(webDist, 'index.html')
    if (existsSync(index)) {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(readFileSync(index))
      return true
    }
    return false
  }
  res.writeHead(200, { 'Content-Type': mime(file) })
  res.end(readFileSync(file))
  return true
}

function requireDesktopMutate(req, res) {
  if (isLocalSocket(req)) return true
  const vw = Number(req.headers['x-proofforge-viewport'] || 0)
  const bearer = extractBearer(req)
  const session = bearer ? verifyDesktopSession(bearer) : null
  if (session) return true
  if (vw >= config.desktopMinWidth) return true
  sendError(res, 403, 'Desktop viewport required', 'desktop_required')
  return false
}

const server = http.createServer(async (req, res) => {
  securityHeaders(res)
  cors(req, res)
  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const url = new URL(req.url || '/', `http://${req.headers.host}`)
  const path = url.pathname

  try {
    if (req.method === 'GET' && path === '/health') {
      const llm = createLlmProvider({
        provider: config.llmProvider,
        anthropicApiKey: config.anthropicApiKey,
        openaiApiKey: config.openaiApiKey,
      })
      const verify = createVerifyProvider({
        verifyProvider: config.verifyProvider,
        anthropicApiKey: config.anthropicApiKey,
        openaiApiKey: config.openaiApiKey,
      })
      sendJson(res, 200, {
        ok: true,
        service: 'proofforge',
        llm: llmProviderStatus(llm),
        verify_llm: llmProviderStatus(verify),
        desktop_min_width: DESKTOP_MIN_WIDTH,
        personal_studio: true,
        persist: Boolean(config.persist || config.dataPath),
        ocr: process.env.PROOFFORGE_OCR !== '0',
        plagiarism_provider: createPlagiarismProvider()?.id || 'off',
      })
      return
    }

    if (!limit(req, res)) return
    if (path.startsWith('/v1/') && !assertApiAccess(req, res)) return

    if (req.method === 'GET' && path === '/v1/specs') {
      sendJson(res, 200, {
        book_languages: bookLanguagesPayload(),
        edit_modes: editModesPayload(),
        book_types: bookTypesPayload(),
        publishing_targets: publishingTargetsPayload(),
        language_packs: languagePacksPayload(),
        kdp_rules: kdpRulesPayload(),
        preferences: preferencesPayload(),
        document_domains: documentDomainPayload(),
        manuscript_analysis: manuscriptAnalysisPayload(),
        report_catalog: reportCatalogPayload(),
        word_count_gate: {
          recommended_min: MANUSCRIPT_WORD_MIN,
          recommended_max: MANUSCRIPT_WORD_MAX,
        },
        product: productPayload(),
        desktop_min_width: DESKTOP_MIN_WIDTH,
        personal_studio: true,
        research: '/docs/RESEARCH.md',
        entitlements: resolveEntitlement(),
        formats: {
          ingest: ['txt', 'md', 'docx', 'pdf', 'epub'],
          export: [
            'json',
            'csv',
            'md',
            'manuscript',
            'epub',
            'docx',
            'pdf',
            'pdf-report',
            'txt',
            'html',
            'rtf',
          ],
          kdp_upload_paths: {
            kindle_ebook: [
              'docx',
              'epub',
              'html',
              'txt',
              'rtf',
              'pdf_limited_languages',
              'kpf_via_kindle_create',
            ],
            paperback_hardcover: ['pdf_print_interior', 'docx_then_pdf_with_fonts_embedded'],
            cover_calculator: 'https://kdp.amazon.com/en_US/cover-calculator',
            note: 'KPF is produced in Amazon Kindle Create. Print PDF uses project trim/margins/bleed. MOBI fixed-layout ended March 2025.',
          },
          ocr: process.env.PROOFFORGE_OCR !== '0',
        },
        plagiarism: {
          provider: createPlagiarismProvider()?.id || 'off',
          requires_consent: true,
        },
      })
      return
    }

    if (req.method === 'GET' && path === '/v1/admin/kdp-rules') {
      sendJson(res, 200, {
        ...kdpRulesPayload(),
        note: 'Versioned rules for author review. Edit source in packages/shared/src/kdpRules.js and bump KDP_RULES_VERSION.',
      })
      return
    }

    if (req.method === 'GET' && path === '/v1/audit') {
      sendJson(res, 200, { entries: listAudit({ limit: 100 }) })
      return
    }

    if (req.method === 'POST' && path === '/v1/session/desktop') {
      const body = await readJson(req)
      const viewportWidth = Number(body.viewportWidth || body.viewport_width || 0)
      try {
        const session = issueDesktopSession({
          userId: LOCAL_USER,
          viewportWidth,
          userAgent: req.headers['user-agent'] || '',
        })
        sendJson(res, 200, session)
      } catch (err) {
        sendError(res, err.status || 403, err.message, err.code)
      }
      return
    }

    if (req.method === 'GET' && path === '/v1/credits') {
      sendJson(res, 200, store.getCredits(LOCAL_USER))
      return
    }

    if (req.method === 'GET' && path === '/v1/projects') {
      sendJson(res, 200, { projects: store.listProjects(LOCAL_USER) })
      return
    }

    if (req.method === 'POST' && path === '/v1/projects') {
      if (!requireDesktopMutate(req, res)) return
      const body = createSchema.parse(await readJson(req))
      const project = store.createProject(LOCAL_USER, body)
      audit('project_create', { project_id: project.id, source: project.source })
      sendJson(res, 201, { project })
      return
    }

    if (req.method === 'POST' && path === '/v1/projects/import') {
      if (!requireDesktopMutate(req, res)) return
      const body = createSchema.parse(await readJson(req))
      const project = store.createProject(LOCAL_USER, {
        ...body,
        source: body.source || 'import',
      })
      audit('project_import', { project_id: project.id, source_studio: body.source_studio })
      sendJson(res, 201, { project })
      return
    }

    if (req.method === 'POST' && path === '/v1/projects/ingest') {
      if (!requireDesktopMutate(req, res)) return
      const body = await readJson(req, { maxBytes: 12_000_000 })
      const extracted = await extractManuscript(body)
      if (extracted.unsupported || !extracted.text) {
        sendError(
          res,
          400,
          extracted.warnings?.[0] || 'Could not extract manuscript text',
          'ingest_failed'
        )
        return
      }
      const meta = createSchema.parse({
        title: body.title || body.filename || 'Uploaded manuscript',
        language: body.language,
        language_variety: body.language_variety,
        book_type: body.book_type,
        edit_mode: body.edit_mode,
        publishing_target: body.publishing_target,
        document_domain: body.document_domain,
        translation_mode: body.translation_mode,
        plagiarism_consent: body.plagiarism_consent,
        manuscript_text: extracted.text,
        source: 'upload',
      })
      const project = store.createProject(LOCAL_USER, {
        ...meta,
        ingest_warnings: extracted.warnings,
        ingest_meta: {
          format: extracted.format,
          ocr: extracted.ocr === true,
          ocr_confidence: extracted.ocr_confidence,
          page_count: extracted.page_count,
          sha256: extracted.sha256,
          filename: body.filename || null,
        },
      })
      audit('project_ingest', {
        project_id: project.id,
        format: extracted.format,
        bytes: extracted.bytes,
        ocr: extracted.ocr === true,
        sha256: extracted.sha256,
      })
      sendJson(res, 201, {
        project,
        extraction: {
          format: extracted.format,
          bytes: extracted.bytes,
          warnings: extracted.warnings,
          page_count: extracted.page_count,
          ocr: extracted.ocr === true,
          ocr_confidence: extracted.ocr_confidence,
          sha256: extracted.sha256,
        },
      })
      return
    }

    const projectMatch = path.match(/^\/v1\/projects\/([^/]+)$/)
    if (projectMatch) {
      const id = projectMatch[1]
      const project = store.getProject(id)
      if (!project || project.owner_id !== LOCAL_USER) {
        sendError(res, 404, 'Project not found')
        return
      }
      if (req.method === 'GET') {
        sendJson(res, 200, { project })
        return
      }
      if (req.method === 'PATCH') {
        if (!requireDesktopMutate(req, res)) return
        const body = await readJson(req)
        const updated = store.updateProject(id, body)
        sendJson(res, 200, { project: updated })
        return
      }
    }

    const estimateMatch = path.match(/^\/v1\/projects\/([^/]+)\/estimate$/)
    if (req.method === 'GET' && estimateMatch) {
      const project = store.getProject(estimateMatch[1])
      if (!project || project.owner_id !== LOCAL_USER) {
        sendError(res, 404, 'Project not found')
        return
      }
      const sectionCount = Object.keys(project.sections || {}).length
      sendJson(res, 200, {
        ...estimateProofreadCredits(sectionCount),
        section_count: sectionCount,
        personal_studio: true,
      })
      return
    }

    const analyzeMatch = path.match(/^\/v1\/projects\/([^/]+)\/analyze$/)
    if (req.method === 'POST' && analyzeMatch) {
      if (!requireDesktopMutate(req, res)) return
      const id = analyzeMatch[1]
      const project = store.getProject(id)
      if (!project || project.owner_id !== LOCAL_USER) {
        sendError(res, 404, 'Project not found')
        return
      }
      const sectionCount = Object.keys(project.sections || {}).length
      if (!sectionCount) {
        sendError(res, 400, 'Add manuscript sections before analyzing')
        return
      }
      const estimate = estimateProofreadCredits(sectionCount)
      const job = await jobs.enqueueAnalysis(LOCAL_USER, id)
      audit('analyze_enqueue', { project_id: id, job_id: job.id })
      sendJson(res, 202, { job, estimate })
      return
    }

    const undoMatch = path.match(/^\/v1\/projects\/([^/]+)\/undo$/)
    if (req.method === 'POST' && undoMatch) {
      if (!requireDesktopMutate(req, res)) return
      const result = store.undoRevision(undoMatch[1])
      if (!result) {
        sendError(res, 400, 'No revision to undo')
        return
      }
      audit('revision_undo', { project_id: undoMatch[1], revision_id: result.restored?.id })
      sendJson(res, 200, result)
      return
    }

    const findingMatch = path.match(/^\/v1\/projects\/([^/]+)\/findings\/([^/]+)\/resolve$/)
    if (req.method === 'POST' && findingMatch) {
      if (!requireDesktopMutate(req, res)) return
      const [, projectId, findingId] = findingMatch
      const body = await readJson(req)
      const result = store.resolveFinding(projectId, findingId, body)
      if (!result) {
        sendError(res, 404, 'Finding not found')
        return
      }
      sendJson(res, 200, result)
      return
    }

    const batchMatch = path.match(/^\/v1\/projects\/([^/]+)\/findings\/batch-resolve$/)
    if (req.method === 'POST' && batchMatch) {
      if (!requireDesktopMutate(req, res)) return
      const body = await readJson(req)
      const result = store.batchResolve(batchMatch[1], body)
      if (!result) {
        sendError(res, 404, 'Project not found')
        return
      }
      sendJson(res, 200, result)
      return
    }

    const checklistMatch = path.match(/^\/v1\/projects\/([^/]+)\/kdp-checklist$/)
    if (req.method === 'GET' && checklistMatch) {
      const project = store.getProject(checklistMatch[1])
      if (!project || project.owner_id !== LOCAL_USER) {
        sendError(res, 404, 'Project not found')
        return
      }
      sendJson(res, 200, kdpUploadChecklist(project))
      return
    }

    const exportMatch = path.match(
      /^\/v1\/projects\/([^/]+)\/export\/(json|csv|md|manuscript|epub|docx|pdf|pdf-report|txt|html|rtf)$/
    )
    if (req.method === 'GET' && exportMatch) {
      const project = store.getProject(exportMatch[1])
      if (!project || project.owner_id !== LOCAL_USER) {
        sendError(res, 404, 'Project not found')
        return
      }
      const kind = exportMatch[2]
      audit('export', { project_id: project.id, kind })
      if (kind === 'json') {
        sendJson(res, 200, buildJsonReport(project))
        return
      }
      if (kind === 'csv') {
        const csv = buildCsvFindings(project.findings || [])
        res.writeHead(200, {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="findings-${project.id}.csv"`,
        })
        res.end(csv)
        return
      }
      if (kind === 'md') {
        const md = buildMarkdownReport(project)
        res.writeHead(200, {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': `attachment; filename="report-${project.id}.md"`,
        })
        res.end(md)
        return
      }
      if (kind === 'manuscript') {
        const text = buildCorrectedManuscript(project)
        res.writeHead(200, {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': `attachment; filename="manuscript-${project.id}.md"`,
        })
        res.end(text)
        return
      }
      if (kind === 'epub') {
        const { bytes } = await buildCorrectedEpub(project)
        res.writeHead(200, {
          'Content-Type': 'application/epub+zip',
          'Content-Disposition': `attachment; filename="manuscript-${project.id}.epub"`,
          'Content-Length': bytes.length,
        })
        res.end(bytes)
        return
      }
      if (kind === 'docx') {
        const { bytes } = await buildCorrectedDocx(project)
        res.writeHead(200, {
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="manuscript-${project.id}.docx"`,
          'Content-Length': bytes.length,
        })
        res.end(Buffer.from(bytes))
        return
      }
      if (kind === 'pdf') {
        const { bytes, filename } = await buildPrintPdf(project)
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename || `manuscript-print-${project.id}.pdf`}"`,
          'Content-Length': bytes.length,
        })
        res.end(Buffer.from(bytes))
        return
      }
      if (kind === 'pdf-report') {
        const { bytes, filename } = await buildReportPdf(project)
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename || `report-${project.id}.pdf`}"`,
          'Content-Length': bytes.length,
        })
        res.end(Buffer.from(bytes))
        return
      }
      if (kind === 'txt') {
        const { text, filename } = buildPlainTextManuscript(project)
        res.writeHead(200, {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
        })
        res.end(text)
        return
      }
      if (kind === 'html') {
        const { html, filename } = buildEbookHtml(project)
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
        })
        res.end(html)
        return
      }
      if (kind === 'rtf') {
        const { text, filename } = buildRtfManuscript(project)
        res.writeHead(200, {
          'Content-Type': 'application/rtf',
          'Content-Disposition': `attachment; filename="${filename}"`,
        })
        res.end(text)
        return
      }
    }

    const jobMatch = path.match(/^\/v1\/jobs\/([^/]+)$/)
    if (req.method === 'GET' && jobMatch) {
      const job = store.getJob(jobMatch[1])
      if (!job) {
        sendError(res, 404, 'Job not found')
        return
      }
      sendJson(res, 200, { job })
      return
    }

    if (serveStatic(req, res)) return

    sendError(res, 404, 'Not found')
  } catch (err) {
    if (err?.name === 'ZodError') {
      sendError(res, 400, 'Invalid request', 'validation')
      return
    }
    console.error('[proofforge-api]', err)
    sendError(res, err.status || 500, err.message || 'Server error', err.code)
  }
})

server.listen(config.port, config.host, () => {
  console.info(`[proofforge-api] http://${config.host}:${config.port} llm=${config.llmProvider}`)
})
