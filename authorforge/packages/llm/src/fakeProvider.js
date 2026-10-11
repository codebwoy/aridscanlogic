import { LLMProvider, estimateCostUsd } from './provider.js'

/**
 * Deterministic fixtures for offline UI + tests.
 * Never invents credentials, quotes, or statistics.
 */
export class FakeLLMProvider extends LLMProvider {
  get id() {
    return 'fake'
  }

  async complete(req) {
    const user = req.messages?.map((m) => m.content).join('\n') || ''
    const system = String(req.system || '').toLowerCase()
    const promptHint = `${system}\n${user}`.toLowerCase()
    let text

    // Match on system prompt agent identity first — avoid false hits from JSON field names (e.g. "persona":null).
    if (system.includes('writeragent') || (system.includes('content_md') && system.includes('story_slots'))) {
      text = JSON.stringify(fakeSection(req))
    } else if (system.includes('outlineagent') || (system.includes('3-level outline') && system.includes('focus tag'))) {
      text = JSON.stringify(fakeOutline())
    } else if (system.includes('titleagent') || (system.includes('title') && system.includes('variation'))) {
      text = JSON.stringify(fakeTitles())
    } else if (system.includes('positioningagent') || system.includes('differentiated angles')) {
      text = JSON.stringify(fakeAngles())
    } else if (system.includes('personaagent') || system.includes('voice descriptor')) {
      text = JSON.stringify(fakePersona())
    } else if (system.includes('continuityagent') || system.includes('summarize section')) {
      text = JSON.stringify({
        summary: 'Section covers the planned writing direction without inventing personal stories.',
        key_claims: [],
        terms_introduced: ['framework'],
        examples_used: [],
        open_loops: [],
      })
    } else if (system.includes('descriptionagent')) {
      text = JSON.stringify({
        description_html: '<p>A practical first-draft guide. Edit before publishing.</p>',
        keywords: ['nonfiction', 'self help', 'guide', 'workbook', 'habits', 'clarity', 'action'],
        categories: ['Business', 'Self-Help', 'Education'],
      })
    } else if (promptHint.includes('focus tag') && system.includes('clickable')) {
      text = JSON.stringify(fakeFocusTags())
    } else if (promptHint.includes('back cover')) {
      text = JSON.stringify({
        back_cover_copy:
          'A clear, honest first draft you can revise with your own stories and verified facts.',
      })
    } else if (system.includes('writer') || system.includes('co-writer')) {
      text = JSON.stringify(fakeSection(req))
    } else {
      text = JSON.stringify({
        ok: true,
        message: 'FakeLLMProvider: generic structured reply (no invented facts).',
        suggestion: 'Replace with your own wording before publishing.',
      })
    }

    const model = 'fake-draft'
    const tokensIn = Math.ceil((req.system?.length || 0 + user.length) / 4)
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

function fakeOutline() {
  const chapters = []
  for (let c = 1; c <= 8; c++) {
    chapters.push({
      level: 'chapter',
      title: `Chapter ${c}: Core idea ${c}`,
      writing_direction: `Explain concept ${c} with generic examples only; insert STORY_SLOT where a personal story would help.`,
      target_words: 3200,
      focus_tags: c <= 3 ? [`tag-${c}`] : [],
      children: [
        {
          level: 'section',
          title: `${c}.1 Framing`,
          writing_direction: 'Define the problem and why it matters (no invented stats).',
          target_words: 800,
          focus_tags: c === 1 ? ['tag-1'] : [],
          children: [
            {
              level: 'subsection',
              title: `${c}.1.1 Key distinction`,
              writing_direction: 'One clear distinction; mark CLAIM_NEEDED if a number is tempting.',
              target_words: 400,
              focus_tags: [],
            },
          ],
        },
        {
          level: 'section',
          title: `${c}.2 Practice`,
          writing_direction: 'Actionable steps; generic scenarios only.',
          target_words: 900,
          focus_tags: [],
          children: [],
        },
      ],
    })
  }
  return { chapters, note: 'First-draft outline — edit freely. Every focus tag should map to ≥1 node.' }
}

function fakeTitles() {
  return {
    options: [
      { title: 'Clear Work, Quiet Wins', subtitle: 'A Practical Guide to Focus Without Hype', risk: 'low' },
      { title: 'The Honest Playbook', subtitle: 'Build Skills You Can Defend', risk: 'low' },
      { title: 'Fewer Inputs, Better Output', subtitle: 'Systems for Non-Fiction Readers', risk: 'low' },
      { title: 'Draft First, Prove Later', subtitle: 'Co-Writing Your Expertise Book', risk: 'medium' },
      { title: 'Ship the Framework', subtitle: 'Turn Experience Into a Teachable Book', risk: 'low' },
    ],
    warnings: ['Do not claim “bestseller” or trademarked names in titles.'],
  }
}

function fakeAngles() {
  return {
    angles: [
      {
        name: 'Niche-down audience',
        rationale: 'Serve a narrower reader with clearer outcomes (metadata/gap estimate only).',
        confidence: 'medium',
      },
      {
        name: 'Simpler/faster format',
        rationale: 'Shorter chapters + worksheets vs dense textbooks.',
        confidence: 'medium',
      },
      {
        name: 'More value/bonus',
        rationale: 'Templates and checklists as appendices.',
        confidence: 'low',
      },
    ],
    disclaimer: 'Based on public metadata / mock market data — not Amazon scrape.',
  }
}

function fakePersona() {
  return {
    voice_descriptor: {
      sentence_length: 'medium',
      tone: 'calm, direct, mentoring',
      vocabulary: 'plain professional',
      rhetorical_habits: ['short paragraphs', 'concrete verbs', 'questions sparingly'],
    },
    style_guide: 'Prefer concrete verbs. No invented credentials. Mark personal stories as Story Slots.',
    bio_draft:
      'Write an honest bio from credentials you actually have. AuthorForge will not invent experience.',
  }
}

function fakeFocusTags() {
  return {
    tags: [
      { id: 'tag-1', label: 'Core framework', why: 'Central method of the book' },
      { id: 'tag-2', label: 'Decision checklist', why: 'Reader actionability' },
      { id: 'tag-3', label: 'Common pitfalls', why: 'Differentiation vs generic advice' },
      { id: 'tag-4', label: 'Templates', why: 'Workbook-style value' },
      { id: 'tag-5', label: 'Case patterns (generic)', why: 'Illustrate without inventing clients' },
    ],
  }
}

function fakeSection(req) {
  const target = req.metadata?.targetWords || 800
  const paragraphs = [
    'This section advances the chapter’s promise with a continuous argument rather than a listicle.',
    'Use only frameworks and generic scenarios here. When a lived anecdote would help, insert a story slot for the author.',
    '<!-- STORY_SLOT: Describe a real situation from your experience that illustrates this point. Do not invent clients. -->',
    'Prefer qualitative claims unless you attach a verified source. If a number seems necessary:',
    '<!-- CLAIM_NEEDED: Replace with a verified statistic or keep the claim qualitative. -->',
    'Close by bridging to the next section without formulaic wrap-ups.',
  ]
  let content = paragraphs.join('\n\n')
  while (content.split(/\s+/).length < target * 0.85) {
    content +=
      '\n\nExpand the reasoning with another concrete, generic example — still without invented studies or quotes.'
  }
  return {
    content_md: content,
    story_slots: [
      {
        prompt_to_user:
          'Describe a real situation from your experience that illustrates this point. Do not invent clients.',
      },
    ],
    claims_needed: [{ text: 'Optional numeric claim — verify or keep qualitative.' }],
    terms_introduced: ['framework'],
    open_loops: [],
  }
}
