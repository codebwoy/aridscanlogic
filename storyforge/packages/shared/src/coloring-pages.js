/**
 * Coloring pages from approved story art — line-art on white for print companions.
 * Source: craft COLORING_PAGE_WORKFLOW (S50). Job: coloring_all_pages (S70).
 * Not affiliated with Amazon. Be honest in listings about B&W vs color interiors.
 */

export const COLORING_PAGES_META = {
  id: 'coloring_pages',
  title: 'Coloring pages from story art',
  sourceIds: ['S70', 'S50'],
  disclaimer:
    'Derives clean line-art from approved color story pages so the character stays consistent. Export is for coloring / activity companions — disclose B&W interiors honestly on KDP. Not affiliated with Amazon.',
}

/**
 * Prompt for converting a finished color scene into a printable coloring page.
 * Callers should pass the page still as the img2img reference (not invent a new character).
 */
export function buildColoringPagePrompt({
  characterName = 'Hero',
  pageBrief = '',
  pageIndex = 0,
} = {}) {
  const name = String(characterName || 'Hero').trim() || 'Hero'
  const brief = String(pageBrief || '').trim().slice(0, 160)
  const sceneBit = brief ? ` Keep the same composition as: ${brief}.` : ''
  return [
    `Convert this children’s picture-book illustration of ${name} into a PRINTABLE COLORING PAGE.`,
    'Clean black outlines only on pure white background.',
    'No gray fills, no color, no screentones, no gradients, no watercolor texture.',
    'Thick friendly kid-friendly line weight; large open regions to color.',
    'Preserve character identity, pose, and silhouette from the reference image.',
    'No text, no numbers, no logos, no watermark, no signature.',
    `Page ${Number(pageIndex) + 1}.${sceneBit}`,
  ].join(' ')
}

export function countPagesWithArt(pages = []) {
  return (pages || []).filter((p) => p?.asset?.url || p?.asset?.remoteUrl).length
}

export function countPagesWithColoring(pages = []) {
  return (pages || []).filter((p) => p?.coloring_asset?.url || p?.coloring_asset?.remoteUrl).length
}

export function assessColoringPages(project) {
  const pages = project?.pages || []
  const withArt = countPagesWithArt(pages)
  const withColoring = countPagesWithColoring(pages)
  const issues = []
  if (!project?.pinned_anchor?.heroUrl) {
    issues.push({ severity: 'block', message: 'Pin Character Turbo before deriving coloring pages' })
  }
  if (withArt === 0) {
    issues.push({
      severity: 'block',
      message: 'Illustrate story pages first — coloring pages are derived from approved color art',
    })
  }
  if (withArt > 0 && withColoring === 0) {
    issues.push({
      severity: 'warn',
      message: 'No coloring pages yet — run Derive coloring pages',
    })
  }
  return {
    withArt,
    withColoring,
    issues,
    meta: COLORING_PAGES_META,
  }
}

export function coloringPagesPayload() {
  return {
    meta: COLORING_PAGES_META,
  }
}
