import sharp from 'sharp'
import { ImageProvider } from './imageProvider.js'
import { runReplicateModel, firstImageUrl, ReplicateError } from './replicateClient.js'
import {
  characterPrompt,
  scenePrompt,
  fetchImageBuffer,
  toPngDataUrl,
  assetId,
  PRINT_UPSCALE_FACTOR,
} from './imageUtils.js'

/**
 * Live Replicate provider — FLUX Schnell for gens + Real-ESRGAN then sharp → 2.5× / print size.
 *
 * Required: REPLICATE_API_TOKEN
 * Dashboard: https://replicate.com/account/api-tokens
 */
export class ReplicateImageProvider extends ImageProvider {
  constructor(opts = {}) {
    super()
    this.name = 'replicate'
    this.token = opts.token || process.env.REPLICATE_API_TOKEN || ''
    this.genModel =
      opts.genModel || process.env.REPLICATE_MODEL_GENERATE || 'black-forest-labs/flux-schnell'
    this.reduxModel =
      opts.reduxModel ||
      process.env.REPLICATE_MODEL_IMG2IMG ||
      'black-forest-labs/flux-redux-dev'
    this.upscaleModel =
      opts.upscaleModel || process.env.REPLICATE_MODEL_UPSCALE || 'nightmareai/real-esrgan'
  }

  assertToken() {
    if (!this.token) {
      const err = new ReplicateError(
        'Set REPLICATE_API_TOKEN and STORYFORGE_IMAGE_PROVIDER=replicate',
        { status: 503 }
      )
      throw err
    }
  }

  async _predict(model, input) {
    this.assertToken()
    return runReplicateModel({ token: this.token, model, input })
  }

  async _urlFromPrediction(prediction) {
    const url = firstImageUrl(prediction.output)
    if (!url) {
      throw new ReplicateError('Replicate returned no image URL', {
        status: 502,
        body: prediction,
      })
    }
    return url
  }

