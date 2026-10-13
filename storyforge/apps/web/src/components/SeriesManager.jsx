import { useCallback, useEffect, useState } from 'react'
import { Layers, RefreshCw, Link2 } from 'lucide-react'
import { emptyIpCharacter, NAMED_TOOLS, SERIES_META } from '@storyforge/shared'
import { api } from '../lib/api.js'

/**
 * Catalog of books sharing an IP Character seriesId (S74).
 * Assign series id on the active book, open titles, reuse locked DNA.
 */
export default function SeriesManager({
  project,
  busy,
  setBusy,
  setError,
  setStatus,
  onOpenProject,
  onProjectUpdated,
  refreshKey = 0,
}) {
  const [catalog, setCatalog] = useState({ series: [], meta: SERIES_META })
  const [loading, setLoading] = useState(false)
  const [seriesDraft, setSeriesDraft] = useState(() => project?.ip_character?.seriesId || '')
  const [heroes, setHeroes] = useState([])
  const [heroesSeriesId, setHeroesSeriesId] = useState('')

  useEffect(() => {
    setSeriesDraft(project?.ip_character?.seriesId || '')
  }, [project?.id, project?.ip_character?.seriesId])

  const load = useCallback(async () => {
    setLoading(true)
    setError?.('')
    try {
      const res = await api('/v1/series')
      setCatalog({
        series: res.series || [],
        meta: res.meta || SERIES_META,
      })
      setStatus?.(
        res.series?.length
          ? `${res.series.length} series · ${res.series.reduce((n, s) => n + (s.bookCount || 0), 0)} books`
          : 'No series yet — set a Series id on this book or in IP Character Builder',
      )
    } catch (e) {
      setError?.(e.message || 'Failed to load series')
    } finally {
      setLoading(false)
    }
  }, [setError, setStatus])

  useEffect(() => {
    load()
  }, [load, refreshKey])

  async function applySeriesId() {
    if (!project?.id) {
      setError?.('Open a project first')
      return
    }
    const sid = String(seriesDraft || '').trim()
    setBusy?.(true)
    setError?.('')
    try {
      const base = { ...emptyIpCharacter(), ...(project.ip_character || {}) }
      const res = await api(`/v1/projects/${project.id}/ip-character`, {
        method: 'PUT',
        body: { ...base, seriesId: sid },
      })
      onProjectUpdated?.(res.project)
      setStatus?.(
        sid
          ? `Series id “${sid}” saved on “${res.project.title}”`
          : `Series id cleared on “${res.project.title}”`,
      )
      await load()
    } catch (e) {
      setError?.(e.message || 'Failed to save series id')
    } finally {
      setBusy?.(false)
    }
  }

  async function loadHeroes(seriesId) {
    const sid = String(seriesId || '').trim()
    if (!sid) return
    setBusy?.(true)
    setError?.('')
    try {
      const res = await api(`/v1/series/${encodeURIComponent(sid)}/ip-dna`)
      setHeroes(res.heroes || [])
      setHeroesSeriesId(sid)
      setStatus?.(
        res.heroes?.length
          ? `${res.heroes.length} locked hero(es) in “${sid}”`
          : `No locked heroes yet for “${sid}”`,
      )
    } catch (e) {
      setError?.(e.message || 'Failed to load series heroes')
    } finally {
      setBusy?.(false)
    }
  }

  async function reuseHero(hero) {
    if (!project?.id || !hero?.ip_character) return
    if (project.ip_character?.locked_at) {
      setError?.('Unlock IP DNA on this book before reusing a series hero')
      return
    }
    setBusy?.(true)
    setError?.('')
    try {
      const dna = {
        ...emptyIpCharacter(),
        ...hero.ip_character,
        seriesId: hero.ip_character.seriesId || heroesSeriesId,
        locked_at: null,
      }
      delete dna.locked_at
      const res = await api(`/v1/projects/${project.id}/ip-character`, {
        method: 'PUT',
        body: { ...dna, unlock: true },
      })
      onProjectUpdated?.(res.project)
      setStatus?.(`Copied DNA from “${hero.title}” — review & lock in Character Turbo`)
    } catch (e) {
      setError?.(e.message || 'Failed to reuse hero DNA')
    } finally {
      setBusy?.(false)
    }
  }

  return (
    <section className="sf-card sf-series-manager" aria-labelledby="series-manager-heading">
      <header className="sf-card-head">
        <h3 id="series-manager-heading" style={{ marginTop: 0 }}>
          <Layers size={16} aria-hidden /> {NAMED_TOOLS.series_manager?.label || SERIES_META.title}
        </h3>
        <p className="sf-muted">{NAMED_TOOLS.series_manager?.description}</p>
      </header>

      <div className="sf-series-assign">
        <label htmlFor="sf-series-draft">
          Series id for this book
          <input
            id="sf-series-draft"
            type="text"
            value={seriesDraft}
            disabled={busy || !project}
            maxLength={64}
            placeholder="e.g. kofi-adventures"
            onChange={(e) => setSeriesDraft(e.target.value)}
          />
        </label>
        <div className="sf-btn-row">
          <button
            type="button"
            className="sf-btn sf-btn-primary"
            disabled={busy || !project}
            onClick={applySeriesId}
          >
            <Link2 size={16} aria-hidden /> Save series id
          </button>
          <button
            type="button"
            className="sf-btn"
            disabled={busy || loading}
            onClick={() => {
              setBusy?.(true)
              load().finally(() => setBusy?.(false))
            }}
          >
            <RefreshCw size={16} aria-hidden /> Refresh catalog
          </button>
        </div>
        {!project ? (
          <p className="sf-muted">Select or create a project to assign a series id.</p>
        ) : null}
      </div>

      {!catalog.series.length ? (
        <p className="sf-muted">
          Save the same Series id on multiple books to group them here. Lock IP DNA to reuse heroes
          across titles.
        </p>
      ) : (
        <ul className="sf-series-list">
          {catalog.series.map((s) => (
            <li key={s.seriesId} className="sf-series-card">
              <div className="sf-series-card-head">
                <strong>{s.seriesId}</strong>
                <span className="sf-muted">
                  {s.bookCount} book{s.bookCount === 1 ? '' : 's'} · {s.lockedHeroes} locked ·{' '}
                  {s.pinnedAnchors} pinned
                </span>
              </div>
              <div className="sf-btn-row">
                <button
                  type="button"
                  className="sf-btn"
                  disabled={busy}
                  onClick={() => {
                    setSeriesDraft(s.seriesId)
                    loadHeroes(s.seriesId)
                  }}
                >
                  Find locked heroes
                </button>
                {project ? (
                  <button
                    type="button"
                    className="sf-btn"
                    disabled={busy}
                    onClick={() => {
                      setSeriesDraft(s.seriesId)
                    }}
                  >
                    Use id on this book
                  </button>
                ) : null}
              </div>
              <ul className="sf-series-books">
                {s.books.map((b) => (
                  <li key={b.projectId}>
                    <button
                      type="button"
                      className="sf-btn sf-series-book-btn"
                      disabled={busy}
                      onClick={() => onOpenProject?.(b.projectId)}
                    >
                      <span className="sf-series-book-title">{b.title}</span>
                      <span className="sf-muted">
                        {b.progress_step || 'story'}
                        {b.characterName ? ` · ${b.characterName}` : ''}
                        {b.ip_locked ? ' · DNA locked' : ''}
                        {b.pinned ? ' · pinned' : ''}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}

      {heroesSeriesId ? (
        <div className="sf-series-heroes">
          <h4 style={{ marginBottom: '0.35rem' }}>Locked heroes · {heroesSeriesId}</h4>
          {!heroes.length ? (
            <p className="sf-muted">No locked DNA yet — lock a hero in Character Turbo first.</p>
          ) : (
            <ul className="sf-series-books">
              {heroes.map((h) => (
                <li key={h.projectId}>
                  <div className="sf-btn-row" style={{ flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="sf-btn"
                      disabled={busy}
                      onClick={() => onOpenProject?.(h.projectId)}
                    >
                      Open {h.title}
                    </button>
                    <button
                      type="button"
                      className="sf-btn sf-btn-primary"
                      disabled={busy || !project || project.id === h.projectId}
                      onClick={() => reuseHero(h)}
                      title={
                        project?.ip_character?.locked_at
                          ? 'Unlock this book’s DNA first'
                          : 'Copy DNA into the open book'
                      }
                    >
                      Reuse DNA on this book
                    </button>
                  </div>
                  <p className="sf-muted" style={{ margin: '0.25rem 0 0.5rem' }}>
                    {h.ip_character?.name || h.pinned_anchor?.name || 'Hero'}
                    {h.pinned_anchor?.heroUrl ? ' · pinned art available' : ''}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      <p className="sf-muted">{catalog.meta?.disclaimer || SERIES_META.disclaimer}</p>
    </section>
  )
}
