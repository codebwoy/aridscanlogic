import test from 'node:test'
import assert from 'node:assert/strict'
import {
  KINDLE_CREATE_SPECS,
  KINDLE_CREATE_LAUNCH_ITEMS,
  inferSectionRole,
  classifyManuscriptSections,
  analyzeKindleCreateStructure,
  kindleCreatePayload,
} from '../src/kindle-create-specs.js'
import { LAUNCH_READINESS, PUBLISHING_SPECS } from '../src/publishing-specs.js'

test('Kindle Create specs cite Amazon help topic', () => {
  assert.equal(KINDLE_CREATE_SPECS.sourceTopicId, 'G7R2L7V5X6SJH948')
  assert.match(KINDLE_CREATE_SPECS.helpUrl, /G7R2L7V5X6SJH948/)
  assert.ok(KINDLE_CREATE_SPECS.frontMatterTypes.length >= 5)
  assert.ok(KINDLE_CREATE_SPECS.backMatterTypes.length >= 4)
})

test('inferSectionRole maps imprint and chapters', () => {
  assert.equal(inferSectionRole('Copyright'), 'copyright')
  assert.equal(inferSectionRole('Widmung'), 'dedication')
  assert.equal(inferSectionRole('Chapter 3'), 'chapter')
  assert.equal(inferSectionRole('Anything', 'prologue'), 'prologue')
})

test('classify and analyze manuscript structure', () => {
  const classified = classifyManuscriptSections([
    { title: 'Copyright', content_md: '© 2026' },
    { title: 'Chapter 1', content_md: 'Once upon a time.' },
    { title: 'Chapter 2', content_md: 'Then…' },
    { title: 'About the author', content_md: 'Bio' },
  ])
  assert.equal(classified[0].matter, 'front')
  assert.equal(classified[1].role, 'chapter')
  assert.equal(classified[3].matter, 'back')
  const analysis = analyzeKindleCreateStructure(classified)
  assert.equal(analysis.chapterCount, 2)
  assert.ok(analysis.frontMatterCount >= 1)
  assert.ok(analysis.backMatterCount >= 1)
})

test('launch readiness includes typesetting phase', () => {
  assert.equal(LAUNCH_READINESS.version, 3)
  const phase = LAUNCH_READINESS.phases.find((p) => p.id === 'typesetting')
  assert.ok(phase)
  assert.equal(phase.items.length, KINDLE_CREATE_LAUNCH_ITEMS.length)
  assert.ok(PUBLISHING_SPECS.kdpHelpUrls.kindleCreate)
  assert.ok(kindleCreatePayload().launchItems.length >= 4)
})
