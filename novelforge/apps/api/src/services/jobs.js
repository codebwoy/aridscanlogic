import { costFor, nicheContextForBook, nichesForStudio } from '@novelforge/shared'
import { createLlmProvider } from '@novelforge/llm'
import {
  runAgent,
  focusTagCoverage,
  sectionQualityReport,
  ngramOverlap,
  parseManuscriptText,
  manuscriptToBookPatch,
} from '@novelforge/agents'
import {
  buildInteriorPdf,
  buildCoverWrapPdf,
  buildEpub,
  buildDocx,
  buildKdpPackage,
  buildCoverSvg,
  thumbnailLegibilityScore,
} from '@novelforge/export'
import { createMarketProvider } from '@novelforge/market'
import { config } from '../config.js'
import { enqueue, registerLocalHandler } from '../queue/queues.js'
import { persistExportArtifact } from './exportStore.js'

let llm
let market

function ensureProviders() {
  if (!llm) {
    llm = createLlmProvider({
      provider: process.env.NOVELFORGE_LLM_PROVIDER || config.llmProvider,
      anthropicApiKey: process.env.ANTHROPIC_API_KEY || config.anthropicApiKey,
    })
  }
  if (!market) {
    market = createMarketProvider(process.env.NOVELFORGE_MARKET_PROVIDER || config.marketProvider)
  }
}

export function getLlm() {
  ensureProviders()
  return llm
}

export function getMarket() {
  ensureProviders()
  return market
}

async function chargeOrRefund(store, { userId, action, jobId, run }) {
  const cost = costFor(action)
  if (cost == null) {
    const err = new Error(`Unknown action: ${action}`)
    err.status = 400
    throw err
  }
  const bal = await store.getBalance(userId)
  if (bal < cost) {
    const err = new Error('Insufficient credits')
    err.status = 402
    err.code = 'insufficient_credits'
    throw err
  }
  const spent = await store.getSpentToday(userId)
  if (spent + cost > config.dailyCreditCap) {
    const err = new Error('Daily credit cap reached')
    err.status = 429
    err.code = 'daily_cap'
    throw err
  }
  await store.appendLedger({
    userId,
    delta: -cost,
    reason: action,
    jobId,
    meta: { action },
  })
  try {
    return await run()
  } catch (e) {
    await store.appendLedger({
      userId,
      delta: cost,
      reason: `${action}_refund`,
      jobId,
      meta: { refund: true, error: String(e.message || e) },
    })
    throw e
  }
}

export async function submitJob(store, { userId, type, bookId = null, inputs = {} }) {
  const job = await store.createJob({
    user_id: userId,
    book_id: bookId,
    type,
    cost_credits: costFor(type) || 0,
    inputs,
  })
  await enqueue('run_job', { jobId: job.id, userId, type, bookId, inputs })
  return job
}

export function wireLocalJobHandlers(store) {
  registerLocalHandler('run_job', async ({ jobId, userId, type, bookId, inputs }) => {
    await store.updateJob(jobId, { status: 'running' })
    try {
      const outputs = await chargeOrRefund(store, {
        userId,
        action: type,
        jobId,
        run: () => runJobBody(store, { userId, type, bookId, inputs, jobId }),
      })
      await store.updateJob(jobId, { status: 'completed', outputs })
    } catch (e) {
      await store.updateJob(jobId, {
        status: 'failed',
        error: String(e.message || e),
      })
    }
  })
}

function flattenLeafNodes(node, path = 'c0') {
  const children = node.children || []
  if (!children.length) return [{ key: path, node }]
  return children.flatMap((ch, i) => flattenLeafNodes(ch, `${path}.${i}`))
}

function starterTitleOptions(seed, topic, warnings = []) {
  const base = String(seed || topic || 'Untitled').slice(0, 80)
  return {
    options: [
      { title: base, subtitle: '', risk: 'low' },
      { title: `${base}: A Novel`, subtitle: '', risk: 'medium' },
      { title: `The ${base} Years`, subtitle: '', risk: 'medium' },
    ],
    warnings,
  }
}

