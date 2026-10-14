/**
 * One Anthropic call cannot reliably finish a full chapter as JSON-wrapped prose.
 * Clamp per-call targets and split oversized chapter leaves into parts.
 */

/** Soft max words per writer call (fits ~16k output tokens with JSON overhead). */
export const MAX_SCENE_DRAFT_WORDS = 2000

/** Anthropic Messages default output ceiling we allow for writer/outline. */
export const WRITER_MAX_OUTPUT_TOKENS = 16_384

export function clampDraftTargetWords(targetWords, max = MAX_SCENE_DRAFT_WORDS) {
  const n = Number(targetWords)
  const base = Number.isFinite(n) && n > 0 ? Math.floor(n) : 800
  return Math.min(Math.max(base, 200), max)
}

/** Rough max_tokens budget from target words (+ JSON / metadata headroom). */
export function maxTokensForDraftWords(targetWords) {
  const words = clampDraftTargetWords(targetWords)
  // ~3 tokens/word worst-case + JSON keys / escaping overhead
  return Math.min(WRITER_MAX_OUTPUT_TOKENS, Math.max(6144, Math.ceil(words * 3) + 1500))
}

/**
 * If a chapter is a single oversized leaf, split into sequential draft parts.
 * @param {{ title?: string, writing_direction?: string, target_words?: number, children?: unknown[] }} chapter
 * @param {number} chapterIndex
 * @param {(node: object, path: string) => { key: string, node: object }[]} flattenLeafNodes
 */
export function chapterDraftNodes(chapter, chapterIndex, flattenLeafNodes) {
  const path = `c${chapterIndex}`
  const leaves = flattenLeafNodes(chapter, path)
  if (leaves.length > 1) {
    return leaves.map(({ key, node }) => ({
      key,
      node: { ...node, target_words: clampDraftTargetWords(node.target_words) },
    }))
  }
  const leaf = leaves[0]
  if (!leaf) return []
  const tw = Number(leaf.node.target_words) || 2000
  if (tw <= MAX_SCENE_DRAFT_WORDS) {
    return [
      {
        key: leaf.key,
        node: { ...leaf.node, target_words: clampDraftTargetWords(tw) },
      },
    ]
  }
  const parts = Math.ceil(tw / MAX_SCENE_DRAFT_WORDS)
  const per = Math.ceil(tw / parts)
  const direction = String(leaf.node.writing_direction || '').trim()
  return Array.from({ length: parts }, (_, i) => ({
    key: `${path}.p${i}`,
    node: {
      ...leaf.node,
      title: `${leaf.node.title || `Chapter ${chapterIndex + 1}`} — part ${i + 1}/${parts}`,
      writing_direction: [
        direction,
        `Write ONLY part ${i + 1} of ${parts} for this chapter (~${per} words).`,
        'End on a natural beat. Do not summarize later parts. Complete the JSON object fully.',
      ]
        .filter(Boolean)
        .join('\n'),
      target_words: clampDraftTargetWords(per),
    },
  }))
}
