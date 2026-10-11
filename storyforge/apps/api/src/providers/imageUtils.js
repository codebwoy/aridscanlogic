import sharp from 'sharp'
import { randomToken } from '../security/crypto.js'

const KIDS_STYLE =
  'children\'s picture book illustration, soft watercolor-ink cartoon, warm friendly, clean shapes, age 3-7, high quality, no text, no watermark, no signature'

export function characterPrompt(input) {
  const name = input.name || input.characterName || 'Hero'
  const desc =
    input.description ||
    input.brief ||
    'friendly child character, simple bold shapes, merch-ready silhouette'
  const dnaBits = input.ipDna
    ? ` Signature colour ${input.ipDna.signatureColor || ''}; trait ${input.ipDna.definingTrait || ''}; object ${input.ipDna.signatureObject || ''}.`
    : ''
  return [
    `Full-body front-facing cartoon character named ${name}: ${desc}.${dnaBits}`,
    'Standing on plain white background, centered, consistent design bible sheet style,',
    'bold merch-ready silhouette, minimal detail, high contrast for T-shirt print.',
    KIDS_STYLE,
  ].join(' ')
}

export function scenePrompt(input) {
  const name = input.characterName || input.name || 'Hero'
  const brief = input.brief || input.sceneBrief || 'playing outside'
  const second = input.secondCharacter
    ? ` with friend character ${input.secondCharacter}`
    : ''
  const editHint =
    input.editor === 'editor_expression'
      ? 'same outfit and face proportions, change facial expression only'
      : input.editor === 'editor_action'
        ? 'same character identity, change pose/action'
        : input.editor === 'editor_background'
          ? 'same character identity, change outfit or setting as described'
          : 'same character identity as the reference hero'
  return [
    `Children's book scene: ${name}${second} ${brief}.`,
    editHint,
    KIDS_STYLE,
  ].join(' ')
}

export async function fetchImageBuffer(url) {
  if (!url || typeof url !== 'string') {
    throw Object.assign(new Error('Missing image URL for processing'), {
      status: 400,
      code: 'image_url_required',
    })
  }
  if (url.startsWith('data:')) {
    const m = url.match(/^data:([^;]+);base64,(.+)$/)
    if (!m) {
      throw Object.assign(new Error('Invalid data URL'), { status: 400, code: 'bad_data_url' })
    }
    return { buffer: Buffer.from(m[2], 'base64'), mime: m[1] }
  }
  const res = await fetch(url)
  if (!res.ok) {
    throw Object.assign(new Error(`Failed to fetch image (${res.status})`), {
      status: 502,
      code: 'image_fetch_failed',
    })
  }
  const mime = res.headers.get('content-type') || 'image/png'
  const buffer = Buffer.from(await res.arrayBuffer())
  return { buffer, mime }
}

/**
 * Resize/encode to PNG. Used after AI upscale to hit exact Neolemon-style 2.5×
 * (1024→2560) or KDP bleed pixel targets.
 */
export async function toPngDataUrl(buffer, { width, height } = {}) {
  let pipeline = sharp(buffer).rotate()
  if (width && height) {
    pipeline = pipeline.resize(width, height, {
      fit: 'fill',
      kernel: sharp.kernel.lanczos3,
    })
  }
  const out = await pipeline.png({ compressionLevel: 9 }).toBuffer()
  const meta = await sharp(out).metadata()
  return {
    dataUrl: `data:image/png;base64,${out.toString('base64')}`,
    width: meta.width,
    height: meta.height,
    mime: 'image/png',
    bytes: out.length,
  }
}

export function assetId(prefix = 'img') {
  return `${prefix}_${randomToken(8)}`
}

/** Default Neolemon-style factor when only base size is known. */
export const PRINT_UPSCALE_FACTOR = 2.5
