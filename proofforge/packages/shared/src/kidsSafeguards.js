/**
 * Children's / YA content safeguards — soft flags only.
 * Never generates or expands sexual content involving minors.
 */

const AGE_RISK = [
  /\bexplicit\s+sex\b/i,
  /\berotic\b/i,
  /\bpornograph/i,
  /\bnude\s+scene\b/i,
  /\bgraphic\s+violence\b/i,
]

export function kidsSafeguardFindings(text, bookType = '') {
  const kids =
    /children|kids|picture|middle.?grade|young.?adult|ya\b|juvenile/i.test(String(bookType)) ||
    bookType === 'children'
  if (!kids) return []
  const out = []
  const sample = String(text || '').slice(0, 100_000)
  for (const re of AGE_RISK) {
    const m = sample.match(re)
    if (m) {
      out.push({
        category: 'kdp_policy',
        subcategory: 'age_appropriateness',
        severity: 'major',
        title: 'Age-appropriateness review needed',
        explanation:
          'Children’s / YA project: flagged phrasing may need human review for age suitability and KDP content guidelines. This is a soft safeguard — not a legal determination.',
        original_excerpt: m[0],
        suggested_correction: '',
        reason: 'kids_safeguard',
        confidence: 0.7,
        objective: false,
      })
    }
  }
  out.push({
    category: 'kdp_policy',
    subcategory: 'age_appropriateness',
    severity: 'needs_verification',
    title: 'Confirm target reader age',
    explanation:
      'For children’s books, confirm target age band and that content, illustrations, and marketing match. Prefer StoryForge for picture-book art workflows.',
    original_excerpt: 'children / YA project',
    suggested_correction: '',
    reason: 'kids_safeguard_reminder',
    confidence: 0.85,
    objective: false,
  })
  return out
}
