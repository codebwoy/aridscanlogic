import { aiLanguageInstruction } from '@/lib/ai/promptLanguage'
import { PRODUCT_EXTRACT_JSON_SCHEMA } from '../schema'
import { noHallucinationRules } from './germanRetailVoice'

export function buildExtractPrompt({ rawText, language = 'de' }) {
  return `${aiLanguageInstruction(language)}

You are a product-data extractor for German eBay.de / e-commerce listings (ScanLogic Listing Engine).

Extract ONLY facts that appear in the supplier material below.
${noHallucinationRules()}

Rules:
1. Reconstruct meaning; do not invent specs.
2. Mark spezifikationen.source as "verified" only when clearly stated; otherwise "supplier_claim".
3. Put unknown important fields into missing_fields (German labels).
4. Put marketing claims that need human verification into supplier_claims_to_verify.
5. Keep units with values (e.g. "76 cm").
6. If GPSR/manufacturer data is absent, leave those fields empty and list them in missing_fields.
7. Output JSON matching the schema. Empty string for unknown scalars; empty arrays when none.

JSON schema shape:
${JSON.stringify(PRODUCT_EXTRACT_JSON_SCHEMA, null, 2)}

--- SUPPLIER / PRODUCT SOURCE ---
${String(rawText || '').slice(0, 48000)}
`
}
