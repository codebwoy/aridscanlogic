/**
 * Kindle Create / reflowable manuscript typesetting guidance (KDP Help G7R2L7V5X6SJH948).
 * Operational defaults for export structure + launch checklists — not Amazon affiliation,
 * not a KPF emitter, and not a guarantee of KDP acceptance.
 */

export const KINDLE_CREATE_SPECS = {
  lastVerified: '2026-10-15',
  sourceTopicId: 'G7R2L7V5X6SJH948',
  helpUrl: 'https://kdp.amazon.com/en_US/help/topic/G7R2L7V5X6SJH948',
  helpUrlDe: 'https://kdp.amazon.com/de_DE/help/topic/G7R2L7V5X6SJH948',
  verifiedNote:
    '⚠ Kindle Create guidance distilled for reflowable DOC(X)/EPUB structure. Studios export files + checklist only — KPF is produced inside Amazon Kindle Create. Confirm current KDP Help before upload.',
  format: 'reflowable',
  /** Picture books / Print Replica are out of scope for this path. */
  notFor: ['fixed_layout_picture_book', 'print_replica', 'japanese_reflowable_via_kindle_create'],
  projectFiles: {
    editable: 'KCB (Kindle Create project — keep backed up)',
    publish: 'KPF (export from Kindle Create for KDP upload only)',
  },
  knownLimitations: [
    {
      id: 'tables_lists_footnotes',
      label: 'Tables, lists, and footnotes cannot be edited inside Kindle Create',
      action: 'Edit in Word/Pages/Docs, then paste or re-import into Kindle Create.',
    },
    {
      id: 'inline_images',
      label: 'Inline images imported from DOC(X) cannot be edited in Kindle Create',
      action: 'Remove from source and re-insert in Kindle Create as block images.',
    },
  ],
  frontMatterTypes: [
    { id: 'title', toc: true, epubType: 'titlepage', label: 'Title page', use: 'Title, subtitle, author, publisher logo' },
    { id: 'copyright', toc: true, epubType: 'copyright-page', label: 'Copyright / imprint', use: 'Copyright, edition, publisher' },
    { id: 'dedication', toc: true, epubType: 'dedication', label: 'Dedication', use: 'Short dedication paragraph' },
    { id: 'epigraph', toc: true, epubType: 'epigraph', label: 'Epigraph', use: 'Thematic quote + source' },
    { id: 'toc', toc: false, epubType: 'toc', label: 'Table of contents page', use: 'HTML TOC; print adds page numbers' },
    { id: 'foreword', toc: true, epubType: 'foreword', label: 'Foreword', use: 'Usually by someone other than the author' },
    { id: 'preface', toc: true, epubType: 'preface', label: 'Preface', use: 'Author introduction / edition context' },
    { id: 'introduction', toc: true, epubType: 'introduction', label: 'Introduction', use: 'Typical for non-fiction' },
    { id: 'prologue', toc: true, epubType: 'prologue', label: 'Prologue', use: 'Typical for fiction' },
  ],
  backMatterTypes: [
    { id: 'epilogue', toc: true, epubType: 'epilogue', label: 'Epilogue', use: 'Closing story section' },
    { id: 'afterword', toc: true, epubType: 'afterword', label: 'Afterword', use: 'Final commentary' },
    { id: 'acknowledgments', toc: true, epubType: 'acknowledgments', label: 'Acknowledgements', use: 'Thanks / sources' },
    { id: 'about_author', toc: true, epubType: 'contributors', label: 'About the author', use: 'Bio + optional photo' },
    { id: 'praise', toc: true, epubType: 'bibliography', label: 'Praise for the author', use: 'Blurbs' },
    { id: 'also_by', toc: true, epubType: 'loi', label: 'Books by author / series', use: 'Amazon links to other titles' },
    { id: 'characters', toc: true, epubType: 'glossary', label: 'List of characters', use: 'Fiction cast list' },
  ],
  typography: {
    chapterHeading: 'Use Heading 1 so Kindle Create detects chapters for HTML TOC + NCX',
    chapterSubtitle: 'Optional descriptive line under chapter heading',
    firstParagraph: 'No first-line indent; optional drop cap (set in Kindle Create design)',
    bodyText:
      'Prefer default / reader-controlled body fonts. Locking a custom font on all body text blocks Kindle device font preferences — use sparingly for emphasis only',
    pageBreak: 'Each chapter / titled section starts on a new screen (DOCX page break → KC section)',
    separators: 'Scene breaks as decorative separators (Kindle Create element)',
    blockQuote: 'Long quotations as block quote element',
    poem: 'Poetry via poem element for readability',
    cascading: 'Apply cascading element updates so all chapter headings match',
  },
  toc: {
    htmlPage: 'Insert TOC page after reviewing chapter headings',
    ncx: 'Interactive Kindle TOC (NCX) built from accepted chapter headings',
    orangeDot: 'Sections without a title element are excluded from TOC — apply Chapter Heading',
    printBehavior: 'Print prep strips links and adds page numbers for KDP print preview',
  },
  images: {
    formats: ['JPG', 'PNG'],
    minLongSidePx: 100,
    recommendedPpi: 300,
    altText: 'Required for meaningful images; mark decorative to exclude from screen readers',
    sizes: ['small_33', 'medium', 'large', 'full_100'],
    chapterOpening: 'Optional full-bleed top image at 25% or 33% height with focal points',
    edgePlacementNote:
      'Place at edge currently forces portrait-only reading on some devices — prefer within margin unless intentional',
  },
  hyperlinks: {
    allowed: 'External https links that enhance reading; follow current KDP link guidelines',
    styling: 'Bold/italic/underline + size OK; link color not editable in Kindle Create',
  },
  printDualPath: {
    sameProject: true,
    pageNumbers: 'Arabic from first main-text page; Roman numerals for front matter',
    headersFooters: 'Paperback only — set in Kindle Create Print Settings',
    rectoVerso: 'Title and chapter opens on right-hand (recto) pages',
    widowsOrphans: 'Kindle Create minimizes widows/orphans automatically for print',
  },
  indianLanguageNote:
    'Hindi, Tamil, Malayalam, Marathi, Gujarati: only Classic/Modern designs; font picker disabled in Kindle Create',
}

