import { createWorker } from 'tesseract.js'

const LANG_MAP = {
  eng: 'eng',
  deu: 'deu',
  fra: 'fra',
  spa: 'spa',
  ara: 'ara',
}

export async function runOcrOnImage(imageUrl, language = 'eng', onProgress) {
  const lang = LANG_MAP[language] || language || 'eng'
  const worker = await createWorker(lang, 1, {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round((m.progress || 0) * 100))
      }
    },
  })
  try {
    const { data } = await worker.recognize(imageUrl)
    return data.text?.trim() || ''
  } finally {
    await worker.terminate()
  }
}

export async function runOcrOnPages(pages, language, onProgress) {
  const texts = []
  for (let i = 0; i < pages.length; i++) {
    const url = pages[i].processedImageUrl || pages[i].imageUrl
    if (!url) continue
    onProgress?.(Math.round(((i + 0.5) / pages.length) * 100))
    const text = await runOcrOnImage(url, language)
    texts.push(text)
    pages[i] = { ...pages[i], extractedText: text }
    onProgress?.(Math.round(((i + 1) / pages.length) * 100))
  }
  return { pages, fullText: texts.join('\n\n---\n\n') }
}
