/**
 * Rules-based listing image plan — no vision AI, no generated product photos.
 * Seller ticks which shot types they already have.
 */

import { normalizeProductData } from './schema'

/** @typedef {{ id: string, de: string, en: string, required?: boolean }} ImageShot */

/** @type {ImageShot[]} */
const BASE_SHOTS = [
  { id: 'main', de: 'Hauptbild (Produkt klar, neutraler Hintergrund)', en: 'Main image (clear product, neutral background)', required: true },
  { id: 'detail', de: 'Detail / Material-Nahaufnahme', en: 'Detail / material close-up' },
  { id: 'dimensions', de: 'Maßzeichnung / Größenangabe im Bild', en: 'Dimension diagram / size in image' },
  { id: 'contents', de: 'Lieferumfang (alles was enthalten ist)', en: 'Delivery contents (everything included)' },
  { id: 'lifestyle', de: 'Lifestyle / Anwendungskontext', en: 'Lifestyle / use context' },
  { id: 'back', de: 'Rückseite / Unterseite', en: 'Back / underside' },
  { id: 'packaging', de: 'Verpackung (falls relevant)', en: 'Packaging (if relevant)' },
]

function categoryExtras(product) {
  const blob = `${product.produkttyp || ''} ${product.category_hint || ''}`.toLowerCase()
  /** @type {ImageShot[]} */
  const extra = []
  if (/möbel|stuhl|schrank|tisch|sofa|regal|furniture/.test(blob)) {
    extra.push({
      id: 'assembly',
      de: 'Montagehinweis / Aufbau-Schritte',
      en: 'Assembly hint / build steps',
    })
  }
  if (/elektr|akku|ladegerät|lampe|licht/.test(blob)) {
    extra.push({
      id: 'label',
      de: 'Typenschild / Anschluss / CE-Hinweis (nur wenn vorhanden)',
      en: 'Type plate / connector / CE mark (only if real)',
    })
  }
  if (/textil|kleid|shirt|hose|jacke/.test(blob)) {
    extra.push({
      id: 'care',
      de: 'Pflegeetikett / Größenvergleich',
      en: 'Care label / size comparison',
    })
  }
  return extra
}

/**
 * @param {{ product?: object, checklist?: Record<string, boolean> }} args
 * @returns {{
 *   shots: ImageShot[],
 *   score: number,
 *   missingRequired: ImageShot[],
 *   missingOptional: ImageShot[],
 *   checkedCount: number,
 * }}
 */
export function analyzeImagePlan({ product, checklist = {} } = {}) {
  const p = normalizeProductData(product || {})
  const shots = [...BASE_SHOTS, ...categoryExtras(p)]
  const checked = checklist && typeof checklist === 'object' ? checklist : {}

  const missingRequired = []
  const missingOptional = []
  let checkedCount = 0

  for (const shot of shots) {
    if (checked[shot.id]) {
      checkedCount += 1
    } else if (shot.required) {
      missingRequired.push(shot)
    } else {
      missingOptional.push(shot)
    }
  }

  const requiredTotal = shots.filter((s) => s.required).length || 1
  const requiredOk = requiredTotal - missingRequired.length
  const optionalTotal = shots.length - requiredTotal || 1
  const optionalOk = Math.max(0, checkedCount - requiredOk)

  const score = Math.round(
    Math.min(100, (requiredOk / requiredTotal) * 70 + (optionalOk / optionalTotal) * 30)
  )

  return {
    shots,
    score: Math.max(0, Math.min(100, score)),
    missingRequired,
    missingOptional: missingOptional.slice(0, 6),
    checkedCount,
  }
}

export function emptyImageChecklist() {
  return {}
}
