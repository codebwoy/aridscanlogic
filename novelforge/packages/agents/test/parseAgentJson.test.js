import test from 'node:test'
import assert from 'node:assert/strict'
import { z } from 'zod'
import { parseAgentJson } from '../src/registry.js'

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
      titles: [{ title: 'Soft Landing', tagline: 'A novel' }, { name: 'Two Homes' }],
    }),
    titlesSchema
  )
  assert.equal(out.options.length, 2)
  assert.equal(out.options[0].subtitle, 'A novel')
  assert.equal(out.options[1].title, 'Two Homes')
  assert.equal(out.options[1].subtitle, '')
})

test('parseAgentJson wraps root title array as options', () => {
  const out = parseAgentJson(JSON.stringify([{ title: 'A', subtitle: 'B' }]), titlesSchema)
  assert.equal(out.options[0].title, 'A')
})

test('parseAgentJson throws readable error', () => {
  assert.throws(
    () => parseAgentJson(JSON.stringify({ nope: true }), titlesSchema),
    /failed validation/
  )
})
