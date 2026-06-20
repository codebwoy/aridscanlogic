/** Default Claude model + migration from retired IDs (June 2026). */

export const DEFAULT_ANTHROPIC_MODEL = 'claude-sonnet-4-6'

/** Retired 2026-06-15 — map to current replacements so stale env vars still work. */
const RETIRED_MODEL_MAP = {
  'claude-sonnet-4-20250514': 'claude-sonnet-4-6',
  'claude-opus-4-20250514': 'claude-opus-4-8',
}

export function resolveAnthropicModel(raw) {
  const trimmed = typeof raw === 'string' ? raw.trim() : ''
  const base = trimmed || DEFAULT_ANTHROPIC_MODEL
  return RETIRED_MODEL_MAP[base] || base
}
