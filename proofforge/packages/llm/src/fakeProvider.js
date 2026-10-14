import { LLMProvider, estimateCostUsd } from './provider.js'

/**
 * Deterministic editorial fixtures for offline UI + tests.
 */
export class FakeLLMProvider extends LLMProvider {
  get id() {
    return 'fake'
  }

  async complete(req) {
    const user = req.messages?.map((m) => m.content).join('\n') || ''
    const system = String(req.system || '').toLowerCase()
    const promptName = String(req.metadata?.promptName || req.metadata?.promptKey || '').toLowerCase()
    let text

    if (promptName.includes('overview') || system.includes('overviewagent')) {
      text = JSON.stringify(fakeOverview(user))
    } else if (promptName.includes('fiction') || system.includes('fictionauditagent')) {
      text = JSON.stringify(fakeFiction(user))
    } else if (promptName.includes('nonfiction') || system.includes('nonfictionauditagent')) {
      text = JSON.stringify(fakeNonfiction(user))
    } else if (
      promptName.includes('chapter_critique') ||
      system.includes('chaptercritiqueagent')
    ) {
      text = JSON.stringify(fakeChapterCritique(user))
    } else if (promptName.includes('translation') || system.includes('translationmodeagent')) {
      text = JSON.stringify(fakeTranslation(user))
    } else if (promptName.includes('cross_chapter') || system.includes('crosschapteragent')) {
      text = JSON.stringify({
        findings: [],
        continuity_note: 'Fake cross-chapter pass: no contradictions in short sample.',
      })
    } else if (promptName.includes('verify') || system.includes('verifyagent')) {
      text = JSON.stringify(fakeVerify(user))
    } else if (promptName.includes('proofread') || system.includes('proofreadagent')) {
      text = JSON.stringify(fakeProofread(user))
    } else {
      text = JSON.stringify({ ok: true, message: 'FakeLLMProvider: generic proofread reply.' })
    }

    const model = 'fake-draft'
    const tokensIn = Math.ceil(((req.system?.length || 0) + user.length) / 4)
    const tokensOut = Math.ceil(text.length / 4)
    return {
      text,
      model,
      tokensIn,
      tokensOut,
      costUsd: estimateCostUsd(model, tokensIn, tokensOut),
    }
  }
}

function extractQuotedSnippet(user) {
  const m = String(user).match(/<<<SECTION>>>\s*([\s\S]*?)\s*<<<END>>>/i)
  const body = (m?.[1] || user).trim()
  const words = body.split(/\s+/).filter(Boolean)
  if (words.length < 4) return body.slice(0, 80) || 'the manuscript'
  return words.slice(0, Math.min(12, words.length)).join(' ')
}

function fakeOverview(user) {
  const goals = /author_goals/i.test(user)
  return {
    subject_or_story: 'A complete manuscript submitted for editorial audit.',
    likely_genre: user.toLowerCase().includes('nonfiction') ? 'nonfiction' : 'fiction',
    audience_fit: 'Matches the configured language and audience profile when voice stays consistent.',
    structure_summary: 'Chapter/section structure detected; ready for passage-level proofread.',
    themes: ['Belonging', 'Choice under pressure'],
    character_notes: ['Protagonist voice appears consistent in sample'],
    setting_notes: ['Place texture present in sampled paragraphs'],
    strengths: ['Clear section boundaries', 'Sufficient length for whole-book analysis'],
    opportunities: [
      'Check regional language consistency',
      'Review repeated phrases',
      'Confirm intentional stylistic choices before batch-accepting',
      ...(goals ? ['Author fine-tune goals were noted for this overview'] : []),
    ],
    note: 'Overview is an estimate. Scores do not prove literary merit or KDP approval.',
    manuscript_sections: {
      about_story: {
        level: 'working_well',
        summary: 'Story premise is clear from section summaries.',
        competitive_landscape: 'General fiction readers seeking character-driven narrative.',
        items: [],
      },
      themes: {
        level: 'working_well',
        summary: 'Belonging and choice under pressure surface in samples.',
        items: [],
      },
      plot: {
        level: 'minor_concern',
        summary: 'Structure present; verify pacing and open loops in full audit.',
        items: ['Confirm chapter endings drive forward'],
      },
      characters: {
        level: 'working_well',
        summary: 'Protagonist voice consistent in sample.',
        items: [],
      },
      setting: {
        level: 'working_well',
        summary: 'Place texture present in sampled paragraphs.',
        items: [],
      },
    },
  }
}

