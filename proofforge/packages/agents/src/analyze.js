import {
  chunkText,
  normalizeFinding,
  repetitionFindings,
  sectionStats,
  scoreFromFindings,
  localizationFindings,
  buildStyleReports,
  aggregateManuscriptReports,
  runKdpChecks,
  filterFindingsByPreferences,
  filterFindingsByDomain,
  defaultPreferences,
  wordCount,
  workbookFindings,
  assessWordCount,
  wordCountGateFinding,
  buildManuscriptAnalysisSections,
  detectTone,
  severityToFeedbackLevel,
  overusedWordsReport,
  sentenceStructureReport,
  readabilityBands,
  grammarReportFromFindings,
  buildSummaryReport,
  buildActionPlan,
  kidsSafeguardFindings,
} from '@proofforge/shared'
import { createVerifyProvider } from '@proofforge/llm'
import { runAgent } from './runAgent.js'
import { createOriginalityProvider, originalityFindings } from './originality.js'
import { createPlagiarismProvider, plagiarismFindings } from './plagiarism.js'

function isFictionType(bookType) {
  return ['fiction', 'poetry', 'other'].includes(bookType) || !bookType
}

/**
 * Full manuscript analysis pipeline:
 * overview → deterministic style/localization/repetition → proofread chunks →
 * fiction/nonfiction pass → optional verify → KDP rules → scorecard.
 */
