import JSZip from 'jszip'
import {
  COMPLIANCE_CHECKLIST_DEFAULT,
  PUBLISHING_SPECS,
  KINDLE_CREATE_SPECS,
  analyzeKindleCreateStructure,
  normalizeBookLanguage,
} from '@authorforge/shared'
import { buildInteriorPdf } from './interiorPdf.js'
import { buildCoverWrapPdf } from './coverPdf.js'
import { buildEpub } from './epub.js'
import { buildDocx } from './docx.js'

export async function buildKdpPackage({
  book,
  chapters,
  metadata = {},
  aiDisclosure = {},
} = {}) {
  const title = book?.working_title || book?.title || 'Untitled'
  const author = book?.author_name || book?.bible?.author_name || 'Author'
  const trimId = book?.trim_size || '6x9'
  const language = normalizeBookLanguage(book?.language)

  const interior = await buildInteriorPdf({ title, author, chapters, trimId })
  const cover = await buildCoverWrapPdf({
    title,
    author,
    backCopy: metadata.back_cover_copy || book?.bible?.key_selling_points?.join(' ') || '',
    pageCount: interior.pageCount,
    trimId,
  })
  const epub = await buildEpub({ title, author, chapters, language })
  const docx = await buildDocx({
    title,
    author,
    subtitle: book?.subtitle || '',
    chapters,
  })

  const zip = new JSZip()
  zip.file('manuscript-interior.pdf', interior.bytes)
  zip.file('cover-wrap.pdf', cover.bytes)
  zip.file('manuscript.epub', epub.bytes)
  zip.file('manuscript.docx', docx.bytes)
  zip.file(
    'metadata.json',
    JSON.stringify(
      {
        title,
        subtitle: book?.subtitle || '',
        author,
        description_html: metadata.description_html || '',
        keywords: metadata.keywords || [],
        categories: metadata.categories || [],
        language,
        trim_size: trimId,
        page_count: interior.pageCount,
        ai_disclosure: aiDisclosure,
        generated_at: new Date().toISOString(),
      },
      null,
      2
    )
  )
  const kcStructure = analyzeKindleCreateStructure(chapters)
  zip.file(
    'UPLOAD-CHECKLIST.txt',
    [
      'AuthorForge KDP Upload Checklist',
      '================================',
      PUBLISHING_SPECS.verifiedNote,
      '',
      ...COMPLIANCE_CHECKLIST_DEFAULT.items.map(
        (i, idx) => `[ ] ${idx + 1}. ${i.label}`
      ),
      '',
      'Kindle Create (reflowable ebook → KPF)',
      '--------------------------------------',
      KINDLE_CREATE_SPECS.verifiedNote,
      `[ ] Import manuscript.docx into Kindle Create (Dynamic Text Flow)`,
      `[ ] Accept chapter headings for HTML TOC + interactive Kindle TOC (NCX)`,
      `[ ] Apply a design; keep body fonts on reader defaults`,
      `[ ] Export KPF for KDP; keep KCB project folder backed up`,
      `[ ] Validate in Kindle Previewer before upload`,
      '',
      'Help links:',
      ...Object.entries(PUBLISHING_SPECS.kdpHelpUrls).map(([k, v]) => `- ${k}: ${v}`),
      '',
      'Always run Amazon KDP Previewer before publishing.',
    ].join('\n')
  )
  zip.file(
    'KINDLE-CREATE-NOTES.txt',
    [
      'Kindle Create handoff (AuthorForge)',
      '==================================',
      `Source: ${KINDLE_CREATE_SPECS.helpUrl}`,
      `Verified: ${KINDLE_CREATE_SPECS.lastVerified}`,
      '',
      KINDLE_CREATE_SPECS.verifiedNote,
      '',
      'Project files:',
      `- Editable: ${KINDLE_CREATE_SPECS.projectFiles.editable}`,
      `- Publish: ${KINDLE_CREATE_SPECS.projectFiles.publish}`,
      '',
      'Known limitations:',
      ...KINDLE_CREATE_SPECS.knownLimitations.map((l) => `- ${l.label}: ${l.action}`),
      '',
      'Structure scan (this export):',
      `- Sections: ${kcStructure.sectionCount}`,
      `- Chapters: ${kcStructure.chapterCount}`,
      `- Front matter detected: ${kcStructure.frontMatterCount}`,
      `- Back matter detected: ${kcStructure.backMatterCount}`,
      `- TOC-eligible: ${kcStructure.tocEligible}`,
      ...(kcStructure.issues.length
        ? ['', 'Issues:', ...kcStructure.issues.map((i) => `- [${i.severity}] ${i.message}`)]
        : ['', 'No structural issues flagged by local scan.']),
      '',
      'Typography tips:',
      ...Object.entries(KINDLE_CREATE_SPECS.typography).map(([k, v]) => `- ${k}: ${v}`),
    ].join('\n')
  )
  zip.file(
    'preflight.json',
    JSON.stringify(
      {
        page_count: interior.pageCount,
        trim_id: trimId,
        spine: cover.layout,
        fonts: 'Standard PDF fonts embedded via pdf-lib',
        epub: 'EPUB3 minimal — validate with epubcheck before wide distribution',
        kindle_create: {
          ...docx.kindleCreate,
          structure: {
            sectionCount: kcStructure.sectionCount,
            chapterCount: kcStructure.chapterCount,
            frontMatterCount: kcStructure.frontMatterCount,
            backMatterCount: kcStructure.backMatterCount,
            issues: kcStructure.issues,
          },
          helpUrl: KINDLE_CREATE_SPECS.helpUrl,
          lastVerified: KINDLE_CREATE_SPECS.lastVerified,
        },
        lastVerified: PUBLISHING_SPECS.lastVerified,
      },
      null,
      2
    )
  )

  const bytes = await zip.generateAsync({ type: 'uint8array' })
  return {
    bytes,
    pageCount: interior.pageCount,
    files: [
      'manuscript-interior.pdf',
      'cover-wrap.pdf',
      'manuscript.epub',
      'manuscript.docx',
      'metadata.json',
      'UPLOAD-CHECKLIST.txt',
      'KINDLE-CREATE-NOTES.txt',
      'preflight.json',
    ],
  }
}
