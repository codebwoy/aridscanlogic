/**
 * KDP AI disclosure helper logic from source S20–S22.
 * Edge cases default to "disclose" (cautious). Config-backed wording lives in launchpad seed.
 */

/**
 * @param {{ generationMode: 'prompt'|'enhance_hand_painted'|'mixed'|'unknown', usedAi: boolean }} input
 * @returns {{ recommendDisclose: boolean, kdpCategory: string, rationale: string, sourceIds: string[] }}
 */
export function assessDisclosure(input) {
  const usedAi = Boolean(input?.usedAi)
  const mode = input?.generationMode || 'unknown'

  if (!usedAi) {
    return {
      recommendDisclose: false,
      kdpCategory: 'not_ai',
      rationale: 'No AI involvement reported for this asset.',
      sourceIds: [],
    }
  }

  if (mode === 'prompt') {
    return {
      recommendDisclose: true,
      kdpCategory: 'ai_generated',
      rationale: 'AI generated an image from a prompt → disclose as AI-generated (S21).',
      sourceIds: ['S21'],
    }
  }

  if (mode === 'enhance_hand_painted') {
    return {
      recommendDisclose: false,
      kdpCategory: 'ai_assisted',
      rationale:
        'Source text: AI used to enhance a hand-painted image → AI-assisted, no disclosure (S22). Verify against current KDP wording.',
      sourceIds: ['S22'],
      verificationNote: true,
    }
  }

  // mixed / unknown — cautious default
  return {
    recommendDisclose: true,
    kdpCategory: 'ai_generated',
    rationale:
      'Edge case or mixed workflow — default recommendation is to disclose until you verify KDP rules for your case.',
    sourceIds: ['S20', 'S21'],
    verificationNote: true,
  }
}
