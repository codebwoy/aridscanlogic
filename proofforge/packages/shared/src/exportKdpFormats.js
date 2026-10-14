/**
 * Additional KDP-supported manuscript formats (ebook help G200634390):
 * DOCX / EPUB / PDF / TXT / HTML (+ KPF via Kindle Create only).
 */

import { buildCorrectedManuscript } from './exportReport.js'

/** Plain text — KDP accepts TXT for ebook in supported languages. */
export function buildPlainTextManuscript(project) {
  const md = buildCorrectedManuscript(project)
  const text = String(md || '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
  return {
    text,
    filename: `manuscript-${project.id || 'export'}.txt`,
    contentType: 'text/plain; charset=utf-8',
    kdp_note: 'KDP accepts TXT for ebook manuscripts. Validate conversion in Kindle Previewer.',
  }
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Simple semantic HTML for KDP HTML/ZIP upload path.
 * Author can zip the single .html before upload.
 */
export function buildEbookHtml(project) {
  const sections = Object.values(project.sections || {}).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  )
  const parts = []
  parts.push(`<!DOCTYPE html>
<html lang="${escapeHtml(project.language || 'en')}">
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(project.title || 'Manuscript')}</title>
<meta name="author" content="${escapeHtml(project.author_name || '')}"/>
<style>
  body { font-family: Georgia, "Times New Roman", serif; line-height: 1.45; max-width: 40rem; margin: 2rem auto; padding: 0 1rem; }
  h1 { font-size: 1.6rem; page-break-before: always; }
  h1:first-of-type { page-break-before: avoid; }
  p { margin: 0 0 0.85em; text-indent: 1.2em; }
  .title-page { text-align: center; margin: 4rem 0; text-indent: 0; }
  .title-page p { text-indent: 0; }
</style>
</head>
<body>
`)
  parts.push(`<section class="title-page">
  <h1>${escapeHtml(project.title || 'Manuscript')}</h1>
  ${project.subtitle ? `<p><em>${escapeHtml(project.subtitle)}</em></p>` : ''}
  ${project.author_name ? `<p>${escapeHtml(project.author_name)}</p>` : ''}
</section>
`)
  for (const s of sections) {
    parts.push(`<section id="${escapeHtml(s.key || '')}">\n`)
    parts.push(`<h1>${escapeHtml(s.title || s.key || 'Chapter')}</h1>\n`)
    const paras = String(s.content_md || '')
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)
    for (const p of paras) {
      const clean = p.replace(/^#{1,6}\s+/, '').replace(/\*\*/g, '')
      parts.push(`<p>${escapeHtml(clean).replace(/\n/g, '<br/>')}</p>\n`)
    }
    parts.push(`</section>\n`)
  }
  parts.push(`</body>\n</html>\n`)
  return {
    html: parts.join(''),
    filename: `manuscript-${project.id || 'export'}.html`,
    contentType: 'text/html; charset=utf-8',
    kdp_note:
      'KDP accepts HTML (or ZIP of HTML). Zip this file if uploading as HTML package. Validate in Kindle Previewer.',
  }
}

/**
 * Author-facing KDP upload readiness checklist (ebook + print).
 */
export function kdpUploadChecklist(project) {
  const target = project.publishing_target || 'editorial_only'
  const print =
    target === 'paperback' ||
    target === 'hardcover' ||
    target === 'multiple'
  const ebook = target === 'kindle_ebook' || target === 'multiple' || target === 'editorial_only'
  const trim = project.print_config?.trim_size_in
  const items = []

  items.push({
    id: 'audit',
    group: 'before_export',
    label: 'Run full ProofForge audit and resolve critical / major findings',
    done: project.status === 'analyzed' && (project.scores?.counts?.critical || 0) === 0,
  })
  items.push({
    id: 'previewer_ebook',
    group: 'kindle_ebook',
    label: 'Validate DOCX/EPUB/HTML in Kindle Previewer before KDP upload',
    done: false,
    required: ebook,
    link: 'https://kdp.amazon.com/en_US/help/topic/G200634390',
  })
  items.push({
    id: 'kpf_optional',
    group: 'kindle_ebook',
    label: 'Optional: open DOCX in Kindle Create → export KPF (best device fit)',
    done: false,
    required: false,
  })
  items.push({
    id: 'mobi_avoid',
    group: 'kindle_ebook',
    label: 'Do not upload MOBI fixed-layout (ended March 2025)',
    done: true,
    required: ebook,
  })
  items.push({
    id: 'pdf_ebook_lang',
    group: 'kindle_ebook',
    label:
      'PDF as ebook only for EN/FR/DE/IT/PT/ES (+ Catalan/Galician/Basque) — prefer DOCX/EPUB/KPF',
    done: false,
    required: false,
  })

  items.push({
    id: 'trim',
    group: 'print',
    label: `Print trim size configured${trim ? ` (${trim})` : ''}`,
    done: Boolean(trim),
    required: print,
  })
  items.push({
    id: 'margins',
    group: 'print',
    label: 'Outside margin + gutter set for estimated page count',
    done:
      project.print_config?.outside_margin_in != null &&
      project.print_config?.gutter_in != null,
    required: print,
  })
  items.push({
    id: 'print_pdf',
    group: 'print',
    label: 'Export Print PDF (or DOCX→Word embed fonts→PDF) and check in Print Previewer',
    done: false,
    required: print,
  })
  items.push({
    id: 'cover',
    group: 'print',
    label: 'Cover is a separate full-bleed PDF (not the interior) — use KDP cover calculator',
    done: false,
    required: print,
  })
  items.push({
    id: 'spine',
    group: 'print',
    label: 'Spine text only if ≥79 pages; match title/author metadata exactly',
    done: false,
    required: print,
  })
  items.push({
    id: 'ai_disclosure',
    group: 'policy',
    label: 'Confirm AI-generated vs AI-assisted disclosure on current KDP form',
    done: false,
    required: true,
    link: 'https://kdp.amazon.com/en_US/help/topic/G200672390',
  })

  return {
    publishing_target: target,
    items,
    formats: {
      kindle_ebook: ['docx', 'epub', 'html', 'txt', 'pdf_limited_languages', 'kpf_via_kindle_create'],
      paperback_hardcover: ['pdf_print_interior', 'docx_then_embedded_font_pdf'],
      not_supported_here: ['kpf_direct', 'cover_designer', 'print_previewer_live'],
    },
    disclaimer:
      'Not affiliated with Amazon. Completing this checklist does not guarantee KDP acceptance.',
  }
}
