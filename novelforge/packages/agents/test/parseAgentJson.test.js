import test from 'node:test'
import assert from 'node:assert/strict'
import { z } from 'zod'
import { extractJsonPayload, parseAgentJson } from '../src/registry.js'

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

const writerSchema = z.object({
  content_md: z.string(),
  scene_goal: z.string().optional().default(''),
  characters_on_page: z.array(z.string()).default([]),
  open_loops: z.array(z.string()).default([]),
  continuity_notes: z.array(z.string()).default([]),
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

test('parseAgentJson strips markdown fence without closing fence', () => {
  const out = parseAgentJson(
    '```json\n{"content_md":"Ama stepped off the S-Bahn into cold Berlin air and kept walking."}\n',
    writerSchema
  )
  assert.match(out.content_md, /S-Bahn/)
})

test('parseAgentJson keeps triple backticks inside content_md', () => {
  const out = parseAgentJson(
    '```json\n{"content_md":"He wrote ```js\\ncode``` in his notes, then left."}\n```',
    writerSchema
  )
  assert.match(out.content_md, /```js/)
})

test('extractJsonPayload explains truncated fence responses', () => {
  assert.throws(
    () => extractJsonPayload('```json\n{ "content_md": "Hello there'),
    /cut off|incomplete JSON/i
  )
})
