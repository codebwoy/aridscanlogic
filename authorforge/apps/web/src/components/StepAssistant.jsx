import { Download, RefreshCw } from 'lucide-react'

const IDLE_COPY =
  'Ask for title ideas, positioning, or outline tweaks for non-fiction. Suggestions never invent credentials or stats. Picture books → StoryForge.'

function ptToIn(pt) {
  const n = Number(pt)
  if (!Number.isFinite(n)) return '—'
  return `${(n / 72).toFixed(3)} in`
}

function jobLabel(type) {
  return String(type || 'result')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function collectDownloadUrls(type, outputs) {
  const urls = []
  if (!outputs) return urls
  if (outputs.url) urls.push(outputs.url)
  if (outputs.download && outputs.download !== outputs.url) urls.push(outputs.download)
  if (outputs.cover?.export?.url) urls.push(outputs.cover.export.url)
  if (Array.isArray(outputs.modules)) {
    for (const mod of outputs.modules) {
      if (mod?.export?.url) urls.push(mod.export.url)
    }
  }
  return urls
}

function ExportSummary({ type, outputs, downloaded, onDownload }) {
  const meta = outputs.meta || {}
  const layout = meta.layout || null
  const format = meta.format || outputs.format || type
  const urls = collectDownloadUrls(type, outputs)

  return (
    <div>
      <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>{jobLabel(type)} ready</p>
      {downloaded > 0 ? (
        <p className="muted" style={{ margin: '0 0 0.75rem' }}>
          Download started ({downloaded} file{downloaded > 1 ? 's' : ''}). Use the button below if you need it
          again.
        </p>
      ) : (
        <p className="muted" style={{ margin: '0 0 0.75rem' }}>
          File is ready. Download it to your computer.
        </p>
      )}
      <dl className="assist-dl">
        {format ? (
          <>
            <dt>Format</dt>
            <dd>{String(format).replace(/_/g, ' ')}</dd>
          </>
        ) : null}
        {meta.pageCount != null ? (
          <>
            <dt>Page count</dt>
            <dd>{meta.pageCount}</dd>
          </>
        ) : null}
        {Array.isArray(meta.files) && meta.files.length ? (
          <>
            <dt>Package files</dt>
            <dd>{meta.files.join(', ')}</dd>
          </>
        ) : null}
        {layout ? (
          <>
            <dt>Trim</dt>
            <dd>
              {ptToIn(layout.trimWidthPt)} × {ptToIn(layout.trimHeightPt)}
            </dd>
            <dt>Spine</dt>
            <dd>{ptToIn(layout.spinePt)}</dd>
            <dt>Bleed</dt>
            <dd>{ptToIn(layout.bleedPt)}</dd>
            <dt>Full wrap</dt>
            <dd>
              {ptToIn(layout.widthPt)} × {ptToIn(layout.heightPt)}
            </dd>
          </>
        ) : null}
      </dl>
      {layout?.note || meta.note ? (
        <p className="muted" style={{ marginTop: '0.75rem', fontSize: '0.72rem' }}>
          ⚠ {layout?.note || meta.note}
        </p>
      ) : null}
      {urls.length ? (
        <button
          type="button"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.75rem' }}
          onClick={() => onDownload?.(urls[0])}
        >
          <Download size={14} /> {downloaded > 0 ? 'Download again' : 'Download file'}
        </button>
      ) : null}
    </div>
  )
}

function TitleOptions({ options, warnings, onApply }) {
  if (!options?.length) {
    return (
      <div>
        <p className="warn" style={{ margin: 0 }}>
          No title suggestions yet. Try Suggest titles again, or type a title in Book Basics.
        </p>
        {(warnings || []).map((w) => (
          <p key={w} className="muted" style={{ marginTop: '0.5rem', fontSize: '0.72rem' }}>
            {w}
          </p>
        ))}
      </div>
    )
  }
  return (
    <div>
      <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Title options</p>
      <ul className="assist-list">
        {options.map((opt, i) => (
          <li key={`${opt.title}-${i}`}>
            <div>
              <strong>{opt.title}</strong>
              {opt.subtitle ? <div className="muted">{opt.subtitle}</div> : null}
              {opt.risk ? (
                <div className="muted" style={{ fontSize: '0.7rem' }}>
                  Risk: {opt.risk}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              className="btn"
              style={{ flexShrink: 0 }}
              onClick={() => onApply?.(opt)}
            >
              Apply
            </button>
          </li>
        ))}
      </ul>
      {(warnings || []).map((w) => (
        <p key={w} className="muted" style={{ marginTop: '0.5rem', fontSize: '0.72rem' }}>
          {w}
        </p>
      ))}
    </div>
  )
}

function AnglesView({ outputs, onApplyAngle }) {
  const angles = outputs?.angles?.angles || outputs?.angles || []
  const titles = outputs?.meta?.titles || []
  const disclaimer = outputs?.angles?.disclaimer || outputs?.disclaimer
  return (
    <div>
      <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Positioning</p>
      {titles.length ? (
        <>
          <p className="muted" style={{ margin: '0 0 0.35rem', fontSize: '0.72rem' }}>
            Comparable titles (estimates only)
          </p>
          <ul className="assist-simple">
            {titles.slice(0, 8).map((c) => (
              <li key={c.asin || c.title}>{c.title}</li>
            ))}
          </ul>
        </>
      ) : null}
      {Array.isArray(angles) && angles.length ? (
        <ul className="assist-simple" style={{ marginTop: '0.75rem' }}>
          {angles.map((a) => (
            <li key={a.name || a.id}>
              <strong>{a.strategy_label ? `${a.strategy_label}: ` : ''}{a.name}</strong>
              {a.unique_value || a.rationale ? (
                <div className="muted">{a.unique_value || a.rationale}</div>
              ) : null}
              {onApplyAngle ? (
                <button
                  type="button"
                  className="btn"
                  style={{ marginTop: '0.35rem', minHeight: 40 }}
                  onClick={() => onApplyAngle(a)}
                >
                  Select
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
      {disclaimer ? (
        <p className="muted" style={{ marginTop: '0.75rem', fontSize: '0.72rem' }}>
          {disclaimer}
        </p>
      ) : null}
    </div>
  )
}

function CoverView({ outputs, onDownload }) {
  const cover = outputs.cover || {}
  const url = outputs.download || cover.export?.url
  const mime = cover.export?.meta?.mime || ''
  const format = cover.export?.meta?.format || cover.export?.format || ''
  const isSvg = mime.includes('svg') || String(format).includes('svg')
  return (
    <div>
      <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Cover generated</p>
      {cover.warning ? <p className="warn">{cover.warning}</p> : null}
      {cover.legibility != null ? (
        <p className="muted" style={{ margin: '0.35rem 0' }}>
          Thumbnail legibility: {Number(cover.legibility).toFixed(2)}
          {cover.typography_ok === false ? ' · typography needs review' : ''}
        </p>
      ) : null}
      {url && isSvg ? (
        <div
          className="assist-preview"
          style={{
            marginTop: '0.75rem',
            borderRadius: 8,
            overflow: 'hidden',
            background: 'var(--af-bg-elevated)',
          }}
        >
          <img src={url} alt={cover.title || 'Cover preview'} style={{ width: '100%', display: 'block' }} />
        </div>
      ) : null}
      {url ? (
        <button
          type="button"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.75rem' }}
          onClick={() => onDownload?.(url)}
        >
          <Download size={14} /> Download cover
        </button>
      ) : null}
    </div>
  )
}

function NicheView({ outputs }) {
  const niches = outputs?.niches || outputs?.results || (Array.isArray(outputs) ? outputs : [])
  if (!niches.length) {
    return <p className="muted" style={{ margin: 0 }}>No niche results.</p>
  }
  return (
    <div>
      <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Niche estimates</p>
      <ul className="assist-simple">
        {niches.slice(0, 10).map((n, i) => (
          <li key={n.id || n.name || i}>
            <strong>{n.name || n.topic || 'Niche'}</strong>
            {n.note || n.rationale ? <div className="muted">{n.note || n.rationale}</div> : null}
          </li>
        ))}
      </ul>
      <p className="muted" style={{ marginTop: '0.5rem', fontSize: '0.72rem' }}>
        Estimates from mock/licensed adapters only — never Amazon scrape.
      </p>
    </div>
  )
}

function GenericSummary({ type, outputs }) {
  if (typeof outputs?.suggestion === 'string') {
    return (
      <div>
        <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Suggestion</p>
        <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{outputs.suggestion}</p>
        {outputs.note ? (
          <p className="muted" style={{ marginTop: '0.5rem', fontSize: '0.72rem' }}>
            {outputs.note}
          </p>
        ) : null}
      </div>
    )
  }
  if (outputs?.ad_script) {
    return (
      <div>
        <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Ad script</p>
        <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{outputs.ad_script}</p>
      </div>
    )
  }
  if (outputs?.metadata || type === 'metadata_generate') {
    const m = outputs.metadata || outputs
    return (
      <div>
        <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Metadata ready</p>
        <p className="muted" style={{ margin: 0 }}>
          {(m.keywords || []).length} keywords · {(m.categories || []).length} categories
        </p>
        {(outputs.warnings || []).map((w) => (
          <p key={w} className="warn" style={{ marginTop: '0.5rem', fontSize: '0.72rem' }}>
            {w}
          </p>
        ))}
        <p className="muted" style={{ marginTop: '0.5rem', fontSize: '0.72rem' }}>
          Edit fields in the Metadata step and click Save metadata.
        </p>
      </div>
    )
  }
  if (outputs?.storefront?.slug) {
    return (
      <div>
        <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Storefront published</p>
        <p className="muted" style={{ margin: 0 }}>
          Slug: {outputs.storefront.slug}
        </p>
        <a
          className="btn btn-primary"
          style={{ display: 'inline-flex', marginTop: '0.75rem', textDecoration: 'none' }}
          href={`/?view=store&slug=${encodeURIComponent(outputs.storefront.slug)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open storefront
        </a>
      </div>
    )
  }
  if (outputs?.chapters?.length) {
    return (
      <div>
        <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Outline updated</p>
        <p className="muted" style={{ margin: 0 }}>
          {outputs.chapters.length} chapters · coverage{' '}
          {outputs.coverage?.passed ? 'PASS' : outputs.coverage ? 'needs tags' : 'n/a'}
        </p>
      </div>
    )
  }
  if (outputs?.section) {
    return (
      <div>
        <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Section drafted</p>
        <p className="muted" style={{ margin: 0 }}>
          {outputs.section.title || 'Section'} · {outputs.section.word_count ?? '—'} words
        </p>
      </div>
    )
  }
  if (outputs?.reports) {
    return (
      <div>
        <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Quality report</p>
        <p className="muted" style={{ margin: 0 }}>
          {outputs.passed ? 'All sections passed' : 'Some sections need edits'} · {outputs.reports.length}{' '}
          sections
        </p>
      </div>
    )
  }
  if (outputs?.persona || outputs?.voice) {
    const p = outputs.persona || outputs
    return (
      <div>
        <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Persona</p>
        <p className="muted" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
          {p.bio || p.summary || p.voice || 'Persona saved to the book.'}
        </p>
      </div>
    )
  }
  return (
    <div>
      <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>{jobLabel(type)} completed</p>
      <p className="muted" style={{ margin: 0, fontSize: '0.72rem' }}>
        Results were applied to the book where relevant. Open the wizard step to review.
      </p>
    </div>
  )
}

export function isExportArtifact(outputs) {
  return !!(outputs && outputs.url && (outputs.id || outputs.meta))
}

/** Normalize legacy string dumps + structured job results into a render payload. */
function normalizeAssist(assist) {
  if (assist == null) return null
  if (typeof assist === 'string') {
    const text = assist.trim()
    if (!text) return null
    try {
      const parsed = JSON.parse(text)
      if (parsed && typeof parsed === 'object') {
        if (parsed.outputs && parsed.type) return parsed
        if (Array.isArray(parsed.options) || Array.isArray(parsed.warnings)) {
          return { type: 'title_variations', outputs: parsed, downloaded: 0 }
        }
        if (parsed.url && (parsed.id || parsed.meta)) {
          return { type: 'export', outputs: parsed, downloaded: 0 }
        }
        return { type: 'result', outputs: parsed, downloaded: 0 }
      }
    } catch {
      return { type: 'note', outputs: { suggestion: text }, downloaded: 0 }
    }
    return { type: 'note', outputs: { suggestion: text }, downloaded: 0 }
  }
  if (typeof assist === 'object') {
    if (assist.outputs != null) return assist
    if (Array.isArray(assist.options) || Array.isArray(assist.warnings)) {
      return { type: 'title_variations', outputs: assist, downloaded: 0 }
    }
    return { type: assist.type || 'result', outputs: assist, downloaded: assist.downloaded || 0 }
  }
  return null
}

export default function StepAssistant({
  assist,
  busy,
  onSuggestTitles,
  onApplyTitle,
  onApplyAngle,
  onDownload,
  canSuggest,
  idleCopy,
}) {
  const payload = normalizeAssist(assist)
  const type = payload?.type
  const outputs = payload?.outputs
  const downloaded = payload?.downloaded || 0
  const idle = idleCopy || IDLE_COPY

  let body = <p className="muted" style={{ margin: 0 }}>{idle}</p>

  if (outputs) {
    if (
      type === 'title_variations' ||
      Array.isArray(outputs.options) ||
      Array.isArray(outputs.warnings)
    ) {
      body = (
        <TitleOptions options={outputs.options || []} warnings={outputs.warnings} onApply={onApplyTitle} />
      )
    } else if (type === 'cover_generate' || type === 'cover_revise' || outputs.cover?.export) {
      body = <CoverView outputs={outputs} onDownload={onDownload} />
    } else if (isExportArtifact(outputs) || String(type || '').startsWith('export_') || type === 'cover_wrap') {
      body = (
        <ExportSummary type={type} outputs={outputs} downloaded={downloaded} onDownload={onDownload} />
      )
    } else if (type === 'competitive_analysis' || outputs.angles || outputs.meta?.titles) {
      body = <AnglesView outputs={outputs} onApplyAngle={onApplyAngle} />
    } else if (type === 'niche_search') {
      body = <NicheView outputs={outputs} />
    } else if (type === 'aplus_module' && Array.isArray(outputs.modules)) {
      body = (
        <div>
          <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>A+ modules ready</p>
          <ul className="assist-simple">
            {outputs.modules.map((m) => (
              <li key={m.type}>
                {String(m.type).replace(/_/g, ' ')}
                {m.export?.url ? (
                  <>
                    {' · '}
                    <button type="button" className="btn" onClick={() => onDownload?.(m.export.url)}>
                      Download
                    </button>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )
    } else {
      body = <GenericSummary type={type || 'result'} outputs={outputs} />
    }
  }

  return (
    <>
      <div
        className="card"
        style={{
          marginTop: '0.75rem',
          fontSize: '0.8rem',
          maxHeight: '60vh',
          overflow: 'auto',
        }}
      >
        {body}
      </div>
      <button
        type="button"
        className="btn"
        style={{ width: '100%', marginTop: '0.75rem' }}
        disabled={!canSuggest || !!busy}
        onClick={onSuggestTitles}
      >
        <RefreshCw size={14} /> Suggest titles
      </button>
    </>
  )
}