async function runJobBody(store, { userId, type, bookId, inputs, jobId }) {
  ensureProviders()
  const book = bookId ? await store.getBook(userId, bookId) : null

  switch (type) {
    case 'genre_search': {
      const product = nicheContextForBook(book)
      return {
        niches: nichesForStudio('novelforge').map((n) => ({
          id: n.id,
          priority: n.priority,
          title: n.en.title,
          angle: n.en.angle,
        })),
        product_lane: product,
        disclaimer: product.disclaimer,
      }
    }
    case 'premise_generate': {
      if (!book) throw new Error('book required')
      const agent = await runAgent(llm, 'premise.v1', {
        modelClass: 'cheap',
        input: {
          genre: book.bible?.genre || book.genre,
          topic: book.topic,
          niche: nicheContextForBook(book),
          seed: inputs.seed || book.bible?.premise || '',
        },
        metadata: { bookId, jobId },
      })
      await store.addLlmCost(userId, bookId, agent.completion.costUsd)
      await store.updateBook(userId, bookId, {
        bible: {
          ...book.bible,
          premise: agent.parsed.premise,
          promise_to_reader: agent.parsed.promise_to_reader,
          stakes: agent.parsed.stakes,
          unique_hook: agent.parsed.unique_hook,
        },
      })
      return agent.parsed
    }
    case 'cast_generate': {
      if (!book) throw new Error('book required')
      const agent = await runAgent(llm, 'cast.v1', {
        modelClass: 'cheap',
        input: {
          premise: book.bible?.premise,
          genre: book.bible?.genre || book.genre,
          seed: inputs.seed || '',
        },
        metadata: { bookId, jobId },
      })
      await store.addLlmCost(userId, bookId, agent.completion.costUsd)
      await store.updateBook(userId, bookId, {
        bible: {
          ...book.bible,
          cast: agent.parsed.cast,
          relationships: agent.parsed.relationships,
        },
      })
      return agent.parsed
    }
    case 'plot_generate': {
      if (!book) throw new Error('book required')
      const agent = await runAgent(llm, 'plot.v1', {
        modelClass: 'cheap',
        input: {
          premise: book.bible?.premise,
          cast: book.bible?.cast,
          genre: book.bible?.genre || book.genre,
        },
        metadata: { bookId, jobId },
      })
      await store.addLlmCost(userId, bookId, agent.completion.costUsd)
      await store.updateBook(userId, bookId, {
        bible: {
          ...book.bible,
          beats: agent.parsed.beats,
          theme: agent.parsed.theme,
          ending_type: agent.parsed.ending_type,
        },
      })
      return agent.parsed
    }
    case 'title_variations': {
      try {
        const agent = await runAgent(llm, 'title.v1', {
          modelClass: 'cheap',
          input: {
            premise: book?.bible?.premise,
            genre: book?.bible?.genre || book?.genre,
            seed: inputs.seed || book?.working_title,
            bible: book?.bible,
          },
          metadata: { bookId, jobId },
        })
        if (book) await store.addLlmCost(userId, bookId, agent.completion.costUsd)
        if (agent.parsed?.options?.length) return agent.parsed
        return starterTitleOptions(inputs.seed || book?.working_title, book?.topic, [
          'Model returned no options — starter titles below.',
        ])
      } catch (e) {
        return starterTitleOptions(inputs.seed || book?.working_title, book?.topic, [
          `Title model failed (${e.message || 'error'}). Showing starters.`,
        ])
      }
    }
    case 'outline_generate':
    case 'outline_regenerate_subtree': {
      const targetWords = Number(book?.target_words) || 80000
      const chapterCount = Math.min(Math.max(Number(book?.chapter_count) || 12, 1), 40)
      const outlineInput = {
        bookBible: book?.bible,
        product_lane: nicheContextForBook(book),
        target_words: targetWords,
        chapter_count: chapterCount,
        topic: book?.topic || book?.working_title,
        beats: book?.bible?.beats || [],
        cast: book?.bible?.cast || [],
      }
      let agent
      let chapters = []
      let usedStub = false
      try {
        agent = await runAgent(llm, 'outline.v1', {
          modelClass: 'draft',
          input: outlineInput,
          metadata: { bookId, jobId, maxTokens: 12288 },
        })
        chapters = agent.parsed.chapters || []
      } catch {
        const per = Math.max(800, Math.floor(targetWords / chapterCount))
        chapters = Array.from({ length: chapterCount }, (_, i) => ({
          level: 'chapter',
          title: `Chapter ${i + 1}`,
          writing_direction: `Develop plot movement ${i + 1} of: ${outlineInput.topic || 'the story'}.`,
          target_words: per,
          focus_tags: [],
          children: [],
        }))
        usedStub = true
        agent = { promptName: 'outline', promptVersion: 'v1-stub', completion: { costUsd: 0 } }
      }
      const coverage = focusTagCoverage(book?.bible?.focus_tags || [], chapters)
      if (book) {
        if (agent?.completion?.costUsd) await store.addLlmCost(userId, bookId, agent.completion.costUsd)
        await store.updateBook(userId, bookId, {
          outline: { chapters, coverage, note: usedStub ? 'Stub outline — edit freely.' : undefined },
          status: 'outlined',
          wizard_step: 'outline',
        })
      }
      return { chapters, coverage, stub: usedStub }
    }
    case 'outline_expand_chapter': {
      if (!book) throw new Error('book required')
      const chapters = book.outline?.chapters || []
      const idx = Number(inputs.chapterIndex)
      if (!Number.isInteger(idx) || idx < 0 || idx >= chapters.length) throw new Error('chapterIndex out of range')
      const chapter = chapters[idx]
      const agent = await runAgent(llm, 'outline.v1', {
        modelClass: 'cheap',
        input: {
          bookBible: book.bible,
          expand_chapter: chapter,
          instruction: `Expand ONLY chapter "${chapter.title}" into 2–4 scenes as children. Return chapters array of length 1.`,
        },
        metadata: { bookId, jobId, maxTokens: 4096 },
      })
      await store.addLlmCost(userId, bookId, agent.completion.costUsd)
      const expanded = agent.parsed?.chapters?.[0]
      if (!expanded) throw new Error('Expand failed')
      const next = chapters.map((c, i) => (i === idx ? { ...c, ...expanded, title: c.title } : c))
      await store.updateBook(userId, bookId, { outline: { ...(book.outline || {}), chapters: next } })
      return { chapterIndex: idx, chapter: next[idx] }
    }
    case 'section_draft':
    case 'section_regenerate': {
      if (!book) throw new Error('book required')
      const node = inputs.node
      if (!node?.title) throw new Error('node required')
      const agent = await runAgent(llm, 'writer.v1', {
        modelClass: 'draft',
        input: {
          bookBible: book.bible,
          persona: book.persona,
          continuity: book.continuity,
          node,
        },
        metadata: { bookId, jobId, targetWords: node.target_words },
      })
      const content_md = String(agent.parsed.content_md || '').trim()
      const existingMd = String(book.sections?.[inputs.sectionKey]?.content_md || '').trim()
      if (!content_md || content_md.length < 40) {
        throw new Error(
          existingMd
            ? 'AI returned empty/cut-off text — existing section preserved. Retry draft.'
            : 'AI returned empty/cut-off text — nothing saved. Retry draft.'
        )
      }
      const quality = sectionQualityReport({
        content_md,
        target_words: node.target_words,
        banned_phrases: book.bible?.banned_phrases,
      })
      let maxOverlap = 0
      for (const [k, sec] of Object.entries(book.sections || {})) {
        if (k === inputs.sectionKey) continue
        maxOverlap = Math.max(maxOverlap, ngramOverlap(content_md, sec.content_md || ''))
      }
      const section = {
        outline_path: inputs.sectionKey,
        title: node.title,
        content_md,
        word_count: quality.word_count,
        version: (book.sections?.[inputs.sectionKey]?.version || 0) + 1,
        status: 'draft',
        quality: { ...quality, repetition_score: Number(maxOverlap.toFixed(3)) },
        scene_goal: agent.parsed.scene_goal,
        versions: [
          ...((book.sections?.[inputs.sectionKey]?.versions || []).slice(-9)),
          {
            version: (book.sections?.[inputs.sectionKey]?.version || 0) + 1,
            content_md,
            at: new Date().toISOString(),
          },
        ],
      }
      const sections = { ...(book.sections || {}), [inputs.sectionKey]: section }
      await store.addLlmCost(userId, bookId, agent.completion.costUsd)
      await store.updateBook(userId, bookId, {
        sections,
        status: 'writing',
        continuity: {
          ...(book.continuity || {}),
          summaries: [
            ...((book.continuity?.summaries || []).slice(-30)),
            {
              id: inputs.sectionKey,
              title: node.title,
              summary: agent.parsed.scene_goal || content_md.slice(0, 200),
            },
          ],
          open_loops: agent.parsed.open_loops || [],
        },
      })
      return { section, prompt: { name: agent.promptName, version: agent.promptVersion } }
    }
    case 'generate_all_chapter': {
      if (!book) throw new Error('book required')
      const chapterIndex = Number(inputs.chapterIndex) || 0
      const chapter = book.outline?.chapters?.[chapterIndex]
      if (!chapter) throw new Error('chapter not found')
      const nodes = flattenLeafNodes(chapter, `c${chapterIndex}`)
      const results = []
      for (const { key, node } of nodes) {
        const out = await runJobBody(store, {
          userId,
          type: 'section_draft',
          bookId,
          inputs: { sectionKey: key, node },
          jobId,
        })
        results.push({ key, words: out.section?.word_count })
      }
      return { chapterIndex, results }
    }
    case 'continuity_scan': {
      if (!book) throw new Error('book required')
      const key = inputs.sectionKey || Object.keys(book.sections || {})[0]
      const section = book.sections?.[key]
      if (!section) throw new Error('section not found')
      const agent = await runAgent(llm, 'continuity.v1', {
        modelClass: 'cheap',
        input: {
          content_md: section.content_md,
          bible: book.bible,
          continuity: book.continuity,
        },
        metadata: { bookId, jobId },
      })
      await store.addLlmCost(userId, bookId, agent.completion.costUsd)
      return { sectionKey: key, ...agent.parsed }
    }
    case 'inline_edit': {
      if (!book) throw new Error('book required')
      const selection = String(inputs.selection || '')
      if (!selection.trim()) throw new Error('selection required')
      const instruction = String(inputs.instruction || 'Improve clarity and voice')
      const agent = await runAgent(llm, 'writer.v1', {
        modelClass: 'cheap',
        input: {
          bookBible: book.bible,
          node: {
            title: 'Inline edit',
            writing_direction: `${instruction}\n\nRewrite only this passage:\n${selection}`,
            target_words: Math.max(50, selection.split(/\s+/).length),
          },
          inline: true,
        },
        metadata: { bookId, jobId, maxTokens: 2048 },
      })
      await store.addLlmCost(userId, bookId, agent.completion.costUsd)
      return {
        original: selection,
        proposed: agent.parsed.content_md,
        explanation: agent.parsed.scene_goal || instruction,
      }
    }
    case 'import_manuscript': {
      if (!book) throw new Error('book required')
      const raw = inputs.text || inputs.manuscript || ''
      if (!String(raw).trim()) throw new Error('manuscript text required')
      const parsed = parseManuscriptText(raw)
      if (!parsed.chapters.length) throw new Error('Could not detect chapters')
      if (Object.keys(book.sections || {}).length && !inputs.replace) {
        throw new Error('Book already has sections — pass replace:true to overwrite')
      }
      const patch = manuscriptToBookPatch(parsed)
      await store.updateBook(userId, bookId, patch)
      return {
        chapter_count: parsed.chapters.length,
        warnings: parsed.warnings,
        preview: parsed.chapters.map((c, i) => ({
          index: i,
          title: c.title,
          words: c.word_count,
          excerpt: String(c.body || '').slice(0, 180),
        })),
      }
    }
    case 'metadata_generate': {
      if (!book) throw new Error('book required')
      const agent = await runAgent(llm, 'description.v1', {
        modelClass: 'cheap',
        input: {
          working_title: book.working_title,
          subtitle: book.subtitle,
          premise: book.bible?.premise,
          genre: book.bible?.genre,
          cast: book.bible?.cast,
          tone: book.bible?.tone,
        },
        metadata: { bookId, jobId },
      })
      await store.addLlmCost(userId, bookId, agent.completion.costUsd)
      await store.updateBook(userId, bookId, {
        metadata: { ...(book.metadata || {}), ...agent.parsed },
      })
      return agent.parsed
    }
    case 'cover_generate':
    case 'cover_revise': {
      if (!book) throw new Error('book required')
      const title = book.working_title || 'Untitled'
      const author = book.author_name || 'Author'
      const svg = buildCoverSvg({
        title,
        subtitle: book.subtitle || '',
        author,
      })
      const bytes = svg.bytes || Buffer.from(String(svg), 'utf8')
      const leg = thumbnailLegibilityScore(title)
      const art = await persistExportArtifact(store, {
        bookId,
        format: 'cover_svg',
        bytes,
        meta: { mime: svg.mime || 'image/svg+xml', typography_ok: true, legibility: leg.score },
      })
      return {
        cover: {
          title,
          export: art,
          legibility: leg.score,
          typography_ok: leg.passed,
          warning: 'Typography SVG stub — replace with final art before print.',
        },
        download: art.url,
      }
    }
    case 'cover_wrap': {
      if (!book) throw new Error('book required')
      const chapters = chaptersFromBook(book)
      const interior = await buildInteriorPdf({
        title: book.working_title,
        author: book.author_name,
        chapters,
        trimId: book.trim_size || '5.5x8.5',
      })
      const cover = await buildCoverWrapPdf({
        title: book.working_title,
        author: book.author_name,
        backCopy: book.metadata?.back_cover_copy || book.bible?.premise || '',
        pageCount: interior.pageCount,
        trimId: book.trim_size || '5.5x8.5',
      })
      return persistExportArtifact(store, {
        bookId,
        format: 'cover_pdf',
        bytes: cover.bytes,
        meta: { pageCount: interior.pageCount, layout: cover.layout },
      })
    }
    case 'export_interior_pdf': {
      if (!book) throw new Error('book required')
      const pdf = await buildInteriorPdf({
        title: book.working_title,
        author: book.author_name,
        chapters: chaptersFromBook(book),
        trimId: book.trim_size || '5.5x8.5',
      })
      return persistExportArtifact(store, {
        bookId,
        format: 'interior_pdf',
        bytes: pdf.bytes,
        meta: { pageCount: pdf.pageCount },
      })
    }
    case 'export_epub': {
      if (!book) throw new Error('book required')
      const epub = await buildEpub({
        title: book.working_title,
        author: book.author_name,
        chapters: chaptersFromBook(book),
        language: book.language,
      })
      return persistExportArtifact(store, { bookId, format: 'epub', bytes: epub.bytes })
    }
    case 'export_docx': {
      if (!book) throw new Error('book required')
      const docx = await buildDocx({
        title: book.working_title,
        author: book.author_name,
        subtitle: book.subtitle || '',
        chapters: chaptersFromBook(book),
      })
      return persistExportArtifact(store, {
        bookId,
        format: 'docx',
        bytes: docx.bytes,
        meta: { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      })
    }
    case 'export_cover_pdf': {
      return runJobBody(store, { userId, type: 'cover_wrap', bookId, inputs, jobId })
    }
    case 'export_kdp_zip': {
      if (!book) throw new Error('book required')
      const pack = await buildKdpPackage({
        book,
        chapters: chaptersFromBook(book),
        metadata: book.metadata,
        aiDisclosure: book.compliance?.ai_disclosure || {},
      })
      return persistExportArtifact(store, {
        bookId,
        format: 'kdp_zip',
        bytes: pack.bytes,
        meta: { pageCount: pack.pageCount, files: pack.files },
      })
    }
    default: {
      const err = new Error(`Unknown job type: ${type}`)
      err.status = 400
      throw err
    }
  }
}

function chaptersFromBook(book) {
  const sections = book.sections || {}
  const keys = Object.keys(sections).sort()
  if (keys.length) {
    return keys.map((k) => ({
      title: sections[k].title || k,
      content_md: sections[k].content_md || '',
    }))
  }
  return (book.outline?.chapters || []).map((c) => ({
    title: c.title,
    content_md: c.writing_direction || '',
  }))
}
