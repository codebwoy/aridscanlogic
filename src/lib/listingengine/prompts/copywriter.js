import { aiLanguageInstruction } from '@/lib/ai/promptLanguage'
import { LISTING_COPY_JSON_SCHEMA } from '../schema'
import { germanRetailVoiceRules, noHallucinationRules } from './germanRetailVoice'

export function buildCopywriterPrompt({ product, mode = 'complete', existingListing = null, language = 'de' }) {
  const modeHints = {
    complete:
      'Generate a full eBay.de listing: titles, mobile short description (strong first 250–800 chars), body, benefits, details, FAQ.',
    seo: 'Improve SEO title and natural search phrasing ONLY. Do not change factual information.',
    rewrite:
      'Rewrite existing German text so it sounds like a professional German retailer wrote it originally. Preserve every fact.',
    translate:
      'Convert supplier information into natural German retail copy. Preserve factual accuracy. Do not literal-translate awkwardly.',
    improve:
      'Improve conversion and clarity while preserving every factual constraint. Remove hype. Strengthen structure.',
    compliance: 'Do not rewrite marketing; return empty strings / empty arrays (compliance is a separate pass).',
  }

  return `${aiLanguageInstruction(language)}

You are Engine 1 — „German Copywriter“ for ScanLogic Listing Engine (eBay.de commercial sellers).

${germanRetailVoiceRules()}
${noHallucinationRules()}

Mode: ${mode}
${modeHints[mode] || modeHints.complete}

Structure requirements for complete/translate/improve/rewrite:
1. titel: Produkttyp + Marke + Modell + wichtigstes Merkmal + Farbe/Größe + ggf. Anzahl — factual, not advertising
2. seo_titel / mobil_titel: variants without marketing fluff
3. kurzbeschreibung: starts with the product (no „Willkommen in unserem Shop“); what / for whom / key benefit / key specs
4. produktbeschreibung: 1–3 short paragraphs
5. vorteile: 4–7 concise bullets, each factually supported
6. produktdetails, masse_text, material_text, farbe_text, ausstattung, lieferumfang, montage_text, hinweise
7. versand_text: ONLY from product.shipping verified values; if empty, write a neutral placeholder that seller must fill — do NOT invent times/costs
8. faq: factual Q&A; set flagged=true if answer unknown
9. kundenservice: restrained professional line using "Sie"

Output JSON matching the schema.

JSON schema shape:
${JSON.stringify(LISTING_COPY_JSON_SCHEMA, null, 2)}

--- VERIFIED PRODUCT DATA (JSON) ---
${JSON.stringify(product, null, 2)}

--- EXISTING LISTING (if any) ---
${existingListing ? JSON.stringify(existingListing, null, 2) : '(none)'}
`
}
