import { useMemo, useState } from 'react'
import { Smile, PersonStanding, Shirt, Mountain, Wand2 } from 'lucide-react'
import {
  CREDIT_COSTS,
  NAMED_TOOLS,
  EDITOR_VARIATION_PLAYBOOKS,
  EDITOR_VARIATION_PRESETS,
} from '@storyforge/shared'

const EDITOR_IDS = ['editor_action', 'editor_expression', 'editor_outfit', 'editor_background']

const ICONS = {
  editor_action: PersonStanding,
  editor_expression: Smile,
  editor_outfit: Shirt,
  editor_background: Mountain,
}

/**
 * Dedicated Action / Expression / Outfit / Background editors.
 * Each job changes one axis while keeping Character Turbo identity locked.
 */
export default function VariationEditors({
  busy,
  disabled,
  pageIndex,
  characterName,
  sceneBrief,
  setSceneBrief,
  onRun,
  ModelSelect,
  falImg2img,
}) {
  const [editorId, setEditorId] = useState('editor_action')
  const [customBrief, setCustomBrief] = useState('')

  const playbook = useMemo(
    () => EDITOR_VARIATION_PLAYBOOKS.find((p) => p.tool === editorId),
    [editorId],
  )
  const presets = EDITOR_VARIATION_PRESETS[editorId] || playbook?.presets || []
  const tool = NAMED_TOOLS[editorId]
  const Icon = ICONS[editorId] || Wand2
  const cost = CREDIT_COSTS[editorId] ?? 1
  const brief = (customBrief || sceneBrief || '').trim()

  function applyPreset(preset) {
    setCustomBrief(preset.brief)
    if (typeof setSceneBrief === 'function') setSceneBrief(preset.brief)
  }

  function runEditor() {
    if (!brief) return
    onRun(editorId, {
      brief,
      pageIndex,
      characterName,
      editFocus: editorId.replace(/^editor_/, ''),
    })
  }

  return (
    <div className="sf-card sf-variation-editors">
      <h3 style={{ marginTop: 0 }}>{NAMED_TOOLS.variation_editors.label}</h3>
      <p className="sf-muted">{NAMED_TOOLS.variation_editors.description}</p>

      <div className="sf-tabs sf-tabs-compact" role="tablist" aria-label="Variation editors">
        {EDITOR_IDS.map((id) => {
          const TabIcon = ICONS[id]
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={editorId === id}
              className={editorId === id ? 'sf-tab-active' : ''}
              onClick={() => {
                setEditorId(id)
                setCustomBrief('')
              }}
            >
              <TabIcon size={14} aria-hidden /> {NAMED_TOOLS[id]?.label?.replace(' Editor', '') || id}
            </button>
          )
        })}
      </div>

      <div className="sf-variation-panel" role="tabpanel">
        <div className="sf-variation-head">
          <Icon size={18} aria-hidden />
          <div>
            <strong>{tool?.label}</strong>
            <p className="sf-muted" style={{ margin: '0.2rem 0 0' }}>
              {tool?.description}
            </p>
          </div>
        </div>

        {playbook?.bullets?.length ? (
          <ul className="sf-variation-tips">
            {playbook.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        ) : null}

        <div className="sf-field">
          <label>Quick presets</label>
          <div className="sf-chip-row" role="list">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`sf-chip${brief === p.brief ? ' sf-chip-active' : ''}`}
                disabled={busy || disabled}
                onClick={() => applyPreset(p)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {typeof ModelSelect === 'function' ? (
          <ModelSelect role="img2img" label="fal Editor img2img model" value={falImg2img} />
        ) : null}

        <div className="sf-field">
          <label htmlFor="variation-brief">
            {editorId === 'editor_action'
              ? 'Action / pose'
              : editorId === 'editor_expression'
                ? 'Expression'
                : editorId === 'editor_outfit'
                  ? 'Outfit'
                  : 'Background / place'}
          </label>
          <textarea
            id="variation-brief"
            value={customBrief || sceneBrief}
            onChange={(e) => {
              setCustomBrief(e.target.value)
              if (typeof setSceneBrief === 'function') setSceneBrief(e.target.value)
            }}
            placeholder={
              editorId === 'editor_action'
                ? 'e.g. jumping over a puddle'
                : editorId === 'editor_expression'
                  ? 'e.g. surprised and delighted'
                  : editorId === 'editor_outfit'
                    ? 'e.g. wearing cozy pajamas'
                    : 'e.g. magical forest clearing'
            }
            rows={3}
          />
        </div>

        <div className="sf-btn-row">
          <button
            type="button"
            className="sf-btn sf-btn-primary"
            disabled={busy || disabled || !brief}
            onClick={runEditor}
          >
            <Wand2 size={16} aria-hidden /> Apply {tool?.label || 'edit'} ({cost})
          </button>
        </div>
        <p className="sf-muted" style={{ marginBottom: 0 }}>
          Writes to page {pageIndex + 1}. Always starts from the pinned Character Turbo anchor.
        </p>
      </div>
    </div>
  )
}
