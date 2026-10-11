import { test } from 'node:test'
import assert from 'node:assert/strict'
import { FakeLLMProvider } from '../src/fakeProvider.js'

test('FakeLLMProvider returns outline JSON without invented stats', async () => {
  const p = new FakeLLMProvider()
  const r = await p.complete({
    modelClass: 'cheap',
    system: 'OutlineAgent',
    messages: [{ role: 'user', content: 'Generate outline for focus tags' }],
  })
  const data = JSON.parse(r.text)
  assert.ok(Array.isArray(data.chapters))
  assert.equal(data.chapters.length, 8)
  assert.equal(r.costUsd, 0)
})

test('FakeLLMProvider section includes story slot markers', async () => {
  const p = new FakeLLMProvider()
  const r = await p.complete({
    modelClass: 'draft',
    system: 'WriterAgent content_md',
    messages: [{ role: 'user', content: 'Write section' }],
    metadata: { targetWords: 200 },
  })
  const data = JSON.parse(r.text)
  assert.ok(data.content_md.includes('STORY_SLOT'))
  assert.ok(Array.isArray(data.story_slots))
})
