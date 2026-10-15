/**
 * Versioned KDP compliance rules — provenance from Amazon help (see docs/RESEARCH.md).
 * Never claim Amazon approval. Separate technical vs policy; mark needs_config when specs missing.
 */

import { analyzeKindleCreateStructure } from './kindle-create-specs.js'

export const KDP_RULES_VERSION = '2026-10-15'

/** Kindle Create reflowable typesetting (G7R2L7V5X6SJH948). */
export const KINDLE_CREATE_HELP =
  'https://kdp.amazon.com/en_US/help/topic/G7R2L7V5X6SJH948'

/** Gutter minimums from KDP trim/bleed/margins help (inches). */
export const GUTTER_BY_PAGE_COUNT = Object.freeze([
  { maxPages: 150, gutterIn: 0.375 },
  { maxPages: 300, gutterIn: 0.5 },
  { maxPages: 500, gutterIn: 0.625 },
  { maxPages: 700, gutterIn: 0.75 },
  { maxPages: 828, gutterIn: 0.875 },
])

export const KDP_RULES = Object.freeze([
  {
    id: 'kdp.ebook.supported_format',
    title: 'Ebook manuscript format',
    format: 'kindle_ebook',
    severity: 'major',
    requirement: 'Prefer DOCX, EPUB, or KPF for reflowable Kindle books. MOBI fixed-layout ended March 2025.',
    verification: 'config_and_export',
    source_url: 'https://kdp.amazon.com/en_US/help/topic/G200634390',
    retrieved: KDP_RULES_VERSION,
    automated: true,
  },
  {
    id: 'kdp.ebook.toc_structure',
    title: 'Ebook chapter / TOC structure',
    format: 'kindle_ebook',
    severity: 'moderate',
    requirement: 'Manuscript should have clear chapter/section headings for navigation.',
    verification: 'structure_scan',
    source_url: 'https://kdp.amazon.com/en_US/help/topic/GKX2T59EVGFSMKQK',
    retrieved: KDP_RULES_VERSION,
    automated: true,
  },
  {
    id: 'kdp.ebook.kindle_create_headings',
    title: 'Kindle Create chapter headings',
    format: 'all',
    severity: 'moderate',
    requirement:
      'Reflowable DOC(X) for Kindle Create needs Heading-style chapter titles so KC can build HTML TOC + interactive Kindle TOC (NCX). Page breaks become sections.',
    verification: 'structure_scan',
    source_url: KINDLE_CREATE_HELP,
    retrieved: KDP_RULES_VERSION,
    automated: true,
  },
  {
    id: 'kdp.ebook.kindle_create_front_matter',
    title: 'Kindle Create front matter',
    format: 'all',
    severity: 'suggestion',
    requirement:
      'Include title/copyright (imprint) front matter before main text. Kindle Create supports dedication, epigraph, foreword, preface, introduction, prologue.',
    verification: 'structure_scan',
    source_url: KINDLE_CREATE_HELP,
    retrieved: KDP_RULES_VERSION,
    automated: true,
  },
  {
    id: 'kdp.ebook.kindle_create_body_fonts',
    title: 'Body text font restraint (reflowable)',
    format: 'all',
    severity: 'suggestion',
    requirement:
      'Amazon recommends default body text so readers keep device font preferences. Lock custom fonts only for emphasis (headings, quotes), not the whole body.',
    verification: 'author_confirm',
    source_url: KINDLE_CREATE_HELP,
    retrieved: KDP_RULES_VERSION,
    automated: false,
  },
  {
    id: 'kdp.ebook.kindle_create_limitations',
    title: 'Tables / lists / footnotes edited in source',
    format: 'all',
    severity: 'suggestion',
    requirement:
      'Kindle Create cannot edit tables, lists, or footnotes after import — change them in Word/Pages/Docs then paste or re-import.',
    verification: 'author_confirm',
    source_url: KINDLE_CREATE_HELP,
    retrieved: KDP_RULES_VERSION,
    automated: false,
  },
  {
    id: 'kdp.ebook.kindle_create_kpf',
    title: 'KPF via Kindle Create only',
    format: 'all',
    severity: 'suggestion',
    requirement:
      'Export DOCX → open in Kindle Create → export KPF for KDP. Keep the KCB project folder backed up. This studio cannot emit KPF.',
    verification: 'author_confirm',
    source_url: KINDLE_CREATE_HELP,
    retrieved: KDP_RULES_VERSION,
    automated: false,
  },
  {
    id: 'kdp.ebook.kindle_create_images',
    title: 'Kindle Create image guidance',
    format: 'all',
    severity: 'suggestion',
    requirement:
      'Images JPG/PNG; recommend ≥100px long side and 300 ppi. Add alt text. Edge-bleed placement may force portrait-only reading.',
    verification: 'author_confirm',
    source_url: KINDLE_CREATE_HELP,
    retrieved: KDP_RULES_VERSION,
    automated: false,
  },
  {
    id: 'kdp.print.trim_required',
    title: 'Print trim size configured',
    format: 'paperback',
    severity: 'critical',
    requirement: 'Set trim size before margins. Common US trim: 6×9 in.',
    verification: 'needs_config',
    source_url: 'https://kdp.amazon.com/help/topic/GVBQ3CMEQW3W2VL6',
    retrieved: KDP_RULES_VERSION,
    automated: true,
  },
  {
    id: 'kdp.hardcover.case_laminate',
    title: 'Hardcover case-laminate dimensions',
    format: 'hardcover',
    severity: 'major',
    requirement:
      'Hardcover case-laminate extends beyond the manuscript; review cover dimensions separately from paperback. Interior formatting is largely the same as paperback. Hardcover not supported on kdp.amazon.co.jp.',
    verification: 'author_confirm',
    source_url: 'https://kdp.amazon.com/en_US/help/topic/GKX2T59EVGFSMKQK',
    retrieved: KDP_RULES_VERSION,
    automated: false,
  },
  {
    id: 'kdp.print.outside_margins',
    title: 'Outside margins minimum',
    format: 'paperback',
    severity: 'critical',
    requirement: 'Outside margins ≥0.25 in without bleed, ≥0.375 in with bleed.',
    verification: 'needs_config',
    source_url: 'https://kdp.amazon.com/help/topic/GVBQ3CMEQW3W2VL6',
    retrieved: KDP_RULES_VERSION,
    automated: true,
  },
  {
    id: 'kdp.print.gutter',
    title: 'Inside (gutter) margin by page count',
    format: 'paperback',
    severity: 'critical',
    requirement: 'Gutter scales with page count (0.375″ … 0.875″).',
    verification: 'page_count_estimate',
    source_url: 'https://kdp.amazon.com/help/topic/GVBQ3CMEQW3W2VL6',
    retrieved: KDP_RULES_VERSION,
    automated: true,
  },
  {
    id: 'kdp.print.bleed',
    title: 'Bleed when images to edge',
    format: 'paperback',
    severity: 'major',
    requirement: 'If any page bleeds, entire interior needs 0.125″ bleed; use PDF.',
    verification: 'needs_config',
    source_url: 'https://kdp.amazon.com/help/topic/GVBQ3CMEQW3W2VL6',
    retrieved: KDP_RULES_VERSION,
    automated: true,
  },
  {
    id: 'kdp.policy.no_guarantee',
    title: 'Amazon retains final publishing decision',
    format: 'all',
    severity: 'suggestion',
    requirement: 'This tool cannot guarantee KDP acceptance. Amazon performs its own checks.',
    verification: 'disclosure',
    source_url: 'https://kdp.amazon.com/en_US/help/topic/GKX2T59EVGFSMKQK',
    retrieved: KDP_RULES_VERSION,
    automated: true,
  },
  {
    id: 'kdp.policy.ai_disclosure',
    title: 'AI-generated vs AI-assisted disclosure',
    format: 'all',
    severity: 'needs_verification',
    requirement:
      'KDP Content Guidelines distinguish AI-generated (must inform Amazon when publishing/republishing) from AI-assisted (edit/refine/error-check/brainstorm — disclosure not required). ProofForge audit itself is AI-assisted editing. Confirm current KDP form questions at upload — guidelines and UI can diverge.',
    verification: 'author_confirm',
    source_url: 'https://kdp.amazon.com/en_US/help/topic/G200672390',
    retrieved: KDP_RULES_VERSION,
    automated: false,
  },
  {
    id: 'kdp.policy.content_guidelines',
    title: 'Content guidelines (illegal / offensive / customer experience)',
    format: 'all',
    severity: 'needs_verification',
    requirement:
      'Authors must adhere to KDP Content Guidelines: no illegal/infringing content; no hate speech, child exploitation, pornography, glorified rape/pedophilia, terrorism advocacy; no misleading metadata; public-domain undifferentiated copies may be rejected. This tool does not certify compliance.',
    verification: 'author_confirm',
    source_url: 'https://kdp.amazon.com/en_US/help/topic/G200672390',
    retrieved: KDP_RULES_VERSION,
    automated: false,
  },
  {
    id: 'kdp.policy.translation_credit',
    title: 'Translation contributor credit',
    format: 'all',
    severity: 'needs_verification',
    requirement:
      'Books that are translations must credit the translator and original author in the contributor field (use Anonymous if translator unknown for older works).',
    verification: 'author_confirm',
    source_url: 'https://kdp.amazon.com/en_US/help/topic/G200672390',
    retrieved: KDP_RULES_VERSION,
    automated: false,
  },
  {
    id: 'kdp.ebook.previewer',
    title: 'Validate with Kindle Previewer',
    format: 'kindle_ebook',
    severity: 'suggestion',
    requirement:
      'After export (DOCX/EPUB/KPF), validate conversion in Kindle Previewer before KDP upload. MOBI fixed-layout no longer accepted (March 2025).',
    verification: 'author_confirm',
    source_url: 'https://kdp.amazon.com/en_US/help/topic/G200634390',
    retrieved: KDP_RULES_VERSION,
    automated: false,
  },
  {
    id: 'kdp.print.prepub_placeholders',
    title: 'Remove template placeholder text',
    format: 'all',
    severity: 'major',
    requirement:
      'KDP Word templates: customize or remove all placeholder text before upload — remaining placeholders can cause rejection on review.',
    verification: 'author_confirm',
    source_url: 'https://kdp.amazon.com/en_US/help/topic/G201834230',
    retrieved: KDP_RULES_VERSION,
    automated: true,
  },
  {
    id: 'kdp.print.prepub_details_match',
    title: 'Title/author match metadata',
    format: 'all',
    severity: 'major',
    requirement:
      'Book details in the file (title page, headers) must exactly match title setup metadata on KDP.',
    verification: 'author_confirm',
    source_url: 'https://kdp.amazon.com/en_US/help/topic/G201834230',
    retrieved: KDP_RULES_VERSION,
    automated: false,
  },
  {
    id: 'kdp.print.prepub_images_dpi',
    title: 'Images ≥300 DPI when present',
    format: 'all',
    severity: 'needs_verification',
    requirement:
      'Print images should be high resolution (≥300 DPI). Low-res images look blurry in print.',
    verification: 'author_confirm',
    source_url: 'https://kdp.amazon.com/en_US/help/topic/G201834230',
    retrieved: KDP_RULES_VERSION,
    automated: false,
  },
  {
    id: 'kdp.print.prepub_legibility',
    title: 'Text legibility (≥7 pt)',
    format: 'all',
    severity: 'needs_verification',
    requirement:
      'Customers must be able to read the text — at least 7-point font; not cut off, overlapped, or blending into the background.',
    verification: 'author_confirm',
    source_url: 'https://kdp.amazon.com/en_US/help/topic/G201834230',
    retrieved: KDP_RULES_VERSION,
    automated: false,
  },
  {
    id: 'kdp.print.fonts_embed',
    title: 'Fonts fully embedded (print PDF)',
    format: 'print',
    severity: 'major',
    requirement:
      'All fonts must be fully embedded in interior and cover files. In Word: File → Options → Save → Embed fonts; uncheck “Embed only characters used” and “Do not embed common system fonts”; save as PDF. Commercial-license restrictions can still block embedding.',
    verification: 'author_confirm',
    source_url: 'https://kdp.amazon.com/en_US/help/topic/G201834260',
    retrieved: KDP_RULES_VERSION,
    automated: false,
  },
  {
    id: 'kdp.print.blank_pages',
    title: 'Consecutive blank pages limit',
    format: 'print',
    severity: 'major',
    requirement:
      'KDP allows no more than 4 consecutive blank pages at the beginning or middle of a manuscript, and/or 10 consecutive blank pages at the end (reader-experience rule).',
    verification: 'structure_scan',
    source_url: 'https://kdp.amazon.com/en_US/help/topic/G201834260',
    retrieved: KDP_RULES_VERSION,
    automated: true,
  },
  {
    id: 'kdp.print.pagination',
    title: 'Sequential pagination',
    format: 'print',
    severity: 'needs_verification',
    requirement:
      'Page numbers must be ordered sequentially (LTR: even left / odd right). Skips can indicate missing or mis-ordered pages.',
    verification: 'author_confirm',
    source_url: 'https://kdp.amazon.com/en_US/help/topic/G201834260',
    retrieved: KDP_RULES_VERSION,
    automated: false,
  },
  {
    id: 'kdp.print.hidden_characters',
    title: 'No text/spaces outside margins',
    format: 'print',
    severity: 'needs_verification',
    requirement:
      'Text, italic overhangs, hidden spaces, and empty text boxes outside margins trigger Print Previewer errors. Reveal formatting marks (¶) and remove stray objects before PDF upload.',
    verification: 'author_confirm',
    source_url: 'https://kdp.amazon.com/en_US/help/topic/G201834260',
    retrieved: KDP_RULES_VERSION,
    automated: false,
  },
  {
    id: 'kdp.print.spine_min_pages',
    title: 'Spine text requires ≥79 pages',
    format: 'print',
    severity: 'needs_verification',
    requirement:
      'Books with fewer than 79 pages cannot have text on the spine — remove spine text if page count is below the threshold.',
    verification: 'author_confirm',
    source_url: 'https://kdp.amazon.com/en_US/help/topic/G201834260',
    retrieved: KDP_RULES_VERSION,
    automated: false,
  },
  {
    id: 'kdp.print.transparencies',
    title: 'Flatten transparencies / layers',
    format: 'print',
    severity: 'needs_verification',
    requirement:
      'When creating print PDFs, flatten transparencies and layers so content order stays stable in production.',
    verification: 'author_confirm',
    source_url: 'https://kdp.amazon.com/en_US/help/topic/G201834260',
    retrieved: KDP_RULES_VERSION,
    automated: false,
  },
  {
    id: 'kdp.print.isbn_format',
    title: 'ISBN format on copyright page (if used)',
    format: 'all',
    severity: 'suggestion',
    requirement:
      'ISBN is optional on the copyright page. If you include one, format like 978-X-XXXX-XXXX-X and ensure it matches the ISBN assigned to the title. Mismatches cause metadata issues.',
    verification: 'structure_scan',
    source_url: 'https://kdp.amazon.com/en_US/help/topic/G201834230',
    retrieved: KDP_RULES_VERSION,
    automated: true,
  },
  {
    id: 'kdp.print.save_pdf_embed',
    title: 'Save interior as PDF with fonts embedded',
    format: 'print',
    severity: 'suggestion',
    requirement:
      'Pre-publication checklist: for best results save the formatted manuscript as PDF with fonts embedded before KDP upload (in addition to embedding settings in Word).',
    verification: 'author_confirm',
    source_url: 'https://kdp.amazon.com/en_US/help/topic/G201834230',
    retrieved: KDP_RULES_VERSION,
    automated: false,
  },
  {
    id: 'kdp.print.endure_font_note',
    title: 'Optional Amazon Endure font (page-count)',
    format: 'print',
    severity: 'suggestion',
    requirement:
      'KDP offers Amazon Endure, a custom font designed to reduce page count / print cost. Not available for Japanese, Kanji, or Cyrillic. Optional — only if it fits your design.',
    verification: 'author_confirm',
    source_url: 'https://kdp.amazon.com/en_US/help/topic/G201834230',
    retrieved: KDP_RULES_VERSION,
    automated: false,
  },
])

