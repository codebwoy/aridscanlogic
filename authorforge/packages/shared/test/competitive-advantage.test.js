import test from 'node:test'
import assert from 'node:assert/strict'
import {
  STRATEGY_KINDS,
  normalizeAngle,
  applyAngleToBookPatch,
  emptyCustomAngle,
} from '../src/competitive-advantage.js'

test('normalizeAngle maps strategy kinds and aliases', () => {
  const a = normalizeAngle(
    {
      kind: 'more value',
      title: 'Depth workbook',
      reason: 'More drills',
      audience: 'Parents',
      usp: 'Weekly drills',
      evidence_points: ['Mock gap'],
      weaknesses: ['Longer'],
      must_deliver: ['Tracker'],
    },
    0
  )
  assert.equal(a.strategy_kind, STRATEGY_KINDS.MORE_VALUE)
  assert.equal(a.name, 'Depth workbook')
  assert.equal(a.rationale, 'More drills')
  assert.equal(a.target_audience, 'Parents')
  assert.equal(a.unique_value, 'Weekly drills')
  assert.deepEqual(a.evidence, ['Mock gap'])
  assert.deepEqual(a.risks, ['Longer'])
  assert.deepEqual(a.must_contain, ['Tracker'])
})

test('normalizeAngle defaults first three cards to distinct strategies', () => {
  assert.equal(normalizeAngle({ name: 'A' }, 0).strategy_kind, STRATEGY_KINDS.MORE_VALUE)
  assert.equal(normalizeAngle({ name: 'B' }, 1).strategy_kind, STRATEGY_KINDS.NICHE_END_GOAL)
  assert.equal(normalizeAngle({ name: 'C' }, 2).strategy_kind, STRATEGY_KINDS.SIMPLER_FASTER)
})

test('applyAngleToBookPatch writes bible + optional titles', () => {
  const patch = applyAngleToBookPatch(
    {
      strategy_kind: 'niche_end_goal',
      name: 'Niche outcome',
      proposed_title: 'One Goal Guide',
      proposed_subtitle: 'For immigrant parents',
      target_audience: 'Parents in DE',
      unique_value: 'Clear 4-week outcome',
      differentiation: 'Tighter than comps',
      must_contain: ['Plan', 'Obstacles'],
      toc_direction: 'Outcome → plan',
      rationale: 'Narrow reader',
    },
    { bible: { tone: 'warm' }, working_title: 'Old' }
  )
  assert.equal(patch.working_title, 'One Goal Guide')
  assert.equal(patch.subtitle, 'For immigrant parents')
  assert.equal(patch.bible.tone, 'warm')
  assert.equal(patch.bible.positioning, 'Niche outcome')
  assert.equal(patch.bible.usp, 'Clear 4-week outcome')
  assert.equal(patch.bible.audience, 'Parents in DE')
  assert.equal(patch.bible.selected_angle.name, 'Niche outcome')
  assert.deepEqual(patch.bible.key_selling_points, ['Plan', 'Obstacles'])
})

test('emptyCustomAngle is custom kind', () => {
  const c = emptyCustomAngle()
  assert.equal(c.strategy_kind, STRATEGY_KINDS.CUSTOM)
})
