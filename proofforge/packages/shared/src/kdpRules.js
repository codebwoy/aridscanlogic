/**
 * Versioned KDP compliance rules — provenance from Amazon help (see docs/RESEARCH.md).
 * Never claim Amazon approval. Separate technical vs policy; mark needs_config when specs missing.
 */

export const KDP_RULES_VERSION = '2026-10-14'

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

  const results = []
  for (const rule of KDP_RULES) {
    if (rule.format !== 'all' && !formats.includes(rule.format) && target !== 'editorial_only') {
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
      const hit = /(lorem ipsum|\[title\]|\[author\]|placeholder text|click here to|sample chapter)/i.test(
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
    } else if (
      rule.id === 'kdp.print.prepub_details_match' ||
      rule.id === 'kdp.print.prepub_images_dpi' ||
      rule.id === 'kdp.print.prepub_legibility' ||
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
