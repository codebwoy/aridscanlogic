import { test } from 'node:test'
import assert from 'node:assert/strict'
import { FakeLLMProvider } from '../src/fakeProvider.js'

test('FakeLLMProvider returns fiction outline JSON', async () => {
  const p = new FakeLLMProvider()
  const r = await p.complete({
    modelClass: 'cheap',
    system: 'OutlineAgent',
    messages: [{ role: 'user', content: 'Generate outline' }],
  })
  const data = JSON.parse(r.text)
  assert.ok(Array.isArray(data.chapters))
  assert.equal(data.chapters.length, 8)
  assert.equal(r.costUsd, 0)
})

test('FakeLLMProvider section returns fiction prose', async () => {
  const p = new FakeLLMProvider()
  const r = await p.complete({
    modelClass: 'draft',
    system: 'WriterAgent content_md fiction',
    messages: [{ role: 'user', content: JSON.stringify({ node: { title: 'Arrival' } }) }],
    metadata: { targetWords: 200, promptName: 'writer' },
  })
  const data = JSON.parse(r.text)
  assert.ok(data.content_md.length > 40)
  assert.ok(Array.isArray(data.characters_on_page))
  assert.equal(data.story_slots, undefined)
})

test('FakeLLMProvider title wins even when fiction co-writer rules are in system', async () => {
  const p = new FakeLLMProvider()
  const r = await p.complete({
    modelClass: 'cheap',
    system: 'You are a professional adult fiction co-writer.\n\nTitleAgent: title variations.',
    messages: [{ role: 'user', content: '{"seed":"Test"}' }],
    metadata: { promptName: 'title', promptKey: 'title.v1' },
  })
  const data = JSON.parse(r.text)
  assert.ok(Array.isArray(data.options))
  assert.ok(data.options.length >= 3)
  assert.ok(data.options[0].title)
})
