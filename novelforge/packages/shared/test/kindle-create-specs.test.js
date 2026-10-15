import test from 'node:test'
import assert from 'node:assert/strict'
import {
  KINDLE_CREATE_SPECS,
  KINDLE_CREATE_LAUNCH_ITEMS,
  inferSectionRole,
  analyzeKindleCreateStructure,
  kindleCreatePayload,
} from '../src/kindle-create-specs.js'
import { LAUNCH_READINESS, PUBLISHING_SPECS } from '../src/publishing-specs.js'

test('NovelForge Kindle Create specs aligned with KDP help', () => {
  assert.equal(KINDLE_CREATE_SPECS.sourceTopicId, 'G7R2L7V5X6SJH948')
  assert.equal(inferSectionRole('Prologue'), 'prologue')
  assert.equal(inferSectionRole('Epilogue'), 'epilogue')
  assert.equal(LAUNCH_READINESS.studio, 'novelforge')
  assert.ok(LAUNCH_READINESS.phases.some((p) => p.id === 'typesetting'))
  assert.equal(LAUNCH_READINESS.phases.find((p) => p.id === 'typesetting').items.length, KINDLE_CREATE_LAUNCH_ITEMS.length)
  assert.ok(PUBLISHING_SPECS.kdpHelpUrls.kindleCreate)
  const weak = analyzeKindleCreateStructure([{ title: '', content_md: 'x' }])
  assert.ok(weak.issues.some((i) => i.id === 'untitled_sections' || i.id === 'few_sections'))
  assert.match(kindleCreatePayload().verifiedNote, /Kindle Create/)
})
