import test from 'node:test'
import assert from 'node:assert/strict'
import {
  LAUNCH_READINESS,
  COMPLIANCE_CHECKLIST_DEFAULT,
  mergeLaunchChecklist,
  launchReadinessProgress,
  launchReadinessPayload,
} from '../src/publishing-specs.js'

test('NovelForge launch readiness uses fiction manuscript items', () => {
  assert.equal(LAUNCH_READINESS.studio, 'novelforge')
  const flat = LAUNCH_READINESS.phases.flatMap((p) => p.items)
  assert.ok(flat.some((i) => i.id === 'continuity_pass'))
  assert.ok(flat.some((i) => i.id === 'adult_content_ok'))
  assert.ok(!flat.some((i) => i.id === 'story_slots'))
  assert.ok(flat.some((i) => i.id === 'manual_kdp_upload'))
  assert.ok(LAUNCH_READINESS.phases.some((p) => p.id === 'typesetting'))
  assert.ok(flat.some((i) => i.id === 'kc_docx_structure'))
})

test('compliance checklist derives from launch readiness', () => {
  assert.equal(COMPLIANCE_CHECKLIST_DEFAULT.version, LAUNCH_READINESS.version)
  assert.ok(COMPLIANCE_CHECKLIST_DEFAULT.items.length >= 15)
})

test('merge and progress track required items', () => {
  const merged = mergeLaunchChecklist([])
  assert.ok(merged.every((i) => i.checked === false))
  const allRequired = merged
    .filter((i) => i.required)
    .map((i) => ({ id: i.id, checked: true }))
  const progress = launchReadinessProgress(allRequired)
  assert.equal(progress.requiredComplete, true)
})

test('launchReadinessPayload exposes help urls and dpi', () => {
  const p = launchReadinessPayload()
  assert.equal(p.dpiTarget, 300)
  assert.ok(p.helpUrls?.manuscript)
})
