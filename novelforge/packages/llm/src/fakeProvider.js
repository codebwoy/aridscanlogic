import { LLMProvider, estimateCostUsd } from './provider.js'

/**
 * Deterministic fiction fixtures for offline UI + tests.
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

    if (promptName.includes('title') || system.includes('titleagent')) {
      text = JSON.stringify(fakeTitles())
    } else if (promptName.includes('premise') || system.includes('premiseagent')) {
      text = JSON.stringify(fakePremise())
    } else if (promptName.includes('cast') || system.includes('castagent')) {
      text = JSON.stringify(fakeCast())
    } else if (promptName.includes('plot') || system.includes('plotagent')) {
      text = JSON.stringify(fakePlot())
    } else if (promptName.includes('continuity') || system.includes('continuityagent')) {
      text = JSON.stringify({
        summary: 'Scene advances the chapter goal with consistent character voice.',
        characters_on_page: ['Ama', 'Jonas'],
        timeline_notes: ['Same evening as prior scene'],
        open_loops: ['Who left the note?'],
        issues: [],
      })
    } else if (promptName.includes('description') || system.includes('descriptionagent')) {
      text = JSON.stringify(fakeDescription(user))
    } else if (promptName.includes('outline') || system.includes('outlineagent') || system.includes('chapter/scene outline')) {
      text = JSON.stringify(fakeOutline())
    } else if (
      promptName.includes('writer') ||
      system.includes('writeragent') ||
      system.includes('content_md') ||
      system.includes('fiction co-writer') ||
      system.includes('co-writer')
    ) {
      text = JSON.stringify(fakeSection(req))
    } else {
      text = JSON.stringify({
        ok: true,
        message: 'FakeLLMProvider: generic fiction reply.',
      })
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

function fakePremise() {
  return {
    premise:
      'A bilingual software engineer in Berlin must choose between a safe visa job and returning home to save the family printing press.',
    promise_to_reader: 'An emotionally honest diaspora story about belonging and courage.',
    stakes: 'If she waits too long, the press—and her father’s legacy—will be sold.',
    unique_hook: 'Dual-language workplace comedy colliding with a family crisis.',
    warnings: [],
  }
}

function fakeCast() {
  return {
    cast: [
      {
        name: 'Ama Mensah',
        role: 'protagonist',
        age: 29,
        want: 'A permanent contract in Berlin',
        need: 'To stop running from family duty',
        wound: 'Left home after a bitter argument',
        voice_notes: 'Dry humor, precise, code-switcher',
      },
      {
        name: 'Jonas Weber',
        role: 'ally',
        age: 34,
        want: 'To keep his team intact',
        need: 'To trust collaborators',
        wound: 'Burned by a previous partner',
        voice_notes: 'Quiet, practical, warm',
      },
      {
        name: 'Kwame Mensah',
        role: 'other',
        age: 58,
        want: 'To keep the press alive',
        need: 'To ask for help without shame',
        wound: 'Pride after losing a big client',
        voice_notes: 'Formal English, soft Twi at home',
      },
    ],
    relationships: ['Ama—Kwame: strained father/daughter', 'Ama—Jonas: budding trust'],
  }
}

function fakePlot() {
  return {
    beats: [
      { act: 1, name: 'Setup', summary: 'Ama’s Berlin life; the call about the press.' },
      { act: 1, name: 'Inciting incident', summary: 'Deadline to sell the press in 30 days.' },
      { act: 2, name: 'Midpoint', summary: 'Ama returns home and clashes with Kwame.' },
      { act: 2, name: 'Crisis', summary: 'A deal that would save the press costs her Berlin future.' },
      { act: 3, name: 'Climax', summary: 'Ama chooses a hybrid path; family and self realign.' },
      { act: 3, name: 'Resolution', summary: 'Press reborn; Ama’s two homes finally talk.' },
    ],
    theme: 'Belonging is built, not found',
    ending_type: 'bittersweet',
  }
}

function fakeTitles() {
  return {
    options: [
      { title: 'Two Homes, One Press', subtitle: '', risk: 'low' },
      { title: 'The Soft Landing', subtitle: 'A novel', risk: 'medium' },
      { title: 'Letters Between Accents', subtitle: '', risk: 'low' },
      { title: 'Berlin Soft Landing', subtitle: '', risk: 'medium' },
    ],
    warnings: ['No bestseller claims.'],
  }
}

function fakeOutline() {
  const chapters = []
  for (let c = 1; c <= 8; c++) {
    chapters.push({
      level: 'chapter',
      title: `Chapter ${c}`,
      writing_direction: `Advance plot beat ${c}: conflict + emotional turn for Ama.`,
      target_words: 3500,
      focus_tags: [],
      children: [
        {
          level: 'section',
          title: `${c}.1 Opening scene`,
          writing_direction: 'Plant desire and friction; end on a turn.',
          target_words: 1200,
          focus_tags: [],
          children: [],
        },
        {
          level: 'section',
          title: `${c}.2 Consequence`,
          writing_direction: 'Show cost of the choice; deepen relationship.',
          target_words: 1200,
          focus_tags: [],
          children: [],
        },
      ],
    })
  }
  return { chapters, note: 'Fake outline — edit freely.' }
}

function fakeSection(req) {
  const user = req.messages?.map((m) => m.content).join('\n') || ''
  let title = 'Scene'
  try {
    const parsed = JSON.parse(user)
    title = parsed?.node?.title || parsed?.title || title
  } catch {
    /* ignore */
  }
  const paras = [
    `## ${title}`,
    '',
    'Ama locked her bike under the S-Bahn and checked the time. Berlin’s evening light made every glass front look like a promise she had already signed.',
    '',
    'Her phone buzzed again — Kwame. She almost silenced it. Instead she answered, switching mid-breath into the softer cadence she used at home.',
    '',
    '“Papa, I’m listening,” she said, and meant it for the first time in months.',
    '',
    'By the time the train doors closed, the choice she had postponed was already shaping the night ahead.',
  ]
  return {
    content_md: paras.join('\n'),
    scene_goal: 'Force Ama to face the family call',
    characters_on_page: ['Ama Mensah', 'Kwame Mensah'],
    open_loops: ['Will she book the flight?'],
    continuity_notes: ['Evening in Berlin', 'Kwame called from home'],
  }
}

function fakeDescription(user) {
  let title = 'Untitled novel'
  try {
    const j = JSON.parse(user)
    title = j.working_title || j.title || title
  } catch {
    /* ignore */
  }
  return {
    description_html: `<p><b>${title}</b> is an adult fiction novel about belonging, family duty, and the lives we build between languages.</p><p>When a crisis at home collides with a hard-won life abroad, the protagonist must choose what “home” means.</p>`,
    keywords: [
      'diaspora fiction',
      'contemporary novel',
      'immigrant story',
      'family saga',
      'Berlin fiction',
      'bilingual',
      'literary fiction',
    ],
    categories: ['Literature & Fiction', 'Cultural Heritage', 'Women’s Fiction'],
    back_cover_copy: `${title} — a story of two homes and one unfinished conversation.`,
  }
}
