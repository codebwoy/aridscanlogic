/**
 * Workbook / journal / activity-book deterministic checks.
 * Does not flag intentional blank templates as redundant prose.
 */

export function workbookFindings(sections = [], bookType = '') {
  if (!['workbook', 'journal'].includes(bookType)) return []
  const out = []
  const all = Object.values(sections || {})
  const exerciseNums = []
  const instructionDupes = new Map()

  for (const s of all) {
    const text = s.content_md || ''
    const nums = [...text.matchAll(/(?:exercise|übung|exercice|ejercicio|esercizio)\s*(\d+)/gi)]
    for (const m of nums) exerciseNums.push({ n: Number(m[1]), section: s.key, excerpt: m[0] })

    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
    for (const line of lines) {
      if (/^(write|describe|list|circle|check|fill|zeichne|schreibe|escribe|écris|scrivi)\b/i.test(line)) {
        const key = line.toLowerCase()
        instructionDupes.set(key, (instructionDupes.get(key) || 0) + 1)
      }
    }

    // Blank writing pages: repeated underscores / "Notes" only — do not treat as redundancy finding here
    const blankish = /^[\s_\-.]*$|^(notes|notizen|notas|notes:)\s*$/im.test(text) && text.length < 80
    if (blankish) {
      // intentional blank — skip
    }
  }

  const seen = new Set()
  const gaps = []
  const sorted = [...new Set(exerciseNums.map((e) => e.n))].sort((a, b) => a - b)
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1] + 1) {
      gaps.push({ from: sorted[i - 1], to: sorted[i] })
    }
  }
  if (gaps.length) {
    out.push({
      category: 'structure',
      subcategory: 'workbook_numbering',
      severity: 'moderate',
      title: 'Exercise numbering gap',
      explanation: `Possible missing exercise numbers between ${gaps.map((g) => `${g.from}→${g.to}`).join(', ')}.`,
      original_excerpt: exerciseNums[0]?.excerpt || 'Exercise',
      suggested_correction: '',
      reason: 'workbook_engine',
      confidence: 0.7,
      objective: true,
      section_key: exerciseNums[0]?.section || '',
      chapter: 'Workbook',
    })
  }

  for (const [line, count] of instructionDupes) {
    if (count >= 4 && line.length > 12) {
      // Journals may repeat prompts intentionally — soft flag
      out.push({
        category: 'structure',
        subcategory: 'workbook_repeat_instruction',
        severity: 'suggestion',
        title: 'Repeated instruction template',
        explanation: `Instruction appears ${count}×. OK for journals/planners; review if accidental copy-paste.`,
        original_excerpt: line.slice(0, 120),
        suggested_correction: '',
        reason: 'workbook_engine',
        confidence: 0.55,
        objective: false,
        section_key: '',
        chapter: 'Workbook',
      })
      if (out.length > 8) break
    }
  }

  if (bookType === 'workbook' && sorted.length === 0) {
    out.push({
      category: 'structure',
      subcategory: 'workbook_missing_exercises',
      severity: 'needs_verification',
      title: 'No numbered exercises detected',
      explanation: 'Workbook type selected but no “Exercise N” markers found. Confirm structure or rename prompts.',
      original_excerpt: all[0]?.content_md?.slice(0, 60) || 'workbook',
      suggested_correction: '',
      reason: 'workbook_engine',
      confidence: 0.5,
      objective: false,
      section_key: all[0]?.key || '',
      chapter: all[0]?.title || 'Workbook',
    })
  }

  const full = all.map((s) => s.content_md || '').join('\n')
  // Answer-key consistency: "Answer key" present but few "Exercise N" — soft
  if (/answer\s*key|lösung|soluciones|corrigé/i.test(full) && sorted.length >= 2) {
    const keyNums = [...full.matchAll(/(?:answer|lösung|respuesta)\s*(?:to\s*)?(?:exercise|übung)?\s*(\d+)/gi)].map(
      (m) => Number(m[1])
    )
    if (keyNums.length && sorted.length) {
      const missing = sorted.filter((n) => !keyNums.includes(n))
      if (missing.length >= 1 && missing.length <= 8) {
        out.push({
          category: 'structure',
          subcategory: 'workbook_answer_key',
          severity: 'moderate',
          title: 'Answer key may miss some exercises',
          explanation: `Exercises ${missing.slice(0, 6).join(', ')} appear in the body but not clearly in the answer key. Confirm pairing.`,
          original_excerpt: 'Answer key',
          suggested_correction: '',
          reason: 'workbook_engine',
          confidence: 0.55,
          objective: false,
          section_key: '',
          chapter: 'Workbook',
        })
      }
    }
  }

  // Writing space: prompts without blank lines / underscores nearby
  let promptNoSpace = 0
  for (const s of all) {
    const lines = String(s.content_md || '').split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!/^(write|describe|list|draw|circle|check|fill in)\b/i.test(line)) continue
      const next = (lines[i + 1] || '') + (lines[i + 2] || '')
      if (!/_{3,}|\n\s*\n|□|☐|\[\s*\]/.test(next) && next.trim().length > 0) {
        promptNoSpace += 1
      }
    }
  }
  if (promptNoSpace >= 3) {
    out.push({
      category: 'structure',
      subcategory: 'workbook_writing_space',
      severity: 'suggestion',
      title: 'Prompts may lack answer space',
      explanation: `${promptNoSpace} action prompts appear without nearby blanks/checkboxes. For print workbooks, leave writing space (BookReady workbook engine).`,
      original_excerpt: 'Write',
      suggested_correction: '',
      reason: 'workbook_engine',
      confidence: 0.5,
      objective: false,
      section_key: '',
      chapter: 'Workbook',
    })
  }

  if (/\bsee\s+(page|p\.)\s*\d+/i.test(full) && !/\b\d+\b/.test(full.slice(0, 200))) {
    // weak — skip
  }
  // Broken page refs: "see page XX" / "page TBD"
  if (/see\s+page\s*(xx|tbd|\?+|#+)/i.test(full)) {
    out.push({
      category: 'structure',
      subcategory: 'workbook_page_ref',
      severity: 'major',
      title: 'Unresolved page reference',
      explanation: 'Placeholder page references (XX/TBD) remain — fix before print.',
      original_excerpt: (full.match(/see\s+page\s*(?:xx|tbd|\?+|#+)/i) || ['see page XX'])[0],
      suggested_correction: '',
      reason: 'workbook_engine',
      confidence: 0.85,
      objective: true,
      section_key: '',
      chapter: 'Workbook',
    })
  }

  for (const f of out) {
    const k = f.title + f.original_excerpt
    if (seen.has(k)) continue
    seen.add(k)
  }
  return out
}
