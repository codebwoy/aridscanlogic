import { useEffect, useState } from 'react'
import { Copy, RefreshCw, Save } from 'lucide-react'
import {
  LISTING_DESCRIPTION_META,
  LISTING_DESCRIPTION_PARTS,
  NAMED_TOOLS,
  buildListingDescription,
  normalizeListingDescription,
  refreshListingFromParts,
} from '@storyforge/shared'

/**
 * 5-part Amazon KDP book description — built from project facts.
 * Social proof never invented; author pastes a real review when available.
 */
export default function ListingDescriptionBuilder({
  project,
  busy,
  setBusy,
  setError,
  setStatus,
  onSaved,
}) {
  const [listing, setListing] = useState(() =>
    normalizeListingDescription(project?.listing_description),
  )
  const [reviewQuote, setReviewQuote] = useState(
    () => project?.listing_description?.review_quote || '',
  )

  useEffect(() => {
    setListing(normalizeListingDescription(project?.listing_description))
    setReviewQuote(project?.listing_description?.review_quote || '')
  }, [project?.id, project?.listing_description?.updated_at])

  const characterName =
    project?.ip_character?.name || project?.pinned_anchor?.name || 'Hero'
  const lang = project?.language === 'de' ? 'de' : 'en'

  function rebuild() {
    const built = buildListingDescription({
      title: project?.title || '',
      characterName,
      emotionalCore: project?.emotional_core || 'courage',
      premise: project?.premise || '',
      refrain: project?.refrain || '',
      formatId: project?.format_id || 'picture',
      language: lang,
      reviewQuote,
    })
    setListing(
      normalizeListingDescription({
        ...built,
        review_quote: reviewQuote,
        language: lang,
        updated_at: new Date().toISOString(),
      }),
    )
    setStatus('KDP description draft rebuilt from project facts (0 credits)')
  }

  function updatePart(id, value) {
    const nextParts = { ...listing.parts, [id]: value }
    setListing(
      refreshListingFromParts(
        { ...listing, parts: nextParts, review_quote: reviewQuote, language: lang },
        { bookLine: project?.title ? `${project.title}` : '' },
      ),
    )
  }

  async function save() {
    if (!project?.id || !onSaved) return
    setBusy(true)
    setError('')
    try {
      const payload = normalizeListingDescription({
        ...listing,
        review_quote: reviewQuote,
        language: lang,
        updated_at: new Date().toISOString(),
      })
      const refreshed = refreshListingFromParts(payload, {
        bookLine: project?.title || '',
      })
      await onSaved(refreshed)
      setListing(refreshed)
      setStatus('KDP description saved (0 credits) — paste into Amazon listing')
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function copyPlain() {
    try {
      await navigator.clipboard.writeText(listing.plain || '')
      setStatus('Description copied (plain text)')
    } catch {
      setError('Could not copy — select the text manually')
    }
  }

  async function copyHtml() {
    try {
      await navigator.clipboard.writeText(listing.html || '')
      setStatus('Description copied (HTML for KDP rich text)')
    } catch {
      setError('Could not copy HTML')
    }
  }

  return (
    <div className="sf-listing-desc">
      <div className="sf-compliance-head">
        <h3 style={{ margin: 0 }}>{NAMED_TOOLS.listing_description?.label || 'KDP description'}</h3>
      </div>
      <p className="sf-muted" style={{ marginTop: '0.35rem' }}>
        {LISTING_DESCRIPTION_META.disclaimer}
      </p>
      <p className="sf-muted" style={{ fontSize: '0.8rem' }}>
        Uses: <strong>{characterName}</strong>
        {project?.emotional_core ? ` · core “${project.emotional_core}”` : ''}
        {project?.format_id ? ` · ${project.format_id}` : ''} · lang {lang}
      </p>

      <div className="sf-field">
        <label htmlFor="review-quote">Social proof (optional — real review only)</label>
        <input
          id="review-quote"
          value={reviewQuote}
          disabled={busy}
          placeholder='e.g. Our daughter asks for this book every bedtime'
          onChange={(e) => setReviewQuote(e.target.value)}
        />
        <p className="sf-warn-note" style={{ margin: '0.25rem 0 0' }}>
          Leave blank until you have a verified review. Never invent testimonials.
        </p>
      </div>

      <div className="sf-btn-row">
        <button type="button" className="sf-btn sf-btn-primary" disabled={busy} onClick={rebuild}>
          <RefreshCw size={16} aria-hidden /> Build from story facts (0)
        </button>
        <button type="button" className="sf-btn" disabled={busy} onClick={save}>
          <Save size={16} aria-hidden /> Save
        </button>
        <button type="button" className="sf-btn" disabled={busy || !listing.plain} onClick={copyPlain}>
          <Copy size={16} aria-hidden /> Copy plain
        </button>
        <button type="button" className="sf-btn" disabled={busy || !listing.html} onClick={copyHtml}>
          <Copy size={16} aria-hidden /> Copy HTML
        </button>
      </div>

      <div className="sf-listing-parts">
        {LISTING_DESCRIPTION_PARTS.map((part) => (
          <div key={part.id} className="sf-field">
            <label htmlFor={`listing-${part.id}`}>
              {part.label}
              <span className="sf-muted"> — {part.role}</span>
            </label>
            <textarea
              id={`listing-${part.id}`}
              rows={part.id === 'promise' ? 3 : 2}
              value={listing.parts?.[part.id] || ''}
              disabled={busy}
              onChange={(e) => updatePart(part.id, e.target.value)}
              placeholder={part.id === 'social' ? 'Paste a real review later…' : ''}
            />
          </div>
        ))}
      </div>

      <div className="sf-field">
        <label htmlFor="listing-preview">Combined preview (plain)</label>
        <textarea
          id="listing-preview"
          rows={8}
          value={listing.plain || ''}
          disabled={busy}
          onChange={(e) => setListing((prev) => ({ ...prev, plain: e.target.value }))}
        />
      </div>
    </div>
  )
}
