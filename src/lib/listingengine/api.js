/**
 * Listing Engine LLM orchestration via appApi → /api/llm.
 * Engine 1 = German Copywriter · Engine 2 = Compliance Checker
 */

import appApi from '@/lib/appApi'
import {
  PRODUCT_EXTRACT_JSON_SCHEMA,
  LISTING_COPY_JSON_SCHEMA,
  COMPLIANCE_JSON_SCHEMA,
  normalizeProductData,
  normalizeListingCopy,
  normalizeCompliance,
  normalizeScore,
  emptyProductData,
} from './schema'
import { buildExtractPrompt, buildCopywriterPrompt, buildCompliancePrompt } from './prompts'
import { mergeComplianceGuards, stripRedClaimsFromListing } from './validateClaims'
import { finalizeScore, localFallbackScore, computeWeightedTotal } from './score'
import { canRunGeneration, recordGenerationUse } from './store'

function unwrapParsed(res) {
  return res?.parsed || res?.data || {}
}

export async function extractProductData(rawText, language = 'de') {
  if (!String(rawText || '').trim()) {
    throw new Error('Lieferanten-/Produktdaten fehlen.')
  }
  const res = await appApi.integrations.Core.InvokeLLM({
    prompt: buildExtractPrompt({ rawText, language }),
    response_json_schema: PRODUCT_EXTRACT_JSON_SCHEMA,
  })
  const parsed = unwrapParsed(res)
  const product = normalizeProductData(parsed)
  return {
    product,
    missing_fields: Array.isArray(parsed.missing_fields) ? parsed.missing_fields : [],
    supplier_claims_to_verify: Array.isArray(parsed.supplier_claims_to_verify)
      ? parsed.supplier_claims_to_verify
      : [],
  }
}

export async function generateListingCopy({ product, mode = 'complete', existingListing = null, language = 'de' }) {
  const res = await appApi.integrations.Core.InvokeLLM({
    prompt: buildCopywriterPrompt({ product, mode, existingListing, language }),
    response_json_schema: LISTING_COPY_JSON_SCHEMA,
  })
  return normalizeListingCopy(unwrapParsed(res))
}

export async function runComplianceCheck({ product, listing, language = 'de' }) {
  const res = await appApi.integrations.Core.InvokeLLM({
    prompt: buildCompliancePrompt({ product, listing, language }),
    response_json_schema: COMPLIANCE_JSON_SCHEMA,
  })
  const parsed = unwrapParsed(res)
  let compliance = normalizeCompliance(parsed)
  compliance = mergeComplianceGuards(product, listing, compliance)

  let score = normalizeScore(parsed.score || {})
  if (!score.total) score.total = computeWeightedTotal(score)
  if (!score.german_naturalness && !parsed.score) {
    score = localFallbackScore(listing, compliance)
  } else {
    score = finalizeScore(score, compliance.publish_status)
  }

  let suggested = null
  if (parsed.suggested_listing_fixes && typeof parsed.suggested_listing_fixes === 'object') {
    suggested = normalizeListingCopy(parsed.suggested_listing_fixes)
  }

  return { compliance, score, suggested }
}

/**
 * Full pipeline: extract → copywriter → compliance → optional red-claim strip.
 */
export async function runListingPipeline({
  rawText,
  productOverride = null,
  mode = 'complete',
  existingListing = null,
  language = 'de',
  onPhase,
  stripRed = true,
}) {
  if (!canRunGeneration()) {
    throw new Error(
      'Tageslimit für Listing-Engine-Generierungen erreicht. Bitte morgen erneut versuchen.'
    )
  }

  let product = productOverride ? normalizeProductData(productOverride) : emptyProductData()
  let extractMeta = { missing_fields: [], supplier_claims_to_verify: [] }

  if (mode === 'compliance' && existingListing) {
    onPhase?.('compliance')
    const { compliance, score, suggested } = await runComplianceCheck({
      product,
      listing: existingListing,
      language,
    })
    recordGenerationUse(1)
    return {
      product,
      listing: existingListing,
      compliance,
      score,
      extractMeta,
      suggested,
    }
  }

  const raw = String(rawText || '').trim()
  if (raw.length > 40) {
    onPhase?.('extracting')
    const extracted = await extractProductData(raw, language)
    // Manual product fields win over extracted values when non-empty
    const override = productOverride ? normalizeProductData(productOverride) : null
    if (override) {
      const merged = { ...extracted.product }
      for (const [k, v] of Object.entries(override)) {
        if (v == null || v === '' || (Array.isArray(v) && !v.length)) continue
        if (typeof v === 'object' && !Array.isArray(v)) {
          merged[k] = { ...(merged[k] || {}), ...Object.fromEntries(
            Object.entries(v).filter(([, val]) => val != null && val !== '')
          ) }
        } else {
          merged[k] = v
        }
      }
      product = normalizeProductData(merged)
    } else {
      product = extracted.product
    }
    extractMeta = {
      missing_fields: extracted.missing_fields,
      supplier_claims_to_verify: extracted.supplier_claims_to_verify,
    }
  }

  onPhase?.('copywriting')
  let listing = await generateListingCopy({
    product,
    mode: mode === 'compliance' ? 'complete' : mode,
    existingListing,
    language,
  })

  onPhase?.('compliance')
  let { compliance, score, suggested } = await runComplianceCheck({
    product,
    listing,
    language,
  })

  if (extractMeta.missing_fields.length) {
    compliance = normalizeCompliance({
      ...compliance,
      missing: [...new Set([...(compliance.missing || []), ...extractMeta.missing_fields])],
    })
  }
  if (extractMeta.supplier_claims_to_verify.length) {
    compliance = normalizeCompliance({
      ...compliance,
      warnings: [
        ...compliance.warnings,
        ...extractMeta.supplier_claims_to_verify.map(
          (c) => `Lieferantenangabe prüfen: ${c}`
        ),
      ],
    })
  }

  if (stripRed && compliance.claims.some((c) => c.level === 'RED')) {
    listing = stripRedClaimsFromListing(listing, compliance.claims)
    // Re-merge guards after strip (may clear some REDs from text)
    compliance = mergeComplianceGuards(product, listing, {
      ...compliance,
      claims: compliance.claims.map((c) =>
        c.level === 'RED'
          ? { ...c, reason: `${c.reason} (aus Marketingtext entfernt — bitte Daten prüfen)` }
          : c
      ),
    })
    score = finalizeScore(score, compliance.publish_status)
  }

  recordGenerationUse(1)

  return {
    product,
    listing: suggested && mode === 'improve' ? suggested : listing,
    compliance,
    score,
    extractMeta,
    suggested,
  }
}
