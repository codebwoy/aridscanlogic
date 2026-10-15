/**
 * Build exportable audit report + corrected manuscript text.
 */

export function buildJsonReport(project) {
  return {
    product: 'ProofForge',
    generated_at: new Date().toISOString(),
    disclaimer:
      'Editorial scores are guides. Not affiliated with Amazon. Does not guarantee KDP acceptance.',
    project: {
      id: project.id,
      title: project.title,
      language: project.language,
      language_variety: project.language_variety,
      book_type: project.book_type,
      edit_mode: project.edit_mode,
      publishing_target: project.publishing_target,
      status: project.status,
    },
    overview: project.overview,
    scores: project.scores,
    category_scores: project.style_reports?.category_scores || null,
    kdp: project.kdp || null,
    coverage: project.last_analysis?.coverage || null,
    findings: project.findings || [],
    author_decisions: project.author_decisions || [],
    research_note: 'Rule sources documented in proofforge/docs/RESEARCH.md',
  }
}

export function buildCsvFindings(findings = []) {
  const header = [
    'id',
    'severity',
    'category',
    'subcategory',
    'title',
    'section',
    'resolution',
    'original_excerpt',
    'suggested_correction',
    'confidence',
  ]
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const rows = findings.map((f) =>
    [
      f.id,
      f.severity,
      f.category,
      f.subcategory,
      f.title,
      f.section_key || f.chapter,
      f.resolution,
      f.original_excerpt,
      f.suggested_correction,
      f.confidence,
    ]
      .map(esc)
      .join(',')
  )
  return [header.join(','), ...rows].join('\n')
}

export function buildMarkdownReport(project) {
  const s = project.scores || {}
  const lines = [
    `# ProofForge audit — ${project.title}`,
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    '> Scores are guides. Not Amazon-affiliated. No guarantee of KDP acceptance.',
    '',
    `## Summary`,
    '',
    `- Language: ${project.language}/${project.language_variety}`,
    `- Book type: ${project.book_type}`,
    `- Edit mode: ${project.edit_mode}`,
    `- Overall score: ${s.overall ?? '—'}`,
    `- Readiness: ${s.readiness ?? '—'}`,
    `- Open findings: ${s.counts?.total_open ?? 0}`,
    `- Formality: ${project.formality || s.formality || '—'}`,
    '',
  ]
  if (s.dimensions && typeof s.dimensions === 'object') {
    lines.push('## Scorecard dimensions', '')
    for (const [k, v] of Object.entries(s.dimensions)) {
      lines.push(`- ${k.replaceAll('_', ' ')}: ${v}`)
    }
    lines.push('')
  }
  lines.push(
    '## Overview',
    '',
    project.overview?.subject_or_story || '_No overview_',
    '',
    project.overview?.structure_summary || '',
    '',
    '## Critical & major findings',
    ''
  )
  const important = (project.findings || []).filter((f) =>
    ['critical', 'major'].includes(f.severity)
  )
  if (!important.length) lines.push('_None_')
  for (const f of important) {
    lines.push(`### ${f.title} (${f.severity})`)
    lines.push(f.explanation)
    lines.push(`> ${f.original_excerpt}`)
    if (f.suggested_correction) lines.push(`Suggested: ${f.suggested_correction}`)
    lines.push('')
  }
  if (project.kdp) {
    lines.push('## KDP checks', '')
    lines.push(project.kdp.disclaimer || '')
    for (const r of project.kdp.results || []) {
      lines.push(`- **${r.title}**: ${r.status} — ${r.detail}`)
    }
    lines.push('')
  }
  if ((project.author_decisions || []).length) {
    lines.push('## Author decisions (recent)', '')
    for (const d of project.author_decisions.slice(-40)) {
      lines.push(
        `- ${d.at || ''} · ${d.action || ''} · ${d.title || d.finding_id || ''}${
          d.category ? ` (${d.category})` : ''
        }`
      )
    }
    lines.push('')
  }
  lines.push('## All findings', '')
  for (const f of project.findings || []) {
    lines.push(
      `- [${f.resolution || 'open'}][${f.severity}] ${f.category}/${f.subcategory || '-'}: ${f.title}`
    )
  }
  if (project.translation_mode || project.edit_mode === 'translation' || project.translation) {
    lines.push('', '## Translation log', '')
    lines.push(`- Source language: ${project.source_language || '—'}`)
    lines.push(`- Target: ${project.language}/${project.language_variety}`)
    lines.push(`- Glossary terms: ${(project.translation_glossary || []).length}`)
    if (project.translation?.note) lines.push(`- Note: ${project.translation.note}`)
    if (project.translation?.detected_languages?.length) {
      lines.push(`- Detected: ${project.translation.detected_languages.join(', ')}`)
    }
    lines.push(
      '- Reminder: credit translator + original author on KDP when publishing a translation.'
    )
  }
  return lines.join('\n')
}

export function buildCorrectedManuscript(project) {
  const sections = Object.values(project.sections || {}).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  )
  return sections.map((s) => `# ${s.title}\n\n${s.content_md || ''}`).join('\n\n')
}
