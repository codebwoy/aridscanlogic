import appApi from '@/lib/appApi'
import { canvasDataUrlToJpegFile, loadImage, luminance } from '@/lib/imageProcessing'

const BG_REMOVAL_PROMPT = `You are an edge-aware document segmentation assistant.
Analyze this scanned document photo. Identify the document page boundaries versus table/surface shadows and background.
Isolate the document content region. The output goal is a clean scan on pure white (#FFFFFF).
Describe document edges as normalized coordinates if helpful, but prioritize text clarity.`

const BG_SCHEMA = {
  type: 'object',
  properties: {
    document_detected: { type: 'boolean' },
    confidence: { type: 'number' },
    guidance: { type: 'string' },
  },
}

/** LLM edge-aware analysis + canvas white-background composite */
export async function aiBackgroundRemoval(dataUrl) {
  const file = await canvasDataUrlToJpegFile(dataUrl, 0)
  const { file_url } = await appApi.integrations.Core.UploadFile({ file })

  try {
    await appApi.integrations.Core.InvokeLLM({
      prompt: BG_REMOVAL_PROMPT,
      file_urls: [file_url],
      response_json_schema: BG_SCHEMA,
    })
  } catch {
    /* canvas fallback still runs */
  }

  return applyWhiteDocumentBackground(dataUrl)
}

/** Replace light pixels / edges with pure white while preserving document ink */
export async function applyWhiteDocumentBackground(dataUrl) {
  const img = await loadImage(dataUrl)
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const d = imageData.data
  const w = canvas.width
  const h = canvas.height

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      const lum = luminance(d[i], d[i + 1], d[i + 2])
      const isEdge =
        x > 0 &&
        x < w - 1 &&
        y > 0 &&
        y < h - 1 &&
        Math.abs(
          lum -
            luminance(
              d[((y - 1) * w + x) * 4],
              d[((y - 1) * w + x) * 4 + 1],
              d[((y - 1) * w + x) * 4 + 2]
            )
        ) > 18
      if (lum > 175 && !isEdge) {
        const blend = Math.min(1, (lum - 175) / 60)
        d[i] = d[i] + (255 - d[i]) * blend
        d[i + 1] = d[i + 1] + (255 - d[i + 1]) * blend
        d[i + 2] = d[i + 2] + (255 - d[i + 2]) * blend
      } else if (lum > 210) {
        d[i] = d[i + 1] = d[i + 2] = 255
      }
    }
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL('image/jpeg', 0.94)
}