/** Title patterns → section role (Kindle Create front/back matter + chapter). */
const ROLE_PATTERNS = [
  { role: 'title', re: /^(title(\s*page)?|titelseite|frontpage)$/i },
  { role: 'copyright', re: /^(copyright|imprint|impressum|colophon)$/i },
  { role: 'dedication', re: /^(dedication|widmung)$/i },
  { role: 'epigraph', re: /^(epigraph|epigraf)$/i },
  { role: 'toc', re: /^(contents|table of contents|inhaltsverzeichnis|toc)$/i },
  { role: 'foreword', re: /^(foreword|vorwort)$/i },
  { role: 'preface', re: /^(preface|vorrede)$/i },
  { role: 'introduction', re: /^(introduction|einführung|einfuehrung)$/i },
  { role: 'prologue', re: /^(prologue|prolog)$/i },
  { role: 'epilogue', re: /^(epilogue|epilog)$/i },
  { role: 'afterword', re: /^(afterword|nachwort)$/i },
  { role: 'acknowledgments', re: /^(acknowledge?ments?|danksagungen?)$/i },
  { role: 'about_author', re: /^(about the author|über den autor|ueber den autor|author bio)$/i },
  { role: 'also_by', re: /^(also by|books by|books in (this )?series|weitere bücher|weitere buecher)$/i },
  { role: 'characters', re: /^(characters?|cast|figuren|personenverzeichnis)$/i },
]

const FRONT_ROLES = new Set([
  'title',
  'copyright',
  'dedication',
  'epigraph',
  'toc',
  'foreword',
  'preface',
  'introduction',
  'prologue',
])
const BACK_ROLES = new Set([
  'epilogue',
  'afterword',
  'acknowledgments',
  'about_author',
  'praise',
  'also_by',
  'characters',
])

