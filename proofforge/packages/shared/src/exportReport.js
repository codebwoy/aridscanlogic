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
    '',
    '## Overview',
    '',
    project.overview?.subject_or_story || '_No overview_',
    '',
    project.overview?.structure_summary || '',
    '',
    '## Critical & major findings',
    '',
  ]
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
  lines.push('## All findings', '')
  for (const f of project.findings || []) {
    lines.push(
      `- [${f.resolution || 'open'}][${f.severity}] ${f.category}/${f.subcategory || '-'}: ${f.title}`
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
