import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  FAL_MODEL_CATALOGUE,
  FAL_DEFAULTS,
  isAllowedFalModel,
  falModelsPayload,
} from '../src/fal-models.js'

describe('fal model catalogue', () => {
  it('includes TOC image + video + upscale endpoints', () => {
    const genIds = FAL_MODEL_CATALOGUE.generate.map((m) => m.id)
    assert.ok(genIds.includes('fal-ai/nano-banana-2'))
    assert.ok(genIds.includes('fal-ai/flux-2-pro'))
    assert.ok(genIds.includes('fal-ai/flux/dev'))
    assert.ok(genIds.includes('fal-ai/flux/schnell'))
    assert.ok(genIds.includes('fal-ai/z-image/turbo'))

    const imgIds = FAL_MODEL_CATALOGUE.img2img.map((m) => m.id)
    assert.ok(imgIds.includes('fal-ai/flux-pro/kontext'))
    assert.ok(imgIds.includes('fal-ai/flux/dev/image-to-image'))

    const vidIds = FAL_MODEL_CATALOGUE.video.map((m) => m.id)
    assert.ok(vidIds.includes('fal-ai/kling-video/v3/pro/image-to-video'))
    assert.ok(vidIds.includes('fal-ai/kling-video/v3/standard/image-to-video'))
    assert.ok(vidIds.includes('fal-ai/kling-video/v3/pro/text-to-video'))
    assert.ok(vidIds.includes('fal-ai/veo3.1'))
    assert.ok(vidIds.includes('fal-ai/bytedance/seedance/v1/pro/text-to-video'))

    assert.ok(FAL_MODEL_CATALOGUE.upscale.some((m) => m.id === 'fal-ai/clarity-upscaler'))
  })

  it('defaults prefer Kontext + Kling Pro', () => {
    assert.equal(FAL_DEFAULTS.img2img, 'fal-ai/flux-pro/kontext')
    assert.equal(FAL_DEFAULTS.video, 'fal-ai/kling-video/v3/pro/image-to-video')
  })

  it('allowlists models', () => {
    assert.equal(isAllowedFalModel('video', 'fal-ai/veo3.1'), true)
    assert.equal(isAllowedFalModel('video', 'evil/model'), false)
    assert.ok(falModelsPayload().catalogue.generate.length >= 5)
  })
})