export function inferSectionRole(title, explicitRole) {
  if (explicitRole && typeof explicitRole === 'string') {
    const r = explicitRole.trim().toLowerCase().replace(/\s+/g, '_')
    if (r === 'chapter' || r === 'bodymatter' || r === 'body') return 'chapter'
    if (FRONT_ROLES.has(r) || BACK_ROLES.has(r) || r === 'toc') return r
  }
  const t = String(title || '').trim()
  for (const { role, re } of ROLE_PATTERNS) {
    if (re.test(t)) return role
  }
  return 'chapter'
}

export function matterForRole(role) {
  if (FRONT_ROLES.has(role)) return 'front'
  if (BACK_ROLES.has(role)) return 'back'
  return 'body'
}

export function epubTypeForRole(role) {
  const all = [...KINDLE_CREATE_SPECS.frontMatterTypes, ...KINDLE_CREATE_SPECS.backMatterTypes]
  const hit = all.find((x) => x.id === role)
  if (hit?.epubType) return hit.epubType
  return role === 'chapter' ? 'chapter' : 'bodymatter'
}

export function includeInToc(role) {
  if (role === 'chapter') return true
  const all = [...KINDLE_CREATE_SPECS.frontMatterTypes, ...KINDLE_CREATE_SPECS.backMatterTypes]
  const hit = all.find((x) => x.id === role)
  return hit ? hit.toc !== false : true
}

/**
 * Normalize chapters for Kindle Create–ready export.
 * @param {Array<{ title?: string, role?: string, content_md?: string, body?: string }>} chapters
 */
export function classifyManuscriptSections(chapters = []) {
  return (Array.isArray(chapters) ? chapters : []).map((ch, index) => {
    const role = inferSectionRole(ch.title || ch.key, ch.role || ch.section_role || ch.matter_role)
    return {
      ...ch,
      index,
      role,
      matter: matterForRole(role),
      epubType: epubTypeForRole(role),
      toc: includeInToc(role),
      title: String(ch.title || ch.key || (role === 'chapter' ? `Chapter ${index + 1}` : role)),
    }
  })
}

/** Launch-readiness phase items for reflowable studios (AuthorForge / NovelForge). */
export const KINDLE_CREATE_LAUNCH_ITEMS = [
  {
    id: 'kc_docx_structure',
    label:
      'Manuscript uses clear chapter headings (Heading 1) and page breaks so Kindle Create can detect sections',
    required: true,
    linkKey: 'kindleCreate',
  },
  {
    id: 'kc_front_matter',
    label: 'Front matter reviewed (title, copyright/imprint, dedication/epigraph as needed)',
    required: true,
    linkKey: 'kindleCreate',
  },
  {
    id: 'kc_toc_headings',
    label: 'Chapter titles reviewed for HTML TOC + interactive Kindle TOC (NCX)',
    required: true,
    linkKey: 'kindleCreate',
  },
  {
    id: 'kc_body_fonts',
    label: 'Body text left on default/reader fonts — custom fonts only for emphasis, not whole body',
    required: true,
    linkKey: 'kindleCreate',
  },
  {
    id: 'kc_images_alt',
    label: 'Images are JPG/PNG with alt text (or marked decorative); ≥300 ppi when print-bound',
    required: false,
    linkKey: 'kindleCreate',
  },
  {
    id: 'kc_kindle_create_handoff',
    label: 'Optional: open exported DOCX in Kindle Create → check design → export KPF for ebook',
    required: false,
    linkKey: 'kindleCreate',
  },
  {
    id: 'kc_print_dual',
    label:
      'If publishing paperback from same project: confirm print settings (page numbers, headers, recto chapter opens) in Kindle Create or Print Previewer',
    required: false,
    linkKey: 'kindleCreate',
  },
  {
    id: 'kc_tables_source',
    label: 'Tables/lists/footnotes edited in source DOC(X) before Kindle Create (not editable in KC)',
    required: false,
    linkKey: 'kindleCreate',
  },
  {
    id: 'kc_hyperlinks',
    label: 'External hyperlinks reviewed against current KDP link guidelines (https only; enhance reading)',
    required: false,
    linkKey: 'kindleCreate',
  },
  {
    id: 'kc_indian_langs',
    label:
      'If Hindi/Tamil/Malayalam/Marathi/Gujarati: note Kindle Create shows only Classic/Modern designs and disables font picker',
    required: false,
    linkKey: 'kindleCreate',
  },
]

