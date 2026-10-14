import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeFinding, scoreFromFindings, detectSections, chunkText } from '../src/index.js'

test('normalizeFinding rejects missing excerpt', () => {
  const r = normalizeFinding({ category: 'grammar' })
  assert.equal(r.ok, false)
})

test('normalizeFinding verifies excerpt against section', () => {
  const sectionText = 'She walked to the colour shop yesterday.'
  const bad = normalizeFinding(
    { original_excerpt: 'not in text', suggested_correction: 'x' },
    { sectionText }
  )
  assert.equal(bad.ok, false)
  const good = normalizeFinding(
    {
      category: 'localization',
      severity: 'minor',
      original_excerpt: 'colour shop',
      suggested_correction: 'color shop',
      explanation: 'US English variety',
    },
    { sectionText, sectionKey: 's1' }
  )
  assert.equal(good.ok, true)
  assert.equal(good.finding.section_key, 's1')
})

test('scoreFromFindings lowers score for critical issues', () => {
  const s = scoreFromFindings([
    { severity: 'critical', category: 'kdp_technical', resolution: 'open' },
    { severity: 'suggestion', category: 'style', resolution: 'open' },
  ])
  assert.ok(s.overall < 80)
  assert.equal(s.readiness, 'critical_issues_detected')
})

test('scoreFromFindings does not fake 100 before analysis', () => {
  const s = scoreFromFindings([])
  assert.equal(s.overall, null)
  assert.equal(s.readiness, 'analysis_incomplete')
})

test('detectSections splits on chapter headings', () => {
  const ms = `# Chapter 1\n\nOnce upon a time there was a long enough opening paragraph for the splitter.\n\n# Chapter 2\n\nLater that day the story continued with another paragraph of substance.`
  const sections = detectSections(ms)
  assert.ok(sections.length >= 2)
})

test('chunkText keeps short text as one chunk', () => {
  const chunks = chunkText('Hello world.')
  assert.equal(chunks.length, 1)
})
