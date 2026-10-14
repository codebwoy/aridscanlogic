import test from 'node:test'
import assert from 'node:assert/strict'
import {
  LAUNCH_READINESS,
  COMPLIANCE_CHECKLIST_DEFAULT,
  mergeLaunchChecklist,
  launchReadinessProgress,
  launchReadinessPayload,
} from '../src/publishing-specs.js'

test('AuthorForge launch readiness has required Amazon phases', () => {
  assert.equal(LAUNCH_READINESS.studio, 'authorforge')
  const ids = new Set(LAUNCH_READINESS.phases.map((p) => p.id))
  for (const need of ['manuscript', 'amazon_account', 'studio_setup', 'after_export', 'strategy']) {
    assert.ok(ids.has(need), need)
  }
  assert.ok(LAUNCH_READINESS.phases.some((p) => p.items.some((i) => i.id === 'story_slots')))
  assert.ok(LAUNCH_READINESS.phases.some((p) => p.items.some((i) => i.id === 'manual_kdp_upload')))
})

test('compliance checklist derives from launch readiness', () => {
  assert.equal(COMPLIANCE_CHECKLIST_DEFAULT.version, LAUNCH_READINESS.version)
  assert.ok(COMPLIANCE_CHECKLIST_DEFAULT.items.length >= 15)
  assert.ok(COMPLIANCE_CHECKLIST_DEFAULT.items.every((i) => i.id && i.label))
})

test('merge and progress track required items', () => {
  const merged = mergeLaunchChecklist([])
  assert.ok(merged.every((i) => i.checked === false))
  const one = mergeLaunchChecklist([{ id: 'human_edit', checked: true }])
  assert.equal(one.find((i) => i.id === 'human_edit')?.checked, true)
  const progressEmpty = launchReadinessProgress([])
  assert.equal(progressEmpty.requiredComplete, false)
  const allRequired = merged
    .filter((i) => i.required)
    .map((i) => ({ id: i.id, checked: true }))
  const progress = launchReadinessProgress(allRequired)
  assert.equal(progress.requiredComplete, true)
  assert.ok(progress.percent > 0)
})

test('launchReadinessPayload exposes help urls and dpi', () => {
  const p = launchReadinessPayload()
  assert.equal(p.dpiTarget, 300)
  assert.ok(p.helpUrls?.coverCalculator)
  assert.match(p.lead, /KDP/i)
})