/** Roles authors can assign in the Writing step (persisted as section_role). */
export const SECTION_ROLE_OPTIONS = [
  { id: 'chapter', label: 'Chapter (body)' },
  { id: 'title', label: 'Title page' },
  { id: 'copyright', label: 'Copyright / imprint' },
  { id: 'dedication', label: 'Dedication' },
  { id: 'epigraph', label: 'Epigraph' },
  { id: 'toc', label: 'Table of contents' },
  { id: 'foreword', label: 'Foreword' },
  { id: 'preface', label: 'Preface' },
  { id: 'introduction', label: 'Introduction' },
  { id: 'prologue', label: 'Prologue' },
  { id: 'epilogue', label: 'Epilogue' },
  { id: 'afterword', label: 'Afterword' },
  { id: 'acknowledgments', label: 'Acknowledgements' },
  { id: 'about_author', label: 'About the author' },
  { id: 'also_by', label: 'Also by / series' },
  { id: 'characters', label: 'List of characters' },
]

export function kindleCreatePayload() {
  return {
    lastVerified: KINDLE_CREATE_SPECS.lastVerified,
    helpUrl: KINDLE_CREATE_SPECS.helpUrl,
    helpUrlDe: KINDLE_CREATE_SPECS.helpUrlDe,
    verifiedNote: KINDLE_CREATE_SPECS.verifiedNote,
    format: KINDLE_CREATE_SPECS.format,
    notFor: KINDLE_CREATE_SPECS.notFor,
    projectFiles: KINDLE_CREATE_SPECS.projectFiles,
    knownLimitations: KINDLE_CREATE_SPECS.knownLimitations,
    frontMatterTypes: KINDLE_CREATE_SPECS.frontMatterTypes,
    backMatterTypes: KINDLE_CREATE_SPECS.backMatterTypes,
    typography: KINDLE_CREATE_SPECS.typography,
    toc: KINDLE_CREATE_SPECS.toc,
    images: KINDLE_CREATE_SPECS.images,
    hyperlinks: KINDLE_CREATE_SPECS.hyperlinks,
    printDualPath: KINDLE_CREATE_SPECS.printDualPath,
    indianLanguageNote: KINDLE_CREATE_SPECS.indianLanguageNote,
    sectionRoleOptions: SECTION_ROLE_OPTIONS,
    launchItems: KINDLE_CREATE_LAUNCH_ITEMS,
  }
}

/** Structured audit hints for ProofForge / export preflight. */
export function analyzeKindleCreateStructure(sections = []) {
  const classified = classifyManuscriptSections(
    (Array.isArray(sections) ? sections : []).map((s) => ({
      title: s.title || s.key,
      role: s.role || s.section_role,
      content_md: s.content_md || s.body || '',
      key: s.key,
    }))
  )
  const chapters = classified.filter((s) => s.role === 'chapter')
  const front = classified.filter((s) => s.matter === 'front')
  const back = classified.filter((s) => s.matter === 'back')
  const emptyTitles = classified.filter((s) => !String(s.title || '').trim())
  const issues = []

  if (chapters.length < 2 && classified.length < 2) {
    issues.push({
      id: 'few_sections',
      severity: 'moderate',
      message: 'Fewer than 2 titled sections — Kindle Create TOC / NCX navigation will be weak.',
    })
  }
  if (!front.some((s) => s.role === 'title' || s.role === 'copyright')) {
    issues.push({
      id: 'missing_imprint',
      severity: 'suggestion',
      message: 'No title/copyright front-matter section detected — add imprint before KDP upload.',
    })
  }
  if (emptyTitles.length) {
    issues.push({
      id: 'untitled_sections',
      severity: 'major',
      message: `${emptyTitles.length} section(s) lack titles — Kindle Create needs chapter headings for TOC.`,
    })
  }

  return {
    sectionCount: classified.length,
    chapterCount: chapters.length,
    frontMatterCount: front.length,
    backMatterCount: back.length,
    tocEligible: classified.filter((s) => s.toc).length,
    issues,
    classified,
  }
}
