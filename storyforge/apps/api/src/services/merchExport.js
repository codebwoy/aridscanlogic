import sharp from 'sharp'
import { PUBLISHING_SPECS } from '@storyforge/shared'
import { fetchImageBuffer } from '../providers/imageUtils.js'
import { attachSignedDownload } from './exportStore.js'

/**
 * Build a Merch-oriented PNG from the pinned Character Turbo hero.
 * Centers the character on a transparent (or white) canvas at Amazon Merch template size.
 */
export async function buildMerchPngFromHero({
  heroUrl,
  title = 'character',
  background = 'transparent',
  userId,
}) {
  if (!heroUrl) {
    const err = new Error('Pinned Character Turbo anchor required for Merch PNG')
    err.status = 400
    err.code = 'anchor_required'
    throw err
  }

  const canvas = PUBLISHING_SPECS.merch?.canvasPx || { width: 4500, height: 5400 }
  const targetW = canvas.width
  const targetH = canvas.height
  const { buffer } = await fetchImageBuffer(heroUrl)

  // Fit character inside Merch canvas with padding; keep aspect ratio
  const pad = Math.round(Math.min(targetW, targetH) * 0.08)
  const innerW = targetW - pad * 2
  const innerH = targetH - pad * 2

  let characterPng
  try {
    characterPng = await sharp(buffer, { density: 300 })
      .rotate()
      .resize(innerW, innerH, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer()
  } catch {
    // Fallback for odd SVG/mock assets — rasterize to square then contain
    characterPng = await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: background === 'white' ? 1 : 0 },
      },
    })
      .composite([
        {
          input: await sharp(buffer).resize(900, 900, { fit: 'inside' }).png().toBuffer(),
          gravity: 'centre',
        },
      ])
      .png()
      .toBuffer()
    characterPng = await sharp(characterPng)
      .resize(innerW, innerH, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()
  }

  const baseBg =
    background === 'white'
      ? { r: 255, g: 255, b: 255, alpha: 1 }
      : { r: 0, g: 0, b: 0, alpha: 0 }

  const out = await sharp({
    create: {
      width: targetW,
      height: targetH,
      channels: 4,
      background: baseBg,
    },
  })
    .composite([{ input: characterPng, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toBuffer()

  const meta = await sharp(out).metadata()
  const slug = String(title || 'character')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'character'
  const filename = `${slug}-merch-${targetW}x${targetH}.png`
  const dataUrl = `data:image/png;base64,${out.toString('base64')}`

  const raw = {
    mime: 'image/png',
    filename,
    dataUrl,
    bytes: out,
    byteLength: out.length,
    width: meta.width,
    height: meta.height,
    printReady: meta.width >= targetW && meta.height >= targetH,
    merch: {
      ...PUBLISHING_SPECS.merch,
      background,
      note: PUBLISHING_SPECS.merch?.note,
    },
    specsLastVerified: PUBLISHING_SPECS.lastVerified,
    checklist: [
      'Upload PNG to Merch by Amazon (manual) — StoryForge does not auto-upload',
      'Keep design inside safe print area; avoid tiny text',
      'Disclose AI-assisted art if Amazon requires it for your listing',
      PUBLISHING_SPECS.disclaimers?.notAffiliated || '',
    ].filter(Boolean),
  }

  return attachSignedDownload(raw, { userId, stripDataUrlAbove: 400_000 })
}
