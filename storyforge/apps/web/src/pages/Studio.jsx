import { useEffect, useState } from 'react'
import {
  BookOpen,
  Check,
  Clapperboard,
  ClipboardCheck,
  FileOutput,
  Package,
  Pin,
  Sparkles,
  Wand2,
  ZoomIn,
} from 'lucide-react'
import {
  CREDIT_COSTS,
  CHARACTER_TURBO_ENGINES,
  NAMED_TOOLS,
  PUBLISHING_SPECS,
  FAL_DEFAULTS,
  estimateBookCredits,
  STORY_LANGUAGES,
  LANGUAGE_PAIR_PRESETS,
  BILINGUAL_LAYOUTS,
  formatLanguagePairLabel,
  composeDisplayText,
  languageLabel,
  BOOK_FORMATS,
  assessPublicationReadiness,
  emptyPublicationSignoff,
  normalizePublicationSignoff,
  CONTINUITY_SIGNOFF_ITEMS,
  STORYFORGE_NICHES,
  STORYFORGE_MARKET_DISCLAIMER,
  storyforgeNicheLocalized,
  applyStoryforgeNiche,
} from '@storyforge/shared'
import { api } from '../lib/api.js'
import { runAndWait } from '../lib/jobs.js'
import PageCanvas from '../components/PageCanvas.jsx'
import IpCharacterBuilder from '../components/IpCharacterBuilder.jsx'

const STEPS = ['story', 'characters', 'scenes', 'layout', 'preflight', 'export']

