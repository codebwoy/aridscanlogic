/**
 * fal.ai Model API catalogue wired into StoryForge.
 * Docs: https://fal.ai/docs/documentation · Marketplace: https://fal.ai/models
 *
 * Roles:
 * - generate: Character Turbo (text→image)
 * - img2img: Editor Pro from pinned anchor
 * - video_i2v: Scene→Video from approved still
 * - video_t2v: text-to-video (prompt + optional reference; not preferred for heroes)
 * - upscale: print 2.5× path
 */

export const FAL_MODEL_CATALOGUE = {
  generate: [
    {
      id: 'fal-ai/flux/schnell',
      label: 'FLUX.1 Schnell',
      tier: 'fast',
      note: 'Ultra-fast text→image (default Character Turbo)',
      docs: 'https://fal.ai/models/fal-ai/flux/schnell',
    },
    {
      id: 'fal-ai/flux/dev',
      label: 'FLUX.1 Dev',
      tier: 'quality',
      note: 'Higher quality text→image',
      docs: 'https://fal.ai/models/fal-ai/flux/dev',
    },
    {
      id: 'fal-ai/flux-2-pro',
      label: 'FLUX.2 Pro',
      tier: 'pro',
      note: 'Zero-config pro text→image',
      docs: 'https://fal.ai/models/fal-ai/flux-2-pro',
    },
    {
      id: 'fal-ai/nano-banana-2',
      label: 'Nano Banana 2',
      tier: 'pro',
      note: 'Strong prompt following for character sheets',
      docs: 'https://fal.ai/models/fal-ai/nano-banana-2',
    },
    {
      id: 'fal-ai/z-image/turbo',
      label: 'Z-Image Turbo',
      tier: 'fast',
      note: 'Lightning-fast drafts',
      docs: 'https://fal.ai/models/fal-ai/z-image/turbo',
    },
  ],
  img2img: [
    {
      id: 'fal-ai/flux-pro/kontext',
      label: 'FLUX.1 Kontext Pro',
      tier: 'pro',
      note: 'Best Editor Pro identity lock from pinned still (default)',
      docs: 'https://fal.ai/models/fal-ai/flux-pro/kontext',
      family: 'kontext',
    },
    {
      id: 'fal-ai/flux/dev/image-to-image',
      label: 'FLUX.1 Dev Img2Img',
      tier: 'quality',
      note: 'Classic strength-based img2img',
      docs: 'https://fal.ai/models/fal-ai/flux/dev/image-to-image',
      family: 'flux_img2img',
    },
  ],
  video: [
    {
      id: 'fal-ai/kling-video/v3/pro/image-to-video',
      label: 'Kling v3 Pro (image→video)',
      tier: 'pro',
      mode: 'i2v',
      note: 'Default Scene→Video — highest quality from page still',
      docs: 'https://fal.ai/models/fal-ai/kling-video/v3/pro/image-to-video',
    },
    {
      id: 'fal-ai/kling-video/v3/standard/image-to-video',
      label: 'Kling v3 Standard (image→video)',
      tier: 'standard',
      mode: 'i2v',
      note: 'Cheaper / faster image→video',
      docs: 'https://fal.ai/models/fal-ai/kling-video/v3/standard/image-to-video',
    },
    {
      id: 'fal-ai/kling-video/v3/pro/text-to-video',
      label: 'Kling v3 Pro (text→video)',
      tier: 'pro',
      mode: 't2v',
      note: 'Text-led; still prefers scene prompt + reference when possible',
      docs: 'https://fal.ai/models/fal-ai/kling-video/v3/pro/text-to-video',
    },
    {
      id: 'fal-ai/veo3.1',
      label: 'Veo 3.1',
      tier: 'pro',
      mode: 't2v',
      note: 'Google Veo text→video on fal',
      docs: 'https://fal.ai/models/fal-ai/veo3.1',
    },
    {
      id: 'fal-ai/bytedance/seedance/v1/pro/text-to-video',
      label: 'Seedance 1.0 Pro',
      tier: 'pro',
      mode: 't2v',
      note: 'ByteDance text→video',
      docs: 'https://fal.ai/models/fal-ai/bytedance/seedance/v1/pro/text-to-video',
    },
  ],
  upscale: [
    {
      id: 'fal-ai/clarity-upscaler',
      label: 'Clarity Upscaler',
      tier: 'print',
      note: 'Print 2.5× path (default)',
      docs: 'https://fal.ai/models/fal-ai/clarity-upscaler',
    },
  ],
}

export const FAL_DEFAULTS = {
  generate: 'fal-ai/flux/schnell',
  img2img: 'fal-ai/flux-pro/kontext',
  video: 'fal-ai/kling-video/v3/pro/image-to-video',
  upscale: 'fal-ai/clarity-upscaler',
}

export function falModelsPayload() {
  return {
    catalogue: FAL_MODEL_CATALOGUE,
    defaults: FAL_DEFAULTS,
    docs: 'https://fal.ai/docs/documentation',
    independenceNote:
      'StoryForge is not affiliated with fal.ai. Model availability and pricing follow your fal account.',
  }
}

/** Allowlist check — reject unknown endpoint ids from the client. */
export function isAllowedFalModel(role, modelId) {
  const list = FAL_MODEL_CATALOGUE[role]
  if (!list || !modelId) return false
  return list.some((m) => m.id === modelId)
}

export function falModelMeta(role, modelId) {
  return FAL_MODEL_CATALOGUE[role]?.find((m) => m.id === modelId) || null
}
