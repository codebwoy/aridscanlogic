import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from 'docx'

/** Real DOCX manuscript for Word / KDP upload paths */
export async function buildDocx({
  title = 'Untitled',
  author = 'Author',
  subtitle = '',
  chapters = [],
} = {}) {
  const children = [
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
      spacing: { after: 200 },
    }),
  ]
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
          text: 'First draft — verify facts, story slots, and rights before publishing.',
          size: 18,
          italics: true,
        }),
      ],
      spacing: { after: 400 },
    })
  )

  for (const ch of chapters) {
    children.push(
      new Paragraph({
        text: String(ch.title || 'Chapter'),
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 360, after: 200 },
      })
    )
    const body = stripMarkers(ch.content_md || ch.body || '')
    for (const para of body.split(/\n\n+/)) {
      const t = para.trim()
      if (!t) continue
      if (t.startsWith('# ')) {
        children.push(
          new Paragraph({
            text: t.replace(/^#+\s*/, ''),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 },
          })
        )
        continue
      }
      children.push(
        new Paragraph({
          children: [new TextRun({ text: t, size: 22 })],
          spacing: { after: 160 },
        })
      )
    }
  }

  const doc = new Document({
    creator: 'AuthorForge',
    title,
    description: 'AuthorForge non-fiction manuscript export',
    sections: [{ children }],
  })
  const buffer = await Packer.toBuffer(doc)
  return { bytes: new Uint8Array(buffer) }
}

function stripMarkers(md) {
  return String(md || '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim()
}
