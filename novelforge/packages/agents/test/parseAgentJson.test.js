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

test('parseAgentJson salvages truncated content_md', () => {
  const prose =
    'Ama stepped off the S-Bahn into cold Berlin air and kept walking toward the flat she still called temporary. '.repeat(
      3
    )
  const out = parseAgentJson(`\`\`\`json\n{ "content_md": "${prose}`, writerSchema)
  assert.match(out.content_md, /S-Bahn/)
  assert.match(out.content_md, /cut off/i)
})

test('parseAgentJson repairs dialogue quotes inside content_md', () => {
  const broken = `{
  "content_md": "She said "Papa, I'm listening," and meant it for the first time.",
  "scene_goal": "Face the call",
  "characters_on_page": ["Ama"],
  "open_loops": ["flight?"],
  "continuity_notes": ["evening"]
}`
  const out = parseAgentJson(broken, writerSchema)
  assert.match(out.content_md, /Papa/)
  assert.match(out.content_md, /listening/)
  assert.equal(out.scene_goal, 'Face the call')
})

test('parseAgentJson accepts delimited NF_PROSE writer format', () => {
  const text = `<<<NF_META>>>
{"scene_goal":"Arrive","characters_on_page":["Ama"],"open_loops":[],"continuity_notes":[]}
<<<NF_PROSE>>>
She said "I'm home," and the hallway smelled like rain.
<<<NF_END>>>`
  const out = parseAgentJson(text, writerSchema)
  assert.match(out.content_md, /I'm home/)
  assert.equal(out.scene_goal, 'Arrive')
})
