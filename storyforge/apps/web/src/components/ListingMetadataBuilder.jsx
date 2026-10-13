import { useEffect, useState } from 'react'
import { Copy, RefreshCw, Save } from 'lucide-react'
import {
  LISTING_METADATA_META,
  NAMED_TOOLS,
  buildListingMetadata,
  composeListingMetadataPlain,
  keywordsForForm,
  normalizeListingMetadata,
} from '@storyforge/shared'

/**
 * KDP listing metadata — subtitle, age range, ≤7 keywords, category ideas.
 */
export default function ListingMetadataBuilder({
  project,
  busy,
  setBusy,
  setError,
  setStatus,
  onSaved,
}) {
  const [meta, setMeta] = useState(() => normalizeListingMetadata(project?.listing_metadata))

  useEffect(() => {
    setMeta(normalizeListingMetadata(project?.listing_metadata))
  }, [project?.id, project?.listing_metadata?.updated_at])

  const characterName =
    project?.ip_character?.name || project?.pinned_anchor?.name || 'Hero'
  const lang = project?.language === 'de' ? 'de' : 'en'
  const keywords = keywordsForForm(meta.keywords)

  function rebuild() {
    const built = buildListingMetadata({
      title: project?.title || '',
      characterName,
      emotionalCore: project?.emotional_core || 'courage',
      premise: project?.premise || '',
      formatId: project?.format_id || 'picture',
      language: lang,
      secondaryLanguage: project?.secondary_language || null,
    })
    const next = normalizeListingMetadata({
      ...built,
      plain: composeListingMetadataPlain(built),
      updated_at: new Date().toISOString(),
    })
    setMeta(next)
    setStatus('KDP metadata draft rebuilt from story facts (0 credits)')
  }

  function setKeyword(index, value) {
    const next = [...keywords]
    next[index] = value
    const draft = {
      ...meta,
      keywords: next,
    }
    setMeta(
      normalizeListingMetadata({
        ...draft,
        plain: composeListingMetadataPlain({
          ...draft,
          keywords: next.filter((k) => String(k || '').trim()),
        }),
      }),
    )
  }

  function patchField(key, value) {
    const draft = { ...meta, [key]: value }
    setMeta(
      normalizeListingMetadata({
        ...draft,
        plain: composeListingMetadataPlain({
          ...draft,
          keywords: keywordsForForm(draft.keywords).filter((k) => String(k || '').trim()),
        }),
      }),
    )
  }

  async function save() {
    if (!project?.id || !onSaved) return
    setBusy(true)
    setError('')
    try {
      const payload = normalizeListingMetadata({
        ...meta,
        title: project?.title || meta.title,
        updated_at: new Date().toISOString(),
      })
      payload.plain = composeListingMetadataPlain({
        ...payload,
        keywords: keywordsForForm(payload.keywords).filter((k) => String(k || '').trim()),
      })
      await onSaved(payload)
      setMeta(payload)
      setStatus('KDP metadata saved (0 credits) — paste keywords into Amazon listing')
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function copyPlain() {
    try {
      await navigator.clipboard.writeText(meta.plain || '')
      setStatus('Listing metadata copied')
    } catch {
      setError('Could not copy — select the text manually')
    }
  }

  async function copyKeywords() {
    const list = keywordsForForm(meta.keywords)
      .map((k) => String(k || '').trim())
      .filter(Boolean)
    try {
      await navigator.clipboard.writeText(list.join('\n'))
      setStatus(`Copied ${list.length} keywords (one per line)`)
    } catch {
      setError('Could not copy keywords')
    }
  }

  return (
    <div className="sf-listing-meta">
      <div className="sf-compliance-head">
        <h3 style={{ margin: 0 }}>{NAMED_TOOLS.listing_metadata?.label || 'KDP metadata'}</h3>
      </div>
      <p className="sf-muted" style={{ marginTop: '0.35rem' }}>
        {LISTING_METADATA_META.disclaimer}
      </p>
      <p className="sf-muted" style={{ fontSize: '0.8rem' }}>
        Uses: <strong>{characterName}</strong>
        {project?.emotional_core ? ` · core “${project.emotional_core}”` : ''}
        {project?.format_id ? ` · ${project.format_id}` : ''} · lang {lang}
      </p>

      <div className="sf-btn-row">
        <button type="button" className="sf-btn sf-btn-primary" disabled={busy} onClick={rebuild}>
          <RefreshCw size={16} aria-hidden /> Build from story facts (0)
        </button>
        <button type="button" className="sf-btn" disabled={busy} onClick={save}>
          <Save size={16} aria-hidden /> Save
        </button>
        <button type="button" className="sf-btn" disabled={busy || !meta.plain} onClick={copyPlain}>
          <Copy size={16} aria-hidden /> Copy all
        </button>
        <button type="button" className="sf-btn" disabled={busy} onClick={copyKeywords}>
          <Copy size={16} aria-hidden /> Copy keywords
        </button>
      </div>

      <div className="sf-field">
        <label htmlFor="meta-subtitle">Subtitle (optional on KDP)</label>
        <input
          id="meta-subtitle"
          value={meta.subtitle || ''}
          disabled={busy}
          maxLength={200}
          onChange={(e) => patchField('subtitle', e.target.value)}
        />
      </div>

      <div className="sf-field">
        <label htmlFor="meta-ages">Age range</label>
        <input
          id="meta-ages"
          value={meta.age_range || ''}
          disabled={busy}
          maxLength={32}
          onChange={(e) => patchField('age_range', e.target.value)}
        />
      </div>

      <fieldset className="sf-listing-keywords">
        <legend>Backend keywords (max {LISTING_METADATA_META.keywordMax})</legend>
        <p className="sf-muted" style={{ fontSize: '0.8rem', marginTop: 0 }}>
          Prefer phrases shoppers type. No competitor brands. No temporary claims.
        </p>
        {keywords.map((kw, i) => (
          <div key={`kw-${i}`} className="sf-field">
            <label htmlFor={`meta-kw-${i}`}>Keyword {i + 1}</label>
            <input
              id={`meta-kw-${i}`}
              value={kw}
              disabled={busy}
              maxLength={LISTING_METADATA_META.keywordMaxChars}
              onChange={(e) => setKeyword(i, e.target.value)}
            />
          </div>
        ))}
      </fieldset>

      <div className="sf-field">
        <label>Category ideas (verify in KDP)</label>
        <ul className="sf-category-list">
          {(meta.categories || []).map((c) => (
            <li key={c.id || c.label}>{c.label}</li>
          ))}
        </ul>
      </div>

      <div className="sf-field">
        <label htmlFor="meta-preview">Combined preview</label>
        <textarea
          id="meta-preview"
          rows={10}
          value={meta.plain || ''}
          disabled={busy}
          onChange={(e) => setMeta((prev) => ({ ...prev, plain: e.target.value }))}
        />
      </div>
    </div>
  )
}
