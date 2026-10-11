import { falModelsPayload, FAL_DEFAULTS } from '@storyforge/shared'
import { MockImageProvider } from './mockProvider.js'
import { ReplicateImageProvider } from './replicateProvider.js'
import { FalImageProvider } from './falProvider.js'
import { config } from '../config.js'

/**
 * Factory: mock (default) | replicate | fal
 * Keys never leave the server.
 */
export function createImageProvider(name = config.imageProvider) {
  const id = String(name || 'mock').toLowerCase()
  if (id === 'replicate') {
    if (!process.env.REPLICATE_API_TOKEN && !config.replicate?.apiToken) {
      console.warn(
        '[storyforge] STORYFORGE_IMAGE_PROVIDER=replicate but REPLICATE_API_TOKEN is empty — jobs will fail until set'
      )
    }
    return new ReplicateImageProvider({
      token: config.replicate?.apiToken || process.env.REPLICATE_API_TOKEN,
      genModel: config.replicate?.genModel,
      reduxModel: config.replicate?.img2imgModel,
      upscaleModel: config.replicate?.upscaleModel,
    })
  }
  if (id === 'fal') {
    if (!process.env.FAL_KEY && !config.fal?.apiKey) {
      console.warn(
        '[storyforge] STORYFORGE_IMAGE_PROVIDER=fal but FAL_KEY is empty — jobs will fail until set'
      )
    }
    return new FalImageProvider({
      key: config.fal?.apiKey || process.env.FAL_KEY,
      genPath: config.fal?.genPath,
      img2imgPath: config.fal?.img2imgPath,
      upscalePath: config.fal?.upscalePath,
      videoPath: config.fal?.videoPath,
      img2imgStrength: config.fal?.img2imgStrength,
    })
  }
  if (id !== 'mock') {
    console.warn(`[storyforge] Unknown image provider "${name}", falling back to mock`)
  }
  return new MockImageProvider()
}

/** Safe public status for /health and Studio. */
export function providerStatus() {
  const id = String(config.imageProvider || 'mock').toLowerCase()
  const replicateReady = Boolean(config.replicate?.apiToken || process.env.REPLICATE_API_TOKEN)
  const falReady = Boolean(config.fal?.apiKey || process.env.FAL_KEY)
  return {
    provider: id,
    ready:
      id === 'mock' ||
      (id === 'replicate' && replicateReady) ||
      (id === 'fal' && falReady),
    replicateConfigured: replicateReady,
    falConfigured: falReady,
    models: {
      generate:
        id === 'fal'
          ? config.fal?.genPath || process.env.FAL_MODEL_GENERATE || FAL_DEFAULTS.generate
          : config.replicate?.genModel ||
            process.env.REPLICATE_MODEL_GENERATE ||
            'black-forest-labs/flux-schnell',
      upscale:
        id === 'fal'
          ? config.fal?.upscalePath || process.env.FAL_MODEL_UPSCALE || FAL_DEFAULTS.upscale
          : config.replicate?.upscaleModel ||
            process.env.REPLICATE_MODEL_UPSCALE ||
            'nightmareai/real-esrgan',
      img2img:
        id === 'fal'
          ? config.fal?.img2imgPath || process.env.FAL_MODEL_IMG2IMG || FAL_DEFAULTS.img2img
          : config.replicate?.img2imgModel ||
            process.env.REPLICATE_MODEL_IMG2IMG ||
            'black-forest-labs/flux-redux-dev',
      video:
        id === 'fal'
          ? config.fal?.videoPath || process.env.FAL_MODEL_VIDEO || FAL_DEFAULTS.video
          : null,
    },
    fal: id === 'fal' || falReady ? falModelsPayload() : null,
    printUpscaleFactor: 2.5,
    connectHint:
      id === 'replicate' && !replicateReady
        ? 'Add REPLICATE_API_TOKEN from https://replicate.com/account/api-tokens'
        : id === 'fal' && !falReady
          ? 'Add FAL_KEY from https://fal.ai/dashboard/keys'
          : id === 'mock'
            ? 'Set STORYFORGE_IMAGE_PROVIDER=fal (images+video) or replicate'
            : null,
  }
}