function fakeFiction(user) {
  const excerpt = extractQuotedSnippet(user)
  return {
    memory: {
      characters: ['Protagonist'],
      timeline: ['Present-day timeline in sample'],
      locations: ['Primary setting'],
      open_loops: [],
    },
    findings: [
      {
        category: 'structure',
        subcategory: 'pacing',
        severity: 'suggestion',
        title: 'Review scene momentum',
        explanation:
          'Fiction audit sample: confirm this passage advances goal/conflict (diagnostic, not a formula).',
        original_excerpt: excerpt,
        suggested_correction: '',
        confidence: 0.45,
        objective: false,
      },
    ],
  }
}

function fakeNonfiction(user) {
  const excerpt = extractQuotedSnippet(user)
  return {
    memory: {
      main_claims: ['Primary thesis implied by section'],
      undefined_terms: [],
      open_questions: [],
    },
    findings: [
      {
        category: 'consistency',
        subcategory: 'claim',
        severity: 'needs_verification',
        title: 'Claim may need source',
        explanation:
          'Nonfiction audit: treat factual-sounding statements as needing verification unless sources are supplied.',
        original_excerpt: excerpt,
        suggested_correction: '',
        confidence: 0.4,
        objective: false,
      },
    ],
  }
}

function fakeChapterCritique(user) {
  const excerpt = extractQuotedSnippet(user)
  return {
    chapter_summary: 'Chapter advances the central conflict in the sampled text.',
    purpose: 'Deepen stakes and character choice',
    tension_or_stakes: 'Pressure present; confirm escalation toward the chapter end',
    opening_hook: 'Opening orients the reader — confirm urgency in first paragraphs',
    ending_drive: 'Ending should pull into the next section',
    character_focus: ['Protagonist'],
    pacing_note: 'Diagnostic only — not a formula.',
    findings: [
      {
        category: 'structure',
        subcategory: 'chapter',
        severity: 'suggestion',
        title: 'Chapter ending drive',
        explanation:
          'Confirm the last beat creates forward motion into the next chapter (PWA-style critique).',
        original_excerpt: excerpt,
        suggested_correction: '',
        confidence: 0.45,
        objective: false,
      },
    ],
  }
}

function fakeTranslation(user) {
  const excerpt = extractQuotedSnippet(user)
  const bilingual = /\b(der|die|das|und|ich|je|tu|el|la|il|che)\b/i.test(user)
  return {
    detected_languages: bilingual ? ['en', 'mixed'] : ['en'],
    findings: bilingual
      ? [
          {
            category: 'localization',
            subcategory: 'translation',
            severity: 'suggestion',
            title: 'Possible bilingual fragment',
            explanation:
              'Sample contains non-English tokens — confirm intentional code-switching vs incomplete translation.',
            original_excerpt: excerpt,
            suggested_correction: '',
            confidence: 0.5,
            objective: false,
          },
        ]
      : [],
    note: 'Translation mode is advisory. Credit translators on KDP when publishing a translation.',
  }
}

function fakeVerify(user) {
  let findings = []
  try {
    const m = String(user).match(/\{[\s\S]*\}/)
    if (m) findings = JSON.parse(m[0]).findings || []
  } catch {
    findings = []
  }
  return {
    verdicts: findings.map((f) => ({
      finding_title: f.title || 'finding',
      keep: true,
      confidence: 0.6,
      note: 'Fake verifier keeps findings that cite non-empty excerpts.',
    })),
  }
}

function fakeProofread(user) {
  const excerpt = extractQuotedSnippet(user)
  const findings = [
    {
      category: 'naturalness',
      subcategory: 'awkward_phrasing',
      severity: 'suggestion',
      title: 'Possible awkward phrasing',
      explanation:
        'This passage may read slightly stiff. Optional rewrite for fluency — preserve voice if the rhythm is intentional.',
      original_excerpt: excerpt,
      suggested_correction: excerpt,
      reason: 'FakeLLM fixture — replace with live model in production',
      confidence: 0.55,
      objective: false,
    },
  ]

  // Seed a grammar-like finding when an obvious double word appears
  const double = String(user).match(/\b(\w+)\s+\1\b/i)
  if (double) {
    findings.unshift({
      category: 'grammar',
      subcategory: 'duplicate_word',
      severity: 'minor',
      title: 'Duplicate word',
      explanation: `Possible accidental repetition of “${double[1]}”.`,
      original_excerpt: double[0],
      suggested_correction: double[1],
      reason: 'Deterministic-looking fixture from duplicate token',
      confidence: 0.85,
      objective: true,
    })
  }

  if (findings[0] && !findings[0].alternatives?.length && findings[0].suggested_correction) {
    findings[0].alternatives = [findings[0].suggested_correction]
  }

  return {
    findings,
    coverage_note: 'Fake provider analyzed this chunk offline. Live Anthropic returns richer multilingual findings.',
  }
}
