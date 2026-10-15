import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx'
import { classifyManuscriptSections } from '@novelforge/shared'

/**
 * Kindle Create–ready DOCX for Word / KDP / Kindle Create import.
 * - Heading 1 per section (chapter detection + TOC/NCX)
 * - Page break before each manuscript section (KC converts breaks → sections)
 * - First body paragraph: no first-line indent (chapter-open convention)
 * - Body runs omit locked font family so device font prefs survive reflowable conversion
 */
export async function buildDocx({
  title = 'Untitled',
  author = 'Author',
  subtitle = '',
  chapters = [],
  studioLabel = 'NovelForge',
} = {}) {
  const sections = classifyManuscriptSections(chapters)
  const children = []

  children.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
      spacing: { after: 200 },
    })
  )
  if (subtitle) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: subtitle, italics: true, size: 24 })],
        spacing: { after: 120 },
      })
    )
  }
  children.push(
    new Paragraph({
      children: [new TextRun({ text: author, size: 22 })],
      spacing: { after: 400 },
    })
  )
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `${studioLabel} export — structured for Kindle Create (reflowable). Verify continuity, rights, and KDP Previewer before publishing. KPF is created only inside Amazon Kindle Create.`,
          size: 18,
          italics: true,
        }),
      ],
      spacing: { after: 200 },
    })
  )

  for (const ch of sections) {
    children.push(
      new Paragraph({
        text: String(ch.title || 'Chapter'),
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 0, after: 200 },
        pageBreakBefore: true,
      })
    )

    if (ch.role && ch.role !== 'chapter') {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Section: ${ch.role.replace(/_/g, ' ')}`,
              italics: true,
              size: 18,
            }),
          ],
          spacing: { after: 160 },
        })
      )
    }

    const body = stripMarkers(ch.content_md || ch.body || '')
    const paras = body
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
    let bodyParaIndex = 0
    for (const para of paras) {
      if (para.startsWith('# ')) {
        children.push(
          new Paragraph({
            text: para.replace(/^#+\s*/, ''),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 },
          })
        )
        continue
      }
      const isFirst = bodyParaIndex === 0
      bodyParaIndex += 1
      children.push(
        new Paragraph({
          children: [new TextRun({ text: para, size: 22 })],
          spacing: { after: 160 },
          indent: isFirst ? { firstLine: 0 } : { firstLine: 360 },
        })
      )
    }
  }

  const doc = new Document({
    creator: studioLabel,
    title,
    description: `${studioLabel} fiction manuscript — Kindle Create–ready reflowable DOCX`,
    sections: [{ children }],
  })
  const buffer = await Packer.toBuffer(doc)
  return {
    bytes: new Uint8Array(buffer),
    kindleCreate: {
      structured: true,
      sectionCount: sections.length,
      note: 'Import this DOCX into Kindle Create (Dynamic Text Flow) to build KPF. Keep the KCB project folder backed up.',
    },
  }
}

function stripMarkers(md) {
  return String(md || '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim()
}
