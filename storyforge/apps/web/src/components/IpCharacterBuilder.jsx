import { useEffect, useMemo, useState } from 'react'
import {
  IP_SIGNATURE_COLORS,
  IP_EMOTIONAL_HOOKS,
  IP_NAME_SUGGESTIONS,
  MERCH_READY_CHECKS,
  emptyIpCharacter,
  assessCharacterName,
  IP_CHARACTER_META,
} from '@storyforge/shared'
import { api } from '../lib/api.js'

/** Merch-ready DNA gate — must lock before Character Turbo. */
export default function IpCharacterBuilder({
  projectId,
  initialDna,
  busy,
  setBusy,
  setError,
  setStatus,
  onLocked,
  onProject,
}) {
  const [dna, setDna] = useState(() => emptyIpCharacter(initialDna || {}))
  const [seriesHits, setSeriesHits] = useState([])
  const locked = Boolean(dna.locked_at)
  const nameCoach = useMemo(() => assessCharacterName(dna.name), [dna.name])

  useEffect(() => {
    setDna(emptyIpCharacter(initialDna || {}))
  }, [projectId, initialDna?.updated_at, initialDna?.locked_at])

  function patch(field, value) {
    setDna((d) => ({ ...d, [field]: value }))
  }

  function toggleCheck(id) {
    setDna((d) => ({
      ...d,
      merchChecks: { ...d.merchChecks, [id]: !d.merchChecks?.[id] },
    }))
  }

  async function saveDraft() {
    if (!projectId) return
    setBusy(true)
    setError('')
    try {
      const res = await api(`/v1/projects/${projectId}/ip-character`, {
        method: 'PUT',
        body: { ...dna, unlock: false },
      })
      setDna(emptyIpCharacter(res.ip_character || {}))
      onProject?.(res.project)
      setStatus('IP Character DNA saved (draft)')
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function lockDna() {
    if (!projectId) return
    setBusy(true)
    setError('')
    try {
      await api(`/v1/projects/${projectId}/ip-character`, {
        method: 'PUT',
        body: { ...dna },
      })
      const res = await api(`/v1/projects/${projectId}/ip-character/lock`, {
        method: 'POST',
        body: {},
      })
      setDna(emptyIpCharacter(res.ip_character || {}))
      onProject?.(res.project)
      onLocked?.(res.ip_character)
      setStatus(`IP DNA locked — ${res.ip_character?.name}. Character Turbo unlocked.`)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function unlockDna() {
    if (!projectId) return
    if (
      !window.confirm(
        'Unlock DNA? You must re-lock before Character Turbo. Existing pinned anchors stay until you regenerate.',
      )
    )
      return
    setBusy(true)
    setError('')
    try {
      const res = await api(`/v1/projects/${projectId}/ip-character`, {
        method: 'PUT',
        body: { ...dna, unlock: true, locked_at: null },
      })
      setDna(emptyIpCharacter({ ...res.ip_character, locked_at: null }))
      onProject?.(res.project)
      setStatus('IP DNA unlocked — edit and lock again before Turbo')
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="sf-ip-builder">
      <h3 style={{ marginTop: 0 }}>{IP_CHARACTER_META.title}</h3>
      <p className="sf-muted">{IP_CHARACTER_META.note}</p>
      <p className="sf-warn-note">{IP_CHARACTER_META.disclaimer}</p>

      {locked ? (
        <p className="sf-status" role="status">
          Locked: <strong>{dna.name}</strong> · {dna.signatureColor} · {dna.definingTrait} ·{' '}
          {dna.signatureObject}
        </p>
      ) : (
        <p className="sf-warn-note">Lock DNA before Character Turbo can run.</p>
      )}

      <fieldset disabled={locked || busy} className="sf-ip-fieldset">
        <div className="sf-field">
          <label htmlFor="ip-name">Name (1–2 syllables)</label>
          <input
            id="ip-name"
            value={dna.name}
            onChange={(e) => patch('name', e.target.value)}
            placeholder="e.g. Kofi, Ama, Luna"
          />
          <p className="sf-muted" style={{ margin: '0.25rem 0 0' }}>
            Coach: {nameCoach.tips[0] || '—'}
            {nameCoach.syllables ? ` · ~${nameCoach.syllables} syllable(s) · score ${nameCoach.score}` : ''}
          </p>
          <div className="sf-chip-row" role="list" aria-label="Name suggestions">
            {IP_NAME_SUGGESTIONS.map((s) => (
              <button
                key={s.name}
                type="button"
                className="sf-chip"
                title={s.note}
                onClick={() => patch('name', s.name)}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="sf-grid-2">
          <div className="sf-field">
            <label htmlFor="ip-color">Signature colour</label>
            <select
              id="ip-color"
              value={dna.signatureColor}
              onChange={(e) => patch('signatureColor', e.target.value)}
            >
              {IP_SIGNATURE_COLORS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sf-field">
            <label htmlFor="ip-hook">Emotional hook</label>
            <select
              id="ip-hook"
              value={dna.emotionalHook}
              onChange={(e) => patch('emotionalHook', e.target.value)}
            >
              {IP_EMOTIONAL_HOOKS.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sf-field">
          <label htmlFor="ip-trait">Defining trait (one)</label>
          <input
            id="ip-trait"
            value={dna.definingTrait}
            onChange={(e) => patch('definingTrait', e.target.value)}
            placeholder="e.g. brave helper, curious singer"
          />
        </div>
        <div className="sf-field">
          <label htmlFor="ip-object">Signature object (one)</label>
          <input
            id="ip-object"
            value={dna.signatureObject}
            onChange={(e) => patch('signatureObject', e.target.value)}
            placeholder="e.g. yellow backpack, small drum"
          />
        </div>
        <div className="sf-field">
          <label htmlFor="ip-sil">Silhouette note</label>
          <textarea
            id="ip-sil"
            value={dna.silhouetteNote}
            onChange={(e) => patch('silhouetteNote', e.target.value)}
            placeholder="Big shapes only — how it reads as a black outline"
          />
        </div>
        <div className="sf-field">
          <label htmlFor="ip-culture">Cultural enrichment (optional)</label>
          <input
            id="ip-culture"
            value={dna.culturalEnrichment}
            onChange={(e) => patch('culturalEnrichment', e.target.value)}
            placeholder="e.g. kente scarf accent — enrichment, not the only hook"
          />
        </div>
        <div className="sf-grid-2">
          <div className="sf-field">
            <label htmlFor="ip-age">Age band</label>
            <input
              id="ip-age"
              value={dna.ageBand}
              onChange={(e) => patch('ageBand', e.target.value)}
              placeholder="3–7"
            />
          </div>
          <div className="sf-field">
            <label htmlFor="ip-series">Series id</label>
            <input
              id="ip-series"
              value={dna.seriesId}
              onChange={(e) => patch('seriesId', e.target.value)}
              placeholder="e.g. kofi-adventures"
            />
          </div>
        </div>
        <div className="sf-btn-row">
          <button
            type="button"
            className="sf-btn"
            disabled={busy || !dna.seriesId}
            onClick={async () => {
              setBusy(true)
              setError('')
              try {
                const res = await api(
                  `/v1/series/${encodeURIComponent(dna.seriesId.trim())}/ip-dna`,
                )
                setSeriesHits(res.heroes || [])
                setStatus(
                  res.heroes?.length
                    ? `Found ${res.heroes.length} locked hero(es) in series “${dna.seriesId}”`
                    : `No locked heroes yet for series “${dna.seriesId}”`,
                )
              } catch (e) {
                setError(e.message)
              } finally {
                setBusy(false)
              }
            }}
          >
            Find series heroes
          </button>
        </div>
        {seriesHits.length ? (
          <ul className="sf-list" style={{ marginTop: '0.5rem' }}>
            {seriesHits.map((h) => (
              <li key={h.projectId}>
                <button
                  type="button"
                  className="sf-btn"
                  disabled={locked || busy}
                  onClick={() => {
                    const src = h.ip_character || {}
                    setDna(
                      emptyIpCharacter({
                        ...src,
                        locked_at: null,
                        seriesId: src.seriesId || dna.seriesId,
                      }),
                    )
                    setStatus(`Loaded DNA from “${h.title}” — review checks, then Lock`)
                  }}
                >
                  Reuse {h.ip_character?.name || 'hero'} from {h.title}
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <h4 style={{ margin: '0.75rem 0 0.35rem', fontSize: '0.9rem' }}>Merch-ready checks</h4>
        {MERCH_READY_CHECKS.map((c) => (
          <label key={c.id} className="sf-check">
            <input
              type="checkbox"
              checked={Boolean(dna.merchChecks?.[c.id])}
              onChange={() => toggleCheck(c.id)}
            />
            <span>
              <strong>{c.label}</strong> — {c.description}
            </span>
          </label>
        ))}
      </fieldset>

      <div className="sf-btn-row" style={{ marginTop: '0.75rem' }}>
        {!locked ? (
          <>
            <button type="button" className="sf-btn" disabled={busy || !projectId} onClick={saveDraft}>
              Save draft
            </button>
            <button
              type="button"
              className="sf-btn sf-btn-primary"
              disabled={busy || !projectId}
              onClick={lockDna}
            >
              Lock DNA
            </button>
          </>
        ) : (
          <button type="button" className="sf-btn" disabled={busy} onClick={unlockDna}>
            Unlock to edit
          </button>
        )}
      </div>
    </div>
  )
}
