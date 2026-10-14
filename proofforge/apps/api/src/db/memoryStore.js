import { randomUUID } from 'node:crypto'
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname } from 'node:path'
import {
  normalizeBookLanguage,
  normalizeBookLanguageVariety,
  detectSections,
  scoreFromFindings,
  defaultPreferences,
} from '@proofforge/shared'
import { config } from '../config.js'

function nowIso() {
  return new Date().toISOString()
}

function emptyLedger(credits) {
  return { balance: credits, entries: [] }
}

export function createMemoryStore(options = {}) {
  const persist =
    options.persist === true ||
    (options.persist !== false &&
      (config.persist || Boolean(config.dataPath || process.env.PROOFFORGE_DATA_PATH)))
  const persistPath =
    options.persistPath ||
    config.dataPath ||
    process.env.PROOFFORGE_DATA_PATH ||
    new URL('../../../.data/store.json', import.meta.url).pathname

  /** @type {{ users: Map, projects: Map, jobs: Map }} */
  const state = {
    users: new Map(),
    projects: new Map(),
    jobs: new Map(),
  }

  function load() {
    if (!persist || !existsSync(persistPath)) return
    try {
      const raw = JSON.parse(readFileSync(persistPath, 'utf8'))
      for (const u of raw.users || []) state.users.set(u.id, u)
      for (const p of raw.projects || []) state.projects.set(p.id, p)
      for (const j of raw.jobs || []) state.jobs.set(j.id, j)
    } catch (err) {
      console.warn('[proofforge-store] load failed', err.message)
    }
  }

  function save() {
    if (!persist) return
    try {
      mkdirSync(dirname(persistPath), { recursive: true })
      writeFileSync(
        persistPath,
        JSON.stringify(
          {
            users: [...state.users.values()],
            projects: [...state.projects.values()],
            jobs: [...state.jobs.values()],
          },
          null,
          2
        )
      )
    } catch (err) {
      console.warn('[proofforge-store] save failed', err.message)
    }
  }

  load()

  function ensureUser(userId = 'local-author') {
    let u = state.users.get(userId)
    if (!u) {
      u = {
        id: userId,
        credits: emptyLedger(config.trialCredits),
        created_at: nowIso(),
      }
      state.users.set(userId, u)
      save()
    }
    return u
  }

  function chargeCredits(userId, amount, meta = {}) {
    const u = ensureUser(userId)
    if (u.credits.balance < amount) {
      const err = new Error('Insufficient credits')
      err.code = 'insufficient_credits'
      err.status = 402
      throw err
    }
    u.credits.balance -= amount
    u.credits.entries.push({
      id: randomUUID(),
      delta: -amount,
      ...meta,
      at: nowIso(),
    })
    save()
    return u.credits.balance
  }

  function refundCredits(userId, amount, meta = {}) {
    const u = ensureUser(userId)
    u.credits.balance += amount
    u.credits.entries.push({
      id: randomUUID(),
      delta: amount,
      refund: true,
      ...meta,
      at: nowIso(),
    })
    save()
  }

  function grantCredits(userId, amount, meta = {}) {
    const u = ensureUser(userId)
    u.credits.balance += Number(amount)
    u.credits.entries.push({
      id: randomUUID(),
      delta: Number(amount),
      ...meta,
      at: nowIso(),
    })
    save()
    return u.credits.balance
  }

  function sectionsFromInput(body) {
    if (Array.isArray(body.sections) && body.sections.length) {
      const out = {}
      body.sections.forEach((s, i) => {
        const key = s.key || `section_${i + 1}`
        const content = String(s.content_md || s.content || '')
        out[key] = {
          key,
          title: s.title || `Section ${i + 1}`,
          order: i,
          content_md: content,
          word_count: content.split(/\s+/).filter(Boolean).length,
        }
      })
      return out
    }
    if (body.manuscript_text) {
      const detected = detectSections(body.manuscript_text)
      const out = {}
      detected.forEach((s, i) => {
        out[s.key] = { ...s, order: i }
      })
      return out
    }
    return {}
  }

  return {
    ensureUser,
    getCredits(userId) {
      return ensureUser(userId).credits
    },
    chargeCredits,
    refundCredits,
    grantCredits,

    listProjects(ownerId) {
      return [...state.projects.values()]
        .filter((p) => p.owner_id === ownerId)
        .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)))
    },

    getProject(id) {
      return state.projects.get(id) || null
    },

    createProject(ownerId, body = {}) {
      const id = randomUUID()
      const language = normalizeBookLanguage(body.language)
      const language_variety = normalizeBookLanguageVariety(language, body.language_variety)
      const sections = sectionsFromInput(body)
      const project = {
        id,
        owner_id: ownerId,
        title: String(body.title || 'Untitled manuscript').slice(0, 200),
        subtitle: String(body.subtitle || '').slice(0, 200),
        author_name: String(body.author_name || '').slice(0, 120),
        intended_tone: String(body.intended_tone || '').slice(0, 120),
        style_guide: String(body.style_guide || '').slice(0, 4000),
        book_type: body.book_type || 'fiction',
        language,
        language_variety,
        audience: String(body.audience || '').slice(0, 200),
        publishing_target: body.publishing_target || 'editorial_only',
        edit_mode: body.edit_mode || 'natural',
        source: body.source || 'manual',
        source_book_id: body.source_book_id || null,
        source_studio: body.source_studio || null,
        preferences: { ...defaultPreferences(), ...(body.preferences || {}) },
        document_domain: body.document_domain || 'general',
        genre_comparison: body.genre_comparison || 'general_fiction',
        author_goals: String(body.author_goals || '').slice(0, 2000),
        custom_dictionary: Array.isArray(body.custom_dictionary)
          ? body.custom_dictionary.map(String).slice(0, 500)
          : [],
        translation_mode: Boolean(body.translation_mode),
        source_language: body.source_language || '',
        chapter_critique: body.chapter_critique !== false,
        plagiarism_consent: Boolean(body.plagiarism_consent),
        formality: body.formality || 'neutral',
        reading_level: String(body.reading_level || '').slice(0, 80),
        character_list: Array.isArray(body.character_list)
          ? body.character_list.map(String).slice(0, 80)
          : [],
        glossary: Array.isArray(body.glossary) ? body.glossary.slice(0, 80) : [],
        translation_glossary: Array.isArray(body.translation_glossary)
          ? body.translation_glossary.slice(0, 80)
          : [],
        print_config: body.print_config || {
          trim_size_in: null,
          bleed: false,
          outside_margin_in: null,
          gutter_in: null,
        },
        sections,
        findings: [],
        overview: null,
        manuscript_analysis: null,
        tone: null,
        scores: scoreFromFindings([]),
        style_reports: null,
        kdp: null,
        memory: null,
        chapter_critiques: [],
        disagreements: [],
        plagiarism: null,
        translation: null,
        word_gate: null,
        revisions: [],
        consent: {
          external_plagiarism: Boolean(body.plagiarism_consent),
          ai_provider_processing: true,
        },
        stats: {},
        ingest_warnings: body.ingest_warnings || [],
        ingest_meta: body.ingest_meta || null,
        source_sha256: body.ingest_meta?.sha256 || body.source_sha256 || null,
        status: Object.keys(sections).length ? 'ready' : 'draft',
        last_analysis: null,
        created_at: nowIso(),
        updated_at: nowIso(),
      }
      state.projects.set(id, project)
      save()
      return project
    },

    updateProject(id, patch = {}) {
      const p = state.projects.get(id)
      if (!p) return null
      if (patch.title != null) p.title = String(patch.title).slice(0, 200)
      if (patch.subtitle != null) p.subtitle = String(patch.subtitle).slice(0, 200)
      if (patch.author_name != null) p.author_name = String(patch.author_name).slice(0, 120)
      if (patch.intended_tone != null) p.intended_tone = String(patch.intended_tone).slice(0, 120)
      if (patch.style_guide != null) p.style_guide = String(patch.style_guide).slice(0, 4000)
      if (patch.book_type) p.book_type = patch.book_type
      if (patch.edit_mode) p.edit_mode = patch.edit_mode
      if (patch.publishing_target) p.publishing_target = patch.publishing_target
      if (patch.audience != null) p.audience = String(patch.audience).slice(0, 200)
      if (patch.preferences) p.preferences = { ...defaultPreferences(), ...p.preferences, ...patch.preferences }
      if (patch.document_domain) p.document_domain = String(patch.document_domain)
      if (patch.genre_comparison) p.genre_comparison = String(patch.genre_comparison)
      if (patch.author_goals != null) p.author_goals = String(patch.author_goals).slice(0, 2000)
      if (patch.custom_dictionary) {
        p.custom_dictionary = [...new Set(patch.custom_dictionary.map(String))].slice(0, 500)
      }
      if (patch.add_dictionary_word) {
        const w = String(patch.add_dictionary_word).trim().toLowerCase()
        if (w) {
          p.custom_dictionary = [...new Set([...(p.custom_dictionary || []), w])].slice(0, 500)
        }
      }
      if (patch.translation_mode != null) p.translation_mode = Boolean(patch.translation_mode)
      if (patch.source_language != null) p.source_language = String(patch.source_language).slice(0, 16)
      if (patch.chapter_critique != null) p.chapter_critique = Boolean(patch.chapter_critique)
      if (patch.plagiarism_consent != null) {
        p.plagiarism_consent = Boolean(patch.plagiarism_consent)
        p.consent = { ...(p.consent || {}), external_plagiarism: p.plagiarism_consent }
      }
      if (patch.print_config) p.print_config = { ...(p.print_config || {}), ...patch.print_config }
      if (patch.formality != null) p.formality = String(patch.formality).slice(0, 32)
      if (patch.reading_level != null) p.reading_level = String(patch.reading_level).slice(0, 80)
      if (patch.character_list) {
        p.character_list = patch.character_list.map(String).slice(0, 80)
      }
      if (patch.glossary) p.glossary = patch.glossary.slice(0, 80)
      if (patch.translation_glossary) {
        p.translation_glossary = patch.translation_glossary.slice(0, 80)
      }
      if (patch.consent) {
        p.consent = { ...(p.consent || {}), ...patch.consent }
        if (patch.consent.external_plagiarism != null) {
          p.plagiarism_consent = Boolean(patch.consent.external_plagiarism)
        }
      }
      if (patch.ingest_warnings) p.ingest_warnings = patch.ingest_warnings
      if (patch.language) {
        p.language = normalizeBookLanguage(patch.language)
        p.language_variety = normalizeBookLanguageVariety(
          p.language,
          patch.language_variety || p.language_variety
        )
      } else if (patch.language_variety) {
        p.language_variety = normalizeBookLanguageVariety(p.language, patch.language_variety)
      }
      if (patch.manuscript_text || patch.sections) {
        p.sections = sectionsFromInput(patch)
        p.findings = []
        p.scores = scoreFromFindings([])
        p.status = 'ready'
      }
      if (patch.apply_section) {
        const { key, content_md } = patch.apply_section
        if (p.sections[key]) {
          p.sections[key].content_md = content_md
          p.sections[key].word_count = String(content_md || '')
            .split(/\s+/)
            .filter(Boolean).length
        }
      }
      p.updated_at = nowIso()
      state.projects.set(id, p)
      save()
      return p
    },

    setAnalysisResult(id, result) {
      const p = state.projects.get(id)
      if (!p) return null
      const runId = result.analysis_run_id || result.scores?.analysis_run_id || null
      const withIds = (result.findings || []).map((f) => ({
        ...f,
        id: f.id || randomUUID(),
        analysis_run_id: f.analysis_run_id || runId,
        resolution: f.resolution || 'open',
      }))
      p.findings = withIds
      p.overview = result.overview
      p.manuscript_analysis = result.manuscript_analysis || null
      p.tone = result.tone || null
      p.scores =
        result.scores ||
        scoreFromFindings(withIds, { kdpBlocking: result.kdp?.summary?.blocking || 0 })
      p.style_reports = result.style_reports || null
      p.kdp = result.kdp || null
      p.memory = result.memory || null
      p.chapter_critiques = result.chapter_critiques || []
      p.disagreements = result.disagreements || []
      p.plagiarism = result.plagiarism || null
      p.translation = result.translation || null
      p.word_gate = result.word_gate || null
      p.action_plan = result.action_plan || null
      p.document_domain = result.document_domain || p.document_domain
      p.genre_comparison = result.genre_comparison || p.genre_comparison
      p.formality = result.formality || p.formality
      p.analysis_run_id = runId
      p.stats = result.stats || {}
      p.last_analysis = {
        at: nowIso(),
        coverage: result.coverage,
        usage: result.usage,
        analysis_run_id: runId,
      }
      p.status = 'analyzed'
      p.updated_at = nowIso()
      state.projects.set(id, p)
      save()
      return p
    },

    pushRevision(projectId, label = 'edit') {
      const p = state.projects.get(projectId)
      if (!p) return null
      if (!p.revisions) p.revisions = []
      p.revisions.push({
        id: randomUUID(),
        label,
        at: nowIso(),
        sections: JSON.parse(JSON.stringify(p.sections)),
        findings_snapshot: (p.findings || []).map((f) => ({
          id: f.id,
          resolution: f.resolution,
        })),
      })
      if (p.revisions.length > 40) p.revisions = p.revisions.slice(-40)
      save()
      return p
    },

    undoRevision(projectId) {
      const p = state.projects.get(projectId)
      if (!p?.revisions?.length) return null
      const last = p.revisions.pop()
      p.sections = last.sections
      p.updated_at = nowIso()
      state.projects.set(projectId, p)
      save()
      return { project: p, restored: last }
    },

    resolveFinding(projectId, findingId, decision) {
      const p = state.projects.get(projectId)
      if (!p) return null
      const f = p.findings.find((x) => x.id === findingId)
      if (!f) return null
      const action = decision.action
      if (action === 'accept' || action === 'edit') {
        this.pushRevision(projectId, `before_${action}_${findingId.slice(0, 8)}`)
      }
      if (action === 'accept') {
        f.resolution = 'accepted'
        f.user_decision = 'accept'
        const key = f.section_key
        const section = p.sections[key]
        const replacement = decision.edited_text ?? f.suggested_correction
        if (section && f.original_excerpt && replacement != null && replacement !== '') {
          if (section.content_md.includes(f.original_excerpt)) {
            section.content_md = section.content_md.replace(f.original_excerpt, replacement)
            section.word_count = section.content_md.split(/\s+/).filter(Boolean).length
          }
        }
      } else if (action === 'reject') {
        f.resolution = 'rejected'
        f.user_decision = 'reject'
      } else if (action === 'intentional') {
        f.resolution = 'intentional'
        f.user_decision = 'intentional'
      } else if (action === 'edit') {
        f.resolution = 'edited'
        f.user_decision = 'edit'
        f.edited_correction = String(decision.edited_text || '')
        const key = f.section_key
        const section = p.sections[key]
        if (section && f.original_excerpt && f.edited_correction) {
          if (section.content_md.includes(f.original_excerpt)) {
            section.content_md = section.content_md.replace(
              f.original_excerpt,
              f.edited_correction
            )
            section.word_count = section.content_md.split(/\s+/).filter(Boolean).length
          }
        }
      } else if (action === 'agree') {
        // ProWritingAid-style feedback — does not apply correction
        f.author_feedback = 'agree'
        f.user_decision = 'agree'
      } else if (action === 'disagree') {
        f.author_feedback = 'disagree'
        f.user_decision = 'disagree'
        f.resolution = f.resolution === 'open' || !f.resolution ? 'rejected' : f.resolution
      } else if (action === 'ignore') {
        // Grammarly/PWA: ignore single suggestion
        f.resolution = 'rejected'
        f.user_decision = 'ignore'
      } else if (action === 'defer') {
        f.resolution = 'deferred'
        f.user_decision = 'defer'
      } else if (action === 'add_to_dictionary') {
        const word = String(decision.word || f.original_excerpt || '')
          .trim()
          .toLowerCase()
          .split(/\s+/)[0]
        if (word) {
          p.custom_dictionary = [...new Set([...(p.custom_dictionary || []), word])].slice(0, 500)
        }
        f.resolution = 'intentional'
        f.user_decision = 'dictionary'
      }
      if (decision.feedback_note) {
        f.feedback_note = String(decision.feedback_note).slice(0, 500)
      }
      p.scores = scoreFromFindings(p.findings)
      p.updated_at = nowIso()
      state.projects.set(projectId, p)
      save()
      return { project: p, finding: f }
    },

    batchResolve(projectId, { action = 'accept', only_objective = true, category = null } = {}) {
      const p = state.projects.get(projectId)
      if (!p) return null
      if (action === 'accept') this.pushRevision(projectId, 'before_batch_accept')
      let applied = 0
      for (const f of p.findings) {
        if (f.resolution && f.resolution !== 'open') continue
        if (only_objective && !f.objective) continue
        if (category && f.category !== category) continue
        if (action === 'accept' && f.suggested_correction && f.original_excerpt) {
          const section = p.sections[f.section_key]
          if (section?.content_md?.includes(f.original_excerpt)) {
            section.content_md = section.content_md.replace(
              f.original_excerpt,
              f.suggested_correction
            )
            section.word_count = section.content_md.split(/\s+/).filter(Boolean).length
          }
          f.resolution = 'accepted'
          f.user_decision = 'accept'
          applied += 1
        } else if (action === 'reject') {
          f.resolution = 'rejected'
          f.user_decision = 'reject'
          applied += 1
        }
      }
      p.scores = scoreFromFindings(p.findings)
      p.updated_at = nowIso()
      state.projects.set(projectId, p)
      save()
      return { project: p, applied }
    },

    createJob(job) {
      const id = randomUUID()
      const row = {
        id,
        status: 'queued',
        progress: { phase: 'queued', done: 0, total: 1 },
        error: null,
        result: null,
        created_at: nowIso(),
        updated_at: nowIso(),
        ...job,
      }
      state.jobs.set(id, row)
      save()
      return row
    },

    getJob(id) {
      return state.jobs.get(id) || null
    },

    updateJob(id, patch) {
      const j = state.jobs.get(id)
      if (!j) return null
      Object.assign(j, patch, { updated_at: nowIso() })
      state.jobs.set(id, j)
      save()
      return j
    },
  }
}
