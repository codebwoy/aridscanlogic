import { randomUUID } from 'node:crypto'
import { config } from '../config.js'
import { CONFIG_VALUES, configMap } from '@storyforge/shared'
import {
  resolveDataPath,
  loadPersistedState,
  createDebouncedSaver,
} from './persist.js'

/** Dev / fallback store when DATABASE_URL is unset. Persists locally for operational use. */
export function createMemoryStore(options = {}) {
  const envPersist = process.env.STORYFORGE_PERSIST
  const persistEnabled =
    options.persist === true ||
    (options.persist !== false &&
      !config.isProd &&
      envPersist !== '0' &&
      envPersist !== 'false' &&
      !process.env.NODE_TEST_CONTEXT)
  const persistPath = resolveDataPath(options.persistPath || process.env.STORYFORGE_DATA_PATH)
  const users = new Map()
  const ledger = []
  const projects = new Map()
  const jobs = new Map()
  /** @type {Map<string, Record<string, unknown>>} */
  const configOverrides = new Map()
  /** @type {Map<string, object>} */
  const disclosureByProject = new Map()
  /** @type {Map<string, object>} key = `${userId}:${projectId}` */
  const photoConsents = new Map()

  function snapshot() {
    return {
      version: 1,
      savedAt: new Date().toISOString(),
      users: [...users.values()],
      ledger: ledger.slice(-2000),
      projects: [...projects.values()],
      // Keep recent jobs only (outputs can be large)
      jobs: [...jobs.values()].slice(-80),
      configOverrides: [...configOverrides.entries()],
      disclosures: [...disclosureByProject.entries()],
      photoConsents: [...photoConsents.entries()],
    }
  }

  const scheduleSave = persistEnabled
    ? createDebouncedSaver(persistPath, snapshot)
    : () => {}

  if (persistEnabled) {
    const loaded = loadPersistedState(persistPath)
    if (loaded) {
      for (const u of loaded.users || []) users.set(u.id, u)
      for (const e of loaded.ledger || []) ledger.push(e)
      for (const p of loaded.projects || []) projects.set(p.id, p)
      for (const j of loaded.jobs || []) jobs.set(j.id, j)
      for (const [k, v] of loaded.configOverrides || []) configOverrides.set(k, v)
      for (const [k, v] of loaded.disclosures || []) disclosureByProject.set(k, v)
      for (const [k, v] of loaded.photoConsents || []) photoConsents.set(k, v)
      console.info(
        `[storyforge] restored local state (${users.size} users, ${projects.size} projects) from ${persistPath}`
      )
    } else {
      console.info(`[storyforge] local state file: ${persistPath} (will create on first save)`)
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

  function emptyPages(pageCount) {
    return Array.from({ length: pageCount }, (_, i) => ({
      page_index: i,
      text_content: '',
      illustration_brief: '',
      status: 'empty',
      layers: [],
      asset: null,
      consistencyBadge: null,
      chainSteps: 0,
    }))
  }

  const api = {
    persistPath: persistEnabled ? persistPath : null,

    async ensureUser(externalRef = 'local-dev') {
      for (const u of users.values()) {
        if (u.external_ref === externalRef) return u
      }
      const user = {
        id: randomUUID(),
        external_ref: externalRef,
        email: null,
        locale: 'de',
        guardianAffirmed: false,
        created_at: new Date().toISOString(),
      }
      users.set(user.id, user)
      ledger.push({
        id: randomUUID(),
        user_id: user.id,
        delta: config.trialCredits,
        reason: 'trial_grant',
        job_id: null,
        meta: { never_expires: false, kind: 'trial' },
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

    async createProject(userId, data) {
      const pageCount = data.page_count || 32
      const project = {
        id: randomUUID(),
        user_id: userId,
        title: data.title || 'Untitled book',
        language: data.language || 'de',
        trim_id: data.trim_id || 'sq_85',
        paper_type: data.paper_type || 'premium_color',
        page_count: pageCount,
        status: 'draft',
        progress_step: data.progress_step || 'story',
        premise: data.premise || '',
        emotional_core: data.emotional_core || '',
        format_id: data.format_id || 'picture',
        style_preset: data.style_preset || 'storybook',
        pinned_anchor_asset_id: null,
        pinned_anchor: null,
        turbo_engine: data.turbo_engine || 'v3',
        meta: data.meta || {},
        characters: [],
        pages: emptyPages(pageCount),
        course_progress: {},
        last_job_outputs: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      projects.set(project.id, project)
      scheduleSave()
      return project
    },

    async getProject(userId, projectId) {
      const p = projects.get(projectId)
      if (!p || p.user_id !== userId) return null
      return p
    },

    async listProjects(userId) {
      return [...projects.values()]
        .filter((p) => p.user_id === userId)
        .map((p) => ({
          id: p.id,
          title: p.title,
          language: p.language,
          trim_id: p.trim_id,
          page_count: p.page_count,
          progress_step: p.progress_step,
          pinned_anchor_asset_id: p.pinned_anchor_asset_id,
          format_id: p.format_id,
          updated_at: p.updated_at,
          created_at: p.created_at,
        }))
    },

    async updateProject(userId, projectId, patch) {
      const p = projects.get(projectId)
      if (!p || p.user_id !== userId) return null
      const allowed = [
        'title',
        'language',
        'trim_id',
        'paper_type',
        'page_count',
        'status',
        'progress_step',
        'premise',
        'emotional_core',
        'format_id',
        'style_preset',
        'turbo_engine',
        'meta',
        'course_progress',
        'pages',
        'characters',
        'pinned_anchor_asset_id',
        'pinned_anchor',
        'last_job_outputs',
      ]
      for (const key of allowed) {
        if (patch[key] !== undefined) p[key] = patch[key]
      }
      if (patch.page_count && Number(patch.page_count) !== p.pages.length) {
        const n = Number(patch.page_count)
        if (Number.isInteger(n) && n > 0) {
          const next = emptyPages(n)
          for (let i = 0; i < Math.min(p.pages.length, n); i++) next[i] = p.pages[i]
          p.pages = next
          p.page_count = n
        }
      }
      p.updated_at = new Date().toISOString()
      scheduleSave()
      return p
    },

    async pinAnchor(userId, projectId, anchor) {
      const p = projects.get(projectId)
      if (!p || p.user_id !== userId) return null
      const assetId = anchor?.assetId || randomUUID()
      p.pinned_anchor_asset_id = assetId
      p.pinned_anchor = {
        assetId,
        heroUrl: anchor?.heroUrl || null,
        palette: anchor?.palette || [],
        embedding: anchor?.embedding || null,
        name: anchor?.name || 'Hero',
        engine: anchor?.engine || p.turbo_engine,
        approvedAt: new Date().toISOString(),
      }
      p.progress_step = 'scenes'
      if (!p.characters.length) {
        p.characters.push({
          id: randomUUID(),
          name: p.pinned_anchor.name,
          approved: true,
          heroAssetId: assetId,
          palette: p.pinned_anchor.palette,
        })
      } else {
        p.characters[0] = {
          ...p.characters[0],
          approved: true,
          heroAssetId: assetId,
          palette: p.pinned_anchor.palette,
          name: p.pinned_anchor.name,
        }
      }
      p.updated_at = new Date().toISOString()
      scheduleSave()
      return p
    },

    async setPage(userId, projectId, pageIndex, patch) {
      const p = projects.get(projectId)
      if (!p || p.user_id !== userId) return null
      const page = p.pages.find((x) => x.page_index === pageIndex)
      if (!page) return null
      Object.assign(page, patch)
      p.updated_at = new Date().toISOString()
      scheduleSave()
      return page
    },

    async saveDisclosure(userId, projectId, assessment) {
      const p = projects.get(projectId)
      if (!p || p.user_id !== userId) return null
      const row = {
        id: randomUUID(),
        project_id: projectId,
        ...assessment,
        updated_at: new Date().toISOString(),
      }
      disclosureByProject.set(projectId, row)
      p.meta = { ...p.meta, disclosure: row }
      p.updated_at = new Date().toISOString()
      scheduleSave()
      return row
    },

    async getDisclosure(userId, projectId) {
      const p = projects.get(projectId)
      if (!p || p.user_id !== userId) return null
      return disclosureByProject.get(projectId) || p.meta?.disclosure || null
    },

    async addPhotoConsent(userId, projectId, consent) {
      const p = projects.get(projectId)
      if (!p || p.user_id !== userId) return null
      const row = {
        id: randomUUID(),
        user_id: userId,
        project_id: projectId,
        guardian_name: consent.guardian_name || '',
        relationship: consent.relationship || '',
        acknowledged_guardian: Boolean(consent.acknowledged_guardian),
        acknowledged_no_model_training: Boolean(consent.acknowledged_no_model_training),
        created_at: new Date().toISOString(),
      }
      photoConsents.set(`${userId}:${projectId}`, row)
      p.meta = { ...p.meta, photoConsent: row }
      p.updated_at = new Date().toISOString()
      scheduleSave()
      return row
    },

    async getPhotoConsent(userId, projectId) {
      return photoConsents.get(`${userId}:${projectId}`) || null
    },

    getPinnedCharacter(project) {
      if (!project?.pinned_anchor) return null
      return {
        name: project.pinned_anchor.name,
        anchor: {
          assetId: project.pinned_anchor.assetId,
          url: project.pinned_anchor.heroUrl,
          placeholder: Boolean(project.pinned_anchor.heroUrl),
          palette: project.pinned_anchor.palette,
          embedding: project.pinned_anchor.embedding,
        },
        engine: project.pinned_anchor.engine,
        approvedAt: project.pinned_anchor.approvedAt,
      }
    },

    async getConfigValues() {
      const base = CONFIG_VALUES.map((c) => {
        const o = configOverrides.get(c.key)
        return o ? { ...c, ...o, key: c.key } : { ...c }
      })
      return { values: base, map: configMap(base) }
    },

    async setConfigValue(key, patch) {
      const base = CONFIG_VALUES.find((c) => c.key === key)
      if (!base) return null
      const next = {
        value: patch.value ?? configOverrides.get(key)?.value ?? base.value,
        source_label: patch.source_label ?? configOverrides.get(key)?.source_label ?? base.source_label,
        verified_note:
          patch.verified_note ?? configOverrides.get(key)?.verified_note ?? base.verified_note,
      }
      configOverrides.set(key, next)
      scheduleSave()
      return { key, ...base, ...next }
    },

    async createJob(userId, data) {
      const job = {
        id: randomUUID(),
        user_id: userId,
        project_id: data.project_id || null,
        type: data.type,
        status: 'queued',
        cost_credits: data.cost_credits || 0,
        inputs_hash: data.inputs_hash || null,
        inputs: data.inputs || {},
        outputs: {},
        error: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      jobs.set(job.id, job)
      scheduleSave()
      return job
    },

    async updateJob(jobId, patch) {
      const job = jobs.get(jobId)
      if (!job) return null
      Object.assign(job, patch, { updated_at: new Date().toISOString() })
      scheduleSave()
      return job
    },

    async getJob(userId, jobId) {
      const job = jobs.get(jobId)
      if (!job || job.user_id !== userId) return null
      return job
    },
  }

  return api
}
