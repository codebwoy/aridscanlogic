import sharp from 'sharp'
import { FAL_DEFAULTS, isAllowedFalModel, falModelMeta } from '@storyforge/shared'
import { ImageProvider } from './imageProvider.js'
import {
  falRun,
  falSubscribe,
  falEnsurePublicUrl,
  falFirstImageUrl,
  falFirstVideoUrl,
  FalClientError,
} from './falClient.js'
import {
  characterPrompt,
  scenePrompt,
  fetchImageBuffer,
  toPngDataUrl,
  assetId,
  PRINT_UPSCALE_FACTOR,
} from './imageUtils.js'

/**
 * fal.ai provider — full Model API catalogue for Character Turbo, Editor Pro,
 * print upscale, and Scene→Video.
 *
 * Docs: https://fal.ai/docs/documentation
 * Required: FAL_KEY + STORYFORGE_IMAGE_PROVIDER=fal
 */
export class FalImageProvider extends ImageProvider {
  constructor(opts = {}) {
    super()
    this.name = 'fal'
    this.key = opts.key || process.env.FAL_KEY || ''
    this.genPath = opts.genPath || process.env.FAL_MODEL_GENERATE || FAL_DEFAULTS.generate
    this.img2imgPath =
      opts.img2imgPath || process.env.FAL_MODEL_IMG2IMG || FAL_DEFAULTS.img2img
    this.upscalePath =
      opts.upscalePath || process.env.FAL_MODEL_UPSCALE || FAL_DEFAULTS.upscale
    this.videoPath = opts.videoPath || process.env.FAL_MODEL_VIDEO || FAL_DEFAULTS.video
    this.img2imgStrength = Number(opts.img2imgStrength || process.env.FAL_IMG2IMG_STRENGTH || 0.65)
  }

  assertKey() {
    if (!this.key) {
      throw new FalClientError('Set FAL_KEY and STORYFORGE_IMAGE_PROVIDER=fal', {
        status: 503,
        code: 'fal_missing_key',
      })
    }
  }

  resolveModel(role, override) {
    if (override && isAllowedFalModel(role, override)) return override
    if (role === 'generate') return this.genPath
    if (role === 'img2img') return this.img2imgPath
    if (role === 'video') return this.videoPath
    if (role === 'upscale') return this.upscalePath
    return override || this.genPath
  }

  buildGenerateInput(modelId, prompt) {
    const base = {
      prompt,
      num_images: 1,
      output_format: 'png',
    }
    if (modelId.includes('nano-banana')) {
      return { ...base, enable_safety_checker: true }
    }
    if (modelId.includes('z-image')) {
      return { ...base, image_size: 'square' }
    }
    if (modelId.includes('flux-2')) {
      return { ...base, image_size: 'square_hd' }
    }
    return {
      ...base,
      image_size: 'square_hd',
      enable_safety_checker: true,
    }
  }

  buildImg2ImgInput(modelId, { imageUrl, prompt, strength }) {
    const meta = falModelMeta('img2img', modelId)
    if (meta?.family === 'kontext' || modelId.includes('kontext')) {
      return {
        prompt,
        image_url: imageUrl,
        guidance_scale: 3.5,
        num_images: 1,
        output_format: 'png',
        aspect_ratio: '1:1',
        safety_tolerance: '2',
      }
    }
    return {
      image_url: imageUrl,
      prompt,
      strength: Number.isFinite(strength) ? strength : this.img2imgStrength,
      num_inference_steps: 28,
      guidance_scale: 3.5,
      num_images: 1,
      enable_safety_checker: true,
      output_format: 'png',
    }
  }

  buildVideoInput(modelId, { startImageUrl, prompt, duration, negativePrompt, generateAudio }) {
    const meta = falModelMeta('video', modelId)
    const mode = meta?.mode || (modelId.includes('image-to-video') ? 'i2v' : 't2v')
    const dur = String(duration || process.env.FAL_VIDEO_DURATION || '5')
    const neg =
      negativePrompt ||
      'blur, distort, morphing face, extra characters, low quality, watermark, text overlay'

    if (mode === 'i2v' || modelId.includes('image-to-video')) {
      return {
        start_image_url: startImageUrl,
        prompt,
        duration: dur,
        negative_prompt: neg,
        cfg_scale: 0.5,
        generate_audio: Boolean(generateAudio),
      }
    }

    // Text-to-video models (Veo, Seedance, Kling T2V) — keep scene still as reference when accepted
    const t2v = {
      prompt: `${prompt}. Keep the same cartoon character face, hair, and outfit from the approved storybook still.`,
      duration: dur,
    }
    if (modelId.includes('veo')) {
      return { ...t2v, aspect_ratio: '1:1', image_url: startImageUrl }
    }
    if (modelId.includes('seedance')) {
      return { ...t2v, image_url: startImageUrl }
    }
    if (modelId.includes('text-to-video')) {
      return {
        ...t2v,
        start_image_url: startImageUrl,
        negative_prompt: neg,
        cfg_scale: 0.5,
        generate_audio: Boolean(generateAudio),
      }
    }
    return {
      start_image_url: startImageUrl,
      prompt,
      duration: dur,
      negative_prompt: neg,
    }
  }