export default function Studio({
  session,
  setSession,
  projects,
  setProjects,
  active,
  printReq,
  busy,
  setBusy,
  error,
  setError,
  status,
  setStatus,
  onSelectProject,
}) {
  const [toolTab, setToolTab] = useState('character_turbo')
  const [pageIndex, setPageIndex] = useState(0)
  const [charName, setCharName] = useState('Luna')
  const [engine, setEngine] = useState('v3')
  const [sceneBrief, setSceneBrief] = useState('waves hello in a sunny park')
  const [motionPrompt, setMotionPrompt] = useState(
    'Subtle motion, keep face and outfit unchanged, soft children’s book lighting, steady camera',
  )
  const [pageText, setPageText] = useState('')
  const [pageTextSecondary, setPageTextSecondary] = useState('')
  const [lastOutputs, setLastOutputs] = useState(null)
  const [consent, setConsent] = useState(false)
  const [createForm, setCreateForm] = useState({
    title: 'Mein Bilderbuch',
    language: 'de',
    secondary_language: '',
    bilingual_layout: 'stacked',
    secondary_verified: false,
    trim_id: 'sq_85',
    page_count: 32,
    premise: '',
    emotional_core: '',
    refrain: '',
    format_id: 'picture',
    recommended_niche_id: '',
  })
  const [imageStatus, setImageStatus] = useState(null)
  const [falCatalogue, setFalCatalogue] = useState(null)
  const [falModels, setFalModels] = useState({ ...FAL_DEFAULTS })
  const [pairDraft, setPairDraft] = useState(null)
  const [signoffDraft, setSignoffDraft] = useState(() => emptyPublicationSignoff())

  useEffect(() => {
    let cancelled = false
    api('/v1/specs', { auth: false })
      .then((data) => {
        if (cancelled) return
        setImageStatus(data.image || null)
        const fal = data.fal || data.image?.fal || null
        setFalCatalogue(fal?.catalogue || null)
        if (data.image?.models) {
          setFalModels((prev) => ({
            generate: data.image.models.generate || prev.generate,
            img2img: data.image.models.img2img || prev.img2img,
            video: data.image.models.video || prev.video,
            upscale: data.image.models.upscale || prev.upscale,
          }))
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const prefs = active?.meta?.falModels
    if (prefs && typeof prefs === 'object') {
      setFalModels((prev) => ({ ...prev, ...prefs }))
    }
  }, [active?.id, active?.meta?.falModels])

  useEffect(() => {
    if (!active) {
      setPairDraft(null)
      return
    }
    setPairDraft({
      language: active.language || 'de',
      secondary_language: active.secondary_language || '',
      bilingual_layout: active.bilingual_layout || 'stacked',
      secondary_verified: Boolean(active.secondary_verified),
    })
  }, [
    active?.id,
    active?.language,
    active?.secondary_language,
    active?.bilingual_layout,
    active?.secondary_verified,
  ])

  useEffect(() => {
    if (!active) {
      setSignoffDraft(emptyPublicationSignoff())
      return
    }
    setSignoffDraft(normalizePublicationSignoff(active.publication_signoff))
  }, [active?.id, active?.publication_signoff])

  const syncedPrimary = active?.pages?.[pageIndex]?.text_content || ''
  const syncedSecondary = active?.pages?.[pageIndex]?.text_secondary || ''
  const syncedBrief = active?.pages?.[pageIndex]?.illustration_brief || ''
  useEffect(() => {
    setPageText(syncedPrimary)
    setPageTextSecondary(syncedSecondary)
    if (syncedBrief) setSceneBrief(syncedBrief)
  }, [active?.id, pageIndex, syncedPrimary, syncedSecondary, syncedBrief])

  const estimate = estimateBookCredits({ pages: createForm.page_count, characters: 1 })
  const step = active?.progress_step || 'story'
  const stepIdx = Math.max(0, STEPS.indexOf(step))
  const currentPage = active?.pages?.[pageIndex]
  const readiness = active
    ? assessPublicationReadiness(active, { signoff: signoffDraft })
    : null
  const readinessFromJob =
    lastOutputs?.readiness ||
    lastOutputs?.publication_readiness ||
    active?.meta?.last_readiness ||
    null
  const bilingualActive = Boolean(
    (pairDraft?.secondary_language || active?.secondary_language) &&
      (pairDraft?.secondary_language || active?.secondary_language) !==
        (pairDraft?.language || active?.language),
  )
  const ipLocked = Boolean(active?.ip_character?.locked_at)
  const heroPreview =
    lastOutputs?.assets?.find((a) => a.role === 'hero_frame')?.url ||
    active?.pinned_anchor?.heroUrl ||
    currentPage?.asset?.url
  const canvasText = active
    ? composeDisplayText(
        {
          page_index: pageIndex,
          text_content: pageText,
          text_secondary: pageTextSecondary,
        },
        {
          language: pairDraft?.language || active.language,
          secondary_language: pairDraft?.secondary_language || active.secondary_language || null,
          bilingual_layout: pairDraft?.bilingual_layout || active.bilingual_layout || 'stacked',
        },
      )
    : pageText

  function applyPreset(presetId) {
    const preset = LANGUAGE_PAIR_PRESETS.find(
      (p) => `${p.primary}-${p.secondary}` === presetId,
    )
    if (!preset) return
    setCreateForm((f) => ({
      ...f,
      language: preset.primary,
      secondary_language: preset.secondary,
    }))
  }

  function applyRecommendedNiche(nicheId) {
    const seed = applyStoryforgeNiche(nicheId)
    if (!seed) return
    setCreateForm((f) => ({
      ...f,
      title: seed.title || f.title,
      language: seed.language || f.language,
      secondary_language: seed.secondary_language || '',
      bilingual_layout: seed.bilingual_layout || f.bilingual_layout,
      page_count: seed.page_count || f.page_count,
      format_id: seed.format_id || f.format_id,
      emotional_core: seed.emotional_core || f.emotional_core,
      premise: seed.premise || f.premise,
      recommended_niche_id: seed.recommended_niche_id || nicheId,
    }))
    setStatus('Niche applied — review title & languages, then Create project')
  }

  async function createProject() {
    setBusy(true)
    setError('')
    try {
      const { recommended_niche_id, ...rest } = createForm
      const body = {
        ...rest,
        secondary_language: createForm.secondary_language || null,
        meta: {
          recommended_niche_id: recommended_niche_id || null,
          product_lane: 'bilingual_kids_hybrid',
        },
      }
      const { project } = await api('/v1/projects', {
        method: 'POST',
        body,
      })
      setProjects((p) => [project, ...p])
      await onSelectProject(project.id)
      setStatus(
        `Project created — ${formatLanguagePairLabel(project.language, project.secondary_language)}. Lock IP Character DNA, then Character Turbo`,
      )
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function saveLanguagePair() {
    if (!active || !pairDraft) return
    setBusy(true)
    setError('')
    try {
      const { project } = await api(`/v1/projects/${active.id}`, {
        method: 'PATCH',
        body: {
          language: pairDraft.language,
          secondary_language: pairDraft.secondary_language || null,
          bilingual_layout: pairDraft.bilingual_layout,
          secondary_verified: Boolean(pairDraft.secondary_verified),
        },
      })
      setProjects((list) => list.map((p) => (p.id === project.id ? project : p)))
      await onSelectProject(project.id)
      setStatus(`Languages saved — ${formatLanguagePairLabel(project.language, project.secondary_language)}`)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  function downloadArtifact(file, fallbackName) {
    if (!file) return
    const a = document.createElement('a')
    if (file.downloadPath || file.downloadUrl) {
      a.href = file.downloadPath || file.downloadUrl
      a.download = file.filename || fallbackName || 'export'
      a.rel = 'noopener'
      a.click()
      return
    }
    if (file.dataUrl) {
      a.href = file.dataUrl
      a.download = file.filename || fallbackName || 'export'
      a.click()
    }
  }

  async function seedBeats(overwrite = false) {
    if (!active) return
    setBusy(true)
    setError('')
    try {
      const res = await api(`/v1/projects/${active.id}/seed-beats`, {
        method: 'POST',
        body: { overwrite, refrain: active.refrain || createForm.refrain || undefined },
      })
      await onSelectProject(active.id)
      setStatus(
        `Seeded ${res.seeded} escalating page beats (${res.mode}) — edit briefs, then illustrate`,
      )
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function persistFalModels(next) {
    setFalModels(next)
    if (!active?.id) return
    try {
      const { project } = await api(`/v1/projects/${active.id}`, {
        method: 'PATCH',
        body: { meta: { ...(active.meta || {}), falModels: next } },
      })
      setProjects((list) => list.map((p) => (p.id === project.id ? project : p)))
      await onSelectProject(project.id)
    } catch (e) {
      setError(e.message)
    }
  }

  function modelInputs() {
    return {
      modelGenerate: falModels.generate,
      modelImg2img: falModels.img2img,
      modelVideo: falModels.video,
      modelUpscale: falModels.upscale,
    }
  }

  async function runJob(type, inputs = {}, { skipConfirm = false } = {}) {
    if (!active && type !== 'character_turbo') return
    const cost = CREDIT_COSTS[type] ?? 0
    if (cost > 0 && !skipConfirm) {
      const isExport = type.startsWith('export_')
      const ok = isExport
        ? confirmExportWithReadiness(`Run “${type}”`, cost)
        : window.confirm(`Run “${type}” for ${cost} credit(s)?`)
      if (!ok) return
    }
    setBusy(true)
    setError('')
    try {
      const res = await runAndWait(type, {
        projectId: active?.id,
        inputs: { ...modelInputs(), ...inputs },
      })
      setSession((s) => (s ? { ...s, credits: res.balance } : s))
      if (res.job.status === 'failed') {
        setError(res.job.error || 'Job failed')
        setStatus(`Failed: ${type}`)
      } else {
        setLastOutputs(res.job.outputs)
        const readinessOut = res.job.outputs?.readiness || res.job.outputs?.publication_readiness
        setStatus(
          `Done: ${type}${
            readinessOut?.score != null
              ? ` · readiness ${readinessOut.score}/100 (${readinessOut.levelLabel || readinessOut.level})`
              : ''
          }${
            res.job.outputs?.consistencyBadge
              ? ` · consistency ${res.job.outputs.consistencyBadge}`
              : ''
          }${
            res.job.outputs?.coverWrap
              ? ` · wrap ${Math.round(res.job.outputs.coverWrap.widthPx)}×${Math.round(res.job.outputs.coverWrap.heightPx)}px`
              : ''
          }${res.job.outputs?.pdf?.signed || res.job.outputs?.zip?.signed ? ' · signed download ready' : ''}`,
        )
        if (active?.id) await onSelectProject(active.id)
        downloadArtifact(res.job.outputs?.zip, `${type}.zip`)
        downloadArtifact(res.job.outputs?.pdf, `${type}.pdf`)
        downloadArtifact(res.job.outputs?.png, `${type}.png`)
      }
      return res
    } catch (e) {
      setError(e.message)
      return null
    } finally {
      setBusy(false)
    }
  }

  async function savePublicationSignoff(next) {
    if (!active) return
    const normalized = normalizePublicationSignoff(next)
    setSignoffDraft(normalized)
    setBusy(true)
    setError('')
    try {
      const res = await api(`/v1/projects/${active.id}`, {
        method: 'PATCH',
        body: { publication_signoff: normalized },
      })
      await onSelectProject(res.project?.id || active.id)
      setStatus('Publication sign-off saved (0 credits)')
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function toggleContinuityItem(itemId) {
    const next = normalizePublicationSignoff({
      ...signoffDraft,
      continuity: {
        ...signoffDraft.continuity,
        [itemId]: !signoffDraft.continuity[itemId],
      },
    })
    await savePublicationSignoff(next)
  }

  async function toggleKdpPreviewerReviewed() {
    const reviewed = !signoffDraft.kdp_previewer_reviewed
    await savePublicationSignoff({
      ...signoffDraft,
      kdp_previewer_reviewed: reviewed,
      kdp_previewer_reviewed_at: reviewed ? new Date().toISOString() : null,
    })
  }

  function confirmExportWithReadiness(actionLabel, cost) {
    const score = readiness?.score ?? 0
    const level = readiness?.levelLabel || readiness?.level || 'unknown'
    const blocks = readiness?.issues?.filter((i) => i.severity === 'block').length || 0
    let msg = `${actionLabel} for ${cost} credit(s)?\n\nPublication readiness: ${score}/100 (${level}).`
    if (blocks > 0) {
      msg += `\n\n⚠ ${blocks} blocking issue(s) remain. Export is still allowed — this score is a checklist, not Amazon approval.`
    } else if (score < 70) {
      msg += '\n\nScore is below “Almost ready”. Consider fixing print/copy/continuity first.'
    }
    msg += '\n\nAlways verify in the Amazon KDP Online Previewer before publishing.'
    return window.confirm(msg)
  }

  async function runFinishPack() {
    if (!active) return
    const total = CREDIT_COSTS.export_source_zip || 1
    if (!confirmExportWithReadiness('KDP finish pack (interior + cover + checklist ZIP)', total))
      return
    setBusy(true)
    setError('')
    try {
      const pack = await runAndWait('export_source_zip', {
        projectId: active.id,
        inputs: {
          trim_id: active.trim_id,
          page_count: active.page_count,
          paper_type: active.paper_type || 'white',
          blurb: active.premise || active.emotional_core || '',
        },
      })
      setSession((s) => (s ? { ...s, credits: pack.balance } : s))
      if (pack.job.status === 'failed') {
        setError(pack.job.error || 'Finish pack failed')
        return
      }
      downloadArtifact(pack.job.outputs?.zip, 'kdp-pack.zip')
      setLastOutputs(pack.job.outputs)
      const packScore = pack.job.outputs?.readiness?.score
      setStatus(
        `KDP pack ready — ZIP includes interior, cover, preflight, publication-readiness.json${
          packScore != null ? ` (score ${packScore})` : ''
        }, checklist. Verify in KDP Previewer.`,
      )
      await onSelectProject(active.id)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  function ModelSelect({ role, label, value }) {
    const options = falCatalogue?.[role] || []
    if (!options.length) return null
    return (
      <div className="sf-field">
        <label htmlFor={`fal-${role}`}>{label}</label>
        <select
          id={`fal-${role}`}
          value={value}
          onChange={(e) => persistFalModels({ ...falModels, [role]: e.target.value })}
        >
          {options.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
              {m.tier ? ` · ${m.tier}` : ''}
            </option>
          ))}
        </select>
        <p className="sf-muted" style={{ margin: '0.25rem 0 0', fontSize: '0.8rem' }}>
          {options.find((m) => m.id === value)?.note || ''}
        </p>
      </div>
    )
  }

  async function approvePin() {
    if (!active || !lastOutputs?.assets?.[0]) {
      setError('Generate Character Turbo first')
      return
    }
    setBusy(true)
    setError('')
    try {
      const hero = lastOutputs.assets.find((a) => a.role === 'hero_frame') || lastOutputs.assets[0]
      await api(`/v1/projects/${active.id}/pin`, {
        method: 'POST',
        body: {
          assetId: hero.assetId,
          heroUrl: hero.url,
          palette: lastOutputs.palette,
          embedding: lastOutputs.embedding,
          name: charName,
          engine,
        },
      })
      await onSelectProject(active.id)
      setStatus('Anchor pinned — Editor Pro will use this character')
      setToolTab('editor_pro')
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function savePageText() {
    if (!active) return
    setBusy(true)
    try {
      await api(`/v1/projects/${active.id}/pages/${pageIndex}`, {
        method: 'PATCH',
        body: {
          text_content: pageText,
          text_secondary: pageTextSecondary,
          illustration_brief: sceneBrief,
        },
      })
      await onSelectProject(active.id)
      setStatus(`Page ${pageIndex + 1} text saved (0 credits)`)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="sf-main">
      <aside className="sf-sidebar">
        <div className="sf-progress" aria-label="Project progress">
          {STEPS.map((id, i) => (
            <span key={id} className={`sf-step ${i === stepIdx ? 'sf-step-active' : ''}`}>
              {id}
            </span>
          ))}
        </div>

        <div className="sf-card" style={{ marginBottom: '0.75rem' }}>
          <h3 style={{ marginTop: 0, fontFamily: 'var(--sf-font-display)' }}>New book</h3>
          <p className="sf-muted" style={{ marginTop: 0, fontSize: '0.78rem' }}>
            Priority lane: bilingual African-language + EN/DE picture books. Parenting non-fiction →
            AuthorForge.
          </p>
          <div className="sf-field">
            <label>Recommended niches</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {STORYFORGE_NICHES.map((raw) => {
                const niche = storyforgeNicheLocalized(raw, 'en')
                const selected = createForm.recommended_niche_id === niche.seed?.recommended_niche_id &&
                  createForm.title === niche.seed?.title
                return (
                  <button
                    key={niche.id}
                    type="button"
                    className={selected ? 'sf-btn sf-btn-primary' : 'sf-btn'}
                    style={{ minHeight: 44, textAlign: 'left', whiteSpace: 'normal' }}
                    disabled={busy}
                    onClick={() => applyRecommendedNiche(niche.id)}
                  >
                    <strong>#{niche.priority}</strong> {niche.title}
                    <span className="sf-muted" style={{ display: 'block', fontSize: '0.72rem', marginTop: 2 }}>
                      {niche.angle}
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="sf-muted" style={{ margin: '0.4rem 0 0', fontSize: '0.7rem' }}>
              {STORYFORGE_MARKET_DISCLAIMER}
            </p>
          </div>
          <div className="sf-field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              value={createForm.title}
              onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div className="sf-field">
            <label htmlFor="pair-preset">Language pair preset</label>
            <select
              id="pair-preset"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) applyPreset(e.target.value)
              }}
            >
              <option value="">Custom — pick primary + secondary</option>
              {LANGUAGE_PAIR_PRESETS.map((p) => (
                <option key={`${p.primary}-${p.secondary}`} value={`${p.primary}-${p.secondary}`}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sf-grid-2">
            <div className="sf-field">
              <label htmlFor="lang">Primary language</label>
              <select
                id="lang"
                value={createForm.language}
                onChange={(e) => setCreateForm((f) => ({ ...f, language: e.target.value }))}
              >
                {STORY_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label} ({l.nativeLabel || l.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="sf-field">
              <label htmlFor="lang2">Secondary (optional)</label>
              <select
                id="lang2"
                value={createForm.secondary_language}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, secondary_language: e.target.value }))
                }
              >
                <option value="">None — monolingual</option>
                {STORY_LANGUAGES.filter((l) => l.code !== createForm.language).map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label} ({l.nativeLabel || l.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
          {createForm.secondary_language ? (
            <div className="sf-field">
              <label htmlFor="bilayout">Bilingual layout</label>
              <select
                id="bilayout"
                value={createForm.bilingual_layout}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, bilingual_layout: e.target.value }))
                }
              >
                {BILINGUAL_LAYOUTS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label} — {l.description}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <div className="sf-field">
            <label htmlFor="trim">Trim</label>
            <select
              id="trim"
              value={createForm.trim_id}
              onChange={(e) => setCreateForm((f) => ({ ...f, trim_id: e.target.value }))}
            >
              {PUBLISHING_SPECS.trimSizesInches.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sf-grid-2">
            <div className="sf-field">
              <label htmlFor="format">Format</label>
              <select
                id="format"
                value={createForm.format_id}
                onChange={(e) => setCreateForm((f) => ({ ...f, format_id: e.target.value }))}
              >
                {BOOK_FORMATS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.format} ({f.ageRange})
                  </option>
                ))}
              </select>
            </div>
            <div className="sf-field">
              <label htmlFor="pages">Pages</label>
              <select
                id="pages"
                value={createForm.page_count}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, page_count: Number(e.target.value) }))
                }
              >
                {[24, 32, 40].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="sf-field">
            <label htmlFor="core">Emotional core</label>
            <input
              id="core"
              value={createForm.emotional_core}
              onChange={(e) => setCreateForm((f) => ({ ...f, emotional_core: e.target.value }))}
              placeholder="e.g. belonging, courage — fuels theme-aware names"
            />
            <p className="sf-muted" style={{ margin: '0.25rem 0 0' }}>
              Used later to generate character names that relate to this book.
            </p>
          </div>
          <div className="sf-field">
            <label htmlFor="refrain">Refrain (optional)</label>
            <input
              id="refrain"
              value={createForm.refrain}
              onChange={(e) => setCreateForm((f) => ({ ...f, refrain: e.target.value }))}
              placeholder="e.g. I love you this much"
            />
          </div>
          <button
            type="button"
            className="sf-btn sf-btn-primary"
            onClick={createProject}
            disabled={busy}
            style={{ width: '100%' }}
          >
            Create project
          </button>
          <p className="sf-muted" style={{ marginBottom: 0 }}>
            ~{estimate.total} credits estimate for {createForm.page_count} pages
          </p>
        </div>

        <ul className="sf-list">
          {projects.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="sf-btn"
                onClick={() => onSelectProject(p.id)}
                disabled={busy}
              >
                {p.title}
                {p.pinned_anchor_asset_id ? ' · 📌' : ''}
              </button>
            </li>
          ))}
        </ul>

        <div className="sf-card" style={{ marginTop: '0.75rem' }}>
          <p className="sf-muted" style={{ marginTop: 0 }}>
            Credits: <strong>{session?.credits ?? '—'}</strong>
            {imageStatus ? (
              <>
                {' '}
                · API <strong>{imageStatus.provider}</strong>
                {imageStatus.ready ? ' ready' : ' (configure key)'}
              </>
            ) : null}
          </p>
          {readiness ? (
            <p className="sf-muted" style={{ marginTop: '0.35rem' }}>
              Readiness:{' '}
              <span className={`sf-badge sf-readiness-${readiness.level}`}>
                {readiness.score}/100 · {readiness.levelLabel}
              </span>
              <button
                type="button"
                className="sf-btn sf-btn-ghost"
                style={{ marginLeft: '0.35rem', minHeight: 44 }}
                disabled={busy || !active}
                onClick={() => setToolTab('canvas')}
              >
                Open Canvas
              </button>
            </p>
          ) : null}
          <button
            type="button"
            className="sf-btn"
            style={{ width: '100%' }}
            disabled={busy}
            onClick={async () => {
              setBusy(true)
              setError('')
              try {
                const res = await api('/v1/credits/grant', {
                  method: 'POST',
                  body: { amount: 100 },
                })
                setSession((s) => (s ? { ...s, credits: res.credits } : s))
                setStatus(`Granted +${res.granted} local credits (balance ${res.credits})`)
              } catch (e) {
                setError(e.message)
              } finally {
                setBusy(false)
              }
            }}
          >
            +100 local credits
          </button>
        </div>
        <p className="sf-disclaimer">{PUBLISHING_SPECS.disclaimers.notAffiliated}</p>
      </aside>

      <main className="sf-canvas-wrap">
        {error ? (
          <div className="sf-card" role="alert" style={{ borderColor: 'hsl(var(--sf-danger))' }}>
            {error}
          </div>
        ) : null}

        {!active ? (
          <div className="sf-card">
            <h2 style={{ marginTop: 0, fontFamily: 'var(--sf-font-display)' }}>
              Welcome to StoryForge
            </h2>
            <p className="sf-muted">
              General AI tools drift characters across pages. StoryForge pins one Character Turbo
              anchor, then every scene starts from that anchor — built for non-illustrators
              publishing to Amazon KDP.
            </p>
            <p className="sf-muted">
              You have {session?.credits ?? '—'} credits (trial {session?.trialCredits ?? 20}). Create
              a project to begin.
            </p>
          </div>
        ) : (
          <>
            <div className="sf-card">
              <h2 style={{ marginTop: 0, fontFamily: 'var(--sf-font-display)' }}>{active.title}</h2>
              <p className="sf-muted">
                {formatLanguagePairLabel(active.language, active.secondary_language)} · Trim{' '}
                {active.trim_id} · {active.page_count} pages ·{' '}
                {printReq
                  ? `print min ${printReq.widthPx}×${printReq.heightPx}px @ ${printReq.dpi} DPI`
                  : ''}{' '}
                · specs {PUBLISHING_SPECS.lastVerified}
              </p>
              {pairDraft ? (
                <div className="sf-bilingual-panel">
                  <h3 style={{ margin: '0.5rem 0 0.35rem', fontSize: '0.95rem' }}>
                    Languages
                  </h3>
                  <div className="sf-grid-2">
                    <div className="sf-field">
                      <label htmlFor="active-lang">Primary</label>
                      <select
                        id="active-lang"
                        value={pairDraft.language}
                        onChange={(e) =>
                          setPairDraft((d) => ({ ...d, language: e.target.value }))
                        }
                      >
                        {STORY_LANGUAGES.map((l) => (
                          <option key={l.code} value={l.code}>
                            {l.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sf-field">
                      <label htmlFor="active-lang2">Secondary</label>
                      <select
                        id="active-lang2"
                        value={pairDraft.secondary_language || ''}
                        onChange={(e) =>
                          setPairDraft((d) => ({ ...d, secondary_language: e.target.value }))
                        }
                      >
                        <option value="">None — monolingual</option>
                        {STORY_LANGUAGES.filter((l) => l.code !== pairDraft.language).map((l) => (
                          <option key={l.code} value={l.code}>
                            {l.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {pairDraft.secondary_language ? (
                    <>
                      <div className="sf-field">
                        <label htmlFor="active-layout">Layout</label>
                        <select
                          id="active-layout"
                          value={pairDraft.bilingual_layout}
                          onChange={(e) =>
                            setPairDraft((d) => ({ ...d, bilingual_layout: e.target.value }))
                          }
                        >
                          {BILINGUAL_LAYOUTS.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <label className="sf-check">
                        <input
                          type="checkbox"
                          checked={Boolean(pairDraft.secondary_verified)}
                          onChange={(e) =>
                            setPairDraft((d) => ({
                              ...d,
                              secondary_verified: e.target.checked,
                            }))
                          }
                        />
                        <span>
                          Secondary language reviewed by a fluent speaker (recommended before KDP)
                        </span>
                      </label>
                    </>
                  ) : null}
                  <button
                    type="button"
                    className="sf-btn"
                    disabled={busy}
                    onClick={saveLanguagePair}
                  >
                    Save languages
                  </button>
                </div>
              ) : null}
              {active.pinned_anchor ? (
                <div className="sf-anchor">
                  {active.pinned_anchor.heroUrl ? (
                    <img src={active.pinned_anchor.heroUrl} alt="Pinned anchor" />
                  ) : (
                    <Pin size={20} aria-hidden />
                  )}
                  <div>
                    <strong>Anchor pinned</strong>
                    <div className="sf-muted">
                      {active.pinned_anchor.name} · engine {active.pinned_anchor.engine}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="sf-warn-note">
                  {ipLocked
                    ? 'No anchor pinned yet — use Character Turbo, then Approve.'
                    : 'Lock IP Character Builder first, then Character Turbo → Approve.'}
                </p>
              )}
              <div className="sf-filmstrip" aria-label="Storyboard">
                {(active.pages || []).map((p) => (
                  <button
                    key={p.page_index}
                    type="button"
                    className={`sf-film ${pageIndex === p.page_index ? 'sf-film-active' : ''}`}
                    onClick={() => setPageIndex(p.page_index)}
                  >
                    {p.page_index + 1}
                    {p.consistencyBadge ? ` · ${p.consistencyBadge}` : ''}
                  </button>
                ))}
              </div>
              {status ? <p className="sf-status">{status}</p> : null}
            </div>

            <PageCanvas
              title={`Page ${pageIndex + 1}`}
              previewUrl={heroPreview}
              pageLabel={`Page ${pageIndex + 1}`}
              pageText={canvasText}
            />

            <div className="sf-card">
              <div className="sf-field">
                <label htmlFor="pagetext">
                  Primary text — {languageLabel(pairDraft?.language || active.language)} (0 credits)
                </label>
                <textarea
                  id="pagetext"
                  value={pageText}
                  onChange={(e) => setPageText(e.target.value)}
                  placeholder="Short text for this page…"
                />
              </div>
              {bilingualActive ? (
                <div className="sf-field">
                  <label htmlFor="pagetext2">
                    Secondary text —{' '}
                    {languageLabel(
                      pairDraft?.secondary_language || active.secondary_language,
                    )}{' '}
                    (0 credits)
                  </label>
                  <textarea
                    id="pagetext2"
                    value={pageTextSecondary}
                    onChange={(e) => setPageTextSecondary(e.target.value)}
                    placeholder="Translation / partner-language line for this page…"
                  />
                </div>
              ) : null}
              <div className="sf-btn-row">
                <button type="button" className="sf-btn" disabled={busy} onClick={savePageText}>
                  Save page text
                </button>
                <button
                  type="button"
                  className="sf-btn"
                  disabled={busy || !active}
                  onClick={() => seedBeats(false)}
                >
                  Seed escalating beats (empty only)
                </button>
                <button
                  type="button"
                  className="sf-btn"
                  disabled={busy || !active}
                  onClick={() => {
                    if (
                      window.confirm(
                        'Overwrite all page illustration briefs with escalating beat templates?',
                      )
                    )
                      seedBeats(true)
                  }}
                >
                  Reseed all beats
                </button>
              </div>
              <p className="sf-muted" style={{ marginBottom: 0 }}>
                Beats follow a meet → escalate → resolve arc (picture-book blueprint). Write final
                bilingual lines yourself; briefs guide Editor Pro scenes.
              </p>
            </div>
          </>
        )}
      </main>

      <aside className="sf-tools">
        <div className="sf-tabs" role="tablist">
          {['character_turbo', 'editor_pro', 'scene_to_video', 'canvas'].map((id) => (
            <button
              key={id}
              type="button"
              className={toolTab === id ? 'sf-tab-active' : ''}
              onClick={() => setToolTab(id)}
            >
              {NAMED_TOOLS[id]?.label || id}
            </button>
          ))}
        </div>

        {toolTab === 'character_turbo' ? (
          <>
            <div className="sf-card">
              {active ? (
                <IpCharacterBuilder
                  projectId={active.id}
                  initialDna={active.ip_character}
                  bookContext={{
                    title: active.title,
                    emotional_core: active.emotional_core,
                    premise: active.premise,
                    refrain: active.refrain,
                  }}
                  busy={busy}
                  setBusy={setBusy}
                  setError={setError}
                  setStatus={setStatus}
                  onBookContextSaved={async (patch) => {
                    const res = await api(`/v1/projects/${active.id}`, {
                      method: 'PATCH',
                      body: patch,
                    })
                    setProjects((list) =>
                      list.map((p) => (p.id === res.project.id ? res.project : p)),
                    )
                    await onSelectProject(res.project.id)
                    return res.project
                  }}
                  onLocked={(dna) => {
                    if (dna?.name) setCharName(dna.name)
                  }}
                  onProject={(project) => {
                    setProjects((list) => list.map((p) => (p.id === project.id ? project : p)))
                    if (project.ip_character?.name) setCharName(project.ip_character.name)
                    onSelectProject(project.id)
                  }}
                />
              ) : (
                <p className="sf-muted">Create a project to open the IP Character Builder.</p>
              )}
            </div>
            <div className="sf-card">
              <h3 style={{ marginTop: 0 }}>{NAMED_TOOLS.character_turbo.label}</h3>
              <p className="sf-muted">
                {NAMED_TOOLS.character_turbo.description} Runs only after IP DNA is locked — prompt
                uses your merch-ready colour, trait, object, and silhouette.
              </p>
              {!ipLocked ? (
                <p className="sf-warn-note">Lock IP Character DNA above before generating.</p>
              ) : null}
              <div className="sf-field">
                <label htmlFor="cname">Character name</label>
                <input
                  id="cname"
                  value={charName}
                  onChange={(e) => setCharName(e.target.value)}
                  disabled={!ipLocked}
                />
              </div>
              <div className="sf-field">
                <label htmlFor="engine">Engine</label>
                <select id="engine" value={engine} onChange={(e) => setEngine(e.target.value)}>
                  {CHARACTER_TURBO_ENGINES.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.label}
                      {e.default ? ' (default)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <ModelSelect role="generate" label="fal text→image model" value={falModels.generate} />
              <div className="sf-btn-row">
                <button
                  type="button"
                  className="sf-btn sf-btn-primary"
                  disabled={busy || !active || !ipLocked}
                  onClick={() =>
                    runJob('character_turbo', {
                      name: active?.ip_character?.name || charName,
                      engine,
                      quality: 'final',
                    })
                  }
                >
                  <Sparkles size={16} aria-hidden /> Generate ({CREDIT_COSTS.character_turbo})
                </button>
                <button
                  type="button"
                  className="sf-btn"
                  disabled={busy || !active || !lastOutputs}
                  onClick={approvePin}
                >
                  <Check size={16} aria-hidden /> Approve / pin
                </button>
              </div>
              <hr style={{ border: 0, borderTop: '1px solid hsl(var(--sf-border))', margin: '1rem 0' }} />
              <h4 style={{ marginBottom: '0.35rem' }}>{NAMED_TOOLS.photo_to_cartoon.label}</h4>
              <p className="sf-muted">
                Child photos require guardian consent. Raw photo bytes are never sent to the job API.
                Photos are not used for model training. Also requires locked IP DNA.
              </p>
              <label className="sf-check">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  I am the guardian / have authority; no model training; prefer delete after approval
                </span>
              </label>
              <button
                type="button"
                className="sf-btn"
                disabled={busy || !active || !consent || !ipLocked}
                onClick={async () => {
                  try {
                    await api(`/v1/projects/${active.id}/consent`, {
                      method: 'POST',
                      body: {
                        guardian_name: 'Guardian',
                        relationship: 'parent_or_guardian',
                        acknowledged_guardian: true,
                        acknowledged_no_model_training: true,
                      },
                    })
                    await runJob('photo_to_cartoon', {
                      name: active?.ip_character?.name || charName,
                      engine,
                      photoRef: 'client-transient-only',
                    })
                  } catch (e) {
                    setError(e.message)
                  }
                }}
              >
                Photo to Cartoon ({CREDIT_COSTS.photo_to_cartoon})
              </button>
            </div>
          </>
        ) : null}

        {toolTab === 'editor_pro' ? (
          <div className="sf-card">
            <h3 style={{ marginTop: 0 }}>{NAMED_TOOLS.editor_pro.label}</h3>
            <p className="sf-muted">{NAMED_TOOLS.editor_pro.description}</p>
            <ModelSelect role="img2img" label="fal Editor img2img model" value={falModels.img2img} />
            <div className="sf-field">
              <label htmlFor="brief">Scene brief</label>
              <textarea
                id="brief"
                value={sceneBrief}
                onChange={(e) => setSceneBrief(e.target.value)}
              />
            </div>
            <div className="sf-btn-row">
              <button
                type="button"
                className="sf-btn sf-btn-primary"
                disabled={busy || !active}
                onClick={() =>
                  runJob('editor_pro', {
                    brief: sceneBrief,
                    pageIndex,
                    characterName: charName,
                  })
                }
              >
                <Wand2 size={16} aria-hidden /> Generate scene ({CREDIT_COSTS.editor_pro})
              </button>
              <button
                type="button"
                className="sf-btn"
                disabled={busy || !active}
                onClick={() =>
                  runJob('story_scene_pro', {
                    brief: sceneBrief,
                    pageIndex,
                    characterName: charName,
                    secondCharacterName: 'Friend',
                  })
                }
              >
                Story Scene Pro ({CREDIT_COSTS.story_scene_pro})
              </button>
            </div>
            {currentPage?.consistencyBadge ? (
              <p className={`sf-badge sf-badge-${currentPage.consistencyBadge === 'pass' ? 'ok' : currentPage.consistencyBadge === 'fail' ? 'fail' : 'warn'}`}>
                Consistency: {currentPage.consistencyBadge}
              </p>
            ) : null}
          </div>
        ) : null}

        {toolTab === 'scene_to_video' ? (
          <div className="sf-card">
            <h3 style={{ marginTop: 0 }}>{NAMED_TOOLS.scene_to_video.label}</h3>
            <p className="sf-muted">{NAMED_TOOLS.scene_to_video.description}</p>
            <p className="sf-warn-note">
              Requires a generated page still (Editor Pro first). Real clips need{' '}
              <code>STORYFORGE_IMAGE_PROVIDER=fal</code> + <code>FAL_KEY</code>. Mock mode returns a
              poster only. Prefer Kling image→video for identity lock; Veo/Seedance are text-led.
            </p>
            <ModelSelect role="video" label="fal video model" value={falModels.video} />
            <div className="sf-field">
              <label htmlFor="motion">Motion prompt</label>
              <textarea
                id="motion"
                value={motionPrompt}
                onChange={(e) => setMotionPrompt(e.target.value)}
              />
            </div>
            <div className="sf-btn-row">
              <button
                type="button"
                className="sf-btn sf-btn-primary"
                disabled={busy || !active || !currentPage?.asset?.url}
                onClick={() =>
                  runJob('scene_to_video', {
                    pageIndex,
                    brief: sceneBrief,
                    prompt: motionPrompt,
                    duration: '5',
                    imageUrl: currentPage?.asset?.remoteUrl || currentPage?.asset?.url,
                  })
                }
              >
                <Clapperboard size={16} aria-hidden /> Animate page ({CREDIT_COSTS.scene_to_video})
              </button>
            </div>
            {currentPage?.video?.url ? (
              <div style={{ marginTop: '0.75rem' }}>
                <p className="sf-muted" style={{ marginBottom: '0.35rem' }}>
                  Last clip {currentPage.video.durationSec ? `(${currentPage.video.durationSec}s)` : ''}
                  {currentPage.video.placeholder ? ' · mock' : ''}
                </p>
                {String(currentPage.video.mime || '').startsWith('video/') ||
                /\.mp4(\?|$)/i.test(currentPage.video.url) ? (
                  <video
                    src={currentPage.video.url}
                    controls
                    playsInline
                    style={{ width: '100%', borderRadius: 8, background: '#000' }}
                  />
                ) : (
                  <img
                    src={currentPage.video.url}
                    alt="Video poster"
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                )}
              </div>
            ) : null}
            {imageStatus?.models?.video ? (
              <p className="sf-muted" style={{ marginTop: '0.75rem' }}>
                fal video model: {imageStatus.models.video}
              </p>
            ) : null}
          </div>
        ) : null}

        {toolTab === 'canvas' ? (
          <div className="sf-card">
            <h3 style={{ marginTop: 0 }}>{NAMED_TOOLS.canvas.label}</h3>
            <p className="sf-muted">{NAMED_TOOLS.canvas.description}</p>
            {imageStatus ? (
              <p
                className="sf-muted"
                style={{
                  marginBottom: '0.75rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: 8,
                  border: '1px solid hsl(var(--sf-border))',
                }}
              >
                Image API:{' '}
                <strong>{imageStatus.provider}</strong>
                {imageStatus.ready ? ' · ready' : ' · not configured'}
                {imageStatus.connectHint ? (
                  <span className="sf-warn-note" style={{ display: 'block', marginTop: 4 }}>
                    {imageStatus.connectHint}
                  </span>
                ) : (
                  <span style={{ display: 'block', marginTop: 4 }}>
                    Gen: {imageStatus.models?.generate}
                    {imageStatus.models?.img2img ? ` · Img2img: ${imageStatus.models.img2img}` : ''}
                    {imageStatus.models?.video ? ` · Video: ${imageStatus.models.video}` : ''}
                    {' · '}
                    Upscale 2.5× via {imageStatus.models?.upscale}
                  </span>
                )}
              </p>
            ) : null}
            {readiness ? (
              <div className="sf-readiness" aria-live="polite">
                <div className="sf-readiness-head">
                  <div>
                    <h3>
                      <ClipboardCheck size={18} aria-hidden /> Publication readiness
                    </h3>
                    <p className="sf-muted" style={{ margin: '0.25rem 0 0' }}>
                      Checklist measure — not a guarantee of Amazon acceptance.
                    </p>
                  </div>
                  <div
                    className={`sf-readiness-score sf-readiness-${readiness.level}`}
                    title={readiness.levelLabel}
                  >
                    <strong>{readiness.score}</strong>
                    <span>{readiness.levelLabel}</span>
                  </div>
                </div>
                <div className="sf-readiness-gates">
                  {['print', 'continuity', 'copy', 'human'].map((id) => {
                    const g = readiness.gates[id]
                    return (
                      <div key={id} className={`sf-readiness-gate sf-gate-${g.status}`}>
                        <div className="sf-readiness-gate-top">
                          <span>{id}</span>
                          <span>
                            {g.score}% · w{g.weight}
                          </span>
                        </div>
                        <div className="sf-readiness-bar">
                          <i style={{ width: `${g.score}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="sf-readiness-summary sf-muted">
                  Art {readiness.summary.pagesWithArt}/{readiness.summary.pages} · Text{' '}
                  {readiness.summary.pagesWithText}/{readiness.summary.pages} · Continuity{' '}
                  {readiness.summary.continuityChecked}/{readiness.summary.continuityTotal}
                  {readinessFromJob?.score != null
                    ? ` · Last saved score ${readinessFromJob.score}`
                    : ''}
                </div>
                {(readiness.issues.length > 0 || readiness.warnings.length > 0) && (
                  <ul className="sf-readiness-findings">
                    {readiness.issues.slice(0, 6).map((f, i) => (
                      <li key={`i-${i}`} className="sf-find-block">
                        [{f.gate}] {f.message}
                      </li>
                    ))}
                    {readiness.warnings.slice(0, 4).map((f, i) => (
                      <li key={`w-${i}`} className="sf-find-warn">
                        [{f.gate}] {f.message}
                      </li>
                    ))}
                  </ul>
                )}
                <details className="sf-readiness-details">
                  <summary>Human continuity QC ({CONTINUITY_SIGNOFF_ITEMS.length})</summary>
                  <div className="sf-readiness-checks">
                    {CONTINUITY_SIGNOFF_ITEMS.map((item) => (
                      <label key={item.id} className="sf-check-row">
                        <input
                          type="checkbox"
                          checked={Boolean(signoffDraft.continuity[item.id])}
                          disabled={busy || !active}
                          onChange={() => toggleContinuityItem(item.id)}
                        />
                        <span>
                          <small className="sf-muted">{item.passTitle}</small>
                          <br />
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </details>
                <label className="sf-check-row sf-check-row-primary">
                  <input
                    type="checkbox"
                    checked={Boolean(signoffDraft.kdp_previewer_reviewed)}
                    disabled={busy || !active}
                    onChange={() => toggleKdpPreviewerReviewed()}
                  />
                  <span>
                    I reviewed this book in the Amazon KDP Online Previewer
                    {signoffDraft.kdp_previewer_reviewed_at ? (
                      <small className="sf-muted">
                        {' '}
                        · {new Date(signoffDraft.kdp_previewer_reviewed_at).toLocaleString()}
                      </small>
                    ) : null}
                  </span>
                </label>
                <div className="sf-btn-row">
                  <button
                    type="button"
                    className="sf-btn"
                    disabled={busy || !active}
                    onClick={() =>
                      runJob('publication_readiness', {
                        publication_signoff: signoffDraft,
                      })
                    }
                  >
                    <ClipboardCheck size={16} aria-hidden /> Save &amp; score (0)
                  </button>
                </div>
              </div>
            ) : null}

            <div className="sf-btn-row">
              <button
                type="button"
                className="sf-btn"
                disabled={busy || !active || !currentPage?.asset?.url}
                onClick={() =>
                  runJob('upscale_print', {
                    pageIndex,
                    scaleFactor: 2.5,
                    imageUrl: currentPage?.asset?.url,
                  })
                }
              >
                <ZoomIn size={16} aria-hidden /> 2.5× print upscale (
                {CREDIT_COSTS.upscale_print})
              </button>
              <button
                type="button"
                className="sf-btn"
                disabled={busy || !active}
                onClick={() => runJob('preflight', { trim_id: active.trim_id })}
              >
                <BookOpen size={16} aria-hidden /> Preflight (0)
              </button>
              <button
                type="button"
                className="sf-btn sf-btn-primary"
                disabled={busy || !active}
                onClick={() =>
                  runJob('export_interior_pdf', {
                    trim_id: active.trim_id,
                    page_count: active.page_count,
                  })
                }
              >
                <FileOutput size={16} aria-hidden /> Export interior (
                {CREDIT_COSTS.export_interior_pdf})
              </button>
              <button
                type="button"
                className="sf-btn sf-btn-primary"
                disabled={busy || !active}
                onClick={() =>
                  runJob('export_cover_pdf', {
                    trim_id: active.trim_id,
                    page_count: active.page_count,
                    paper_type: active.paper_type || 'white',
                    blurb: active.premise || active.emotional_core || '',
                  })
                }
              >
                <FileOutput size={16} aria-hidden /> Export cover wrap (
                {CREDIT_COSTS.export_cover_pdf})
              </button>
              <button
                type="button"
                className="sf-btn"
                disabled={busy || !active}
                onClick={() =>
                  runJob('export_source_zip', {
                    trim_id: active.trim_id,
                    page_count: active.page_count,
                    paper_type: active.paper_type || 'white',
                    blurb: active.premise || active.emotional_core || '',
                  })
                }
              >
                <Package size={16} aria-hidden /> KDP ZIP pack (
                {CREDIT_COSTS.export_source_zip})
              </button>
              <button
                type="button"
                className="sf-btn sf-btn-primary"
                disabled={busy || !active}
                onClick={runFinishPack}
              >
                <Package size={16} aria-hidden /> Finish pack (
                {CREDIT_COSTS.export_source_zip})
              </button>
              <button
                type="button"
                className="sf-btn sf-btn-primary"
                disabled={busy || !active || !active?.pinned_anchor?.heroUrl}
                onClick={async () => {
                  const res = await runJob('export_merch_png', { background: 'transparent' })
                  downloadArtifact(
                    res?.job?.outputs?.png,
                    `${active?.ip_character?.name || 'character'}-merch.png`,
                  )
                }}
              >
                <FileOutput size={16} aria-hidden /> Merch PNG (
                {CREDIT_COSTS.export_merch_png})
              </button>
            </div>
            <ModelSelect role="upscale" label="fal upscale model" value={falModels.upscale} />
            <p className="sf-muted">
              Print pipeline: readiness score → 2.5× upscale → interior PDF + cover wrap → signed ZIP
              (preflight + publication-readiness.json + checklist + manuscript). Merch PNG = pinned
              hero on Merch canvas. Always re-check in the Amazon KDP Previewer — no tool certifies
              100% publication perfection.
            </p>
          </div>
        ) : null}
      </aside>
    </div>
  )
}
