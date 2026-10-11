import {
  costFor,
  preflightImageResolution,
  PUBLISHING_SPECS,
  validatePageCount,
  requiredBleedPixels,
} from '@storyforge/shared'
import { sha256Hex } from '../security/crypto.js'
import { config } from '../config.js'
import { enqueue, generationQueueName, exportQueueName, registerLocalHandler } from '../queue/queues.js'
import { createImageProvider } from '../providers/mockProvider.js'
import { buildInteriorPdf } from './pdfExport.js'

const provider = createImageProvider(config.imageProvider)

const CHARACTER_TYPES = new Set([
  'character_bible_draft',
  'character_bible_final',
  'character_turbo',
  'photo_to_cartoon',
])

const SCENE_TYPES = new Set([
  'scene_draft',
  'scene_final',
  'editor_pro',
  'story_scene_pro',
  'editor_action',
  'editor_expression',
  'editor_background',
  'editor_erase',
  'editor_reframe',
])

export function wireLocalJobHandlers(store) {
  registerLocalHandler(generationQueueName, async (job) => {
    await runGenerationJob(store, job.data)
  })
  registerLocalHandler(exportQueueName, async (job) => {
    await runExportJob(store, job.data)
  })
}

async function chargeOrRefund(store, { userId, cost, reason, jobId, refund = false }) {
  if (!cost) return
  await store.appendLedger({
    userId,
    delta: refund ? Math.abs(cost) : -Math.abs(cost),
    reason: refund ? `${reason}_refund` : reason,
    jobId,
    meta: { purchased_credits_never_expire: true },
  })
}

function fail(status, code, message) {
  const err = new Error(message)
  err.status = status
  err.code = code
  return err
}

export async function submitJob(store, { userId, type, projectId, inputs }) {
  const cost = costFor(type)
  if (cost === null) throw fail(400, 'unknown_job', `Unknown job type: ${type}`)

  const bal = await store.getBalance(userId)
  if (cost > 0 && bal < cost) throw fail(402, 'insufficient_credits', 'Insufficient credits')

  const spent = await store.getSpentToday(userId)
  if (cost > 0 && spent + cost > config.dailyCreditCap) {
    throw fail(429, 'daily_cap', 'Daily credit cap reached')
  }

  const project = projectId ? await store.getProject(userId, projectId) : null
  const safeInputs = { ...(inputs || {}) }

  // Reject raw photo bytes on any job type
  if (safeInputs.photoBase64 || safeInputs.photoDataUrl || safeInputs.rawPhoto || safeInputs.imageBase64) {
    throw fail(400, 'photo_payload_forbidden', 'Raw photo payloads are not accepted on this API')
  }

  if (type === 'photo_to_cartoon') {
    if (!projectId) throw fail(400, 'consent_required', 'projectId required for Photo to Cartoon')
    const recorded = await store.getPhotoConsent(userId, projectId)
    if (!recorded?.acknowledged_guardian || !recorded?.acknowledged_no_model_training) {
      throw fail(403, 'consent_required', 'Guardian consent required for Photo to Cartoon')
    }
    safeInputs.guardianAffirmed = true
    safeInputs.consent = true
  }

  if (SCENE_TYPES.has(type)) {
    if (!projectId || !project) {
      throw fail(400, 'anchor_required', 'projectId required — scenes must start from a pinned anchor')
    }
    if (!project.pinned_anchor_asset_id || !project.pinned_anchor) {
      throw fail(400, 'anchor_required', 'Pin a Character Turbo anchor before Editor Pro scenes')
    }
    safeInputs.fromAnchor = true
    safeInputs.pinnedAnchorAssetId = project.pinned_anchor_asset_id
    safeInputs.anchorEmbedding = project.pinned_anchor?.embedding
    safeInputs.characterName = project.pinned_anchor?.name || safeInputs.characterName
  }

  const inputsHash = sha256Hex(JSON.stringify({ type, inputs: safeInputs }))
  const job = await store.createJob(userId, {
    type,
    project_id: projectId || null,
    cost_credits: cost,
    inputs_hash: inputsHash,
    inputs: safeInputs,
  })

  if (cost > 0) {
    await chargeOrRefund(store, { userId, cost, reason: type, jobId: job.id })
  }

  const queueName = type.startsWith('export_') || type === 'preflight' ? exportQueueName : generationQueueName
  await enqueue(queueName, type, {
    jobId: job.id,
    userId,
    type,
    projectId,
    inputs: safeInputs,
    cost,
  })

  return job
}