  async _imageFromBody(body, { width = 1024, height = 1024 } = {}) {
    const remoteUrl = falFirstImageUrl(body)
    if (!remoteUrl) {
      throw new FalClientError('fal.ai returned no image URL', {
        status: 502,
        code: 'fal_no_image',
        body,
      })
    }
    const { buffer } = await fetchImageBuffer(remoteUrl)
    const png = await toPngDataUrl(buffer, { width, height })
    return { remoteUrl, png }
  }

  async generateCharacterSheet(input) {
    this.assertKey()
    const model = this.resolveModel('generate', input.modelGenerate || input.model)
    const body = await falRun(this.key, model, this.buildGenerateInput(model, characterPrompt(input)))
    const { remoteUrl, png } = await this._imageFromBody(body, { width: 1024, height: 1024 })
    return {
      provider: this.name,
      model,
      engine: input.engine || 'v3',
      assets: [
        {
          role: 'hero_frame',
          assetId: assetId('hero'),
          url: png.dataUrl,
          remoteUrl,
          placeholder: false,
          width: png.width,
          height: png.height,
          mime: png.mime,
          quality: input.quality || 'final',
        },
      ],
      palette: input.palette || [],
      embedding: null,
      consistencyRefReady: true,
      provenance: { source: 'ai', generationMode: 'prompt', vendor: 'fal', model },
    }
  }

  async generateScene(input) {
    this.assertKey()
    const prompt = scenePrompt(input)
    const anchorRaw = input.anchorImageUrl || input.heroUrl || null
    const hasAnchor = Boolean(anchorRaw && !String(anchorRaw).startsWith('data:image/svg'))
    let body
    let modelUsed = this.resolveModel('generate', input.modelGenerate)
    let mode = 'prompt'

    if (hasAnchor) {
      try {
        const imageUrl = await falEnsurePublicUrl(this.key, anchorRaw)
        modelUsed = this.resolveModel('img2img', input.modelImg2img || input.model)
        mode = 'img2img'
        body = await falRun(
          this.key,
          modelUsed,
          this.buildImg2ImgInput(modelUsed, {
            imageUrl,
            prompt,
            strength: input.strength,
          }),
        )
      } catch (err) {
        console.warn('[storyforge] fal img2img failed, falling back to text-only:', err.message)
        modelUsed = this.resolveModel('generate', input.modelGenerate)
        mode = 'prompt_fallback'
        body = await falRun(
          this.key,
          modelUsed,
          this.buildGenerateInput(
            modelUsed,
            `${prompt}. Keep the same cartoon character face, hair, and outfit as the pinned hero.`,
          ),
        )
      }
    } else {
      body = await falRun(this.key, modelUsed, this.buildGenerateInput(modelUsed, prompt))
    }

    const outW = Math.min(input.targetWidth || 1024, 1024)
    const outH = Math.min(input.targetHeight || 1024, 1024)
    const { remoteUrl, png } = await this._imageFromBody(body, { width: outW, height: outH })

    return {
      provider: this.name,
      model: modelUsed,
      assets: [
        {
          role: 'scene',
          assetId: assetId('scene'),
          url: png.dataUrl,
          remoteUrl,
          placeholder: false,
          width: png.width,
          height: png.height,
          mime: png.mime,
          quality: input.quality || 'draft',
          usedAnchor: hasAnchor,
        },
      ],
      embedding: input.anchorEmbedding || null,
      consistencyScore: hasAnchor ? 0.9 : null,
      consistencyBadge: hasAnchor ? 'pass' : 'warn',
      chainSteps: input.chainSteps || 1,
      provenance: { source: 'ai', generationMode: mode, vendor: 'fal', model: modelUsed },
    }
  }

  async generateTwoCharacterScene(input) {
    return this.generateScene({
      ...input,
      secondCharacter: input.secondCharacter || input.secondCharacterName || 'Friend',
    })
  }

