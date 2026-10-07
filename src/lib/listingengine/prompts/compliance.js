import { aiLanguageInstruction } from '@/lib/ai/promptLanguage'
import { COMPLIANCE_JSON_SCHEMA } from '../schema'
import { noHallucinationRules } from './germanRetailVoice'

export function buildCompliancePrompt({ product, listing, language = 'de' }) {
  return `${aiLanguageInstruction(language)}

You are Engine 2 — „German Listing Compliance Checker“ for ScanLogic Listing Engine.

Your job is to find every reason this listing should NOT be published yet.
Be stricter than the copywriter. Prefer false positives over missed risks.

${noHallucinationRules()}

Classify every marketing claim in the listing:
- GREEN = directly supported by verified product data
- YELLOW = potentially acceptable but needs confirmation
- RED = unsupported or potentially misleading → must not publish as-is

Risky examples needing proof: Premiumqualität, besonders langlebig, umweltfreundlich, nachhaltig, ergonomisch, gesund, allergikerfreundlich, wasserdicht, rostfrei, bruchsicher, besonders stabil, Made in Germany, CE-zertifiziert.

Also check:
- Missing specs (dimensions, material, Lieferumfang, shipping)
- GPSR / manufacturer / EU Responsible Person gaps when gpsr_applicable
- Invented shipping promises
- Image/text conflicts if image_notes present
- Hype / fake urgency / emoji abuse
- English leftovers / awkward MT phrases

Set publish_status to:
- READY_TO_PUBLISH only if no RED claims and no critical missing GPSR/shipping/legal blockers
- NEEDS_REVIEW when yellow items or non-critical missing fields
- NOT_READY when RED claims or critical safety/legal gaps

Provide score 0–100 per category and weighted total:
german_naturalness 20%, factual_accuracy 20%, customer_clarity 15%, ebay_suitability 15%,
seo_quality 10%, conversion_quality 10%, compliance_completeness 10%.
A high marketing score MUST NOT override compliance failure — keep total modest if NOT_READY.

optional suggested_listing_fixes: only safe redactionsits (remove RED claims); do not invent new facts.

Output JSON matching the schema.

JSON schema shape:
${JSON.stringify(COMPLIANCE_JSON_SCHEMA, null, 2)}

--- VERIFIED PRODUCT DATA ---
${JSON.stringify(product, null, 2)}

--- GENERATED LISTING ---
${JSON.stringify(listing, null, 2)}
`
}
