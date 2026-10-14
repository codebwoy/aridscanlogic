import JSZip from 'jszip'

/** Minimal EPUB3 builder for corrected manuscript export. */
export async function buildCorrectedEpub(project) {
  const chapters = Object.values(project.sections || {})
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((s) => ({ title: s.title, content_md: s.content_md }))
  const title = project.title || 'Manuscript'
  const language = project.language || 'en'
  const author = project.author_name || 'Author'

  const zip = new JSZip()
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' })
  zip.folder('META-INF')?.file(
    'container.xml',
    `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`
  )

  const oebps = zip.folder('OEBPS')
  const manifest = []
  const spine = []
  const navPoints = []

  chapters.forEach((ch, i) => {
    const id = `chap${i + 1}`
    const href = `${id}.xhtml`
    const body = escapeHtml(String(ch.content_md || '').trim())
    oebps.file(
      href,
      `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${escapeHtml(language)}">
<head><title>${escapeHtml(ch.title || id)}</title><meta charset="utf-8"/></head>
<body>
<h1>${escapeHtml(ch.title || id)}</h1>
${body
  .split(/\n\n+/)
  .map((p) => `<p>${escapeHtml(p)}</p>`)
  .join('\n')}
</body></html>`
    )
    manifest.push(`<item id="${id}" href="${href}" media-type="application/xhtml+xml"/>`)
    spine.push(`<itemref idref="${id}"/>`)
    navPoints.push(`<li><a href="${href}">${escapeHtml(ch.title || id)}</a></li>`)
  })

  oebps.file(
    'nav.xhtml',
    `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head><title>Contents</title></head>
<body>
<nav epub:type="toc"><ol>${navPoints.join('')}</ol></nav>
</body></html>`
  )
  manifest.push(
    '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>'
  )

  oebps.file(
    'content.opf',
    `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="uid">proofforge-${Date.now()}</dc:identifier>
    <dc:title>${escapeHtml(title)}</dc:title>
    <dc:creator>${escapeHtml(author)}</dc:creator>
    <dc:language>${escapeHtml(language)}</dc:language>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}</meta>
  </metadata>
  <manifest>
    ${manifest.join('\n    ')}
  </manifest>
  <spine>
    ${spine.join('\n    ')}
  </spine>
</package>`
  )

  const bytes = await zip.generateAsync({ type: 'nodebuffer', mimeType: 'application/epub+zip' })
  return { bytes, chapter_count: chapters.length }
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
