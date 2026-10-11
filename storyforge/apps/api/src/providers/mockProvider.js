import { ImageProvider } from './imageProvider.js'
import { randomToken } from '../security/crypto.js'

function svgDataUrl({ w = 1024, h = 1024, label = 'StoryForge', fill = '#E8F6F3', accent = '#2A9D8F' }) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="${fill}"/>
  <circle cx="${w / 2}" cy="${h * 0.38}" r="${Math.min(w, h) * 0.14}" fill="${accent}" opacity="0.85"/>
  <rect x="${w * 0.35}" y="${h * 0.5}" width="${w * 0.3}" height="${h * 0.28}" rx="${w * 0.04}" fill="${accent}" opacity="0.7"/>
  <text x="50%" y="${h * 0.92}" text-anchor="middle" font-family="Georgia, serif" font-size="${Math.round(w * 0.045)}" fill="#1A3A36">${escapeXml(label)}</text>
</svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function fakeEmbedding(seed) {
  const s = String(seed || 'x')
  return Array.from({ length: 8 }, (_, i) => ((s.charCodeAt(i % s.length) || 1) % 97) / 97)
}

function cosine(a, b) {
  if (!a?.length || !b?.length || a.length !== b.length) return null
  let dot = 0
  let na = 0
  let nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  if (!na || !nb) return 0
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

function badgeFromScore(score) {
  if (score == null) return 'warn'
  if (score >= 0.85) return 'pass'
  if (score >= 0.7) return 'warn'
  return 'fail'
}

/** Deterministic mock for local/dev/tests — no external network. */
export class MockImageProvider extends ImageProvider {
  constructor() {
    super()
    this.name = 'mock'
  }

  async generateCharacterSheet(input) {
    const name = input.name || 'Hero'
    const seed = input.seed || randomToken(8)
    const heroUrl = svgDataUrl({
      w: 1024,
      h: 1024,
      label: `${name} (anchor)`,
      fill: '#FFFFFF',
      accent: '#2A9D8F',
    })
    const sheetUrl = svgDataUrl({
      w: 2048,
      h: 2048,
      label: `${name} sheet`,
      fill: '#F7FBFA',
      accent: '#1F7A6E',
    })
    const embedding = fakeEmbedding(`${name}:${seed}`)
    return {
      provider: this.name,
      model: `mock-character-${input.engine || 'v3'}`,
      engine: input.engine || 'v3',
      seed,
      assets: [
        {
          role: 'hero_frame',
          assetId: `hero_${seed}`,
          url: heroUrl,
          placeholder: true,
          width: 1024,
          height: 1024,
          mime: 'image/svg+xml',
          quality: input.quality || 'final',
        },
        {
          role: 'character_sheet',
          assetId: `sheet_${seed}`,
          url: sheetUrl,
          placeholder: true,
          width: 2048,
          height: 2048,
          mime: 'image/svg+xml',
          quality: input.quality || 'final',
        },
      ],
      palette: input.palette || [
        { name: 'skin', hex: '#F5D0A9' },
        { name: 'outline', hex: '#3D2B1F' },
        { name: 'accent', hex: '#2A9D8F' },
      ],
      embedding,
      consistencyRefReady: true,
      provenance: { source: 'ai', generationMode: 'prompt' },
    }
  }

  async generateScene(input) {
    const seed = input.seed || randomToken(8)
    const name = input.characterName || input.name || 'Hero'
    const brief = input.brief || input.sceneBrief || 'scene'
    const anchorEmb = input.anchorEmbedding || null
    const sceneEmb = fakeEmbedding(`${name}:${brief}:${seed}`)
    const score = anchorEmb ? cosine(anchorEmb, sceneEmb) : 0.92
    // Mock: when anchor present, keep score high to simulate consistency pipeline
    const consistencyScore = anchorEmb ? Math.max(0.88, score ?? 0.9) : score
    const w = input.targetWidth || 1024
    const h = input.targetHeight || 1024
    const url = svgDataUrl({
      w,
      h,
      label: `${name}: ${String(brief).slice(0, 28)}`,
      fill: '#E8F6F3',
      accent: '#2A9D8F',
    })
    return {
      provider: this.name,
      model: 'mock-scene-v1',
      seed,
      assets: [
        {
          role: 'scene',
          assetId: `scene_${seed}`,
          url,
          placeholder: true,
          width: w,
          height: h,
          mime: 'image/svg+xml',
          quality: input.quality || 'draft',
          usedAnchor: Boolean(input.pinnedAnchorAssetId || input.anchorEmbedding),
        },
      ],
      embedding: sceneEmb,
      consistencyScore,
      consistencyBadge: badgeFromScore(consistencyScore),
      chainSteps: input.chainSteps || 1,
      provenance: { source: 'ai', generationMode: 'prompt' },
    }
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

  async upscale(input) {
    const w = input.targetWidth || 2625
    const h = input.targetHeight || 2625
    const url = svgDataUrl({
      w: Math.min(w, 1200),
      h: Math.min(h, 1200),
      label: `upscale ${w}×${h}`,
      fill: '#DFF3EE',
      accent: '#1F7A6E',
    })
    return {
      provider: this.name,
      model: 'mock-upscale-v1',
      assets: [
        {
          role: 'upscaled',
          assetId: `up_${randomToken(6)}`,
          url,
          placeholder: true,
          width: w,
          height: h,
          mime: 'image/svg+xml',
          quality: 'final',
        },
      ],
    }
  }

  /** Deterministic placeholder — no network. Real video needs fal provider. */
  async generateVideo(input) {
    const source = input.imageUrl || input.startImageUrl || input.sceneUrl || ''
    if (!source) {
      const err = new Error('scene_to_video requires a scene imageUrl')
      err.status = 400
      err.code = 'image_url_required'
      throw err
    }
    const durationSec = Number(input.duration || 5) || 5
    // Tiny silent MP4 is heavy to embed; return a data URI poster + mock video marker URL
    const poster = svgDataUrl({
      w: 640,
      h: 640,
      label: `video ${durationSec}s`,
      fill: '#E8F0FE',
      accent: '#3B82F6',
    })
    return {
      provider: this.name,
      model: 'mock-image-to-video',
      assets: [
        {
          role: 'scene_video',
          assetId: `vid_${randomToken(6)}`,
          url: poster,
          remoteUrl: null,
          placeholder: true,
          mime: 'image/svg+xml',
          durationSec,
          quality: 'draft',
          usedAnchor: true,
          startImageUrl: source,
          note: 'Mock provider — switch STORYFORGE_IMAGE_PROVIDER=fal for real clips',
        },
      ],
      provenance: { source: 'mock', generationMode: 'image_to_video', vendor: 'mock' },
    }
  }

  async removeBackground(input) {
    return this.generateScene({ ...input, brief: 'cutout' })
  }

  async embed(input) {
    return { provider: this.name, vector: fakeEmbedding(input.text || input.assetId || 'x') }
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
      engine: input.engine || 'v3',
    })
  }
}

