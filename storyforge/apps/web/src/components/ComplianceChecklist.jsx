import { useRef } from 'react'
import { ShieldCheck, ExternalLink } from 'lucide-react'
import {
  ISBN_CHOICES,
  AI_MODE_CHOICES,
  COMPLIANCE_LINKS,
  RIGHTS_DOC_MAX_BYTES,
  assessComplianceGate,
  stampComplianceIfComplete,
  KDP_COMPLIANCE_META,
  KINDLE_CREATE_SPECS,
} from '@storyforge/shared'

/**
 * KDP compliance checklist — ISBN, trademark, rights doc, AI disclosure.
 * Prevention aids only; not legal advice / not ban evasion.
 */
export default function ComplianceChecklist({
  compliance,
  onChange,
  busy,
  disabled,
  bookTitle = '',
  characterName = '',
}) {
  const fileRef = useRef(null)
  const gate = assessComplianceGate(compliance)
  const c = gate.checklist

  function patch(partial) {
    const next = stampComplianceIfComplete({ ...c, ...partial })
    onChange(next)
  }

  async function onRightsFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > RIGHTS_DOC_MAX_BYTES) {
      window.alert(
        `Rights document must be under ${Math.round(RIGHTS_DOC_MAX_BYTES / 1000)} KB for local attach. Record the path in the note field instead, or use a smaller PDF/scan.`,
      )
      e.target.value = ''
      return
    }
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Could not read file'))
      reader.readAsDataURL(file)
    })
    patch({
      rights_docs_acknowledged: true,
      rights_doc: {
        filename: file.name,
        mime: file.type || 'application/octet-stream',
        byteLength: file.size,
        uploaded_at: new Date().toISOString(),
        dataUrl,
      },
    })
  }

  function clearRightsDoc() {
    patch({ rights_doc: null })
    if (fileRef.current) fileRef.current.value = ''
  }

  const suggestedQuery =
    c.trademark_query ||
    [bookTitle, characterName].filter(Boolean).join(' · ') ||
    ''

  return (
    <div className="sf-compliance" aria-label="KDP compliance checklist">
      <div className="sf-compliance-head">
        <h3>
          <ShieldCheck size={18} aria-hidden /> {KDP_COMPLIANCE_META.title}
        </h3>
        <span
          className={`sf-badge ${gate.ok ? 'sf-badge-ok' : 'sf-badge-warn'}`}
          title={gate.ok ? 'Complete' : 'Required before Finish pack'}
        >
          {gate.doneCount}/{gate.requiredCount}
        </span>
      </div>
      <p className="sf-muted" style={{ marginTop: 0 }}>
        {KDP_COMPLIANCE_META.disclaimer}
      </p>

      <aside
        className="sf-compliance-kc"
        style={{
          margin: '0.65rem 0 0.85rem',
          padding: '0.65rem 0.75rem',
          borderRadius: '8px',
          border: '1px solid var(--sf-border, var(--border))',
          background: 'var(--sf-surface-2, var(--surface-2))',
          fontSize: '0.82rem',
          lineHeight: 1.45,
        }}
      >
        <strong>Picture books ≠ Kindle Create reflowable</strong>
        <p className="sf-muted" style={{ margin: '0.35rem 0 0.45rem' }}>
          {KINDLE_CREATE_SPECS.verifiedNote}
        </p>
        <a href={KINDLE_CREATE_SPECS.helpUrl} target="_blank" rel="noopener noreferrer">
          Kindle Create help (text books)
        </a>
        {' · '}
        <a href={KINDLE_CREATE_SPECS.helpUrlDe} target="_blank" rel="noopener noreferrer">
          DE
        </a>
      </aside>

      <div className="sf-compliance-links">
        {COMPLIANCE_LINKS.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="sf-chip"
            title={link.note}
          >
            {link.label} <ExternalLink size={12} aria-hidden />
          </a>
        ))}
      </div>

      <label className="sf-check-row">
        <input
          type="checkbox"
          checked={c.isbn_plan_acknowledged}
          disabled={busy || disabled}
          onChange={(e) => patch({ isbn_plan_acknowledged: e.target.checked })}
        />
        <span>
          <strong>ISBN plan</strong> — I have chosen how I will identify this edition before live
          upload
          <div className="sf-field" style={{ marginTop: '0.35rem' }}>
            <select
              value={c.isbn_choice}
              disabled={busy || disabled}
              onChange={(e) =>
                patch({
                  isbn_choice: e.target.value,
                  isbn_plan_acknowledged: true,
                })
              }
            >
              {ISBN_CHOICES.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </span>
      </label>

      <label className="sf-check-row">
        <input
          type="checkbox"
          checked={c.trademark_self_checked}
          disabled={busy || disabled}
          onChange={(e) => patch({ trademark_self_checked: e.target.checked })}
        />
        <span>
          <strong>Trademark self-check</strong> — I searched title / character names (EUIPO or
          relevant registry). Not legal clearance.
          <div className="sf-field" style={{ marginTop: '0.35rem' }}>
            <input
              type="text"
              value={suggestedQuery}
              disabled={busy || disabled}
              placeholder="Names I searched…"
              onChange={(e) => patch({ trademark_query: e.target.value })}
            />
            <textarea
              value={c.trademark_notes}
              disabled={busy || disabled}
              placeholder="Notes (e.g. clear / needs lawyer)"
              rows={2}
              onChange={(e) => patch({ trademark_notes: e.target.value })}
            />
          </div>
        </span>
      </label>

      <label className="sf-check-row">
        <input
          type="checkbox"
          checked={c.rights_docs_acknowledged}
          disabled={busy || disabled}
          onChange={(e) => patch({ rights_docs_acknowledged: e.target.checked })}
        />
        <span>
          <strong>Rights documentation</strong> — I am sole author of text/art OR I have a signed
          rights transfer / work-for-hire on file
          <div className="sf-field" style={{ marginTop: '0.35rem' }}>
            <textarea
              value={c.rights_docs_note}
              disabled={busy || disabled}
              placeholder="Where the contract lives (path / folder) or “sole author”"
              rows={2}
              onChange={(e) => patch({ rights_docs_note: e.target.value })}
            />
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
              disabled={busy || disabled}
              onChange={onRightsFile}
            />
            {c.rights_doc ? (
              <p className="sf-muted" style={{ margin: '0.35rem 0 0' }}>
                Attached: {c.rights_doc.filename} ({Math.round((c.rights_doc.byteLength || 0) / 1024)}{' '}
                KB)
                <button
                  type="button"
                  className="sf-linkish"
                  style={{ marginLeft: '0.5rem' }}
                  disabled={busy || disabled}
                  onClick={clearRightsDoc}
                >
                  Remove
                </button>
              </p>
            ) : (
              <p className="sf-muted" style={{ margin: '0.25rem 0 0', fontSize: '0.78rem' }}>
                Optional attach ≤{Math.round(RIGHTS_DOC_MAX_BYTES / 1000)} KB (stays in local project
                data — keep originals safe offline).
              </p>
            )}
          </div>
        </span>
      </label>

      <div className="sf-compliance-ai">
        <strong>AI status &amp; disclosure</strong>
        <label className="sf-check">
          <input
            type="checkbox"
            checked={c.used_ai}
            disabled={busy || disabled}
            onChange={(e) =>
              patch({
                used_ai: e.target.checked,
                ai_generation_mode: e.target.checked ? 'prompt' : 'none',
                ai_disclose_acknowledged: false,
              })
            }
          />
          <span>This book used AI for images and/or text assistance</span>
        </label>
        <div className="sf-field">
          <label htmlFor="ai-mode">Generation mode</label>
          <select
            id="ai-mode"
            value={c.ai_generation_mode}
            disabled={busy || disabled}
            onChange={(e) =>
              patch({
                ai_generation_mode: e.target.value,
                used_ai: e.target.value !== 'none',
                ai_disclose_acknowledged: false,
              })
            }
          >
            {AI_MODE_CHOICES.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <p className="sf-warn-note" style={{ margin: '0.35rem 0' }}>
          {gate.disclosure.rationale}
          {gate.disclosure.recommendDisclose
            ? ' → Plan to disclose in KDP metadata when required.'
            : ' → Still verify current Amazon KDP Help wording.'}
        </p>
        <label className="sf-check-row sf-check-row-primary">
          <input
            type="checkbox"
            checked={c.ai_disclose_acknowledged}
            disabled={busy || disabled}
            onChange={(e) => patch({ ai_disclose_acknowledged: e.target.checked })}
          />
          <span>
            I acknowledge the AI disclosure plan above and will follow current KDP rules at upload
            (honesty — not evasion)
          </span>
        </label>
      </div>

      <label className="sf-check-row">
        <input
          type="checkbox"
          checked={c.single_account_acknowledged}
          disabled={busy || disabled}
          onChange={(e) => patch({ single_account_acknowledged: e.target.checked })}
        />
        <span>
          <strong>One KDP account</strong> — I publish under a single KDP account per person/entity
        </span>
      </label>

      <label className="sf-check-row">
        <input
          type="checkbox"
          checked={c.no_review_manipulation_acknowledged}
          disabled={busy || disabled}
          onChange={(e) => patch({ no_review_manipulation_acknowledged: e.target.checked })}
        />
        <span>
          <strong>No manipulation</strong> — I will not buy fake reviews, swap reviews, or use rank /
          KU page-read farms
        </span>
      </label>

      <label className="sf-check-row">
        <input
          type="checkbox"
          checked={c.wide_publish_noted}
          disabled={busy || disabled}
          onChange={(e) => patch({ wide_publish_noted: e.target.checked })}
        />
        <span>
          Optional: I noted publishing wide (Tolino / Kobo / Apple) so business is not KDP-only
        </span>
      </label>

      {!gate.ok ? (
        <ul className="sf-readiness-findings" style={{ marginTop: '0.75rem' }}>
          {gate.missing.map((m) => (
            <li key={m} className="sf-find-block">
              {m}
            </li>
          ))}
        </ul>
      ) : (
        <p className="sf-status" style={{ marginTop: '0.75rem' }}>
          Compliance checklist complete
          {c.completed_at ? ` · ${new Date(c.completed_at).toLocaleString()}` : ''}. Finish pack
          unlocked (still verify in KDP Previewer).
        </p>
      )}
    </div>
  )
}