export function gutterForPageCount(pages) {
  const n = Number(pages) || 0
  for (const row of GUTTER_BY_PAGE_COUNT) {
    if (n <= row.maxPages) return row.gutterIn
  }
  return 0.875
}

/**
 * Run applicable KDP checks against project config + manuscript stats.
 */
export function runKdpChecks(project, { wordCountTotal = 0, sectionCount = 0 } = {}) {
  const target = project.publishing_target || 'editorial_only'
  const formats =
    target === 'multiple'
      ? ['kindle_ebook', 'paperback', 'hardcover']
      : target === 'editorial_only'
        ? ['all']
        : [target, 'all']

  const estimatedPages = Math.max(24, Math.ceil(wordCountTotal / 250))
  const trim = project.print_config?.trim_size_in
  const bleed = Boolean(project.print_config?.bleed)
  const outside = project.print_config?.outside_margin_in
  const gutter = project.print_config?.gutter_in

  const isPrintTarget =
    formats.includes('paperback') ||
    formats.includes('hardcover') ||
    target === 'multiple'

  const results = []
  for (const rule of KDP_RULES) {
    if (rule.format === 'print') {
      if (!isPrintTarget) continue
    } else if (rule.format !== 'all' && !formats.includes(rule.format) && target !== 'editorial_only') {
      continue
    }
    if (target === 'editorial_only' && rule.format !== 'all') continue

    let status = 'pass'
    let detail = ''
    let finding = null

    if (rule.id === 'kdp.ebook.toc_structure') {
      if (sectionCount < 2) {
        status = 'fail'
        detail = 'Fewer than 2 sections/chapters detected — ebook navigation may be weak.'
        finding = {
          category: 'kdp_technical',
          subcategory: 'toc',
          severity: 'moderate',
          title: rule.title,
          explanation: detail,
          original_excerpt: project.title || 'manuscript',
          suggested_correction: '',
          reason: rule.id,
          confidence: 0.8,
          objective: true,
          source_rule_id: rule.id,
        }
      } else {
        detail = `${sectionCount} sections detected.`
      }
    } else if (rule.id === 'kdp.ebook.kindle_create_headings') {
      const kc = analyzeKindleCreateStructure(Object.values(project.sections || {}))
      const untitled = kc.issues.find((i) => i.id === 'untitled_sections')
      const few = kc.issues.find((i) => i.id === 'few_sections')
      if (untitled || few) {
        status = 'fail'
        detail = (untitled || few).message
        finding = {
          category: 'kdp_technical',
          subcategory: 'kindle_create',
          severity: 'moderate',
          title: rule.title,
          explanation: detail + ' ' + rule.requirement,
          original_excerpt: project.title || 'manuscript',
          suggested_correction: 'Give every section a clear Heading 1 title before DOCX → Kindle Create.',
          reason: rule.id,
          confidence: 0.85,
          objective: true,
          source_rule_id: rule.id,
        }
      } else {
        detail = `${kc.tocEligible} TOC-eligible sections (${kc.chapterCount} chapters) — ready for Kindle Create chapter detection.`
      }
    } else if (rule.id === 'kdp.ebook.kindle_create_front_matter') {
      const kc = analyzeKindleCreateStructure(Object.values(project.sections || {}))
      const miss = kc.issues.find((i) => i.id === 'missing_imprint')
      if (miss) {
        status = 'needs_verification'
        detail = miss.message
        finding = {
          category: 'kdp_technical',
          subcategory: 'kindle_create',
          severity: 'suggestion',
          title: rule.title,
          explanation: detail + ' ' + rule.requirement,
          original_excerpt: project.title || 'front matter',
          suggested_correction: 'Add a Copyright / Imprint section (or title it Copyright).',
          reason: rule.id,
          confidence: 0.7,
          objective: false,
          source_rule_id: rule.id,
        }
      } else {
        detail = `Front-matter sections detected: ${kc.frontMatterCount}.`
      }
    } else if (
      rule.id === 'kdp.ebook.kindle_create_body_fonts' ||
      rule.id === 'kdp.ebook.kindle_create_limitations' ||
      rule.id === 'kdp.ebook.kindle_create_kpf' ||
      rule.id === 'kdp.ebook.kindle_create_images'
    ) {
      status = 'needs_verification'
      detail = rule.requirement
      finding = {
        category: 'kdp_technical',
        subcategory: 'kindle_create',
        severity: 'suggestion',
        title: rule.title,
        explanation: rule.requirement,
        original_excerpt: project.title || 'Kindle Create',
        suggested_correction: '',
        reason: rule.id,
        confidence: 0.75,
        objective: false,
        source_rule_id: rule.id,
      }
    } else if (rule.id === 'kdp.print.trim_required') {
      if (!trim) {
        status = 'needs_config'
        detail = 'Trim size not set on project.print_config.trim_size_in'
      } else detail = `Trim configured: ${trim}`
    } else if (rule.id === 'kdp.print.outside_margins') {
      const min = bleed ? 0.375 : 0.25
      if (outside == null) {
        status = 'needs_config'
        detail = `Set outside_margin_in (≥${min} for ${bleed ? 'bleed' : 'no bleed'})`
      } else if (Number(outside) < min) {
        status = 'fail'
        detail = `Outside margin ${outside} < minimum ${min}`
        finding = {
          category: 'kdp_technical',
          subcategory: 'margins',
          severity: 'critical',
          title: rule.title,
          explanation: detail,
          original_excerpt: project.title || 'print config',
          suggested_correction: String(min),
          reason: rule.id,
          confidence: 0.95,
          objective: true,
          source_rule_id: rule.id,
        }
      } else detail = `Outside margin ${outside} ≥ ${min}`
    } else if (rule.id === 'kdp.print.gutter') {
      const required = gutterForPageCount(estimatedPages)
      detail = `Est. pages ~${estimatedPages} → gutter ≥ ${required} in`
      if (gutter == null) status = 'needs_config'
      else if (Number(gutter) < required) {
        status = 'fail'
        finding = {
          category: 'kdp_technical',
          subcategory: 'gutter',
          severity: 'critical',
          title: rule.title,
          explanation: `Configured gutter ${gutter} < required ${required} for ~${estimatedPages} pages`,
          original_excerpt: project.title || 'print config',
          suggested_correction: String(required),
          reason: rule.id,
          confidence: 0.9,
          objective: true,
          source_rule_id: rule.id,
        }
      }
    } else if (rule.id === 'kdp.print.bleed') {
      status = bleed ? 'pass' : 'needs_config'
      detail = bleed
        ? 'Bleed enabled — ensure PDF page size includes 0.125″'
        : 'Confirm whether interior images need bleed'
    } else if (rule.id === 'kdp.ebook.supported_format') {
      detail = 'Export DOCX/EPUB/KPF from your writing studio; validate in Kindle Previewer.'
      status = 'pass'
    } else if (rule.id === 'kdp.policy.no_guarantee') {
      status = 'disclosure'
      detail = rule.requirement
    } else if (rule.id === 'kdp.hardcover.case_laminate') {
      status = 'needs_verification'
      detail = rule.requirement
      finding = {
        category: 'kdp_technical',
        subcategory: 'hardcover',
        severity: 'major',
        title: rule.title,
        explanation: rule.requirement,
        original_excerpt: project.title || 'hardcover config',
        suggested_correction: '',
        reason: rule.id,
        confidence: 0.75,
        objective: false,
        source_rule_id: rule.id,
      }
    } else if (rule.id === 'kdp.print.prepub_placeholders') {
      const body = Object.values(project.sections || {})
        .map((s) => s.content_md || '')
        .join('\n')
      const hit = /(lorem ipsum|\[title\]|\[author\]|placeholder text|click here to|sample chapter|insert text here|insert chapter)/i.test(
        body
      )
      if (hit) {
        status = 'fail'
        detail = 'Possible template placeholder text detected in manuscript.'
        finding = {
          category: 'kdp_technical',
          subcategory: 'placeholder',
          severity: 'major',
          title: rule.title,
          explanation: detail + ' ' + rule.requirement,
          original_excerpt: project.title || 'manuscript',
          suggested_correction: '',
          reason: rule.id,
          confidence: 0.8,
          objective: true,
          source_rule_id: rule.id,
        }
      } else {
        detail = 'No common placeholder patterns detected (still re-check manually).'
      }
    } else if (rule.id === 'kdp.print.blank_pages') {
      // Heuristic: runs of empty section bodies or 5+ consecutive blank markdown pages (--- / empty paras)
      const secs = Object.values(project.sections || {}).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      let run = 0
      let maxRun = 0
      for (const s of secs) {
        const empty = !String(s.content_md || '').trim()
        if (empty) {
          run += 1
          maxRun = Math.max(maxRun, run)
        } else run = 0
      }
      const full = secs.map((s) => s.content_md || '').join('\n')
      const blankBlocks = (full.match(/(?:\n\s*){8,}/g) || []).length
      if (maxRun >= 5 || blankBlocks >= 3) {
        status = 'fail'
        detail = `Possible excessive blank runs (empty sections run=${maxRun}, large whitespace blocks=${blankBlocks}). KDP: ≤4 consecutive blank mid/front; ≤10 at end.`
        finding = {
          category: 'kdp_technical',
          subcategory: 'blank_pages',
          severity: 'major',
          title: rule.title,
          explanation: detail + ' ' + rule.requirement,
          original_excerpt: project.title || 'manuscript',
          suggested_correction: '',
          reason: rule.id,
          confidence: 0.7,
          objective: true,
          source_rule_id: rule.id,
        }
      } else {
        detail = `No heuristic blank-page excess (empty-section run=${maxRun}). Still verify in Print Previewer / PDF.`
      }
    } else if (rule.id === 'kdp.print.prepub_details_match') {
      const body = Object.values(project.sections || {})
        .map((s) => s.content_md || '')
        .join('\n')
      const title = String(project.title || '').trim()
      const author = String(project.author_name || '').trim()
      const issues = []
      if (title && title.length >= 3 && !body.toLowerCase().includes(title.toLowerCase())) {
        issues.push(`title “${title}” not found in manuscript text`)
      }
      if (author && author.length >= 2 && !body.toLowerCase().includes(author.toLowerCase())) {
        issues.push(`author “${author}” not found in manuscript text`)
      }
      if (issues.length) {
        status = 'fail'
        detail = `Metadata mismatch heuristic: ${issues.join('; ')}. KDP requires file details to match title setup.`
        finding = {
          category: 'kdp_technical',
          subcategory: 'metadata_match',
          severity: 'major',
          title: rule.title,
          explanation: detail + ' ' + rule.requirement,
          original_excerpt: title || author || 'title page',
          suggested_correction: '',
          reason: rule.id,
          confidence: 0.7,
          objective: true,
          source_rule_id: rule.id,
        }
      } else if (title || author) {
        detail = 'Title/author strings appear in manuscript (still confirm headers/copyright match KDP setup exactly).'
        status = 'pass'
      } else {
        status = 'needs_verification'
        detail = rule.requirement + ' Set project title and author_name to enable automatic check.'
        finding = {
          category: 'kdp_policy',
          subcategory: 'metadata_match',
          severity: 'needs_verification',
          title: rule.title,
          explanation: detail,
          original_excerpt: project.title || 'KDP metadata',
          suggested_correction: '',
          reason: rule.id,
          confidence: 0.7,
          objective: false,
          source_rule_id: rule.id,
        }
      }
    } else if (rule.id === 'kdp.print.isbn_format') {
      const body = Object.values(project.sections || {})
        .map((s) => s.content_md || '')
        .join('\n')
      const hasIsbnLabel = /\bisbn\b/i.test(body)
      const isbnMatch = body.match(/\b97[89][\d\-–— ]{10,20}\d\b/)
      if (hasIsbnLabel && !isbnMatch) {
        status = 'fail'
        detail = '“ISBN” mentioned but no 978/979-style number found nearby — confirm format 978-X-XXXX-XXXX-X.'
        finding = {
          category: 'kdp_technical',
          subcategory: 'isbn',
          severity: 'moderate',
          title: rule.title,
          explanation: detail + ' ' + rule.requirement,
          original_excerpt: 'ISBN',
          suggested_correction: '978-X-XXXX-XXXX-X',
          reason: rule.id,
          confidence: 0.7,
          objective: true,
          source_rule_id: rule.id,
        }
      } else if (isbnMatch && !/97[89]-\d/.test(isbnMatch[0]) && !/\s/.test(isbnMatch[0])) {
        status = 'needs_verification'
        detail = `ISBN-like number found (${isbnMatch[0]}); confirm hyphenation and title-setup match.`
        finding = {
          category: 'kdp_technical',
          subcategory: 'isbn',
          severity: 'suggestion',
          title: rule.title,
          explanation: detail,
          original_excerpt: isbnMatch[0],
          suggested_correction: '',
          reason: rule.id,
          confidence: 0.55,
          objective: false,
          source_rule_id: rule.id,
        }
      } else if (isbnMatch) {
        detail = `ISBN-like value detected (${isbnMatch[0]}) — still confirm it matches KDP title setup.`
        status = 'pass'
      } else {
        detail = 'No ISBN in manuscript (optional).'
        status = 'pass'
      }
    } else if (rule.id === 'kdp.print.spine_min_pages') {
      if (estimatedPages < 79) {
        status = 'needs_verification'
        detail = `Est. ~${estimatedPages} pages (<79) — remove spine text on cover if present.`
        finding = {
          category: 'kdp_technical',
          subcategory: 'spine',
          severity: 'needs_verification',
          title: rule.title,
          explanation: detail + ' ' + rule.requirement,
          original_excerpt: project.title || 'cover',
          suggested_correction: '',
          reason: rule.id,
          confidence: 0.75,
          objective: false,
          source_rule_id: rule.id,
        }
      } else {
        detail = `Est. ~${estimatedPages} pages — spine text allowed if margins allow.`
        status = 'pass'
      }
    } else if (
      rule.id === 'kdp.print.prepub_images_dpi' ||
      rule.id === 'kdp.print.prepub_legibility' ||
      rule.id === 'kdp.print.fonts_embed' ||
      rule.id === 'kdp.print.pagination' ||
      rule.id === 'kdp.print.hidden_characters' ||
      rule.id === 'kdp.print.transparencies' ||
      rule.id === 'kdp.print.save_pdf_embed' ||
      rule.id === 'kdp.print.endure_font_note' ||
      rule.id === 'kdp.policy.ai_disclosure' ||
      rule.id === 'kdp.policy.content_guidelines' ||
      rule.id === 'kdp.policy.translation_credit' ||
      rule.id === 'kdp.ebook.previewer'
    ) {
      status = 'needs_verification'
      detail = rule.requirement
      finding = {
        category: 'kdp_policy',
        subcategory: rule.id.replace('kdp.policy.', '').replace('kdp.ebook.', ''),
        severity: 'needs_verification',
        title: rule.title,
        explanation: rule.requirement,
        original_excerpt: project.title || 'KDP policy checklist',
        suggested_correction: '',
        reason: rule.id,
        confidence: 0.7,
        objective: false,
        source_rule_id: rule.id,
      }
    }

    results.push({
      rule_id: rule.id,
      title: rule.title,
      severity: rule.severity,
      status,
      detail,
      source_url: rule.source_url,
      retrieved: rule.retrieved,
      finding,
    })
  }

  const blocking = results.filter((r) => r.status === 'fail' && (r.severity === 'critical' || r.severity === 'major'))
  const needsConfig = results.filter((r) => r.status === 'needs_config')
  return {
    rules_version: KDP_RULES_VERSION,
    estimated_pages: estimatedPages,
    results,
    summary: {
      pass: results.filter((r) => r.status === 'pass').length,
      fail: results.filter((r) => r.status === 'fail').length,
      needs_config: needsConfig.length,
      needs_verification: results.filter((r) => r.status === 'needs_verification').length,
      blocking: blocking.length,
    },
    disclaimer:
      'Not affiliated with Amazon. Passing these checks does not guarantee KDP acceptance.',
  }
}

export function kdpRulesPayload() {
  return {
    version: KDP_RULES_VERSION,
    rules: KDP_RULES.map((r) => ({ ...r })),
    gutter_table: GUTTER_BY_PAGE_COUNT.map((r) => ({ ...r })),
  }
}
