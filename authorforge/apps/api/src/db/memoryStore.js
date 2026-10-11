import { randomUUID } from 'node:crypto'
import { config } from '../config.js'
import { resolveDataPath, loadPersistedState, createDebouncedSaver } from './persist.js'

export function createMemoryStore(options = {}) {
  const envPersist = process.env.AUTHORFORGE_PERSIST
  const explicitlyOff =
    options.persist === false || envPersist === '0' || envPersist === 'false'
  const explicitlyOn =
    options.persist === true ||
    envPersist === '1' ||
    envPersist === 'true' ||
    Boolean(process.env.AUTHORFORGE_DATA_PATH)
  // Dev: persist by default. Prod: only when AUTHORFORGE_PERSIST=1 or DATA_PATH (Fly volume).
  const persistEnabled =
    !explicitlyOff &&
    !process.env.NODE_TEST_CONTEXT &&
    (explicitlyOn || !config.isProd)
  const persistPath = resolveDataPath(options.persistPath || process.env.AUTHORFORGE_DATA_PATH)

  const users = new Map()
  const orgs = new Map()
  const ledger = []
  const books = new Map()
  const jobs = new Map()
  const exportsMap = new Map()
  const storefrontOrders = new Map()
  const downloadTokens = new Map()

  function snapshot() {
    return {
      version: 1,
      savedAt: new Date().toISOString(),
      users: [...users.values()],
      orgs: [...orgs.values()],
      ledger: ledger.slice(-3000),
      books: [...books.values()],
      jobs: [...jobs.values()].slice(-120),
      exports: [...exportsMap.entries()],
      orders: [...storefrontOrders.values()],
      downloadTokens: [...downloadTokens.entries()],
    }
  }

  const scheduleSave = persistEnabled ? createDebouncedSaver(persistPath, snapshot) : () => {}

  if (persistEnabled) {
    const loaded = loadPersistedState(persistPath)
    if (loaded) {
      for (const u of loaded.users || []) users.set(u.id, u)
      for (const o of loaded.orgs || []) orgs.set(o.id, o)
      for (const e of loaded.ledger || []) ledger.push(e)
      for (const b of loaded.books || []) books.set(b.id, b)
      for (const j of loaded.jobs || []) jobs.set(j.id, j)
      for (const [k, v] of loaded.exports || []) exportsMap.set(k, v)
      for (const o of loaded.orders || []) storefrontOrders.set(o.id, o)
      for (const [k, v] of loaded.downloadTokens || []) downloadTokens.set(k, v)
      console.info(
        `[authorforge] restored (${users.size} users, ${books.size} books) from ${persistPath}`
      )
    }
  }

  function balance(userId) {
    return ledger.filter((e) => e.user_id === userId).reduce((s, e) => s + e.delta, 0)
  }

  function spentToday(userId) {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const t = start.getTime()
    return ledger
      .filter((e) => e.user_id === userId && e.delta < 0 && new Date(e.created_at).getTime() >= t)
      .reduce((s, e) => s + Math.abs(e.delta), 0)
  }

  function emptyBible() {
    return {
      version: 0,
      positioning: '',
      usp: '',
      differentiation: '',
      audience: '',
      tone: '',
      stance: '',
      key_selling_points: [],
      focus_tags: [],
      style_guide: '',
      banned_phrases: [],
      glossary: [],
      author_name: '',
      pen_name: '',
    }
  }

  const api = {
    persistPath: persistEnabled ? persistPath : null,

    async ensureUser(externalRef = 'local-dev') {
      for (const u of users.values()) {
        if (u.external_ref === externalRef) return u
      }
      const org = {
        id: randomUUID(),
        name: 'Personal',
        created_at: new Date().toISOString(),
      }
      orgs.set(org.id, org)
      const user = {
        id: randomUUID(),
        external_ref: externalRef,
        email: null,
        org_id: org.id,
        locale: 'en',
        created_at: new Date().toISOString(),
      }
      users.set(user.id, user)
      ledger.push({
        id: randomUUID(),
        user_id: user.id,
        delta: config.trialCredits,
        reason: 'trial_grant',
        job_id: null,
        meta: { kind: 'trial' },
        created_at: new Date().toISOString(),
      })
      scheduleSave()
      return user
    },

    async getBalance(userId) {
      return balance(userId)
    },

    async getSpentToday(userId) {
      return spentToday(userId)
    },

    async appendLedger({ userId, delta, reason, jobId = null, meta = {} }) {
      const entry = {
        id: randomUUID(),
        user_id: userId,
        delta,
        reason,
        job_id: jobId,
        meta,
        created_at: new Date().toISOString(),
      }
      ledger.push(entry)
      scheduleSave()
      return entry
    },

    async listLedger(userId, limit = 50) {
      return ledger
        .filter((e) => e.user_id === userId)
        .slice(-limit)
        .reverse()
    },

    async createBook(userId, data = {}) {
      const user = users.get(userId)
      const book = {
        id: randomUUID(),
        user_id: userId,
        org_id: user?.org_id || null,
        working_title: data.working_title || 'Untitled book',
        subtitle: data.subtitle || '',
        author_name: data.author_name || '',
        status: 'draft',
        genre: data.genre || 'nonfiction',
        topic: data.topic || '',
        target_words: data.target_words || 28000,
        chapter_count: data.chapter_count || 8,
        structure_type: data.structure_type || 'how-to',
        language: data.language || 'en',
        trim_size: data.trim_size || '6x9',
        wizard_step: data.wizard_step || 'basics',
        bible: { ...emptyBible(), ...(data.bible || {}) },
        persona: data.persona || null,
        competitors: data.competitors || [],
        resources: data.resources || [],
        outline: data.outline || { chapters: [] },
        sections: data.sections || {},
        continuity: {
          summaries: [],
          used_examples: [],
          used_openings: [],
          terms: [],
          open_loops: [],
        },
        claims: [],
        story_slots: [],
        quality_reports: [],
        covers: [],
        metadata: data.metadata || {},
        formatting: data.formatting || { preset: 'modern' },
        compliance: { checklist: [], ai_disclosure: {}, passed: false },
        storefront: null,
        llm_cost_usd: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      books.set(book.id, book)
      scheduleSave()
      return book
    },

    async getBook(userId, bookId) {
      const b = books.get(bookId)
      if (!b || b.user_id !== userId) return null
      return b
    },

    async listBooks(userId) {
      return [...books.values()]
        .filter((b) => b.user_id === userId)
        .map((b) => ({
          id: b.id,
          working_title: b.working_title,
          status: b.status,
          wizard_step: b.wizard_step,
          language: b.language,
          target_words: b.target_words,
          llm_cost_usd: b.llm_cost_usd,
          updated_at: b.updated_at,
        }))
        .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1))
    },

    async updateBook(userId, bookId, patch) {
      const b = await api.getBook(userId, bookId)
      if (!b) return null
      const next = {
        ...b,
        ...patch,
        bible: patch.bible ? { ...b.bible, ...patch.bible } : b.bible,
        continuity: patch.continuity ? { ...b.continuity, ...patch.continuity } : b.continuity,
        metadata: patch.metadata ? { ...b.metadata, ...patch.metadata } : b.metadata,
        formatting: patch.formatting ? { ...b.formatting, ...patch.formatting } : b.formatting,
        compliance: patch.compliance ? { ...b.compliance, ...patch.compliance } : b.compliance,
        updated_at: new Date().toISOString(),
      }
      // Preserve nested maps that shouldn't be replaced blindly unless provided
      if (patch.sections) next.sections = patch.sections
      if (patch.outline) next.outline = patch.outline
      if (patch.persona !== undefined) next.persona = patch.persona
      if (patch.competitors) next.competitors = patch.competitors
      if (patch.resources) next.resources = patch.resources
      if (patch.story_slots) next.story_slots = patch.story_slots
      if (patch.claims) next.claims = patch.claims
      if (patch.covers) next.covers = patch.covers
      if (patch.storefront !== undefined) next.storefront = patch.storefront
      books.set(bookId, next)
      scheduleSave()
      return next
    },

    async deleteBook(userId, bookId) {
      const b = await api.getBook(userId, bookId)
      if (!b) return false
      books.delete(bookId)
      for (const [jid, job] of jobs) {
        if (job.book_id === bookId) jobs.delete(jid)
      }
      scheduleSave()
      return true
    },

    async addLlmCost(userId, bookId, costUsd) {
      const b = await api.getBook(userId, bookId)
      if (!b) return null
      b.llm_cost_usd = Number((Number(b.llm_cost_usd || 0) + Number(costUsd || 0)).toFixed(6))
      b.updated_at = new Date().toISOString()
      books.set(bookId, b)
      scheduleSave()
      return b
    },

    async createJob(row) {
      const job = {
        id: randomUUID(),
        status: 'queued',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        outputs: {},
        error: null,
        ...row,
      }
      jobs.set(job.id, job)
      scheduleSave()
      return job
    },

    async getJob(userId, jobId) {
      const j = jobs.get(jobId)
      if (!j || j.user_id !== userId) return null
      return j
    },

    async updateJob(jobId, patch) {
      const j = jobs.get(jobId)
      if (!j) return null
      const next = { ...j, ...patch, updated_at: new Date().toISOString() }
      jobs.set(jobId, next)
      scheduleSave()
      return next
    },

    async saveExport(id, artifact) {
      exportsMap.set(id, artifact)
      scheduleSave()
      return artifact
    },

    async getExport(id) {
      return exportsMap.get(id) || null
    },

    async createOrder(order) {
      const row = { id: randomUUID(), created_at: new Date().toISOString(), ...order }
      storefrontOrders.set(row.id, row)
      scheduleSave()
      return row
    },

    async getOrder(id) {
      return storefrontOrders.get(id) || null
    },

    async saveDownloadToken(token, payload) {
      downloadTokens.set(token, payload)
      scheduleSave()
    },

    async getDownloadToken(token) {
      return downloadTokens.get(token) || null
    },

    async consumeDownloadToken(token) {
      const t = downloadTokens.get(token)
      if (!t) return null
      t.uses = (t.uses || 0) + 1
      if (t.uses >= (t.maxUses || 3)) downloadTokens.delete(token)
      else downloadTokens.set(token, t)
      scheduleSave()
      return t
    },

    /** Admin margin snapshot */
    async adminStats() {
      const allBooks = [...books.values()]
      return {
        users: users.size,
        books: allBooks.length,
        total_llm_usd: allBooks.reduce((s, b) => s + (b.llm_cost_usd || 0), 0),
        jobs: jobs.size,
        orders: storefrontOrders.size,
        books_margin: allBooks.map((b) => ({
          id: b.id,
          title: b.working_title,
          llm_cost_usd: b.llm_cost_usd || 0,
          status: b.status,
        })),
      }
    },

    async findPublishedBySlug(slug) {
      for (const b of books.values()) {
        if (b.storefront?.slug === slug && b.storefront?.status === 'published') return b
      }
      return null
    },

    async getBookById(bookId) {
      return books.get(bookId) || null
    },
  }

  return api
}
