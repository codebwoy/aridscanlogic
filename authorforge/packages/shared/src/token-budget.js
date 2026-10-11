/**
 * WriterAgent context assembly budgets (approximate tokens).
 * See ADR: context-assembly for WriterAgent.
 */

export const WRITER_TOKEN_BUDGETS = {
  universalRules: 1500,
  bookBible: 8000,
  outlineDigest: 3000,
  continuityLedger: 6000,
  previousSection: 4000,
  resourceChunks: 4000,
  nodeBrief: 1500,
  outputReserve: 5000,
}

export function assembleWriterContext({
  bookBible,
  persona,
  styleGuide,
  bannedPhrases = [],
  glossary = [],
  outlineDigest,
  continuity,
  previousSectionMd = '',
  resourceChunks = [],
  node,
  filledStorySlots = [],
}) {
  const budgets = WRITER_TOKEN_BUDGETS
  let continuityText = JSON.stringify(continuity || {}, null, 0)
  if (approxTokens(continuityText) > budgets.continuityLedger) {
    continuityText = compressContinuity(continuity, budgets.continuityLedger)
  }
  let prev = previousSectionMd || ''
  if (approxTokens(prev) > budgets.previousSection) {
    prev = prev.slice(-budgets.previousSection * 4)
  }
  let resources = resourceChunks || []
  while (resources.length && approxTokens(JSON.stringify(resources)) > budgets.resourceChunks) {
    resources = resources.slice(0, -1)
  }

  const staticPrefix = {
    rules: 'UNIVERSAL_COAUTHOR_RULES',
    bookBible,
    persona,
    styleGuide,
    bannedPhrases,
    glossary,
  }

  const dynamic = {
    outlineDigest,
    continuity: continuityText,
    previousSection: prev,
    resources,
    node,
    filledStorySlots,
  }

  const inputHashPayload = JSON.stringify({ staticPrefix, dynamic })
  return {
    staticPrefix,
    dynamic,
    budgets,
    inputHashPayload,
  }
}

export function approxTokens(text) {
  return Math.ceil(String(text || '').length / 4)
}

function compressContinuity(continuity, maxTokens) {
  const c = continuity || {}
  const compact = {
    open_loops: c.open_loops || [],
    used_examples: (c.used_examples || []).slice(-40),
    used_openings: (c.used_openings || []).slice(-20),
    terms: (c.terms || []).slice(-60),
    summaries: (c.summaries || []).map((s) => ({
      id: s.id,
      title: s.title,
      summary: String(s.summary || '').slice(0, 280),
    })),
  }
  let s = JSON.stringify(compact)
  while (approxTokens(s) > maxTokens && compact.summaries.length > 2) {
    compact.summaries.shift()
    s = JSON.stringify(compact)
  }
  return s
}
