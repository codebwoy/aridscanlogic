/**
 * DOCX export of corrected manuscript (OOXML zip).
 * Page size / margins follow project.print_config for KDP Word → PDF path.
 * Structure follows Kindle Create reflowable guidance (G7R2L7V5X6SJH948):
 * Heading 1 chapters, page breaks between sections, first-para no indent.
 * For Kindle ebook, upload DOCX or convert via Kindle Create (KPF).
 */

import JSZip from 'jszip'
import { resolvePrintPageGeometry } from './exportPdf.js'
import { wordCount } from './deterministic.js'
import { classifyManuscriptSections } from './kindle-create-specs.js'

function escapeXml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function paragraphsFromMarkdown(md) {
  const blocks = String(md || '')
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
  if (!blocks.length) return ['']
  return blocks
}

/**
 * @param {{ title?: string, author_name?: string, sections?: Record<string, { title?: string, content_md?: string, order?: number, role?: string }> }} project
 */
export async function buildCorrectedDocx(project) {
  const raw = Object.values(project.sections || {}).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  )
  const sections = classifyManuscriptSections(raw)
  const bodyParts = []
  bodyParts.push(
    `<w:p><w:pPr><w:pStyle w:val="Title"/></w:pPr><w:r><w:t>${escapeXml(project.title || 'Manuscript')}</w:t></w:r></w:p>`
  )
  if (project.author_name) {
    bodyParts.push(
      `<w:p><w:r><w:t>${escapeXml(project.author_name)}</w:t></w:r></w:p>`
    )
  }
  bodyParts.push(
    `<w:p><w:r><w:t xml:space="preserve">${escapeXml(
      'ProofForge export — Kindle Create–ready structure (Heading 1 + section breaks). KPF only via Amazon Kindle Create.'
    )}</w:t></w:r></w:p>`
  )

  for (const s of sections) {
    // pageBreakBefore via w:pageBreakBefore on heading paragraph
    bodyParts.push(
      `<w:p><w:pPr><w:pStyle w:val="Heading1"/><w:pageBreakBefore/></w:pPr><w:r><w:t>${escapeXml(s.title || s.key)}</w:t></w:r></w:p>`
    )
    if (s.role && s.role !== 'chapter') {
      bodyParts.push(
        `<w:p><w:r><w:t>${escapeXml(`Section: ${s.role.replace(/_/g, ' ')}`)}</w:t></w:r></w:p>`
      )
    }
    let bodyParaIndex = 0
    for (const para of paragraphsFromMarkdown(s.content_md)) {
      const lines = para.split('\n')
      const isFirst = bodyParaIndex === 0
      bodyParaIndex += 1
      const indent = isFirst
        ? ''
        : '<w:ind w:firstLine="360"/>'
      for (let li = 0; li < lines.length; li++) {
        const lineIndent = li === 0 ? indent : ''
        bodyParts.push(
          `<w:p><w:pPr>${lineIndent}</w:pPr><w:r><w:t xml:space="preserve">${escapeXml(lines[li])}</w:t></w:r></w:p>`
        )
      }
    }
  }

  const totalWords = sections.reduce((n, s) => n + wordCount(s.content_md), 0)
  const geo = resolvePrintPageGeometry(project, { wordCountTotal: totalWords })
  // OOXML uses twips (1/20 pt); 1 inch = 1440 twips
  const wTwip = Math.round(geo.page_width_in * 1440)
  const hTwip = Math.round(geo.page_height_in * 1440)
  const top = Math.round(geo.top_in * 1440)
  const bottom = Math.round(geo.bottom_in * 1440)
  const gutter = Math.round(geo.gutter_in * 1440)
  const outside = Math.round(geo.outside_in * 1440)

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${bodyParts.join('\n')}
    <w:sectPr>
      <w:pgSz w:w="${wTwip}" w:h="${hTwip}"/>
      <w:pgMar w:top="${top}" w:right="${outside}" w:bottom="${bottom}" w:left="${gutter}" w:gutter="0"/>
      <w:pgNumType w:start="1"/>
    </w:sectPr>
  </w:body>
</w:document>`

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`

  const zip = new JSZip()
  zip.file('[Content_Types].xml', contentTypes)
  zip.folder('_rels')?.file('.rels', rels)
  zip.folder('word')?.file('document.xml', documentXml)
  const bytes = await zip.generateAsync({ type: 'uint8array' })
  return {
    bytes,
    filename: `manuscript-${project.id || 'export'}.docx`,
    note: 'Kindle Create–ready DOCX (Heading 1 + page breaks). Validate in Word or Kindle Create before KDP upload. KPF is Kindle Create–only.',
    kindleCreate: {
      structured: true,
      sectionCount: sections.length,
      helpUrl: 'https://kdp.amazon.com/en_US/help/topic/G7R2L7V5X6SJH948',
    },
  }
}
