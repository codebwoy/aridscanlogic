import test from 'node:test'
import assert from 'node:assert/strict'
import {
  assessWordCount,
  wordCountGateFinding,
  filterFindingsByDomain,
  documentDomainPayload,
  runKdpChecks,
  KDP_RULES,
} from '../src/index.js'

test('word count gate soft-flags short manuscripts', () => {
  const a = assessWordCount(800)
  assert.equal(a.status, 'too_short')
  assert.ok(wordCountGateFinding(a))
  const ok = assessWordCount(50_000)
  assert.equal(ok.status, 'ok')
  assert.equal(wordCountGateFinding(ok), null)
})

test('document domains suppress style noise in creative', () => {
  const payload = documentDomainPayload()
  assert.ok(payload.domains.some((d) => d.id === 'creative'))
  const findings = [
    { category: 'style', subcategory: 'adverb', title: 'adv' },
    { category: 'grammar', subcategory: 'dup', title: 'g' },
    { category: 'structure', subcategory: 'pacing', title: 'pace' },
  ]
  const filtered = filterFindingsByDomain(findings, 'creative')
  assert.ok(filtered.some((f) => f.category === 'grammar'))
  assert.ok(!filtered.some((f) => f.subcategory === 'adverb'))
  assert.ok(!filtered.some((f) => f.subcategory === 'pacing'))
})

test('KDP rules include content guidelines and AI disclosure', () => {
  assert.ok(KDP_RULES.some((r) => r.id === 'kdp.policy.content_guidelines'))
  assert.ok(KDP_RULES.some((r) => r.id === 'kdp.policy.ai_disclosure'))
  const kdp = runKdpChecks(
    { title: 'T', publishing_target: 'kindle_ebook' },
    { wordCountTotal: 40_000, sectionCount: 8 }
  )
  assert.ok(kdp.results.some((r) => r.rule_id === 'kdp.policy.ai_disclosure'))
  assert.ok(kdp.results.some((r) => r.finding?.category === 'kdp_policy'))
})
