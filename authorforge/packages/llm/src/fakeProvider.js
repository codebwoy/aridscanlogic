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
    const promptName = String(req.metadata?.promptName || req.metadata?.promptKey || '').toLowerCase()
    const promptHint = `${system}\n${user}`.toLowerCase()
    let text

    // Prefer explicit agent metadata — UNIVERSAL_COAUTHOR_RULES contains "co-writer" and
    // would otherwise steal title/positioning calls into fakeSection.
    if (promptName.includes('title') || system.includes('titleagent')) {
      text = JSON.stringify(fakeTitles())
    } else if (promptName.includes('positioning') || system.includes('positioningagent') || system.includes('differentiated angles')) {
      text = JSON.stringify(fakeAngles())
    } else if (promptName.includes('persona') || system.includes('personaagent') || system.includes('voice descriptor')) {
      text = JSON.stringify(fakePersona())
    } else if (promptName.includes('continuity') || system.includes('continuityagent') || system.includes('summarize section')) {
      text = JSON.stringify({
        summary: 'Section covers the planned writing direction without inventing personal stories.',
        key_claims: [],
        terms_introduced: ['framework'],
        examples_used: [],
        open_loops: [],
      })
    } else if (promptName.includes('description') || system.includes('descriptionagent')) {
      text = JSON.stringify(fakeDescription(user))
    } else if (
      promptName.includes('outline') ||
      system.includes('outlineagent') ||
      (system.includes('3-level outline') && system.includes('focus tag'))
    ) {
      text = JSON.stringify(fakeOutline())
    } else if (
      promptName.includes('writer') ||
      system.includes('writeragent') ||
      (system.includes('content_md') && system.includes('story_slots'))
    ) {
      text = JSON.stringify(fakeSection(req))
    } else if (promptHint.includes('focus tag') && system.includes('clickable')) {
      text = JSON.stringify(fakeFocusTags())
    } else if (promptHint.includes('back cover')) {
      text = JSON.stringify({
        back_cover_copy:
          'A clear, honest first draft you can revise with your own stories and verified facts.',
      })
    } else if (system.includes('title') && system.includes('variation')) {
      text = JSON.stringify(fakeTitles())
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

function fakeDescription(userContent) {
  let input = {}
  try {
    input = JSON.parse(userContent || '{}')
  } catch {
    input = {}
  }
  const title = String(input.working_title || 'Untitled').trim() || 'Untitled'
  const topic = String(input.topic || '').trim()
  const usp = String(input.usp || '').trim()
  const audience = String(input.audience || '').trim()
  const blob = `${title} ${topic} ${usp}`.toLowerCase()
  const childlike = /child|kid|picture|storybook|brave|young reader|ages?\s*\d/.test(blob)
  const stop = new Set(['the', 'and', 'for', 'with', 'from', 'that', 'this', 'about', 'into', 'your', 'a', 'an'])
  const seedWords = `${title} ${topic} ${usp}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !stop.has(w))
  const filler = childlike
    ? ['story', 'feelings', 'courage', 'family', 'kindness', 'growth', 'hope']
    : ['guide', 'practice', 'clarity', 'habits', 'workbook', 'systems', 'action']
  const keywords = [...new Set([...seedWords, ...filler])].slice(0, 7)
  const categories = childlike
    ? ["Children's Books", 'Literature & Fiction', 'Education & Teaching']
    : ['Self-Help', 'Education & Teaching', 'Business & Money']
  const paras = [
    `<p><b>${title}</b></p>`,
    usp
      ? `<p>${usp}</p>`
      : topic
        ? `<p>A reader-focused book about ${topic}. Edit this draft before publishing.</p>`
        : '<p>A practical first-draft description. Edit before publishing.</p>',
  ]
  if (audience) paras.push(`<p>For: ${audience}</p>`)
  paras.push('<p>No invented reviews or rankings — verify every claim before KDP upload.</p>')
  return {
    description_html: paras.join(''),
    keywords,
    categories,
    back_cover_copy: usp || `${title}${topic ? ` — ${topic}` : ''}`,
  }
}

function fakeAngles() {
  return {
    angles: [
      {
        strategy_kind: 'more_value',
        strategy_label: 'MORE VALUE',
        name: 'Workbook + templates depth',
        proposed_title: 'The Practical Companion Workbook',
        proposed_subtitle: 'Checklists, scripts, and weekly drills',
        target_audience: 'Readers who want more exercises than a slim guide',
        reader_problem: 'Comps promise results but skim implementation',
        unique_value: 'Chapter-end worksheets and printable trackers baked into the book',
        differentiation: 'More value via appendices and drills vs narrative-only comps (metadata gap estimate)',
        evidence: ['Comparable titles lean short on worksheets (mock metadata)'],
        risks: ['Longer page count may raise print cost'],
        must_contain: ['Weekly drills', 'Fill-in worksheets', 'Progress tracker'],
        toc_direction: 'Framework → practice chapters → appendix templates',
        rationale: 'Templates and checklists as appendices.',
        confidence: 'medium',
      },
      {
        strategy_kind: 'niche_end_goal',
        strategy_label: 'NICHE END GOAL',
        name: 'Niche-down audience',
        proposed_title: 'One Outcome, One Reader',
        proposed_subtitle: 'A focused guide for a specific end state',
        target_audience: 'A narrowly defined reader with one clear goal',
        reader_problem: 'Broad self-help dilutes the path to a single outcome',
        unique_value: 'Serve a narrower reader with clearer outcomes',
        differentiation: 'Tight niche vs middle-of-market comps (strategic estimate only)',
        evidence: ['Category comps cluster around broad audiences (mock metadata)'],
        risks: ['Smaller addressable audience'],
        must_contain: ['Outcome definition', 'Step plan', 'Obstacles chapter'],
        toc_direction: 'Define outcome → diagnose blockers → 4-week plan → sustain',
        rationale: 'Serve a narrower reader with clearer outcomes (metadata/gap estimate only).',
        confidence: 'medium',
      },
      {
        strategy_kind: 'simpler_faster',
        strategy_label: 'SIMPLER / FASTER',
        name: 'Simpler/faster format',
        proposed_title: 'Start This Week',
        proposed_subtitle: 'Short chapters, zero fluff',
        target_audience: 'Busy readers who abandon dense textbooks',
        reader_problem: 'Dense comps require too much prep before action',
        unique_value: 'Shorter chapters + worksheets vs dense textbooks',
        differentiation: 'Faster path to first win (format estimate from comps)',
        evidence: ['Several comps skew long / academic in tone (mock metadata)'],
        risks: ['May feel thin to advanced readers'],
        must_contain: ['15-minute actions', 'One-page summaries', 'Quick-start chapter'],
        toc_direction: 'Quick start → micro-lessons → review loops',
        rationale: 'Shorter chapters + worksheets vs dense textbooks.',
        confidence: 'medium',
      },
    ],
    disclaimer: 'Based on public metadata / mock market data — not Amazon scrape. Estimates only.',
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

function detectManuscriptLang(req) {
  const meta = String(req?.metadata?.language || '').toLowerCase()
  if (['en', 'de', 'es', 'fr', 'it', 'nl'].includes(meta)) return meta
  const system = String(req?.system || '')
  const m = system.match(/Manuscript language:[^(]*\(([a-z]{2})\)/i)
  const code = m ? m[1].toLowerCase() : 'en'
  return ['en', 'de', 'es', 'fr', 'it', 'nl'].includes(code) ? code : 'en'
}

const FAKE_OPENERS = {
  en: 'This section advances the chapter’s promise with a continuous argument rather than a listicle.',
  de: 'Dieses Kapitel hält das Versprechen des Buches mit klarer, praktischer Argumentation — ohne Hype.',
  es: 'Este capítulo cumple la promesa del libro con un argumento claro y práctico, sin frases vacías.',
  fr: 'Ce chapitre tient la promesse du livre avec un argument clair et concret, sans slogans creux.',
  it: 'Questo capitolo mantiene la promessa del libro con un ragionamento chiaro e concreto, senza slogan vuoti.',
  nl: 'Dit hoofdstuk lost de belofte van het boek in met een heldere, praktische redenering — zonder hype.',
}

function fakeSection(req) {
  const target = req.metadata?.targetWords || 800
  const lang = detectManuscriptLang(req)
  const paragraphs = [
    FAKE_OPENERS[lang] || FAKE_OPENERS.en,
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
