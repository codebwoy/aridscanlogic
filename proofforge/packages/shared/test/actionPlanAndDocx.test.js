import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildActionPlan,
  buildCorrectedDocx,
  kidsSafeguardFindings,
} from '../src/index.js'

test('action plan orders dialogue before structure', () => {
  const plan = buildActionPlan(
    [
      {
        id: '1',
        category: 'structure',
        subcategory: 'pacing',
        severity: 'suggestion',
        title: 'Pace',
        original_excerpt: 'x',
        resolution: 'open',
      },
      {
        id: '2',
        category: 'style',
        subcategory: 'dialogue',
        severity: 'moderate',
        title: 'Dialogue',
        original_excerpt: 'y',
        resolution: 'open',
      },
      {
        id: '3',
        category: 'grammar',
        subcategory: 'dup',
        severity: 'minor',
        title: 'Dup',
        original_excerpt: 'the the',
        resolution: 'open',
      },
    ],
    { scores: { overall: 70, readiness: 'needs_work' } }
  )
  assert.ok(plan.steps.length >= 2)
  assert.equal(plan.steps[0].id, 'dialogue')
  assert.ok(plan.recommended_order.includes('easy_wins'))
})

test('kids safeguards flag children projects', () => {
  const findings = kidsSafeguardFindings('A gentle story.', 'children')
  assert.ok(findings.some((f) => f.subcategory === 'age_appropriateness'))
})

test('docx export returns zip bytes', async () => {
  const { bytes } = await buildCorrectedDocx({
    id: 't1',
    title: 'Test',
    sections: {
      s1: { key: 's1', title: 'One', order: 0, content_md: 'Hello world.\n\nSecond paragraph.' },
    },
  })
  assert.ok(bytes.length > 100)
  // ZIP magic
  assert.equal(bytes[0], 0x50)
  assert.equal(bytes[1], 0x4b)
})
