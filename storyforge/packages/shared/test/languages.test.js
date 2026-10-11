import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  STORY_LANGUAGE_CODES,
  normalizeLanguagePair,
  formatLanguagePairLabel,
  resolvePageTextLines,
  composeDisplayText,
  languagesPayload,
} from '../src/languages.js'

describe('normalizeLanguagePair', () => {
  it('accepts any primary + different secondary', () => {
    const r = normalizeLanguagePair({ primary: 'ES', secondary: 'tw', layout: 'side_by_side' })
    assert.equal(r.ok, true)
    assert.equal(r.primary, 'es')
    assert.equal(r.secondary, 'tw')
    assert.equal(r.bilingual, true)
    assert.equal(r.layout, 'side_by_side')
  })

  it('allows monolingual when secondary empty', () => {
    const r = normalizeLanguagePair({ primary: 'fr', secondary: '' })
    assert.equal(r.ok, true)
    assert.equal(r.secondary, null)
    assert.equal(r.bilingual, false)
  })

  it('rejects same-language pairs', () => {
    const r = normalizeLanguagePair({ primary: 'it', secondary: 'it' })
    assert.equal(r.ok, false)
  })

  it('rejects unknown codes', () => {
    assert.equal(normalizeLanguagePair({ primary: 'xx' }).ok, false)
    assert.equal(normalizeLanguagePair({ primary: 'de', secondary: 'xx' }).ok, false)
  })
})

describe('resolvePageTextLines', () => {
  it('stacks primary then secondary', () => {
    const r = resolvePageTextLines({
      primaryCode: 'de',
      secondaryCode: 'ig',
      primaryText: 'Hallo',
      secondaryText: 'Ndewo',
      layout: 'stacked',
      pageIndex: 0,
    })
    assert.deepEqual(
      r.lines.map((l) => l.text),
      ['Hallo', 'Ndewo'],
    )
  })

  it('swaps order on odd pages for alternating', () => {
    const r = resolvePageTextLines({
      primaryCode: 'fr',
      secondaryCode: 'ar',
      primaryText: 'Bonjour',
      secondaryText: 'مرحبا',
      layout: 'alternating',
      pageIndex: 1,
    })
    assert.equal(r.lines[0].role, 'secondary')
    assert.equal(r.lines[1].role, 'primary')
  })
})

describe('composeDisplayText + catalogue', () => {
  it('formats pair labels and catalogue payload', () => {
    assert.match(formatLanguagePairLabel('de', 'tw'), /German/)
    assert.ok(STORY_LANGUAGE_CODES.includes('it'))
    assert.ok(STORY_LANGUAGE_CODES.includes('ee'))
    const payload = languagesPayload()
    assert.ok(payload.presets.length > 5)
    assert.ok(payload.layouts.some((l) => l.id === 'side_by_side'))
  })

  it('composes bilingual display from project pages', () => {
    const text = composeDisplayText(
      { page_index: 0, text_content: 'Hi', text_secondary: 'Hola' },
      { language: 'en', secondary_language: 'es', bilingual_layout: 'stacked' },
    )
    assert.match(text, /Hi/)
    assert.match(text, /Hola/)
  })
})
