import test from 'node:test'
import assert from 'node:assert/strict'
import { z } from 'zod'
import { parseAgentJson } from '../src/registry.js'

const anglesSchema = z.object({
  angles: z.array(
    z.object({
      strategy_kind: z.string().optional(),
      strategy_label: z.string().optional(),
      name: z.string(),
      proposed_title: z.string().optional().default(''),
      proposed_subtitle: z.string().optional().default(''),
      target_audience: z.string().optional().default(''),
      reader_problem: z.string().optional().default(''),
      unique_value: z.string().optional().default(''),
      differentiation: z.string().optional().default(''),
      evidence: z.array(z.string()).optional().default([]),
      risks: z.array(z.string()).optional().default([]),
      must_contain: z.array(z.string()).optional().default([]),
      toc_direction: z.string().optional().default(''),
      rationale: z.string(),
      confidence: z.string().optional(),
    })
  ),
  disclaimer: z.string().optional(),
})

test('parseAgentJson wraps root array as angles', () => {
  const out = parseAgentJson(
    JSON.stringify([{ name: 'A', rationale: 'Because', confidence: 'low' }]),
    anglesSchema
  )
  assert.equal(out.angles.length, 1)
  assert.equal(out.angles[0].name, 'A')
})

test('parseAgentJson maps title/reason aliases', () => {
  const out = parseAgentJson(
    JSON.stringify({
      positioning: [{ title: 'Niche down', reason: 'Clearer reader' }],
    }),
    anglesSchema
  )
  assert.equal(out.angles[0].name, 'Niche down')
  assert.equal(out.angles[0].rationale, 'Clearer reader')
})

test('parseAgentJson keeps rich positioning fields', () => {
  const out = parseAgentJson(
    JSON.stringify({
      angles: [
        {
          strategy_kind: 'more_value',
          strategy_label: 'MORE VALUE',
          name: 'Depth',
          proposed_title: 'Workbook Plus',
          unique_value: 'More drills',
          evidence: ['Gap in comps'],
          risks: ['Length'],
          must_contain: ['Tracker'],
          toc_direction: 'Practice-heavy',
          rationale: 'More value',
          confidence: 'high',
        },
      ],
    }),
    anglesSchema
  )
  assert.equal(out.angles[0].strategy_kind, 'more_value')
  assert.equal(out.angles[0].proposed_title, 'Workbook Plus')
  assert.deepEqual(out.angles[0].evidence, ['Gap in comps'])
  assert.deepEqual(out.angles[0].must_contain, ['Tracker'])
})

test('parseAgentJson throws readable error', () => {
  assert.throws(
    () => parseAgentJson(JSON.stringify({ nope: true }), anglesSchema),
    /failed validation/
  )
})

const titlesSchema = z.object({
  options: z.array(
    z.object({
      title: z.string().min(1),
      subtitle: z.string().default(''),
      risk: z.string().optional(),
    })
  ),
  warnings: z.array(z.string()).optional(),
})

test('parseAgentJson maps titles alias and fills missing subtitle', () => {
  const out = parseAgentJson(
    JSON.stringify({
      titles: [{ title: 'Clear Work', tagline: 'Quiet wins' }, { name: 'Ship It' }],
    }),
    titlesSchema
  )
  assert.equal(out.options.length, 2)
  assert.equal(out.options[0].subtitle, 'Quiet wins')
  assert.equal(out.options[1].title, 'Ship It')
  assert.equal(out.options[1].subtitle, '')
})

test('parseAgentJson wraps root title array as options', () => {
  const out = parseAgentJson(
    JSON.stringify([{ title: 'A', subtitle: 'B' }]),
    titlesSchema
  )
  assert.equal(out.options[0].title, 'A')
})
