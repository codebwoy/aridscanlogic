import test from 'node:test'
import assert from 'node:assert/strict'
import { z } from 'zod'
import { parseAgentJson } from '../src/registry.js'

const anglesSchema = z.object({
  angles: z.array(
    z.object({
      name: z.string(),
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
