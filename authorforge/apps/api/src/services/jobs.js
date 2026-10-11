import { costFor } from '@authorforge/shared'
import { createLlmProvider } from '@authorforge/llm'
import {
  runAgent,
  focusTagCoverage,
  sectionQualityReport,
  extractStorySlots,
  extractClaimMarkers,
  ngramOverlap,
  extractClaimsFromText,
  factCheckClaims,
  rewriteClaimQualitatively,
  chunkResource,
  retrieveChunks,
  createOriginalityProvider,
  rewriteFlaggedSpan,
  createSearchProvider,
} from '@authorforge/agents'
import {
  buildInteriorPdf,
  buildCoverWrapPdf,
  buildEpub,
  buildDocx,
  buildKdpPackage,
  buildCoverSvg,
  thumbnailLegibilityScore,
  buildAPlusModuleSvg,
} from '@authorforge/export'
import { createMarketProvider } from '@authorforge/market'
import { config } from '../config.js'
import { enqueue, registerLocalHandler } from '../queue/queues.js'
import { persistExportArtifact } from './exportStore.js'

let llm
let market

function ensureProviders() {
  if (!llm) {
    llm = createLlmProvider({
      provider: process.env.AUTHORFORGE_LLM_PROVIDER || config.llmProvider,
      anthropicApiKey: process.env.ANTHROPIC_API_KEY || config.anthropicApiKey,
    })
  }
  if (!market) {
    market = createMarketProvider(process.env.AUTHORFORGE_MARKET_PROVIDER || config.marketProvider)
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

async function runJobBody(store, { userId, type, bookId, inputs, jobId }) {
  ensureProviders()
  const book = bookId ? await store.getBook(userId, bookId) : null

  switch (type) {
    case 'niche_search': {
      return market.searchNiches(inputs.filters || {})
    }
    case 'competitive_analysis': {
      const meta = await market.competitorMeta({
        topic: inputs.topic || book?.topic,
        asin: inputs.asin,
      })
      // Comps UI needs meta.titles even if positioning JSON fails validation.
      let angles = {
        angles: [],
        disclaimer: 'Comparable titles from market adapter (estimates only).',
      }
      let tokens = null
      try {
        const agent = await runAgent(llm, 'positioning.v1', {
          modelClass: 'cheap',
          input: { meta, topic: inputs.topic || book?.topic },
          metadata: { bookId, jobId },
        })
        angles = agent.parsed
        tokens = agent.completion
        if (book) await store.addLlmCost(userId, bookId, agent.completion.costUsd)
      } catch (e) {
        angles = {
          angles: [],
          disclaimer: `Titles loaded; positioning angles skipped (${e.message || 'parse error'}).`,
        }
      }
      if (book && Array.isArray(meta?.titles) && meta.titles.length) {
        await store.updateBook(userId, bookId, { competitors: meta.titles })
      }
      return { meta, angles, tokens }
    }
    case 'title_variations': {
      try {
        const agent = await runAgent(llm, 'title.v1', {
          modelClass: 'cheap',
          input: {
            topic: book?.topic,
            bible: book?.bible,
            seed: inputs.seed,
          },
          metadata: { bookId, jobId },
        })
        if (book) await store.addLlmCost(userId, bookId, agent.completion.costUsd)
        return agent.parsed
      } catch (e) {
        return {
          options: [],
          warnings: [`Title suggestions unavailable (${e.message || 'parse error'}). Enter a title manually.`],
        }
      }
    }
    case 'persona_derive': {
      try {
        const agent = await runAgent(llm, 'persona.v1', {
          modelClass: 'cheap',
          input: {
            samples: inputs.samples || [],
            real_experience_notes: inputs.real_experience_notes || '',
            name: inputs.name || book?.author_name,
          },
          metadata: { bookId, jobId },
        })
        if (book) {
          await store.addLlmCost(userId, bookId, agent.completion.costUsd)
          await store.updateBook(userId, bookId, { persona: agent.parsed })
        }
        return agent.parsed
      } catch (e) {
        throw new Error(`Persona derive failed: ${e.message || 'invalid model output'}. Try again or fill bio manually.`)
      }
    }
    case 'outline_generate':
    case 'outline_regenerate_subtree': {
      const tags = book?.bible?.focus_tags || inputs.focus_tags || []
      let agent
      try {
        agent = await runAgent(llm, 'outline.v1', {
          modelClass: 'draft',
          input: {
            bookBible: book?.bible,
            focus_tags: tags,
            target_words: book?.target_words,
            chapter_count: book?.chapter_count,
            structure_type: book?.structure_type,
          },
          metadata: { bookId, jobId },
        })
      } catch (e) {
        throw new Error(`Outline failed: ${e.message || 'invalid model output'}. Check focus tags / topic and retry.`)
      }
      // Ensure tag coverage — attach missing tags to first chapters if fake/model missed
      let chapters = agent.parsed.chapters || []
      let coverage = focusTagCoverage(tags, chapters)
      if (!coverage.passed) {
        chapters = chapters.map((ch, i) => {
          const tag = coverage.uncovered[i]
          if (!tag) return ch
          return { ...ch, focus_tags: [...new Set([...(ch.focus_tags || []), tag])] }
        })
        coverage = focusTagCoverage(tags, chapters)
      }
      if (book) {
        await store.addLlmCost(userId, bookId, agent.completion.costUsd)
        await store.updateBook(userId, bookId, {
          outline: { chapters, coverage },
          status: 'outlined',
          wizard_step: 'outline',
        })
      }
      return { chapters, coverage, prompt: { name: agent.promptName, version: agent.promptVersion } }
    }
    case 'section_draft':
    case 'section_regenerate': {
      if (!book) throw new Error('book required')
      const node = inputs.node
      if (!node?.title) throw new Error('node required')
      const resourceChunks = (book.resources || []).flatMap((r) =>
        chunkResource({ id: r.id || 'res', text: r.text || '', must_cover: !!r.must_cover })
      )
      const retrieved = retrieveChunks(
        resourceChunks,
        `${node.title} ${node.writing_direction || ''} ${(node.focus_tags || []).join(' ')}`,
        { topK: 4 }
      )
      const agent = await runAgent(llm, 'writer.v1', {
        modelClass: 'draft',
        input: {
          bookBible: book.bible,
          persona: book.persona,
          continuity: book.continuity,
          node,
          resourceChunks: retrieved.map((c) => ({ id: c.id, content: c.content, must_cover: c.must_cover })),
          filledStorySlots: (book.story_slots || []).filter((s) => s.status === 'filled'),
        },
        metadata: { bookId, jobId, targetWords: node.target_words },
      })
      const content_md = agent.parsed.content_md
      const slots = [
        ...extractStorySlots(content_md),
        ...(agent.parsed.story_slots || []).map((s) => ({
          ...s,
          status: 'pending',
          section_key: inputs.sectionKey,
        })),
      ]
      const claims = [
        ...extractClaimMarkers(content_md),
        ...(agent.parsed.claims_needed || []).map((c) => ({
          ...c,
          verification_status: 'unverified',
          section_key: inputs.sectionKey,
        })),
      ]
      const quality = sectionQualityReport({
        content_md,
        target_words: node.target_words,
        banned_phrases: book.bible?.banned_phrases,
      })
      // Repetition vs other sections
      let maxOverlap = 0
      for (const [k, sec] of Object.entries(book.sections || {})) {
        if (k === inputs.sectionKey) continue
        maxOverlap = Math.max(maxOverlap, ngramOverlap(content_md, sec.content_md || ''))
      }
      const section = {
        outline_path: inputs.sectionKey,
        title: node.title,
        content_md,
        content_json: null,
        word_count: quality.word_count,
        version: (book.sections?.[inputs.sectionKey]?.version || 0) + 1,
        status: 'draft',
        quality: { ...quality, repetition_score: Number(maxOverlap.toFixed(3)) },
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
      const continuityAgent = await runAgent(llm, 'continuity.v1', {
        modelClass: 'cheap',
        input: { title: node.title, content_md },
        metadata: { bookId, jobId },
      })
      const continuity = {
        ...book.continuity,
        summaries: [
          ...(book.continuity?.summaries || []),
          {
            id: inputs.sectionKey,
            title: node.title,
            summary: continuityAgent.parsed.summary,
          },
        ].slice(-80),
        terms: [
          ...new Set([
            ...(book.continuity?.terms || []),
            ...(continuityAgent.parsed.terms_introduced || []),
          ]),
        ],
        used_examples: [
          ...(book.continuity?.used_examples || []),
          ...(continuityAgent.parsed.examples_used || []),
        ].slice(-80),
        open_loops: continuityAgent.parsed.open_loops || [],
      }
      await store.addLlmCost(
        userId,
        bookId,
        agent.completion.costUsd + continuityAgent.completion.costUsd
      )
      await store.updateBook(userId, bookId, {
        sections,
        continuity,
        story_slots: [...(book.story_slots || []).filter((s) => s.section_key !== inputs.sectionKey), ...slots],
        claims: [...(book.claims || []).filter((c) => c.section_key !== inputs.sectionKey), ...claims],
        status: 'writing',
        wizard_step: 'writing',
      })
      return { section, quality, slots, claims }
    }
    case 'generate_all_chapter': {
      if (!book) throw new Error('book required')
      const chapterIndex = Number(inputs.chapterIndex || 0)
      const chapter = book.outline?.chapters?.[chapterIndex]
      if (!chapter) throw new Error('chapter not found')
      const results = []
      async function walk(node, path) {
        const key = path
        if (node.level === 'subsection' || (!node.children?.length && node.writing_direction)) {
          const out = await runJobBody(store, {
            userId,
            type: 'section_draft',
            bookId,
            inputs: { sectionKey: key, node: { ...node, level: node.level || 'section' } },
            jobId,
          })
          results.push({ key, ok: true, words: out.section?.word_count })
          return
        }
        const children = node.children || []
        for (let i = 0; i < children.length; i++) {
          await walk(children[i], `${path}.${i}`)
        }
        if (!children.length) {
          const out = await runJobBody(store, {
            userId,
            type: 'section_draft',
            bookId,
            inputs: { sectionKey: path, node },
            jobId,
          })
          results.push({ key: path, ok: true, words: out.section?.word_count })
        }
      }
      // Charge already applied for generate_all_chapter; nested section_draft would double-charge.
      // Inline draft without nested credit charge:
      const fresh = await store.getBook(userId, bookId)
      const nodes = flattenLeafNodes(chapter, `c${chapterIndex}`)
      for (const { key, node } of nodes) {
        const agent = await runAgent(llm, 'writer.v1', {
          modelClass: 'draft',
          input: {
            bookBible: fresh.bible,
            persona: fresh.persona,
            continuity: fresh.continuity,
            node,
          },
          metadata: { bookId, jobId, targetWords: node.target_words },
        })
        const content_md = agent.parsed.content_md
        const quality = sectionQualityReport({
          content_md,
          target_words: node.target_words,
          banned_phrases: fresh.bible?.banned_phrases,
        })
        const section = {
          outline_path: key,
          title: node.title,
          content_md,
          word_count: quality.word_count,
          version: 1,
          status: 'draft',
          quality,
          versions: [{ version: 1, content_md, at: new Date().toISOString() }],
        }
        const b2 = await store.getBook(userId, bookId)
        const sections = { ...(b2.sections || {}), [key]: section }
        await store.addLlmCost(userId, bookId, agent.completion.costUsd)
        await store.updateBook(userId, bookId, { sections, status: 'writing' })
        results.push({ key, words: quality.word_count })
      }
      return { chapterIndex, results }
    }
    case 'fact_check_section': {
      if (!book) throw new Error('book required')
      const section = book.sections?.[inputs.sectionKey]
      if (!section) throw new Error('section not found')
      const extracted = extractClaimsFromText(section.content_md, inputs.sectionKey)
      const search = createSearchProvider()
      const checked = await factCheckClaims(extracted, { searchProvider: search })
      const others = (book.claims || []).filter((c) => c.section_key !== inputs.sectionKey)
      await store.updateBook(userId, bookId, { claims: [...others, ...checked.claims] })
      return {
        ...checked,
        actions: {
          rewrite_qualitative: checked.claims.map((c) => ({
            text: c.text,
            suggestion: rewriteClaimQualitatively(c.text),
          })),
        },
      }
    }
    case 'originality_scan': {
      if (!book) throw new Error('book required')
      const key = inputs.sectionKey || Object.keys(book.sections || {})[0]
      const section = book.sections?.[key]
      if (!section) throw new Error('section not found')
      const others = Object.entries(book.sections || {})
        .filter(([k]) => k !== key)
        .map(([, s]) => s.content_md || '')
      const provider = createOriginalityProvider()
      const report = await provider.scan(section.content_md, { otherTexts: others })
      const rewrites = (report.flagged || []).slice(0, 8).map((f) => ({
        span: f.span,
        rewritten: rewriteFlaggedSpan(section.content_md, f.span, null),
        action: 'replace_span_in_editor',
      }))
      return { ...report, sectionKey: key, rewrites }
    }
    case 'quality_report': {
      if (!book) throw new Error('book required')
      const reports = Object.entries(book.sections || {}).map(([key, s]) => ({
        key,
        ...sectionQualityReport({
          content_md: s.content_md,
          target_words: s.quality?.target_words || 800,
          banned_phrases: book.bible?.banned_phrases,
        }),
      }))
      const passed = reports.every((r) => r.passed)
      await store.updateBook(userId, bookId, {
        quality_reports: reports,
        status: passed ? 'export_ready' : 'editing',
      })
      return { reports, passed }
    }
    case 'inline_edit': {
      const agent = await runAgent(llm, 'writer.v1', {
        modelClass: 'cheap',
        input: {
          mode: 'inline suggestion diff',
          instruction: inputs.instruction || 'Improve readability',
          selection: inputs.selection || '',
          bookBible: book?.bible,
        },
        metadata: { bookId, jobId },
      })
      if (book) await store.addLlmCost(userId, bookId, agent.completion.costUsd)
      return {
        suggestion: agent.parsed.content_md,
        note: 'Suggestion only — approve/reject in editor; never silent overwrite.',
      }
    }
    case 'cover_generate':
    case 'cover_revise': {
      if (!book) throw new Error('book required')
      const svg = buildCoverSvg({
        title: inputs.title || book.working_title,
        subtitle: book.subtitle || '',
        author: book.author_name || '',
      })
      const legibility = thumbnailLegibilityScore(book.working_title)
      const art = await persistExportArtifact(store, {
        bookId,
        format: 'cover_svg',
        bytes: svg.bytes,
        meta: { mime: svg.mime, typography_ok: svg.typography_ok, legibility },
      })
      const cover = {
        id: art.id,
        provider: config.imageProvider,
        status: 'generated',
        title: book.working_title,
        export: art,
        typography_ok: true,
        legibility,
        warning: 'Do not replicate protected trade dress. Typography is exact SVG text.',
        created_at: new Date().toISOString(),
      }
      await store.updateBook(userId, bookId, {
        covers: [...(book.covers || []), cover],
        wizard_step: 'cover',
      })
      return { cover, download: art.url }
    }
    case 'cover_wrap': {
      if (!book) throw new Error('book required')
      const chapters = chaptersFromBook(book)
      const interior = await buildInteriorPdf({
        title: book.working_title,
        author: book.author_name,
        chapters,
        trimId: book.trim_size,
      })
      const cover = await buildCoverWrapPdf({
        title: book.working_title,
        author: book.author_name,
        backCopy: book.metadata?.back_cover_copy || '',
        pageCount: interior.pageCount,
        trimId: book.trim_size,
      })
      const art = await persistExportArtifact(store, {
        bookId,
        format: 'cover_pdf',
        bytes: cover.bytes,
        meta: { pageCount: interior.pageCount, layout: cover.layout },
      })
      return art
    }
    case 'aplus_module':
    case 'ad_script': {
      if (!book && type === 'aplus_module') throw new Error('book required')
      const points = book?.bible?.key_selling_points || []
      const modules = []
      if (type === 'aplus_module' || type === 'ad_script') {
        for (const modType of ['cover_spotlight', 'author_spotlight', 'checklist']) {
          const svg = buildAPlusModuleSvg({
            type: modType,
            title: book?.working_title,
            author: book?.author_name,
            points,
          })
          const art = await persistExportArtifact(store, {
            bookId: book?.id,
            format: `aplus_${modType}`,
            bytes: svg.bytes,
            meta: { mime: svg.mime, width: svg.width, height: svg.height },
          })
          modules.push({ type: modType, status: 'ready', export: art })
        }
      }
      return {
        modules,
        ad_script:
          type === 'ad_script'
            ? `Hook: Learn ${book?.topic || 'the method'} without hype.\nProof: Your real experience + verified facts.\nCTA: Read the sample chapter.`
            : undefined,
        video_adapter: {
          id: 'pluggable',
          status: 'ready_interface',
          note: 'Call POST job type scene_to_video when a video provider is configured — no unofficial Amazon automation.',
        },
      }
    }
    case 'export_interior_pdf': {
      if (!book) throw new Error('book required')
      const chapters = chaptersFromBook(book)
      const pdf = await buildInteriorPdf({
        title: book.working_title,
        author: book.author_name,
        chapters,
        trimId: book.trim_size,
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
    case 'storefront_publish': {
      if (!book) throw new Error('book required')
      const slug =
        inputs.slug ||
        String(book.working_title || 'book')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .slice(0, 48) ||
        `book-${book.id.slice(0, 8)}`
      const storefront = {
        slug,
        status: 'published',
        price_cents: Number(inputs.price_cents || 1900),
        currency: inputs.currency || 'eur',
        theme: inputs.theme || 'editorial',
        sample_keys: inputs.sample_keys || Object.keys(book.sections || {}).slice(0, 1),
        published_at: new Date().toISOString(),
      }
      await store.updateBook(userId, bookId, {
        storefront,
        status: 'published',
        wizard_step: 'publish',
      })
      return { storefront, path: `/store/${slug}` }
    }
    case 'translation_chapter': {
      if (!book) throw new Error('book required')
      const key = inputs.sectionKey || Object.keys(book.sections || {})[0]
      const section = book.sections?.[key]
      if (!section) throw new Error('section not found')
      const targetLang = inputs.target_lang || (book.language === 'en' ? 'de' : 'en')
      const glossary = book.bible?.glossary || []
      const agent = await runAgent(llm, 'writer.v1', {
        modelClass: 'draft',
        input: {
          mode: 'chapter-aware translation',
          target_lang: targetLang,
          glossary,
          preserve_terms: glossary,
          content_md: section.content_md,
          instruction:
            'Translate preserving glossary terms. Do not invent facts. Flag AI-translated for KDP disclosure.',
        },
        metadata: { bookId, jobId },
      })
      await store.addLlmCost(userId, bookId, agent.completion.costUsd)
      const translatedKey = `${key}__${targetLang}`
      const sections = {
        ...(book.sections || {}),
        [translatedKey]: {
          ...section,
          outline_path: translatedKey,
          content_md: agent.parsed.content_md,
          status: 'draft',
          ai_translated: true,
          source_key: key,
          language: targetLang,
          version: 1,
        },
      }
      await store.updateBook(userId, bookId, {
        sections,
        compliance: {
          ...book.compliance,
          ai_disclosure: {
            ...(book.compliance?.ai_disclosure || {}),
            used_ai_translations: true,
            note: 'Disclose AI-translated text at KDP upload.',
          },
        },
      })
      return {
        sectionKey: translatedKey,
        target_lang: targetLang,
        ai_translated: true,
        content_md: agent.parsed.content_md,
      }
    }
    default:
      throw new Error(`Unhandled job type: ${type}`)
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

function flattenLeafNodes(chapter, prefix) {
  const out = []
  function walk(node, path) {
    const children = node.children || []
    if (!children.length) {
      out.push({ key: path, node })
      return
    }
    children.forEach((ch, i) => walk(ch, `${path}.${i}`))
  }
  walk(chapter, prefix)
  return out
}