  async photoToCartoon(input) {
    if (!input.guardianAffirmed && !input.consent) {
      const err = new Error('Guardian consent required for Photo to Cartoon')
      err.status = 400
      err.code = 'consent_required'
      throw err
    }
    return this.generateCharacterSheet({
      ...input,
      name: input.name || 'PhotoHero',
      description:
        input.description ||
        'cartoon child hero suitable for a picture book (photo reference stays client-side)',
    })
  }

  async edit(input) {
    return this.generateScene(input)
  }

  async inpaint(input) {
    return this.generateScene(input)
  }

  async outpaint(input) {
    return this.generateScene(input)
  }

  async generateVideo(input) {
    this.assertKey()
    const sourceRaw =
      input.imageUrl || input.startImageUrl || input.sceneUrl || input.anchorImageUrl || null
    if (!sourceRaw) {
      throw new FalClientError('scene_to_video requires a scene or anchor imageUrl', {
        status: 400,
        code: 'image_url_required',
      })
    }

    const startImageUrl = await falEnsurePublicUrl(this.key, sourceRaw)
    const duration = String(input.duration || process.env.FAL_VIDEO_DURATION || '5')
    const prompt =
      input.prompt ||
      input.motionPrompt ||
      input.brief ||
      'Subtle motion, keep character face and outfit unchanged, children’s picture book style, soft lighting, steady camera'
    const model = this.resolveModel('video', input.modelVideo || input.model)

    const body = await falSubscribe(
      this.key,
      model,
      this.buildVideoInput(model, {
        startImageUrl,
        prompt,
        duration,
        negativePrompt: input.negativePrompt,
        generateAudio: input.generateAudio,
      }),
      { maxMs: Number(process.env.FAL_VIDEO_TIMEOUT_MS) || 8 * 60 * 1000 },
    )

    const videoUrl = falFirstVideoUrl(body)
    if (!videoUrl) {
      throw new FalClientError('fal.ai returned no video URL', {
        status: 502,
        code: 'fal_no_video',
        body,
      })
    }

    return {
      provider: this.name,
      model,
      assets: [
        {
          role: 'scene_video',
          assetId: assetId('vid'),
          url: videoUrl,
          remoteUrl: videoUrl,
          placeholder: false,
          mime: 'video/mp4',
          durationSec: Number(duration) || 5,
          quality: 'draft',
          usedAnchor: true,
          startImageUrl,
        },
      ],
      provenance: {
        source: 'ai',
        generationMode: falModelMeta('video', model)?.mode || 'image_to_video',
        vendor: 'fal',
        model,
      },
    }
  }

  async upscale(input) {
    this.assertKey()
    const sourceUrl = input.imageUrl || input.url || input.sourceUrl
    if (!sourceUrl) {
      throw new FalClientError('upscale_print requires imageUrl', {
        status: 400,
        code: 'image_url_required',
      })
    }

    const publicUrl = await falEnsurePublicUrl(this.key, sourceUrl)
    const { buffer: srcBuf } = await fetchImageBuffer(publicUrl)
    const srcMeta = await sharp(srcBuf).metadata()
    const srcW = srcMeta.width || 1024
    const srcH = srcMeta.height || 1024
    const factor = Number(input.scaleFactor) || PRINT_UPSCALE_FACTOR
    const targetW = input.targetWidth || Math.round(srcW * factor)
    const targetH = input.targetHeight || Math.round(srcH * factor)
    const model = this.resolveModel('upscale', input.modelUpscale || input.model)

    let enhancedUrl = publicUrl
    try {
      const body = await falRun(this.key, model, {
        image_url: publicUrl,
        upscale_factor: factor,
        creativity: 0.35,
        resemblance: 0.6,
      })
      enhancedUrl = falFirstImageUrl(body) || publicUrl
    } catch (err) {
      console.warn('[storyforge] fal upscale failed, sharp-only:', err.message)
    }

    const { buffer: enhancedBuf } = await fetchImageBuffer(enhancedUrl)
    const png = await toPngDataUrl(enhancedBuf, { width: targetW, height: targetH })
    return {
      provider: this.name,
      model,
      scaleFactor: factor,
      assets: [
        {
          role: 'upscaled',
          assetId: assetId('up'),
          url: png.dataUrl,
          remoteUrl: enhancedUrl.startsWith('http') ? enhancedUrl : null,
          placeholder: false,
          width: png.width,
          height: png.height,
          mime: png.mime,
          quality: 'final',
        },
      ],
      provenance: { source: 'ai', generationMode: 'upscale', vendor: 'fal', model },
    }
  }

  async removeBackground(input) {
    return this.generateScene({ ...input, brief: input.brief || 'character cutout on white' })
  }

  async embed() {
    return { provider: this.name, vector: null, note: 'Embedding not enabled on fal path' }
  }
}
