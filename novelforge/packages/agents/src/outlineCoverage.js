/** Acceptance: every selected focus tag maps to ≥1 outline node */

export function flattenOutlineNodes(chapters = []) {
  const out = []
  function walk(nodes, depth = 0) {
    for (const n of nodes || []) {
      out.push({ ...n, depth })
      if (n.children?.length) walk(n.children, depth + 1)
    }
  }
  walk(chapters)
  return out
}

export function focusTagCoverage(selectedTags = [], chapters = []) {
  const nodes = flattenOutlineNodes(chapters)
  const matrix = selectedTags.map((tag) => {
    const hits = nodes.filter((n) => (n.focus_tags || []).includes(tag))
    return {
      tag,
      covered: hits.length > 0,
      nodes: hits.map((h) => h.title),
    }
  })
  const uncovered = matrix.filter((m) => !m.covered).map((m) => m.tag)
  return {
    matrix,
    passed: uncovered.length === 0,
    uncovered,
    nodeCount: nodes.length,
  }
}
