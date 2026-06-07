/** Canvas-based document image filters — exact luminance coefficients per spec */

const LUMA_R = 0.2126
const LUMA_G = 0.7152
const LUMA_B = 0.0722

export function luminance(r, g, b) {
  return LUMA_R * r + LUMA_G * g + LUMA_B * b
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function getImageDataFromSrc(imageSrc) {
  return loadImage(imageSrc).then((img) => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    return { canvas, ctx, imageData: ctx.getImageData(0, 0, canvas.width, canvas.height) }
  })
}

/** Grayscale: 0.2126 * r + 0.7152 * g + 0.0722 * b */
export function applyFilter(imageSrc, filter) {
  return getImageDataFromSrc(imageSrc).then(({ canvas, ctx, imageData }) => {
    const d = imageData.data
    const w = canvas.width
    const h = canvas.height

    if (filter === 'grayscale') {
      for (let i = 0; i < d.length; i += 4) {
        const gray = luminance(d[i], d[i + 1], d[i + 2])
        d[i] = d[i + 1] = d[i + 2] = gray
      }
    } else if (filter === 'high-contrast') {
      const lums = []
      for (let i = 0; i < d.length; i += 4) {
        lums.push(luminance(d[i], d[i + 1], d[i + 2]))
      }
      let minL = 255
      let maxL = 0
      for (const l of lums) {
        if (l < minL) minL = l
        if (l > maxL) maxL = l
      }
      const range = maxL - minL || 1
      const lowThresh = 0.38
      const highThresh = 0.62
      for (let i = 0, p = 0; i < d.length; i += 4, p++) {
        const normalized = (lums[p] - minL) / range
        let v
        if (normalized < lowThresh) v = 0
        else if (normalized > highThresh) v = 255
        else v = ((normalized - lowThresh) / (highThresh - lowThresh)) * 255
        d[i] = d[i + 1] = d[i + 2] = Math.round(v)
      }
    } else if (filter === 'magic-color') {
      const copy = new Uint8ClampedArray(d)
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const at = (py, px) => ((y + py) * w + (x + px)) * 4
          const i = (y * w + x) * 4
          const lumC = luminance(copy[i], copy[i + 1], copy[i + 2])
          const lumN = luminance(copy[at(-1, 0)], copy[at(-1, 0) + 1], copy[at(-1, 0) + 2])
          const lumS = luminance(copy[at(1, 0)], copy[at(1, 0) + 1], copy[at(1, 0) + 2])
          const lumE = luminance(copy[at(0, 1)], copy[at(0, 1) + 1], copy[at(0, 1) + 2])
          const lumW = luminance(copy[at(0, -1)], copy[at(0, -1) + 1], copy[at(0, -1) + 2])
          const edge = Math.abs(lumC * 4 - lumN - lumS - lumE - lumW)
          let r = copy[i]
          let g = copy[i + 1]
          let b = copy[i + 2]
          if (edge > 12) {
            const sharpen = 1.35
            r = Math.min(255, Math.max(0, lumC + (r - lumC) * sharpen))
            g = Math.min(255, Math.max(0, lumC + (g - lumC) * sharpen))
            b = Math.min(255, Math.max(0, lumC + (b - lumC) * sharpen))
          }
          if (lumC < 200 && lumC > 30) {
            const sat = 1.45
            r = Math.min(255, lumC + (r - lumC) * sat)
            g = Math.min(255, lumC + (g - lumC) * sat)
            b = Math.min(255, lumC + (b - lumC) * sat)
          }
          d[i] = r
          d[i + 1] = g
          d[i + 2] = b
        }
      }
    }

    ctx.putImageData(imageData, 0, 0)
    return canvas.toDataURL('image/jpeg', 0.92)
  })
}

export async function eraseBackground(imageSrc) {
  const { canvas, ctx, imageData } = await getImageDataFromSrc(imageSrc)
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    const lum = luminance(d[i], d[i + 1], d[i + 2])
    if (lum > 200) {
      const blend = (lum - 200) / 55
      d[i] = d[i] + (255 - d[i]) * blend * 0.85
      d[i + 1] = d[i + 1] + (255 - d[i + 1]) * blend * 0.85
      d[i + 2] = d[i + 2] + (255 - d[i + 2]) * blend * 0.85
    }
  }
  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL('image/jpeg', 0.92)
}

export function perspectiveCrop(imageSrc, corners, width = 800, height = 1100) {
  return loadImage(imageSrc).then((img) => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    const [tl, tr, br, bl] = corners
    const minX = Math.min(tl.x, tr.x, br.x, bl.x) * img.width
    const minY = Math.min(tl.y, tr.y, br.y, bl.y) * img.height
    const maxX = Math.max(tl.x, tr.x, br.x, bl.x) * img.width
    const maxY = Math.max(tl.y, tr.y, br.y, bl.y) * img.height
    ctx.drawImage(img, minX, minY, maxX - minX, maxY - minY, 0, 0, width, height)
    return canvas.toDataURL('image/jpeg', 0.92)
  })
}

/** DataURL (JPEG) → Blob → File for appApi.integrations.Core.UploadFile({ file }) */
export async function dataUrlToJpegFile(dataUrl, filename) {
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  return new File([blob], filename, { type: 'image/jpeg' })
}

export async function canvasDataUrlToJpegFile(dataUrl, pageIndex) {
  return dataUrlToJpegFile(dataUrl, `scan-page-${pageIndex + 1}.jpg`)
}

/** Downscale large scans before localStorage / DB persistence. */
export async function capImageDataUrl(dataUrl, maxDim = 1920, quality = 0.85) {
  const img = await loadImage(dataUrl)
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
  if (scale >= 1) return dataUrl
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * scale)
  canvas.height = Math.round(img.height * scale)
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', quality)
}