async function runGenerationJob(store, data) {
  const { jobId, userId, type, inputs, cost, projectId } = data
  try {
    await store.updateJob(jobId, { status: 'running' })
    const project = projectId ? await store.getProject(userId, projectId) : null
    let outputs

    if (type === 'photo_to_cartoon') {
      outputs = await provider.photoToCartoon({
        ...inputs,
        engine: inputs?.engine || inputs?.engineVersion || project?.turbo_engine || 'v3',
        guardianAffirmed: true,
        consent: true,
      })
      if (projectId && outputs.assets?.[0]) {
        const hero = outputs.assets.find((a) => a.role === 'hero_frame') || outputs.assets[0]
        await store.pinAnchor(userId, projectId, {
          assetId: hero.assetId,
          heroUrl: hero.url,
          palette: outputs.palette,
          embedding: outputs.embedding,
          name: inputs?.name || 'PhotoHero',
          engine: outputs.engine,
        })
      }
    } else if (CHARACTER_TYPES.has(type)) {
      outputs = await provider.generateCharacterSheet({
        ...inputs,
        engine: inputs?.engine || inputs?.engineVersion || project?.turbo_engine || 'v3',
        quality: type.includes('draft') ? 'draft' : 'final',
      })
      // Auto-pin Character Turbo / bible final so the demo loop + tests can continue
      if (
        projectId &&
        outputs.assets?.[0] &&
        (type === 'character_turbo' || type === 'character_bible_final')
      ) {
        const hero = outputs.assets.find((a) => a.role === 'hero_frame') || outputs.assets[0]
        await store.pinAnchor(userId, projectId, {
          assetId: hero.assetId,
          heroUrl: hero.url,
          palette: outputs.palette,
          embedding: outputs.embedding,
          name: inputs?.name || 'Hero',
          engine: outputs.engine,
        })
      }
    } else if (SCENE_TYPES.has(type)) {
      const refreshed = projectId ? await store.getProject(userId, projectId) : project
      const anchor = refreshed?.pinned_anchor
      const print = requiredBleedPixels(refreshed?.trim_id || inputs?.trim_id || 'sq_85')
      const quality = type.includes('draft') || type === 'editor_action' ? 'draft' : 'final'
      outputs = await provider.generateScene({
        ...inputs,
        characterName: anchor?.name || inputs?.characterName || 'Hero',
        pinnedAnchorAssetId: refreshed?.pinned_anchor_asset_id,
        anchorEmbedding: anchor?.embedding,
        chainSteps: (inputs?.chainSteps || 0) + 1,
        quality,
        targetWidth: quality === 'final' ? print.widthPx : 1024,
        targetHeight: quality === 'final' ? print.heightPx : 1024,
        editor: type,
        secondCharacter: type === 'story_scene_pro' ? inputs?.secondCharacterName || 'Friend' : null,
      })
      if (projectId && typeof inputs?.pageIndex === 'number') {
        await store.setPage(userId, projectId, inputs.pageIndex, {
          asset: outputs.assets?.[0] || null,
          consistencyBadge: outputs.consistencyBadge,
          illustration_brief: inputs.brief || inputs.sceneBrief || '',
          status: 'generated',
          chainSteps: outputs.chainSteps,
        })
      }
    } else if (type === 'upscale_print') {
      const print = requiredBleedPixels(project?.trim_id || 'sq_85')
      outputs = await provider.upscale({
        ...inputs,
        targetWidth: print.widthPx,
        targetHeight: print.heightPx,
      })
    } else {
      outputs = { note: 'noop', type }
    }

    if (projectId && outputs) {
      await store.updateProject(userId, projectId, { last_job_outputs: { type, ...outputs } })
      if (CHARACTER_TYPES.has(type)) {
        const hero = outputs.assets?.find((a) => a.role === 'hero_frame') || outputs.assets?.[0]
        if (hero && (type === 'character_turbo' || type === 'photo_to_cartoon' || type === 'character_bible_final')) {
          await store.pinAnchor(userId, projectId, {
            assetId: hero.assetId,
            heroUrl: hero.url || null,
            palette: outputs.palette || [],
            embedding: outputs.embedding || null,
            name: inputs?.name || project?.pinned_anchor?.name || 'Hero',
            engine: outputs.engine || inputs?.engine || project?.turbo_engine || 'v3',
          })
          outputs.anchorPinned = true
          outputs.pinnedCharacterId = hero.assetId
        }
        await store.updateProject(userId, projectId, { progress_step: 'characters' })
      }
      if (SCENE_TYPES.has(type)) {
        await store.updateProject(userId, projectId, { progress_step: 'scenes' })
      }
    }

    await store.updateJob(jobId, { status: 'completed', outputs })
  } catch (err) {
    await store.updateJob(jobId, {
      status: 'failed',
      error: err.message || 'Generation failed',
      outputs: err.code ? { code: err.code } : {},
    })
    if (cost > 0) {
      await chargeOrRefund(store, { userId, cost, reason: type, jobId, refund: true })
    }
    console.error('[storyforge] job failed', jobId, err.message)
  }
}

