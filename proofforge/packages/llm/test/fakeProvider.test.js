import test from 'node:test'
import assert from 'node:assert/strict'
import { createLlmProvider } from '../src/index.js'

test('fake provider returns proofread JSON', async () => {
  const llm = createLlmProvider({ provider: 'fake' })
  const res = await llm.complete({
    modelClass: 'cheap',
    system: 'ProofreadAgent: return findings JSON',
    messages: [
      {
        role: 'user',
        content: '<<<SECTION>>>\nShe she walked home.\n<<<END>>>',
      },
    ],
    metadata: { promptName: 'proofread.v1' },
  })
  const parsed = JSON.parse(res.text)
  assert.ok(Array.isArray(parsed.findings))
  assert.ok(parsed.findings.length >= 1)
})
