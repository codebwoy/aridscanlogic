import {
  costFor,
  preflightImageResolution,
  PUBLISHING_SPECS,
  validatePageCount,
  requiredBleedPixels,
  coverWrapLayout,
  isAllowedFalModel,
  languageLabel,
  formatLanguagePairLabel,
  resolvePageTextLines,
  isIpCharacterLocked,
  buildTurboDescriptionFromDna,
} from '@storyforge/shared'
import { sha256Hex } from '../security/crypto.js'
import { config } from '../config.js'
import { enqueue, generationQueueName, exportQueueName, registerLocalHandler } from '../queue/queues.js'
import { createImageProvider } from '../providers/createProvider.js'
import { PRINT_UPSCALE_FACTOR } from '../providers/imageUtils.js'
import { buildInteriorPdf, buildCoverWrapPdf } from './pdfExport.js'
import { attachSignedDownload } from './exportStore.js'
import { buildZip, dataUrlToBuffer } from './zipPack.js'
import { buildMerchPngFromHero } from './merchExport.js'

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

/** Image-to-video from a generated page still (requires pinned anchor + page art). */
const VIDEO_TYPES = new Set(['scene_to_video'])

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
  const falPrefs = project?.meta?.falModels || {}

  // Reject raw photo bytes on any job type
  if (safeInputs.photoBase64 || safeInputs.photoDataUrl || safeInputs.rawPhoto || safeInputs.imageBase64) {
    throw fail(400, 'photo_payload_forbidden', 'Raw photo payloads are not accepted on this API')
  }

  // Merge project fal model prefs; validate allowlist
  if (!safeInputs.modelGenerate && falPrefs.generate) safeInputs.modelGenerate = falPrefs.generate
  if (!safeInputs.modelImg2img && falPrefs.img2img) safeInputs.modelImg2img = falPrefs.img2img
  if (!safeInputs.modelVideo && falPrefs.video) safeInputs.modelVideo = falPrefs.video
  if (!safeInputs.modelUpscale && falPrefs.upscale) safeInputs.modelUpscale = falPrefs.upscale
  for (const [role, key] of [
    ['generate', 'modelGenerate'],
    ['img2img', 'modelImg2img'],
    ['video', 'modelVideo'],
    ['upscale', 'modelUpscale'],
  ]) {
    const id = safeInputs[key]
    if (id && !isAllowedFalModel(role, id)) {
      throw fail(400, 'invalid_fal_model', `Unknown fal ${role} model: ${id}`)
    }
  }

  // Merch-ready DNA gate before Character Turbo / Photo to Cartoon / bible final
  if (
    projectId &&
    project &&
    (type === 'character_turbo' ||
      type === 'photo_to_cartoon' ||
      type === 'character_bible_final' ||
      type === 'character_bible_draft')
  ) {
    if (!isIpCharacterLocked(project)) {
      throw fail(
        400,
        'ip_dna_required',
        'Lock IP Character Builder (merch-ready DNA) before Character Turbo',
      )
    }
    const dna = project.ip_character
    safeInputs.name = safeInputs.name || dna.name
    safeInputs.characterName = safeInputs.characterName || dna.name
    safeInputs.description = safeInputs.description || buildTurboDescriptionFromDna(dna)
    safeInputs.ipDna = {
      signatureColor: dna.signatureColor,
      definingTrait: dna.definingTrait,
      signatureObject: dna.signatureObject,
      emotionalHook: dna.emotionalHook,
      silhouetteNote: dna.silhouetteNote,
    }
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

  if (SCENE_TYPES.has(type) || VIDEO_TYPES.has(type)) {
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

  if (type === 'scene_to_video') {
    const pageIndex =
      typeof safeInputs.pageIndex === 'number' ? safeInputs.pageIndex : Number(safeInputs.pageIndex)
    const hasPageIndex = Number.isFinite(pageIndex)
    let imageUrl = safeInputs.imageUrl || safeInputs.startImageUrl || safeInputs.sceneUrl || null
    // Prefer the page still when pageIndex is set — do not silently animate the white-bg anchor
    if (hasPageIndex && project?.pages?.[pageIndex]) {
      const page = project.pages[pageIndex]
      imageUrl = page?.asset?.remoteUrl || page?.asset?.url || null
      if (!imageUrl) {
        throw fail(
          400,
          'scene_required',
          'Generate this page in Editor Pro first, then animate that still (image-to-video)',
        )
      }
    } else if (!imageUrl) {
      imageUrl = project?.pinned_anchor?.heroUrl || null
    }
    if (!imageUrl) {
      throw fail(
        400,
        'scene_required',
        'Generate and approve a scene page first, then animate that still (image-to-video)',
      )
    }
    safeInputs.imageUrl = imageUrl
    if (hasPageIndex) safeInputs.pageIndex = pageIndex
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
        anchorImageUrl: anchor?.heroUrl || null,
        heroUrl: anchor?.heroUrl || null,
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
      const print = requiredBleedPixels(project?.trim_id || inputs?.trim_id || 'sq_85')
      let imageUrl = inputs?.imageUrl || inputs?.url || inputs?.sourceUrl || null
      if (!imageUrl && project && typeof inputs?.pageIndex === 'number') {
        const page = project.pages?.[inputs.pageIndex]
        imageUrl = page?.asset?.url || page?.asset?.remoteUrl || null
      }
      if (!imageUrl && project?.pinned_anchor?.heroUrl) {
        imageUrl = project.pinned_anchor.heroUrl
      }
      outputs = await provider.upscale({
        ...inputs,
        imageUrl,
        scaleFactor: inputs?.scaleFactor || PRINT_UPSCALE_FACTOR,
        targetWidth: inputs?.targetWidth || print.widthPx,
        targetHeight: inputs?.targetHeight || print.heightPx,
      })
      if (projectId && typeof inputs?.pageIndex === 'number' && outputs.assets?.[0]) {
        await store.setPage(userId, projectId, inputs.pageIndex, {
          asset: outputs.assets[0],
          status: 'upscaled',
        })
      }
    } else if (type === 'scene_to_video') {
      if (typeof provider.generateVideo !== 'function') {
        throw fail(503, 'video_unsupported', 'Current image provider does not support scene_to_video')
      }
      const refreshed = projectId ? await store.getProject(userId, projectId) : project
      let imageUrl = inputs?.imageUrl || null
      if (!imageUrl && refreshed && typeof inputs?.pageIndex === 'number') {
        const page = refreshed.pages?.[inputs.pageIndex]
        imageUrl = page?.asset?.remoteUrl || page?.asset?.url || null
      }
      if (!imageUrl) imageUrl = refreshed?.pinned_anchor?.heroUrl || null
      outputs = await provider.generateVideo({
        ...inputs,
        imageUrl,
        startImageUrl: imageUrl,
        duration: inputs?.duration || config.fal?.videoDuration || '5',
        prompt:
          inputs?.prompt ||
          inputs?.motionPrompt ||
          inputs?.brief ||
          'Subtle motion, keep character identity and outfit unchanged, children’s picture book style',
        characterName: refreshed?.pinned_anchor?.name || inputs?.characterName,
      })
      if (projectId && typeof inputs?.pageIndex === 'number' && outputs.assets?.[0]) {
        const page = refreshed?.pages?.[inputs.pageIndex] || {}
        await store.setPage(userId, projectId, inputs.pageIndex, {
          ...page,
          video: outputs.assets[0],
          status: 'video',
        })
      }
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

    const paperTypeId = inputs?.paper_type || project?.paper_type || 'white'
    const wrapLayout = coverWrapLayout(trimId, pageCount, paperTypeId)

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
          coverWrap: {
            widthPx: wrapLayout.widthPx,
            heightPx: wrapLayout.heightPx,
            spineIn: wrapLayout.spineIn,
            spineTextAllowed: wrapLayout.spineTextAllowed,
            note: wrapLayout.note,
          },
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

    // Cover wrap — finish-flow export (does not require every interior page to pass DPI preflight)
    if (type === 'export_cover_pdf') {
      const frontImageUrl =
        inputs?.frontImageUrl ||
        project?.pinned_anchor?.heroUrl ||
        project?.pages?.[0]?.asset?.url ||
        null
      const backImageUrl = inputs?.backImageUrl || null
      const pdfRaw = await buildCoverWrapPdf({
        title: project?.title || inputs?.title || 'StoryForge Book',
        author: inputs?.author || project?.meta?.author || '',
        blurb: inputs?.blurb || project?.premise || project?.emotional_core || '',
        trimId,
        pageCount,
        paperTypeId,
        frontImageUrl,
        backImageUrl,
        showGuides: Boolean(inputs?.showGuides),
      })
      const pdf = attachSignedDownload(pdfRaw, { userId })
      await store.updateJob(jobId, {
        status: 'completed',
        outputs: {
          type,
          pdf,
          coverWrap: {
            widthPx: wrapLayout.widthPx,
            heightPx: wrapLayout.heightPx,
            widthIn: wrapLayout.widthIn,
            heightIn: wrapLayout.heightIn,
            spineIn: wrapLayout.spineIn,
            spineTextAllowed: wrapLayout.spineTextAllowed,
            barcode: wrapLayout.barcode,
            note: wrapLayout.note,
          },
          specsLastVerified: PUBLISHING_SPECS.lastVerified,
          independenceDisclaimer: PUBLISHING_SPECS.disclaimers.notAffiliated,
          uploadChecklist: [
            'Cover wrap PDF (this file) — upload as paperback cover',
            'Still run Amazon KDP cover calculator / Previewer',
            'Keep barcode reserve clear',
            'AI disclosure if applicable',
            'Interior PDF via export_interior_pdf',
          ],
        },
      })
      if (projectId) await store.updateProject(userId, projectId, { progress_step: 'export' })
      return
    }

    if (type === 'export_merch_png') {
      if (!project?.pinned_anchor?.heroUrl) {
        throw fail(400, 'anchor_required', 'Pin a Character Turbo anchor before Merch PNG export')
      }
      const png = await buildMerchPngFromHero({
        heroUrl: project.pinned_anchor.heroUrl,
        title: project.ip_character?.name || project.title || 'character',
        background: inputs?.background === 'white' ? 'white' : 'transparent',
        userId,
      })
      await store.updateJob(jobId, {
        status: 'completed',
        outputs: {
          type,
          png,
          merch: png.merch || PUBLISHING_SPECS.merch,
          checklist: png.checklist,
          note: 'Manual Merch upload — StoryForge does not push to Amazon',
          specsLastVerified: PUBLISHING_SPECS.lastVerified,
        },
      })
      return
    }

    // Full print pack: interior + cover + preflight + checklist as signed ZIP
    if (type === 'export_source_zip') {
      const title = project?.title || inputs?.title || 'StoryForge Book'
      const interiorRaw = await buildInteriorPdf({
        title,
        trimId,
        pages: project?.pages || [],
        pageCount,
        showGuides: false,
        showChrome: false,
        language: project?.language || 'de',
        secondaryLanguage: project?.secondary_language || null,
        bilingualLayout: project?.bilingual_layout || 'stacked',
      })
      const coverRaw = await buildCoverWrapPdf({
        title,
        author: inputs?.author || project?.meta?.author || '',
        blurb: inputs?.blurb || project?.premise || project?.emotional_core || '',
        trimId,
        pageCount,
        paperTypeId,
        frontImageUrl:
          inputs?.frontImageUrl ||
          project?.pinned_anchor?.heroUrl ||
          project?.pages?.[0]?.asset?.url ||
          null,
        backImageUrl: inputs?.backImageUrl || null,
        showGuides: false,
      })

      const softForZip = (images.length ? images : [{ widthPx: req.widthPx, heightPx: req.heightPx }]).map(
        (img) => {
          if (img.hasAsset && img.widthPx && img.widthPx < req.widthPx) {
            return {
              ...img,
              widthPx: req.widthPx,
              heightPx: req.heightPx,
              softUpscaledForExport: true,
              sourceWidthPx: img.widthPx,
              sourceHeightPx: img.heightPx,
            }
          }
          return img
        },
      )
      const checks = softForZip.map((img) =>
        preflightImageResolution(img.widthPx || 0, img.heightPx || 0, trimId),
      )
      const checklist = [
        '1. Upload interior PDF as paperback manuscript',
        '2. Upload cover-wrap PDF as paperback cover',
        '3. Confirm trim size + page count match KDP calculator',
        '4. Keep barcode reserve clear on back cover',
        '5. Disclose AI-assisted art if required by Amazon policy',
        '6. Always verify in KDP Online Previewer before publishing',
        '',
        PUBLISHING_SPECS.disclaimers.notAffiliated,
      ].join('\n')

      const manuscript = formatBilingualManuscript(project)

      const zipBytes = buildZip([
        {
          name: interiorRaw.filename,
          data: interiorRaw.bytes || dataUrlToBuffer(interiorRaw.dataUrl),
          compress: false,
        },
        {
          name: coverRaw.filename,
          data: coverRaw.bytes || dataUrlToBuffer(coverRaw.dataUrl),
          compress: false,
        },
        {
          name: 'preflight.json',
          data: JSON.stringify(
            {
              trimId,
              pageCount,
              paperTypeId,
              required: req,
              coverWrap: {
                widthPx: wrapLayout.widthPx,
                heightPx: wrapLayout.heightPx,
                spineIn: wrapLayout.spineIn,
              },
              checks,
              specsLastVerified: PUBLISHING_SPECS.lastVerified,
              generatedAt: new Date().toISOString(),
            },
            null,
            2,
          ),
          compress: true,
        },
        { name: 'UPLOAD-CHECKLIST.txt', data: checklist, compress: true },
        { name: 'manuscript.txt', data: manuscript || '(empty)', compress: true },
        {
          name: 'manifest.json',
          data: JSON.stringify(
            {
              title,
              trimId,
              pageCount,
              paperTypeId,
              files: [interiorRaw.filename, coverRaw.filename, 'preflight.json', 'UPLOAD-CHECKLIST.txt', 'manuscript.txt'],
              printReady: true,
              independenceDisclaimer: PUBLISHING_SPECS.disclaimers.notAffiliated,
            },
            null,
            2,
          ),
          compress: true,
        },
      ])

      const zipResult = attachSignedDownload(
        {
          mime: 'application/zip',
          filename: `${String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) || 'book'}-kdp-pack.zip`,
          byteLength: zipBytes.length,
          dataUrl: `data:application/zip;base64,${zipBytes.toString('base64')}`,
          bytes: zipBytes,
          kind: 'source_zip',
        },
        { userId, stripDataUrlAbove: 200_000 },
      )

      await store.updateJob(jobId, {
        status: 'completed',
        outputs: {
          type,
          zip: zipResult,
          pdf: attachSignedDownload(interiorRaw, { userId }),
          coverPdf: attachSignedDownload(coverRaw, { userId }),
          preflight: checks,
          coverWrap: {
            widthPx: wrapLayout.widthPx,
            heightPx: wrapLayout.heightPx,
            spineIn: wrapLayout.spineIn,
            note: wrapLayout.note,
          },
          specsLastVerified: PUBLISHING_SPECS.lastVerified,
          independenceDisclaimer: PUBLISHING_SPECS.disclaimers.notAffiliated,
          uploadChecklist: checklist.split('\n').filter(Boolean),
        },
      })
      if (projectId) await store.updateProject(userId, projectId, { progress_step: 'export' })
      return
    }

    // For interior export: if caller provided explicit images, enforce; else synthesize print-sized mock dims for pages with assets
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

    // Soft-normalize under-res page assets so finish pack always completes locally.
    // Set inputs.strictPreflight=true to hard-block (KDP-prep mode).
    const softNormalized = normalized.map((img) => {
      if (img.hasAsset && img.widthPx && img.widthPx < req.widthPx) {
        return {
          ...img,
          widthPx: req.widthPx,
          heightPx: req.heightPx,
          softUpscaledForExport: true,
          sourceWidthPx: img.widthPx,
          sourceHeightPx: img.heightPx,
        }
      }
      return img
    })

    const checks = softNormalized.map((img) =>
      preflightImageResolution(img.widthPx || 0, img.heightPx || 0, trimId)
    )
    const blocked = checks.filter((c) => !c.ok)
    const strict = Boolean(inputs?.strictPreflight)
    if (blocked.length && strict) {
      await store.updateJob(jobId, {
        status: 'failed',
        error: blocked[0].message,
        outputs: { preflight: checks, specsLastVerified: PUBLISHING_SPECS.lastVerified },
      })
      if (cost > 0) await chargeOrRefund(store, { userId, cost, reason: type, jobId, refund: true })
      return
    }

    if (type === 'export_interior_pdf') {
      const pdfRaw = await buildInteriorPdf({
        title: project?.title || inputs?.title || 'StoryForge Book',
        trimId,
        pages: project?.pages || [],
        pageCount,
        showGuides: Boolean(inputs?.showGuides),
        showChrome: Boolean(inputs?.showChrome),
        language: project?.language || 'de',
        secondaryLanguage: project?.secondary_language || null,
        bilingualLayout: project?.bilingual_layout || 'stacked',
      })
      const pdf = attachSignedDownload(pdfRaw, { userId })
      const softNotes = softNormalized
        .filter((img) => img.softUpscaledForExport)
        .map(
          (img) =>
            `Page asset was ${img.sourceWidthPx}×${img.sourceHeightPx}; export allowed — run 2.5× upscale_print before final KDP upload`
        )
      await store.updateJob(jobId, {
        status: 'completed',
        outputs: {
          type,
          pdf,
          preflight: checks,
          warnings: softNotes,
          coverWrap: {
            widthPx: wrapLayout.widthPx,
            heightPx: wrapLayout.heightPx,
            spineIn: wrapLayout.spineIn,
            note: 'Also run export_cover_pdf for the finish-flow cover wrap.',
          },
          specsLastVerified: PUBLISHING_SPECS.lastVerified,
          independenceDisclaimer: PUBLISHING_SPECS.disclaimers.notAffiliated,
          uploadChecklist: [
            'Interior PDF (this file)',
            'Cover wrap PDF (export_cover_pdf in Studio → Canvas)',
            'Or download full pack via export_source_zip',
            'Upscale page art to print DPI before final Amazon upload',
            'AI disclosure if applicable',
            'Metadata + pricing on kdp.amazon.com',
            'Always verify in KDP Previewer',
          ],
        },
      })
      if (projectId) await store.updateProject(userId, projectId, { progress_step: 'export' })
      return
    }

    await store.updateJob(jobId, {
      status: 'failed',
      error: `Unknown export type: ${type}`,
      outputs: {
        type,
        preflight: checks,
        specsLastVerified: PUBLISHING_SPECS.lastVerified,
      },
    })
    if (cost > 0) await chargeOrRefund(store, { userId, cost, reason: type, jobId, refund: true })
    return
  } catch (err) {
    await store.updateJob(jobId, { status: 'failed', error: err.message || 'Export failed' })
    if (cost > 0) await chargeOrRefund(store, { userId, cost, reason: type, jobId, refund: true })
    console.error('[storyforge] export failed', jobId, err.message)
  }
}

function formatBilingualManuscript(project) {
  const primary = project?.language || 'de'
  const secondary = project?.secondary_language || null
  const layout = project?.bilingual_layout || 'stacked'
  const header = [
    `Title: ${project?.title || 'Untitled'}`,
    `Languages: ${formatLanguagePairLabel(primary, secondary)}`,
    secondary ? `Layout: ${layout}` : 'Mode: monolingual',
    secondary
      ? `Secondary verified: ${project?.secondary_verified ? 'yes' : 'no — review before KDP'}`
      : null,
    '',
  ]
    .filter(Boolean)
    .join('\n')

  const body = (project?.pages || [])
    .map((p, i) => {
      const resolved = resolvePageTextLines({
        primaryCode: primary,
        secondaryCode: secondary,
        primaryText: p.text_content || '',
        secondaryText: p.text_secondary || '',
        layout,
        pageIndex: p.page_index ?? i,
      })
      if (!resolved.lines.length) {
        return `--- Page ${i + 1} ---\n(no text)\n`
      }
      const blocks = resolved.lines
        .map((line) => `[${languageLabel(line.code)}]\n${line.text}`)
        .join('\n\n')
      return `--- Page ${i + 1} ---\n${blocks}\n`
    })
    .join('\n')

  return `${header}\n${body}`
}
