import { luminance } from '@/lib/imageProcessing'

/** Detect document bounds from a video frame; returns normalized corners + confidence */
export function detectDocumentEdgesFromVideo(video) {
  const vw = video.videoWidth
  const vh = video.videoHeight
  if (!vw || !vh) return null

  const maxDim = 240
  const scale = maxDim / Math.max(vw, vh)
  const w = Math.max(32, Math.floor(vw * scale))
  const h = Math.max(32, Math.floor(vh * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(video, 0, 0, w, h)
  const { data } = ctx.getImageData(0, 0, w, h)

  const edge = new Float32Array(w * h)
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = (y * w + x) * 4
      const c = luminance(data[i], data[i + 1], data[i + 2])
      const n = luminance(data[((y - 1) * w + x) * 4], data[((y - 1) * w + x) * 4 + 1], data[((y - 1) * w + x) * 4 + 2])
      const s = luminance(data[((y + 1) * w + x) * 4], data[((y + 1) * w + x) * 4 + 1], data[((y + 1) * w + x) * 4 + 2])
      const e = luminance(data[(y * w + (x + 1)) * 4], data[(y * w + (x + 1)) * 4 + 1], data[(y * w + (x + 1)) * 4 + 2])
      const wst = luminance(data[(y * w + (x - 1)) * 4], data[(y * w + (x - 1)) * 4 + 1], data[(y * w + (x - 1)) * 4 + 2])
      edge[y * w + x] = Math.abs(c * 4 - n - s - e - wst)
    }
  }

  const marginX = Math.floor(w * 0.12)
  const marginY = Math.floor(h * 0.12)
  const xStart = marginX
  const xEnd = w - marginX
  const yStart = marginY
  const yEnd = h - marginY

  const rowScore = (y) => {
    let sum = 0
    let n = 0
    for (let x = xStart; x < xEnd; x++) {
      sum += edge[y * w + x]
      n++
    }
    return n ? sum / n : 0
  }

  const colScore = (x) => {
    let sum = 0
    let n = 0
    for (let y = yStart; y < yEnd; y++) {
      sum += edge[y * w + x]
      n++
    }
    return n ? sum / n : 0
  }

  const threshold = 8
  let top = yStart
  for (let y = yStart; y < Math.floor(h * 0.45); y++) {
    if (rowScore(y) > threshold) {
      top = y
      break
    }
  }
  let bottom = yEnd
  for (let y = yEnd - 1; y > Math.floor(h * 0.55); y--) {
    if (rowScore(y) > threshold) {
      bottom = y
      break
    }
  }
  let left = xStart
  for (let x = xStart; x < Math.floor(w * 0.45); x++) {
    if (colScore(x) > threshold) {
      left = x
      break
    }
  }
  let right = xEnd
  for (let x = xEnd - 1; x > Math.floor(w * 0.55); x--) {
    if (colScore(x) > threshold) {
      right = x
      break
    }
  }

  const pad = 0.02
  const nx = (v) => Math.min(1 - pad, Math.max(pad, v / w))
  const ny = (v) => Math.min(1 - pad, Math.max(pad, v / h))

  const area = (right - left) * (bottom - top)
  const minArea = w * h * 0.15
  if (area < minArea || right <= left + 10 || bottom <= top + 10) {
    return {
      corners: [
        { x: 0.1, y: 0.12 },
        { x: 0.9, y: 0.12 },
        { x: 0.9, y: 0.88 },
        { x: 0.1, y: 0.88 },
      ],
      edges: { tl: false, tr: false, br: false, bl: false },
      stable: false,
    }
  }

  const tl = { x: nx(left), y: ny(top) }
  const tr = { x: nx(right), y: ny(top) }
  const br = { x: nx(right), y: ny(bottom) }
  const bl = { x: nx(left), y: ny(bottom) }

  const conf = (corner) => {
    const px = Math.floor(corner.x * w)
    const py = Math.floor(corner.y * h)
    const e = edge[py * w + px] || 0
    return Math.min(1, e / 25)
  }

  return {
    corners: [tl, tr, br, bl],
    edges: {
      tl: conf(tl) > 0.35,
      tr: conf(tr) > 0.35,
      br: conf(br) > 0.35,
      bl: conf(bl) > 0.35,
    },
    stable: conf(tl) > 0.35 && conf(tr) > 0.35 && conf(br) > 0.35 && conf(bl) > 0.35,
  }
}
