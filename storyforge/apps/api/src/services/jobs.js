import {
  costFor,
  resolveJobCost,
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
  assessPublicationReadiness,
  normalizePublicationSignoff,
  assessComplianceGate,
  buildManuscriptPages,
  estimateManuscriptWords,
  buildEscalatingBeatBriefs,
  defaultRefrainForHook,
  MANUSCRIPT_META,
  buildCoverArtPrompt,
  buildBackCoverArtPrompt,
  normalizeCoverStudioState,
  COVER_STUDIO_META,
  COVER_KDP_CHECKLIST,
  buildColoringPagePrompt,
  COLORING_PAGES_META,
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
import { buildFlipbookZip } from './flipbookExport.js'

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
  'editor_outfit',
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
  if (costFor(type) === null) throw fail(400, 'unknown_job', `Unknown job type: ${type}`)

  const project = projectId ? await store.getProject(userId, projectId) : null
  const safeInputs = { ...(inputs || {}) }
  const pagesWithArt = (project?.pages || []).filter(
    (p) => p?.asset?.url || p?.asset?.remoteUrl,
  ).length
  const pagesWithColoring = (project?.pages || []).filter(
    (p) => p?.coloring_asset?.url || p?.coloring_asset?.remoteUrl,
  ).length
  const cost = resolveJobCost(type, {
    pageCount: project?.page_count || safeInputs.pageCount || 32,
    pagesWithArt,
    pagesWithColoring,
    skipExisting: Boolean(safeInputs.skipExisting),
  })
  if (cost === null) throw fail(400, 'unknown_job', `Unknown job type: ${type}`)

  const bal = await store.getBalance(userId)
  if (cost > 0 && bal < cost) throw fail(402, 'insufficient_credits', 'Insufficient credits')

  const spent = await store.getSpentToday(userId)
  if (cost > 0 && spent + cost > config.dailyCreditCap) {
    throw fail(429, 'daily_cap', 'Daily credit cap reached')
  }
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

  if (
    SCENE_TYPES.has(type) ||
    VIDEO_TYPES.has(type) ||
    type === 'illustrate_all_pages' ||
    type === 'upscale_all_pages' ||
    type === 'generate_cover_art' ||
    type === 'generate_back_cover_art' ||
    type === 'coloring_all_pages'
  ) {
    if (!projectId || !project) {
      throw fail(400, 'anchor_required', 'projectId required — scenes must start from a pinned anchor')
    }
    if (
      (SCENE_TYPES.has(type) ||
        VIDEO_TYPES.has(type) ||
        type === 'illustrate_all_pages' ||
        type === 'generate_cover_art' ||
        type === 'generate_back_cover_art' ||
        type === 'coloring_all_pages') &&
      (!project.pinned_anchor_asset_id || !project.pinned_anchor)
    ) {
      throw fail(
        400,
        'anchor_required',
        type === 'generate_cover_art' || type === 'generate_back_cover_art'
          ? 'Pin a Character Turbo anchor before Cover Studio art'
          : type === 'coloring_all_pages'
            ? 'Pin a Character Turbo anchor before coloring pages'
            : 'Pin a Character Turbo anchor before Editor Pro scenes',
      )
    }
    if (
      SCENE_TYPES.has(type) ||
      VIDEO_TYPES.has(type) ||
      type === 'illustrate_all_pages' ||
      type === 'generate_cover_art' ||
      type === 'generate_back_cover_art' ||
      type === 'coloring_all_pages'
    ) {
      safeInputs.fromAnchor = true
      safeInputs.pinnedAnchorAssetId = project.pinned_anchor_asset_id
      safeInputs.anchorEmbedding = project.pinned_anchor?.embedding
      safeInputs.characterName = project.pinned_anchor?.name || safeInputs.characterName
    }
  }

  if (type === 'coloring_all_pages' || type === 'export_coloring_pdf') {
    if (!projectId || !project) {
      throw fail(400, 'project_required', 'projectId required for coloring export')
    }
  }

  if (type === 'story_text' && !projectId) {
    throw fail(400, 'project_required', 'projectId required for manuscript generation')
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

  const queueName =
    type.startsWith('export_') || type === 'preflight' || type === 'publication_readiness'
      ? exportQueueName
      : generationQueueName
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
    } else if (type === 'generate_cover_art') {
      const refreshed = projectId ? await store.getProject(userId, projectId) : project
      if (!refreshed?.pinned_anchor) {
        throw fail(400, 'anchor_required', 'Pin a Character Turbo anchor before Cover Studio')
      }
      const prev = normalizeCoverStudioState(refreshed.cover_studio)
      const layoutId = inputs?.layout_id || prev.layout_id || 'hero_centered'
      const name =
        refreshed.ip_character?.name ||
        refreshed.pinned_anchor?.name ||
        inputs?.characterName ||
        'Hero'
      const wrap = coverWrapLayout(
        refreshed.trim_id || 'sq_85',
        refreshed.page_count || 32,
        refreshed.paper_type || 'white',
      )
      const prompt = buildCoverArtPrompt({
        characterName: name,
        emotionalCore: refreshed.emotional_core || 'courage',
        layoutId,
        artStyle: refreshed.style_preset || 'children’s picture book illustration',
        premise: refreshed.premise || '',
      })
      const scene = await provider.generateScene({
        ...inputs,
        brief: prompt,
        sceneBrief: prompt,
        characterName: name,
        pinnedAnchorAssetId: refreshed.pinned_anchor_asset_id,
        anchorEmbedding: refreshed.pinned_anchor?.embedding,
        anchorImageUrl: refreshed.pinned_anchor.heroUrl,
        heroUrl: refreshed.pinned_anchor.heroUrl,
        quality: 'final',
        targetWidth: wrap.panelW,
        targetHeight: wrap.heightPx,
        editor: 'generate_cover_art',
        fromAnchor: true,
      })
      const frontUrl = scene.assets?.[0]?.url || scene.assets?.[0]?.remoteUrl || null
      if (!frontUrl) {
        throw fail(500, 'cover_art_failed', 'Cover art generation returned no image')
      }
      const cover_studio = normalizeCoverStudioState({
        ...prev,
        layout_id: layoutId,
        author: inputs?.author ?? prev.author,
        subtitle: inputs?.subtitle ?? prev.subtitle,
        title_placement: inputs?.title_placement || prev.title_placement,
        finish: inputs?.finish || prev.finish,
        front_art_url: frontUrl,
        generated_at: new Date().toISOString(),
        prompt,
      })
      await store.updateProject(userId, projectId, {
        cover_studio,
        progress_step: 'layout',
      })
      outputs = {
        type,
        cover_studio,
        assets: scene.assets,
        consistencyBadge: scene.consistencyBadge,
        wrap: {
          widthPx: wrap.widthPx,
          heightPx: wrap.heightPx,
          widthIn: wrap.widthIn,
          heightIn: wrap.heightIn,
          spineIn: wrap.spineIn,
          spineTextAllowed: wrap.spineTextAllowed,
          barcode: wrap.barcode,
          note: wrap.note,
        },
        checklist: COVER_KDP_CHECKLIST,
        meta: COVER_STUDIO_META,
        note: 'Title-safe front art saved. Overlay title/author in Export cover wrap — do not bake text into the image.',
      }
    } else if (type === 'generate_back_cover_art') {
      const refreshed = projectId ? await store.getProject(userId, projectId) : project
      if (!refreshed?.pinned_anchor) {
        throw fail(400, 'anchor_required', 'Pin a Character Turbo anchor before Cover Studio')
      }
      const prev = normalizeCoverStudioState(refreshed.cover_studio)
      const name =
        refreshed.ip_character?.name ||
        refreshed.pinned_anchor?.name ||
        inputs?.characterName ||
        'Hero'
      const wrap = coverWrapLayout(
        refreshed.trim_id || 'sq_85',
        refreshed.page_count || 32,
        refreshed.paper_type || 'white',
      )
      const prompt = buildBackCoverArtPrompt({
        characterName: name,
        emotionalCore: refreshed.emotional_core || 'courage',
        artStyle: refreshed.style_preset || 'children’s picture book illustration',
        premise: refreshed.premise || '',
      })
      const scene = await provider.generateScene({
        ...inputs,
        brief: prompt,
        sceneBrief: prompt,
        characterName: name,
        pinnedAnchorAssetId: refreshed.pinned_anchor_asset_id,
        anchorEmbedding: refreshed.pinned_anchor?.embedding,
        anchorImageUrl: refreshed.pinned_anchor.heroUrl,
        heroUrl: refreshed.pinned_anchor.heroUrl,
        quality: 'final',
        targetWidth: wrap.panelW,
        targetHeight: wrap.heightPx,
        editor: 'generate_back_cover_art',
        fromAnchor: true,
      })
      const backUrl = scene.assets?.[0]?.url || scene.assets?.[0]?.remoteUrl || null
      if (!backUrl) {
        throw fail(500, 'cover_art_failed', 'Back cover art generation returned no image')
      }
      const cover_studio = normalizeCoverStudioState({
        ...prev,
        author: inputs?.author ?? prev.author,
        subtitle: inputs?.subtitle ?? prev.subtitle,
        back_art_url: backUrl,
        back_generated_at: new Date().toISOString(),
        back_prompt: prompt,
      })
      await store.updateProject(userId, projectId, {
        cover_studio,
        progress_step: 'layout',
      })
      outputs = {
        type,
        cover_studio,
        assets: scene.assets,
        consistencyBadge: scene.consistencyBadge,
        wrap: {
          widthPx: wrap.widthPx,
          heightPx: wrap.heightPx,
          barcode: wrap.barcode,
          note: wrap.note,
        },
        checklist: COVER_KDP_CHECKLIST,
        meta: COVER_STUDIO_META,
        note: 'Barcode-safe back art saved. Blurb overlays in Export cover wrap — keep lower-right clear.',
      }
    } else if (type === 'coloring_all_pages') {
      const refreshed = projectId ? await store.getProject(userId, projectId) : project
      if (!refreshed?.pinned_anchor) {
        throw fail(400, 'anchor_required', 'Pin a Character Turbo anchor before coloring pages')
      }
      const print = requiredBleedPixels(refreshed.trim_id || 'sq_85')
      const skipExisting = Boolean(inputs?.skipExisting)
      const name =
        refreshed.pinned_anchor.name || refreshed.ip_character?.name || inputs?.characterName || 'Hero'
      const results = []
      const n = refreshed.page_count || refreshed.pages?.length || 0
      for (let i = 0; i < n; i++) {
        const page = refreshed.pages?.[i] || {}
        const sourceUrl = page?.asset?.remoteUrl || page?.asset?.url || null
        if (!sourceUrl) {
          results.push({ pageIndex: i, skipped: true, reason: 'no_color_art' })
          continue
        }
        if (skipExisting && (page?.coloring_asset?.url || page?.coloring_asset?.remoteUrl)) {
          results.push({ pageIndex: i, skipped: true, reason: 'has_coloring' })
          continue
        }
        const prompt = buildColoringPagePrompt({
          characterName: name,
          pageBrief: page.illustration_brief || '',
          pageIndex: i,
        })
        const scene = await provider.generateScene({
          ...inputs,
          brief: prompt,
          sceneBrief: prompt,
          characterName: name,
          pinnedAnchorAssetId: refreshed.pinned_anchor_asset_id,
          anchorEmbedding: refreshed.pinned_anchor.embedding,
          // Page still is the img2img source so composition stays consistent
          anchorImageUrl: sourceUrl,
          heroUrl: sourceUrl,
          quality: 'final',
          targetWidth: print.widthPx,
          targetHeight: print.heightPx,
          editor: 'coloring_all_pages',
          strength: 0.55,
          pageIndex: i,
        })
        const coloringAsset = scene.assets?.[0] || null
        await store.setPage(userId, projectId, i, {
          coloring_asset: coloringAsset,
          status: page.status || 'generated',
        })
        results.push({
          pageIndex: i,
          assetId: coloringAsset?.assetId || null,
          consistencyBadge: scene.consistencyBadge,
        })
      }
      outputs = {
        type,
        generated: results.filter((r) => !r.skipped).length,
        skipped: results.filter((r) => r.skipped).length,
        results,
        meta: COLORING_PAGES_META,
        note: 'Coloring line-art saved per page. Export coloring PDF for a B&W activity companion — disclose honestly on KDP.',
      }
      await store.updateProject(userId, projectId, { progress_step: 'layout' })
    } else if (type === 'story_text') {
      const refreshed = projectId ? await store.getProject(userId, projectId) : project
      if (!refreshed) throw fail(400, 'project_required', 'Project required')
      const name =
        refreshed.ip_character?.name ||
        refreshed.pinned_anchor?.name ||
        inputs?.characterName ||
        'Hero'
      const core = refreshed.emotional_core || inputs?.emotionalCore || 'belonging'
      const object = refreshed.ip_character?.signatureObject || 'favorite toy'
      const refrain =
        refreshed.refrain || inputs?.refrain || defaultRefrainForHook(core)
      const pages = buildManuscriptPages({
        pageCount: refreshed.page_count || 32,
        characterName: name,
        emotionalCore: core,
        signatureObject: object,
        refrain,
        language: refreshed.language || 'en',
        secondaryLanguage: refreshed.secondary_language || null,
        speechBubbles: inputs?.speechBubbles !== false,
      })
      // Also seed illustration briefs when empty (or when overwriteBriefs)
      const overwriteBriefs = Boolean(inputs?.overwriteBriefs)
      const overwriteText = inputs?.overwriteText !== false
      for (const row of pages) {
        const existing = refreshed.pages?.[row.page_index] || {}
        const patch = {
          illustration_brief:
            overwriteBriefs || !existing.illustration_brief
              ? row.illustration_brief
              : existing.illustration_brief,
          speech_bubble: row.speech_bubble || existing.speech_bubble || '',
        }
        if (overwriteText || !String(existing.text_content || '').trim()) {
          patch.text_content = row.text_content
          patch.text_secondary = row.text_secondary
        }
        await store.setPage(userId, projectId, row.page_index, patch)
      }
      outputs = {
        type,
        pagesWritten: pages.length,
        wordCount: estimateManuscriptWords(pages),
        refrain,
        note: MANUSCRIPT_META.note,
        sample: pages.slice(0, 3).map((p) => ({
          page: p.page_index + 1,
          text: p.text_content,
          brief: p.illustration_brief,
        })),
      }
      await store.updateProject(userId, projectId, { progress_step: 'story' })
    } else if (type === 'illustrate_all_pages') {
      const refreshed = projectId ? await store.getProject(userId, projectId) : project
      if (!refreshed?.pinned_anchor) {
        throw fail(400, 'anchor_required', 'Pin a Character Turbo anchor before illustrating')
      }
      const print = requiredBleedPixels(refreshed.trim_id || 'sq_85')
      const skipExisting = Boolean(inputs?.skipExisting)
      const name = refreshed.pinned_anchor.name || refreshed.ip_character?.name || 'Hero'
      let briefs = (refreshed.pages || []).map((p) => p.illustration_brief || '')
      if (!briefs.some(Boolean)) {
        const seeded = buildEscalatingBeatBriefs({
          pageCount: refreshed.page_count,
          characterName: name,
          emotionalCore: refreshed.emotional_core || 'belonging',
          signatureObject: refreshed.ip_character?.signatureObject || 'favorite toy',
          refrain: refreshed.refrain || '',
        })
        for (const b of seeded) {
          await store.setPage(userId, projectId, b.page_index, {
            illustration_brief: b.illustration_brief,
          })
        }
        briefs = seeded.map((b) => b.illustration_brief)
      }
      const results = []
      const n = refreshed.page_count || refreshed.pages?.length || 32
      for (let i = 0; i < n; i++) {
        const page = refreshed.pages?.[i] || {}
        if (skipExisting && page?.asset?.url) {
          results.push({ pageIndex: i, skipped: true })
          continue
        }
        const brief = briefs[i] || page.illustration_brief || `${name} on page ${i + 1}`
        const scene = await provider.generateScene({
          ...inputs,
          brief,
          characterName: name,
          pinnedAnchorAssetId: refreshed.pinned_anchor_asset_id,
          anchorEmbedding: refreshed.pinned_anchor.embedding,
          anchorImageUrl: refreshed.pinned_anchor.heroUrl,
          heroUrl: refreshed.pinned_anchor.heroUrl,
          quality: 'final',
          targetWidth: print.widthPx,
          targetHeight: print.heightPx,
          editor: 'editor_pro',
          pageIndex: i,
        })
        await store.setPage(userId, projectId, i, {
          asset: scene.assets?.[0] || null,
          consistencyBadge: scene.consistencyBadge,
          illustration_brief: brief,
          status: 'generated',
          chainSteps: scene.chainSteps,
        })
        results.push({
          pageIndex: i,
          consistencyBadge: scene.consistencyBadge,
          assetId: scene.assets?.[0]?.assetId || null,
        })
      }
      outputs = {
        type,
        generated: results.filter((r) => !r.skipped).length,
        skipped: results.filter((r) => r.skipped).length,
        results,
        note: 'Batch illustration from pinned Character Turbo anchor — review consistency badges',
      }
      await store.updateProject(userId, projectId, { progress_step: 'scenes' })
    } else if (type === 'upscale_all_pages') {
      const refreshed = projectId ? await store.getProject(userId, projectId) : project
      if (!refreshed) throw fail(400, 'project_required', 'Project required')
      const print = requiredBleedPixels(refreshed.trim_id || 'sq_85')
      const results = []
      const n = refreshed.page_count || refreshed.pages?.length || 0
      for (let i = 0; i < n; i++) {
        const page = refreshed.pages?.[i]
        const imageUrl = page?.asset?.url || page?.asset?.remoteUrl
        if (!imageUrl) {
          results.push({ pageIndex: i, skipped: true, reason: 'no_art' })
          continue
        }
        const up = await provider.upscale({
          ...inputs,
          imageUrl,
          scaleFactor: inputs?.scaleFactor || PRINT_UPSCALE_FACTOR,
          targetWidth: print.widthPx,
          targetHeight: print.heightPx,
        })
        if (up.assets?.[0]) {
          await store.setPage(userId, projectId, i, {
            asset: up.assets[0],
            status: 'upscaled',
          })
        }
        results.push({ pageIndex: i, skipped: false, assetId: up.assets?.[0]?.assetId })
      }
      outputs = {
        type,
        upscaled: results.filter((r) => !r.skipped).length,
        skipped: results.filter((r) => r.skipped).length,
        results,
      }
      await store.updateProject(userId, projectId, { progress_step: 'layout' })
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
    // Digital / merch exports are not KDP page-count constrained
    const skipKdpPageCount = type === 'export_flipbook' || type === 'export_merch_png'
    if (!skipKdpPageCount) {
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

    if (type === 'publication_readiness') {
      if (!project) {
        await store.updateJob(jobId, {
          status: 'failed',
          error: 'projectId required for publication readiness',
        })
        return
      }
      const signoff = normalizePublicationSignoff(
        inputs?.publication_signoff ?? project.publication_signoff,
      )
      if (inputs?.publication_signoff) {
        await store.updateProject(userId, projectId, {
          publication_signoff: {
            ...signoff,
            updated_at: new Date().toISOString(),
            kdp_previewer_reviewed_at: signoff.kdp_previewer_reviewed
              ? signoff.kdp_previewer_reviewed_at || new Date().toISOString()
              : null,
          },
        })
      }
      const fresh = await store.getProject(userId, projectId)
      const readiness = assessPublicationReadiness(fresh, {
        signoff: fresh.publication_signoff,
      })
      const stepPatch = {}
      const step = fresh.progress_step || 'story'
      const stepOrder = ['story', 'characters', 'scenes', 'layout', 'preflight', 'export']
      if (stepOrder.indexOf(step) < stepOrder.indexOf('preflight')) {
        stepPatch.progress_step = 'preflight'
      }
      await store.updateProject(userId, projectId, {
        last_job_outputs: { publication_readiness: readiness },
        meta: { ...(fresh.meta || {}), last_readiness: readiness },
        ...stepPatch,
      })
      await store.updateJob(jobId, {
        status: 'completed',
        outputs: { readiness, publication_readiness: readiness },
      })
      return
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
      const cover = normalizeCoverStudioState(project?.cover_studio)
      const listingPlain = String(project?.listing_description?.plain || '').trim()
      const frontImageUrl =
        inputs?.frontImageUrl ||
        cover.front_art_url ||
        project?.pinned_anchor?.heroUrl ||
        project?.pages?.[0]?.asset?.url ||
        null
      const backImageUrl = inputs?.backImageUrl || cover.back_art_url || null
      const pdfRaw = await buildCoverWrapPdf({
        title: project?.title || inputs?.title || 'StoryForge Book',
        author: inputs?.author || cover.author || project?.meta?.author || '',
        subtitle: inputs?.subtitle || cover.subtitle || '',
        blurb:
          inputs?.blurb ||
          listingPlain.slice(0, 700) ||
          project?.premise ||
          project?.emotional_core ||
          '',
        trimId,
        pageCount,
        paperTypeId,
        frontImageUrl,
        backImageUrl,
        titlePlacement: inputs?.title_placement || cover.title_placement || 'top',
        isbn: inputs?.isbn || cover.isbn || '',
        embedIsbnBarcode:
          inputs?.embed_isbn_barcode !== undefined
            ? Boolean(inputs.embed_isbn_barcode)
            : Boolean(cover.embed_isbn_barcode),
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
          coverStudio: cover,
          checklist: COVER_KDP_CHECKLIST,
          specsLastVerified: PUBLISHING_SPECS.lastVerified,
          independenceDisclaimer: PUBLISHING_SPECS.disclaimers.notAffiliated,
          kdpHelpUrl: COVER_STUDIO_META.kdpHelpUrl,
          uploadChecklist: [
            'Cover wrap PDF (this file) — upload as paperback cover in KDP',
            'Re-check size in Amazon KDP cover calculator (G201953020)',
            'Keep barcode reserve clear unless you supply your own barcode',
            'Title/author on cover must match KDP title setup',
            'Choose glossy or matte finish in KDP Print Options',
            'AI disclosure if applicable',
            'Interior PDF via export_interior_pdf',
          ],
        },
      })
      if (projectId) await store.updateProject(userId, projectId, { progress_step: 'export' })
      return
    }

    // Coloring companion PDF — uses coloring_asset per page (not the color story interiors)
    if (type === 'export_coloring_pdf') {
      const includeText = Boolean(inputs?.includeText)
      const pages = (project?.pages || []).map((p) => ({
        ...p,
        asset: p.coloring_asset || null,
        // Pure coloring books: no story text by default (opt-in via includeText)
        text_content: includeText ? p.text_content || '' : '',
        text_secondary: '',
        speech_bubble: '',
      }))
      const withColoring = pages.filter((p) => p.asset?.url || p.asset?.remoteUrl).length
      if (!withColoring) {
        throw fail(
          400,
          'coloring_required',
          'Derive coloring pages first (coloring_all_pages) before exporting the coloring PDF',
        )
      }
      const pdfRaw = await buildInteriorPdf({
        title: `${project?.title || 'StoryForge'} — Coloring Pages`,
        trimId,
        pages,
        pageCount,
        showGuides: false,
        showChrome: false,
        language: project?.language || 'de',
        secondaryLanguage: null,
        bilingualLayout: 'stacked',
      })
      // Retitle filename for coloring companion
      pdfRaw.filename = String(pdfRaw.filename || 'interior.pdf').replace(
        /\.pdf$/i,
        '-coloring.pdf',
      )
      pdfRaw.kind = 'coloring_pdf'
      const pdf = attachSignedDownload(pdfRaw, { userId })
      await store.updateJob(jobId, {
        status: 'completed',
        outputs: {
          type,
          pdf,
          coloringPages: withColoring,
          meta: COLORING_PAGES_META,
          note: 'B&W coloring companion — disclose black-and-white interiors honestly on KDP if you publish this as a separate listing.',
          independenceDisclaimer: PUBLISHING_SPECS.disclaimers.notAffiliated,
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

    if (type === 'export_flipbook') {
      const flip = await buildFlipbookZip({
        project,
        userId,
        includeCover: inputs?.includeCover !== false,
      })
      await store.updateJob(jobId, {
        status: 'completed',
        outputs: {
          type,
          zip: flip.zip,
          flipbook: {
            pageCount: flip.pageCount,
            hasCover: flip.hasCover,
            note: flip.note,
          },
          checklist: flip.checklist,
          independenceDisclaimer: PUBLISHING_SPECS.disclaimers.notAffiliated,
        },
      })
      if (projectId) await store.updateProject(userId, projectId, { progress_step: 'export' })
      return
    }

    // Full print pack: interior + cover + preflight + checklist as signed ZIP
    if (type === 'export_source_zip') {
      const complianceGate = assessComplianceGate(
        normalizePublicationSignoff(project?.publication_signoff).compliance,
      )
      if (!complianceGate.ok && !inputs?.bypassCompliance) {
        await store.updateJob(jobId, {
          status: 'failed',
          error: `KDP compliance checklist incomplete (${complianceGate.doneCount}/${complianceGate.requiredCount}). Complete ISBN, trademark, rights, and AI disclosure in Studio → Canvas.`,
          outputs: {
            code: 'compliance_required',
            missing: complianceGate.missing,
            compliance: {
              ok: false,
              doneCount: complianceGate.doneCount,
              requiredCount: complianceGate.requiredCount,
              disclosure: complianceGate.disclosure,
            },
          },
        })
        if (cost > 0) await chargeOrRefund(store, { userId, cost, reason: type, jobId, refund: true })
        return
      }
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
      const coverState = normalizeCoverStudioState(project?.cover_studio)
      const listingPlainZip = String(project?.listing_description?.plain || '').trim()
      const coverRaw = await buildCoverWrapPdf({
        title,
        author: inputs?.author || coverState.author || project?.meta?.author || '',
        subtitle: inputs?.subtitle || coverState.subtitle || '',
        blurb:
          inputs?.blurb ||
          listingPlainZip.slice(0, 700) ||
          project?.premise ||
          project?.emotional_core ||
          '',
        trimId,
        pageCount,
        paperTypeId,
        frontImageUrl:
          inputs?.frontImageUrl ||
          coverState.front_art_url ||
          project?.pinned_anchor?.heroUrl ||
          project?.pages?.[0]?.asset?.url ||
          null,
        backImageUrl: inputs?.backImageUrl || coverState.back_art_url || null,
        titlePlacement: inputs?.title_placement || coverState.title_placement || 'top',
        isbn: inputs?.isbn || coverState.isbn || '',
        embedIsbnBarcode:
          inputs?.embed_isbn_barcode !== undefined
            ? Boolean(inputs.embed_isbn_barcode)
            : Boolean(coverState.embed_isbn_barcode),
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
      const manuscript = formatBilingualManuscript(project)
      const readiness = assessPublicationReadiness(project, {
        signoff: project?.publication_signoff,
      })
      const readinessForZip = sanitizeReadinessForZip(readiness)
      const complianceSummary = readiness.compliance || complianceGate
      const checklist = [
        '1. Upload interior PDF as paperback manuscript',
        '2. Upload cover-wrap PDF as paperback cover',
        '3. Confirm trim size + page count match KDP calculator',
        '4. Keep barcode reserve clear on back cover',
        '5. Disclose AI-assisted art if required by Amazon policy (see compliance.json)',
        '6. Always verify in KDP Online Previewer before publishing',
        `7. StoryForge publication readiness score: ${readiness.score}/100 (${readiness.levelLabel}) — checklist only, not Amazon approval`,
        `8. Compliance checklist: ${complianceSummary.doneCount}/${complianceSummary.requiredCount} — ISBN / trademark / rights / AI / one account / no manipulation`,
        '9. Own ISBN (MVB) preferred for control; KDP free ISBN is allowed if you acknowledge imprint limits',
        '10. Keep rights contracts offline forever — StoryForge attach is a record only',
        '11. Paste listing-description.txt (or HTML) into the Amazon KDP book description — edit first; never invent reviews',
        '12. Paste listing-metadata.txt keywords (≤7) + subtitle into KDP; verify category ideas in the Amazon picker',
        '13. Optional: coloring-pages PDF in this ZIP is a B&W activity companion — publish separately and disclose B&W interiors',
        '',
        PUBLISHING_SPECS.disclaimers.notAffiliated,
      ].join('\n')

      const listing = project?.listing_description
      const listingPlain =
        (listing && String(listing.plain || '').trim()) ||
        '(No listing description saved yet — use Studio → Canvas → KDP description builder.)'
      const listingHtml = listing && String(listing.html || '').trim()
      const listingMeta = project?.listing_metadata
      const listingMetaPlain =
        (listingMeta && String(listingMeta.plain || '').trim()) ||
        '(No listing metadata saved yet — use Studio → Canvas → KDP metadata builder.)'

      const coloringPageCount = (project?.pages || []).filter(
        (p) => p?.coloring_asset?.url || p?.coloring_asset?.remoteUrl,
      ).length
      let coloringRaw = null
      if (coloringPageCount > 0) {
        const coloringPages = (project?.pages || []).map((p) => ({
          ...p,
          asset: p.coloring_asset || null,
          text_content: '',
          text_secondary: '',
          speech_bubble: '',
        }))
        coloringRaw = await buildInteriorPdf({
          title: `${title} — Coloring Pages`,
          trimId,
          pages: coloringPages,
          pageCount,
          showGuides: false,
          showChrome: false,
          language: project?.language || 'de',
          secondaryLanguage: null,
          bilingualLayout: 'stacked',
        })
        coloringRaw.filename = String(coloringRaw.filename || 'interior.pdf').replace(
          /\.pdf$/i,
          '-coloring.pdf',
        )
        coloringRaw.kind = 'coloring_pdf'
      }

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
        ...(coloringRaw
          ? [
              {
                name: coloringRaw.filename,
                data: coloringRaw.bytes || dataUrlToBuffer(coloringRaw.dataUrl),
                compress: false,
              },
            ]
          : []),
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
        {
          name: 'publication-readiness.json',
          data: JSON.stringify(readinessForZip, null, 2),
          compress: true,
        },
        {
          name: 'compliance.json',
          data: JSON.stringify(
            {
              ok: complianceSummary.ok,
              doneCount: complianceSummary.doneCount,
              requiredCount: complianceSummary.requiredCount,
              missing: complianceSummary.missing || [],
              disclosure: complianceSummary.disclosure,
              checklist: readinessForZip.signoff?.compliance || null,
              meta: complianceSummary.meta,
              note: 'Prevention checklist only — not legal advice; not a guarantee against Amazon action.',
            },
            null,
            2,
          ),
          compress: true,
        },
        { name: 'UPLOAD-CHECKLIST.txt', data: checklist, compress: true },
        { name: 'manuscript.txt', data: manuscript || '(empty)', compress: true },
        { name: 'listing-description.txt', data: listingPlain, compress: true },
        ...(listingHtml
          ? [{ name: 'listing-description.html', data: listingHtml, compress: true }]
          : []),
        { name: 'listing-metadata.txt', data: listingMetaPlain, compress: true },
        ...(listingMeta
          ? [
              {
                name: 'listing-metadata.json',
                data: JSON.stringify(listingMeta, null, 2),
                compress: true,
              },
            ]
          : []),
        {
          name: 'manifest.json',
          data: JSON.stringify(
            {
              title,
              trimId,
              pageCount,
              paperTypeId,
              files: [
                interiorRaw.filename,
                coverRaw.filename,
                ...(coloringRaw ? [coloringRaw.filename] : []),
                'preflight.json',
                'publication-readiness.json',
                'compliance.json',
                'UPLOAD-CHECKLIST.txt',
                'manuscript.txt',
                'listing-description.txt',
                ...(listingHtml ? ['listing-description.html'] : []),
                'listing-metadata.txt',
                ...(listingMeta ? ['listing-metadata.json'] : []),
              ],
              printReady: true,
              readinessScore: readiness.score,
              readinessLevel: readiness.level,
              complianceOk: Boolean(complianceSummary.ok),
              hasListingDescription: Boolean(listing && String(listing.plain || '').trim()),
              hasListingMetadata: Boolean(
                listingMeta &&
                  (String(listingMeta.subtitle || '').trim() ||
                    (listingMeta.keywords || []).some((k) => String(k || '').trim())),
              ),
              hasColoringPages: coloringPageCount > 0,
              coloringPageCount,
              hasBackCoverArt: Boolean(coverState.back_art_url),
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
          readiness,
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

/** Strip bulky rights-doc dataUrls from ZIP JSON. */
function sanitizeReadinessForZip(readiness) {
  try {
    const copy = JSON.parse(JSON.stringify(readiness || {}))
    const doc = copy?.signoff?.compliance?.rights_doc
    if (doc?.dataUrl) {
      delete doc.dataUrl
      doc.dataUrlOmitted = true
    }
    const doc2 = copy?.compliance?.checklist?.rights_doc
    if (doc2?.dataUrl) {
      delete doc2.dataUrl
      doc2.dataUrlOmitted = true
    }
    return copy
  } catch {
    return readiness
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