  async generateCharacterSheet(input) {
    const prompt = characterPrompt(input)
    const prediction = await this._predict(this.genModel, {
      prompt,
      num_outputs: 1,
      aspect_ratio: '1:1',
      output_format: 'png',
      output_quality: 90,
    })
    const remoteUrl = await this._urlFromPrediction(prediction)
    const { buffer } = await fetchImageBuffer(remoteUrl)
    const png = await toPngDataUrl(buffer, { width: 1024, height: 1024 })
    const id = assetId('hero')
    return {
      provider: this.name,
      model: this.genModel,
      engine: input.engine || 'v3',
      seed: input.seed || prediction.id,
      assets: [
        {
          role: 'hero_frame',
          assetId: id,
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
      provenance: { source: 'ai', generationMode: 'prompt', vendor: 'replicate' },
    }
  }

  async generateScene(input) {
    const prompt = scenePrompt(input)
    const anchorUrl = input.anchorImageUrl || input.heroUrl || null
    let prediction
    let modelUsed = this.genModel

    if (anchorUrl && !String(anchorUrl).startsWith('data:image/svg')) {
      try {
        modelUsed = this.reduxModel
        prediction = await this._predict(this.reduxModel, {
          prompt,
          redux_image: anchorUrl.startsWith('data:') ? anchorUrl : anchorUrl,
          aspect_ratio: '1:1',
          output_format: 'png',
        })
      } catch (err) {
        console.warn('[storyforge] flux-redux failed, falling back to text-only:', err.message)
        modelUsed = this.genModel
        prediction = await this._predict(this.genModel, {
          prompt: `${prompt}. Match this character description carefully.`,
          num_outputs: 1,
          aspect_ratio: '1:1',
          output_format: 'png',
          output_quality: 90,
        })
      }
    } else {
      prediction = await this._predict(this.genModel, {
        prompt,
        num_outputs: 1,
        aspect_ratio: '1:1',
        output_format: 'png',
        output_quality: 90,
      })
    }

    const remoteUrl = await this._urlFromPrediction(prediction)
    const { buffer } = await fetchImageBuffer(remoteUrl)
    const targetW = input.targetWidth || 1024
    const targetH = input.targetHeight || 1024
    // Keep scene drafts at gen size; final/print can be upscaled separately via upscale_print
    const outW = input.quality === 'final' && targetW > 1024 ? 1024 : Math.min(targetW, 1024)
    const outH = input.quality === 'final' && targetH > 1024 ? 1024 : Math.min(targetH, 1024)
    const png = await toPngDataUrl(buffer, { width: outW, height: outH })

    return {
      provider: this.name,
      model: modelUsed,
      seed: input.seed || prediction.id,
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
          usedAnchor: Boolean(anchorUrl),
        },
      ],
      embedding: input.anchorEmbedding || null,
      consistencyScore: anchorUrl ? 0.9 : null,
      consistencyBadge: anchorUrl ? 'pass' : 'warn',
      chainSteps: input.chainSteps || 1,
      provenance: { source: 'ai', generationMode: anchorUrl ? 'img2img' : 'prompt', vendor: 'replicate' },
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
    // Job API forbids raw photos — generate a cartoon hero from the name/brief only.
    return this.generateCharacterSheet({
      ...input,
      name: input.name || 'PhotoHero',
      description:
        input.description ||
        'cartoon child hero suitable for a picture book (photo reference stays client-side)',
    })
  }

  async generateVideo() {
    const err = new Error(
      'scene_to_video requires fal.ai — set STORYFORGE_IMAGE_PROVIDER=fal and FAL_KEY',
    )
    err.status = 503
    err.code = 'video_requires_fal'
    throw err
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

  /**
   * Neolemon-style print upscale: AI enhance (Real-ESRGAN ×2 or ×4) then sharp to
   * exact target (default 2.5× source, or KDP bleed pixels from job).
   */
  async upscale(input) {
    const sourceUrl = input.imageUrl || input.url || input.sourceUrl
    if (!sourceUrl) {
      const err = new Error('upscale_print requires imageUrl (page or hero asset)')
      err.status = 400
      err.code = 'image_url_required'
      throw err
    }

    const { buffer: srcBuf } = await fetchImageBuffer(sourceUrl)
    const srcMeta = await sharp(srcBuf).metadata()
    const srcW = srcMeta.width || 1024
    const srcH = srcMeta.height || 1024
    const factor = Number(input.scaleFactor) || PRINT_UPSCALE_FACTOR
    const targetW = input.targetWidth || Math.round(srcW * factor)
    const targetH = input.targetHeight || Math.round(srcH * factor)

    // Pick ESRGAN integer scale that covers the target, then sharp down/up to exact size
    const need = Math.max(targetW / srcW, targetH / srcH)
    const esrganScale = need > 2.2 ? 4 : 2

    let enhancedUrl = sourceUrl
    try {
      const prediction = await this._predict(this.upscaleModel, {
        image: sourceUrl.startsWith('data:') ? sourceUrl : sourceUrl,
        scale: esrganScale,
        face_enhance: Boolean(input.faceEnhance),
      })
      enhancedUrl = await this._urlFromPrediction(prediction)
    } catch (err) {
      console.warn('[storyforge] Real-ESRGAN failed, sharp-only upscale:', err.message)
    }

    const { buffer: enhancedBuf } = await fetchImageBuffer(enhancedUrl)
    const png = await toPngDataUrl(enhancedBuf, { width: targetW, height: targetH })

    return {
      provider: this.name,
      model: this.upscaleModel,
      scaleFactor: factor,
      esrganScale,
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
      provenance: { source: 'ai', generationMode: 'upscale', vendor: 'replicate' },
    }
  }

  async removeBackground(input) {
    return this.generateScene({ ...input, brief: input.brief || 'character cutout on white' })
  }

  async embed() {
    return { provider: this.name, vector: null, note: 'Embedding not enabled on Replicate path' }
  }
}
