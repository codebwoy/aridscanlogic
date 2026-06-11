/**
 * Fix collapsed GFM tables and spacing so remark-gfm can parse them.
 */
export function normalizeLawyerMarkdown(markdown) {
  if (!markdown || typeof markdown !== 'string') return ''

  let text = markdown.replace(/\r\n/g, '\n').trim()

  // Header row glued to separator: "| A | B | |---|---|"
  text = text.replace(
    /(\|[^|\n]+(?:\|[^|\n]+)+\|)\s+(\|[-:\s|]+\|)/g,
    '$1\n$2'
  )

  // Separator glued to first data row: "|---|---|| 2026"
  text = text.replace(/(\|[-:\s|]+\|)\s*(\|)/g, '$1\n$2')

  // Data rows glued together on one line
  text = text.replace(
    /(\|[^|\n]+(?:\|[^|\n]+)+\|)\s+(?=\|[^|\n]+\|)/g,
    '$1\n'
  )

  // Ensure blank line before headings after tables/lists
  text = text.replace(/(\|[^|\n]+\|)\n(#{1,3}\s)/g, '$1\n\n$2')

  return text
}