export async function runManuscriptAnalysis(llm, project, hooks = {}) {
  const sections = Object.values(project.sections || {}).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  )
  const prefs = { ...defaultPreferences(), ...(project.preferences || {}) }
  const documentDomain = project.document_domain || prefs.document_domain || 'general'
  const genreComparison = project.genre_comparison || 'general_fiction'
  const authorGoals = String(project.author_goals || '').trim()
  const findings = []
  const stats = {}
  const sectionReportMap = {}
  const chapterCritiques = []
  const memory = {
    characters: [],
    timeline: [],
    locations: [],
    open_loops: [],
    main_claims: [],
    undefined_terms: [],
    open_questions: [],
  }
  let usageTotal = { tokensIn: 0, tokensOut: 0, costUsd: 0 }
  let plagiarismReport = null
  let translationNote = null
  let wordGate = null

  const addUsage = (u) => {
    usageTotal.tokensIn += u?.tokensIn || 0
    usageTotal.tokensOut += u?.tokensOut || 0
    usageTotal.costUsd = Number((usageTotal.costUsd + (u?.costUsd || 0)).toFixed(6))
  }

  const totalPhases = sections.length + 3
  hooks.onProgress?.({ phase: 'overview', done: 0, total: totalPhases })

  const summaries = sections.map((s) => ({
    key: s.key,
    title: s.title,
    words: s.word_count || wordCount(s.content_md),
    preview: String(s.content_md || '').slice(0, 400),
  }))

  let overview = null
  try {
    const ov = await runAgent(llm, 'overview.v1', {
      language: project.language,
      languageVariety: project.language_variety,
      modelClass: 'cheap',
      userContent: JSON.stringify({
        title: project.title,
        book_type: project.book_type,
        language: project.language,
        language_variety: project.language_variety,
        edit_mode: project.edit_mode,
        genre_comparison: genreComparison,
        author_goals: authorGoals || undefined,
        fine_tune_instructions: authorGoals
          ? 'Steer Manuscript Analysis toward these author goals/concerns.'
          : undefined,
        sections: summaries,
      }),
    })
    overview = ov.data
    addUsage(ov.usage)
  } catch (err) {
    overview = {
      subject_or_story: project.title || 'Manuscript',
      note: `Overview unavailable: ${err.message}`,
      strengths: [],
      opportunities: ['Re-run overview when the LLM provider is ready'],
      themes: [],
      character_notes: [],
      setting_notes: [],
    }
  }

  let done = 1
  for (const section of sections) {
    hooks.onProgress?.({
      phase: 'section_audit',
      section: section.key,
      done,
      total: totalPhases,
    })
    stats[section.key] = sectionStats(section)

    const isFirst =
      sections.findIndex((s) => s.key === section.key) === 0 ||
      /^(chapter\s*)?1\b|^prologue|^opening/i.test(String(section.title || ''))
    const styleBundle = buildStyleReports(section.content_md, {
      language: project.language,
      sectionKey: section.key,
      chapter: section.title,
      firstChapter: isFirst,
    })
    sectionReportMap[section.key] = { ...styleBundle, _text: section.content_md, first_chapter: isFirst }

    const deterministic = [
      ...repetitionFindings(section),
      ...localizationFindings(section, project.language, project.language_variety),
      ...styleBundle.findings,
    ]
    for (const det of deterministic) {
      const n = normalizeFinding(det, {
        sectionText: section.content_md,
        sectionKey: section.key,
        chapter: section.title,
      })
      if (n.ok) findings.push(n.finding)
    }

    // Internal originality vs other sections
    try {
      const orig = createOriginalityProvider()
      const others = sections.filter((o) => o.key !== section.key).map((o) => o.content_md)
      const scan = await orig.scan(section.content_md, { otherTexts: others })
      for (const det of originalityFindings(scan, section)) {
        const n = normalizeFinding(det, {
          sectionText: section.content_md,
          sectionKey: section.key,
          chapter: section.title,
        })
        if (n.ok) findings.push(n.finding)
      }
    } catch {
      /* originality optional */
    }

    const chunks = chunkText(section.content_md, { maxChars: 5500 })
    for (const chunk of chunks) {
      try {
        const res = await runAgent(llm, 'proofread.v1', {
          language: project.language,
          languageVariety: project.language_variety,
          modelClass: 'cheap',
          userContent:
            JSON.stringify({
              edit_mode: project.edit_mode || 'natural',
              book_type: project.book_type,
              section_key: section.key,
              section_title: section.title,
              chunk_index: chunk.index,
              preferences: prefs,
              instructions:
                'Return findings whose original_excerpt is an exact substring of the SECTION text. Max 12.',
            }) + `\n\n<<<SECTION>>>\n${chunk.text}\n<<<END>>>`,
        })
        addUsage(res.usage)
        for (const raw of res.data.findings || []) {
          const n = normalizeFinding(raw, {
            sectionText: section.content_md,
            sectionKey: section.key,
            chapter: section.title,
          })
          if (n.ok) findings.push(n.finding)
        }
      } catch (err) {
        findings.push({
          category: 'other',
          subcategory: 'analysis_error',
          severity: 'needs_verification',
          title: 'Chunk analysis failed',
          explanation: err.message || 'Proofread chunk failed',
          original_excerpt: chunk.text.slice(0, 80),
          suggested_correction: '',
          reason: 'provider_or_parse_error',
          confidence: 0,
          objective: false,
          section_key: section.key,
          chapter: section.title,
          resolution: 'open',
        })
      }
    }

    // Genre-specialized pass (first chunk / whole section if short)
    const genreKey = isFictionType(project.book_type) ? 'fiction.v1' : 'nonfiction.v1'
    const genreText = section.content_md.slice(0, 7000)
    try {
      const genre = await runAgent(llm, genreKey, {
        language: project.language,
        languageVariety: project.language_variety,
        modelClass: 'draft',
        userContent:
          JSON.stringify({
            book_type: project.book_type,
            section_key: section.key,
            section_title: section.title,
          }) + `\n\n<<<SECTION>>>\n${genreText}\n<<<END>>>`,
      })
      addUsage(genre.usage)
      const mem = genre.data.memory || {}
      for (const k of Object.keys(memory)) {
        if (Array.isArray(mem[k])) memory[k] = [...new Set([...memory[k], ...mem[k]])].slice(0, 40)
      }
      for (const raw of genre.data.findings || []) {
        const n = normalizeFinding(raw, {
          sectionText: section.content_md,
          sectionKey: section.key,
          chapter: section.title,
        })
        if (n.ok) findings.push(n.finding)
      }
    } catch {
      /* genre pass optional */
    }

    // Chapter critique (PWA manuscript-analysis style)
    if (project.chapter_critique !== false) {
      try {
        const crit = await runAgent(llm, 'chapter_critique.v1', {
          language: project.language,
          languageVariety: project.language_variety,
          modelClass: 'draft',
          userContent:
            JSON.stringify({
              section_key: section.key,
              section_title: section.title,
              book_type: project.book_type,
            }) + `\n\n<<<SECTION>>>\n${section.content_md.slice(0, 8000)}\n<<<END>>>`,
        })
        addUsage(crit.usage)
        chapterCritiques.push({
          section_key: section.key,
          title: section.title,
          ...crit.data,
          findings: undefined,
        })
        for (const raw of crit.data.findings || []) {
          const n = normalizeFinding(raw, {
            sectionText: section.content_md,
            sectionKey: section.key,
            chapter: section.title,
          })
          if (n.ok) findings.push(n.finding)
        }
      } catch {
        /* critique optional */
      }
    }

    done += 1
  }

  // Cross-chapter continuity (Level 3)
  if (sections.length >= 2) {
    try {
      const map = sections.map((s) => ({
        key: s.key,
        title: s.title,
        summary: String(s.content_md || '').slice(0, 500),
        words: wordCount(s.content_md),
      }))
      const xc = await runAgent(llm, 'cross_chapter.v1', {
        language: project.language,
        languageVariety: project.language_variety,
        modelClass: 'draft',
        userContent: JSON.stringify({
          book_type: project.book_type,
          chapters: map,
          memory,
        }),
      })
      addUsage(xc.usage)
      memory.continuity_note = xc.data.continuity_note || ''
      for (const raw of xc.data.findings || []) {
        const n = normalizeFinding(raw, {
          sectionText: raw.original_excerpt || sections[0].content_md,
          sectionKey: raw.section_key || sections[0].key,
          chapter: 'Cross-chapter',
        })
        if (n.ok) findings.push(n.finding)
      }
    } catch {
      /* cross-chapter optional */
    }
  }

  // Kids / YA soft safeguards
  const kidsSample = sections.map((s) => s.content_md).join('\n\n')
  for (const det of kidsSafeguardFindings(kidsSample, project.book_type)) {
    const n = normalizeFinding(det, {
      sectionText: det.original_excerpt,
      sectionKey: '',
      chapter: 'Safeguards',
    })
    if (n.ok) findings.push(n.finding)
  }

  // Word-count gate (PWA 6k–300k guidance)
  const preWords = sections.reduce((n, s) => n + wordCount(s.content_md), 0)
  wordGate = assessWordCount(preWords)
  const wgFinding = wordCountGateFinding(wordGate)
  if (wgFinding) {
    const n = normalizeFinding(wgFinding, {
      sectionText: wgFinding.original_excerpt,
      sectionKey: '',
      chapter: 'Manuscript',
    })
    if (n.ok) findings.push(n.finding)
  }

  // Translation mode
  if (project.translation_mode || project.edit_mode === 'translation') {
    try {
      const sample = sections
        .map((s) => s.content_md)
        .join('\n\n')
        .slice(0, 10_000)
      const tr = await runAgent(llm, 'translation.v1', {
        language: project.language,
        languageVariety: project.language_variety,
        modelClass: 'cheap',
        userContent:
          JSON.stringify({
            target_language: project.language,
            source_language: project.source_language || '',
          }) + `\n\n<<<SECTION>>>\n${sample}\n<<<END>>>`,
      })
      addUsage(tr.usage)
      translationNote = {
        detected_languages: tr.data.detected_languages,
        note: tr.data.note,
      }
      for (const raw of tr.data.findings || []) {
        const n = normalizeFinding(raw, {
          sectionText: sample,
          sectionKey: sections[0]?.key || '',
          chapter: sections[0]?.title || 'Translation',
        })
        if (n.ok) findings.push(n.finding)
      }
    } catch {
      /* translation optional */
    }
  }

  // External plagiarism — ONLY with informed consent
  if (project.plagiarism_consent === true) {
    const provider = createPlagiarismProvider()
    if (provider) {
      try {
        const full = sections.map((s) => s.content_md).join('\n\n')
        plagiarismReport = await provider.scan(full)
        for (const det of plagiarismFindings(plagiarismReport)) {
          const n = normalizeFinding(det, {
            sectionText: det.original_excerpt,
            sectionKey: det.section_key || '',
            chapter: det.chapter || 'Similarity',
          })
          if (n.ok) findings.push(n.finding)
        }
      } catch (err) {
        plagiarismReport = { error: err.message, provider: provider.id }
      }
    } else {
      plagiarismReport = {
        provider: 'off',
        matches: [],
        coverage_note:
          'Plagiarism consent given but no provider configured (set PROOFFORGE_PLAGIARISM_PROVIDER=mock|http).',
        uploaded_externally: false,
      }
    }
  }

  // Workbook engine
  for (const det of workbookFindings(
    Object.fromEntries(sections.map((s) => [s.key, s])),
    project.book_type
  )) {
    const n = normalizeFinding(det, {
      sectionText: det.original_excerpt,
      sectionKey: det.section_key,
      chapter: det.chapter,
    })
    if (n.ok) findings.push(n.finding)
  }

  // Verification pass — primary LLM + optional second provider (disagreement preserved)
  hooks.onProgress?.({ phase: 'verify', done: done, total: totalPhases })
  const toVerify = findings.filter((f) => !f.objective && f.original_excerpt).slice(0, 12)
  const disagreements = []
  if (toVerify.length && sections[0]) {
    const sampleSection = sections.find((s) => s.key === toVerify[0].section_key) || sections[0]
    const verifyPayload =
      JSON.stringify({
        findings: toVerify.map((f) => ({
          title: f.title,
          original_excerpt: f.original_excerpt,
          explanation: f.explanation,
        })),
      }) + `\n\n<<<SECTION>>>\n${String(sampleSection.content_md).slice(0, 8000)}\n<<<END>>>`

    let primaryVerdicts = []
    try {
      const ver = await runAgent(llm, 'verify.v1', {
        language: project.language,
        languageVariety: project.language_variety,
        modelClass: 'cheap',
        temperature: 0.1,
        userContent: verifyPayload,
      })
      addUsage(ver.usage)
      primaryVerdicts = ver.data.verdicts || []
    } catch {
      /* verify optional */
    }

    let secondaryVerdicts = []
    const verifyLlm = createVerifyProvider()
    if (verifyLlm && verifyLlm.id !== llm.id) {
      try {
        const ver2 = await runAgent(verifyLlm, 'verify.v1', {
          language: project.language,
          languageVariety: project.language_variety,
          modelClass: 'cheap',
          temperature: 0.1,
          userContent: verifyPayload,
        })
        addUsage(ver2.usage)
        secondaryVerdicts = ver2.data.verdicts || []
      } catch {
        /* secondary optional */
      }
    }

    const primaryMap = new Map(primaryVerdicts.map((v) => [v.finding_title, v]))
    const secondaryMap = new Map(secondaryVerdicts.map((v) => [v.finding_title, v]))
    for (const f of findings) {
      const a = primaryMap.get(f.title)
      const b = secondaryMap.get(f.title)
      if (a && b && a.keep !== b.keep) {
        disagreements.push({
          title: f.title,
          primary: { provider: llm.id, keep: a.keep, note: a.note },
          secondary: { provider: verifyLlm?.id, keep: b.keep, note: b.note },
        })
        f.verification_status = 'disagreement'
        f.severity = 'needs_verification'
        f.confidence = Math.min(f.confidence || 0.5, 0.4)
        f.explanation = `${f.explanation} [Models disagree — author review required.]`
      } else if (a && a.keep === false) {
        f.verification_status = 'rejected_by_verifier'
        f.severity = 'needs_verification'
        f.confidence = Math.min(f.confidence || 0.5, 0.35)
      } else if (a && toVerify.some((t) => t.title === f.title)) {
        f.verification_status = 'verified'
      }
    }
  }
  done += 1

  // Deduplicate
  const seen = new Set()
  let deduped = []
  for (const f of findings) {
    const key = `${f.category}|${f.subcategory}|${f.original_excerpt}`.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    deduped.push(f)
  }
  deduped = filterFindingsByPreferences(deduped, prefs)
  deduped = filterFindingsByDomain(deduped, documentDomain)
  const dictionary = new Set(
    (project.custom_dictionary || []).map((w) => String(w).toLowerCase())
  )
  if (dictionary.size) {
    deduped = deduped.filter((f) => {
      if (f.category !== 'spelling') return true
      const token = String(f.original_excerpt || '')
        .toLowerCase()
        .split(/\s+/)[0]
      return !dictionary.has(token)
    })
  }
  for (const f of deduped) {
    f.feedback_level = severityToFeedbackLevel(f.severity)
  }

  const style_reports = aggregateManuscriptReports(sectionReportMap, deduped, project.language, {
    genreComparison,
  })
  const fullText = sections.map((s) => s.content_md).join('\n\n')
  const tone = detectTone(fullText)
  const manuscript_analysis = buildManuscriptAnalysisSections(overview, deduped)
  const overused = overusedWordsReport(fullText)
  const sentence_structure = sentenceStructureReport(fullText)
  const readability_bands = readabilityBands(fullText, project.language)
  const grammar_report = grammarReportFromFindings(deduped)
  const summary_report = buildSummaryReport({
    categoryScores: style_reports.category_scores,
    styleReports: style_reports.manuscript,
    findings: deduped,
    tone,
    genreComparison: style_reports.category_scores?.genre_comparison,
  })
  // Attach catalog reports onto style_reports for single payload
  style_reports.overused_words = overused
  style_reports.sentence_structure = sentence_structure
  style_reports.readability_bands = readability_bands
  style_reports.grammar_report = grammar_report
  style_reports.summary_report = summary_report
  const totalWords = sections.reduce((n, s) => n + wordCount(s.content_md), 0)
  const kdp = runKdpChecks(project, {
    wordCountTotal: totalWords,
    sectionCount: sections.length,
  })
  for (const r of kdp.results) {
    if (r.finding) {
      const n = normalizeFinding(r.finding, {
        sectionText: r.finding.original_excerpt,
        sectionKey: '',
        chapter: 'KDP',
      })
      if (n.ok) deduped.push(n.finding)
    }
  }

  const scores = scoreFromFindings(deduped)
  // Blend AutoCrit-style category scores into scores payload
  scores.autocrit_style = style_reports.category_scores
  scores.kdp_blocking = kdp.summary.blocking
  scores.kdp_needs_config = kdp.summary.needs_config
  scores.word_gate = wordGate?.status

  const action_plan = buildActionPlan(deduped, { scores, kdp })

  hooks.onProgress?.({ phase: 'done', done: totalPhases, total: totalPhases })

  return {
    overview,
    manuscript_analysis,
    findings: deduped,
    stats,
    scores,
    style_reports,
    tone,
    kdp,
    action_plan,
    memory,
    chapter_critiques: chapterCritiques,
    disagreements,
    plagiarism: plagiarismReport,
    translation: translationNote,
    word_gate: wordGate,
    document_domain: documentDomain,
    genre_comparison: genreComparison,
    author_goals: authorGoals || null,
    usage: usageTotal,
    coverage: {
      sections_analyzed: sections.length,
      findings_kept: deduped.length,
      findings_raw: findings.length,
      word_count: totalWords,
      word_gate: wordGate,
      document_domain: documentDomain,
      genre_comparison: genreComparison,
      tone: tone.overall,
      disagreements: disagreements.length,
      chapter_critiques: chapterCritiques.length,
      plagiarism_consent: project.plagiarism_consent === true,
      plagiarism_uploaded: Boolean(plagiarismReport?.uploaded_externally),
      checks: {
        deterministic_style: true,
        emotion_tells: true,
        hidden_verbs: true,
        first_chapter_pacing: true,
        tone_detector: true,
        manuscript_analysis_sections: true,
        genre_comparison: true,
        summary_report: true,
        overused_words: true,
        sentence_structure: true,
        readability_bands: true,
        grammar_report: true,
        action_plan: true,
        cross_chapter: sections.length >= 2,
        kids_safeguards: true,
        localization_packs: true,
        proofread_llm: true,
        fiction_or_nonfiction: true,
        chapter_critique: project.chapter_critique !== false,
        translation_mode: Boolean(project.translation_mode || project.edit_mode === 'translation'),
        originality_internal: true,
        plagiarism_external: project.plagiarism_consent === true,
        workbook_engine: ['workbook', 'journal'].includes(project.book_type),
        verify_sample: toVerify.length > 0,
        dual_model_verify: disagreements.length > 0 || Boolean(createVerifyProvider()),
        kdp_rules: true,
        document_domain: true,
        word_count_gate: true,
        pdf_ocr: true,
      },
      limitations: [
        'OCR labels text and reports confidence — verify against the visual PDF before publish',
        'External plagiarism runs only with plagiarism_consent=true + configured provider (never silent upload)',
        'EPUB export is reflowable minimal — validate with Kindle Previewer / epubcheck before publish',
        'KDP Content Guidelines / AI disclosure: author must confirm current Amazon form at upload',
        'Genre comparison and tone are guides — do not chase 100% scores (AutoCrit)',
        'Personal studio — no Stripe or SaaS billing; you pay only your own LLM provider if used',
      ],
    },
  }
}