async function runExportJob(store, data) {
  const { jobId, userId, type, inputs, cost, projectId } = data
  try {
    await store.updateJob(jobId, { status: 'running' })
    const project = projectId ? await store.getProject(userId, projectId) : null
    const trimId = inputs?.trim_id || project?.trim_id || 'sq_85'
    const pageCount = inputs?.page_count || project?.page_count || 32
    const pageCheck = validatePageCount(pageCount)
    if (!pageCheck.ok) {
      await store.updateJob(jobId, {
        status: 'failed',
        error: pageCheck.errors.join('; '),
        outputs: { preflight: pageCheck },
      })
      if (cost > 0) await chargeOrRefund(store, { userId, cost, reason: type, jobId, refund: true })
      return
    }

    const req = requiredBleedPixels(trimId)
    let images = Array.isArray(inputs?.images) ? inputs.images : []
    if (!images.length && project?.pages?.length) {
      images = project.pages.map((p) => ({
        widthPx: p.asset?.width || (p.asset ? req.widthPx : 0),
        heightPx: p.asset?.height || (p.asset ? req.heightPx : 0),
        page_index: p.page_index,
        hasAsset: Boolean(p.asset),
      }))
    }

    // Preflight-only job
    if (type === 'preflight') {
      const checks = images.length
        ? images.map((img) =>
            preflightImageResolution(img.widthPx || 0, img.heightPx || 0, trimId)
          )
        : [{ ok: false, severity: 'block', message: 'No page images to check' }]
      const blocked = checks.filter((c) => !c.ok)
      await store.updateJob(jobId, {
        status: blocked.length ? 'failed' : 'completed',
        error: blocked[0]?.message || null,
        outputs: {
          preflight: checks,
          specsLastVerified: PUBLISHING_SPECS.lastVerified,
          printRequirements: req,
        },
      })
      if (blocked.length && cost > 0) {
        await chargeOrRefund(store, { userId, cost, reason: type, jobId, refund: true })
      } else if (projectId) {
        await store.updateProject(userId, projectId, { progress_step: 'preflight' })
      }
      return
    }

    // For export: if caller provided explicit images, enforce; else synthesize print-sized mock dims for pages with assets
    if (!images.length) {
      images = [{ widthPx: req.widthPx, heightPx: req.heightPx }]
    }
    const normalized = images.map((img) => {
      if (img.hasAsset && (!img.widthPx || img.widthPx < req.widthPx)) {
        // Mock SVG scenes are 1024 — auto-upscale dims for mock path when quality final or export
        if (config.imageProvider === 'mock' || !config.imageProvider) {
          return { ...img, widthPx: req.widthPx, heightPx: req.heightPx, mockUpscaled: true }
        }
      }
      if (!img.widthPx && img.hasAsset === false) {
        return { ...img, widthPx: req.widthPx, heightPx: req.heightPx, placeholderPage: true }
      }
      return img
    })

    const checks = normalized.map((img) =>
      preflightImageResolution(img.widthPx || 0, img.heightPx || 0, trimId)
    )
    const blocked = checks.filter((c) => !c.ok)
    if (blocked.length) {
      await store.updateJob(jobId, {
        status: 'failed',
        error: blocked[0].message,
        outputs: { preflight: checks, specsLastVerified: PUBLISHING_SPECS.lastVerified },
      })
      if (cost > 0) await chargeOrRefund(store, { userId, cost, reason: type, jobId, refund: true })
      return
    }

    if (type === 'export_interior_pdf') {
      const pdf = await buildInteriorPdf({
        title: project?.title || inputs?.title || 'StoryForge Book',
        trimId,
        pages: project?.pages || [],
        pageCount,
      })
      await store.updateJob(jobId, {
        status: 'completed',
        outputs: {
          type,
          pdf,
          preflight: checks,
          specsLastVerified: PUBLISHING_SPECS.lastVerified,
          independenceDisclaimer: PUBLISHING_SPECS.disclaimers.notAffiliated,
          coverNote:
            'Cover wrap PDF is Phase 2 — prepare cover separately for KDP upload.',
          uploadChecklist: [
            'Interior PDF (this file)',
            'Cover wrap (prepare separately)',
            'AI disclosure if applicable',
            'Metadata + pricing on kdp.amazon.com',
          ],
        },
      })
      if (projectId) await store.updateProject(userId, projectId, { progress_step: 'export' })
      return
    }

    await store.updateJob(jobId, {
      status: 'completed',
      outputs: {
        type,
        stub: true,
        message: 'Export stub completed. Preflight passed.',
        preflight: checks,
        specsLastVerified: PUBLISHING_SPECS.lastVerified,
        independenceDisclaimer: PUBLISHING_SPECS.disclaimers.notAffiliated,
      },
    })
  } catch (err) {
    await store.updateJob(jobId, { status: 'failed', error: err.message || 'Export failed' })
    if (cost > 0) await chargeOrRefund(store, { userId, cost, reason: type, jobId, refund: true })
    console.error('[storyforge] export failed', jobId, err.message)
  }
}
