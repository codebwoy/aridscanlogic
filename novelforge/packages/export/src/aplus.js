/** Amazon A+ style module SVGs at common widths */

export function buildAPlusModuleSvg({
  type = 'cover_spotlight',
  title = '',
  author = '',
  points = [],
  width = 970,
  height = 600,
} = {}) {
  const esc = (s) =>
    String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

  const bullets = (points.length ? points : ['Clear framework', 'Honest first draft', 'Editable by you'])
    .slice(0, 4)
    .map((p, i) => `<text x="80" y="${220 + i * 48}" fill="#e8eef6" font-family="Georgia, serif" font-size="28">• ${esc(p)}</text>`)
    .join('\n')

  const heading =
    type === 'author_spotlight'
      ? `About ${esc(author || 'the author')}`
      : type === 'checklist'
        ? 'Inside this book'
        : esc(title || 'Inside the book')

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#141a22"/>
  <rect x="24" y="24" width="${width - 48}" height="${height - 48}" fill="#1c2430" stroke="#c4a574" stroke-width="2"/>
  <text x="80" y="120" fill="#c4a574" font-family="Avenir Next, sans-serif" font-size="22" letter-spacing="4">A+ MODULE · ${esc(type.toUpperCase())}</text>
  <text x="80" y="180" fill="#f3e6d0" font-family="Georgia, serif" font-size="42" font-weight="700">${heading}</text>
  ${bullets}
  <text x="80" y="${height - 60}" fill="#9aa8bc" font-family="Avenir Next, sans-serif" font-size="18">NovelForge export — verify Amazon A+ image specs before upload</text>
</svg>`

  return {
    bytes: new TextEncoder().encode(svg),
    mime: 'image/svg+xml',
    width,
    height,
    type,
  }
}
