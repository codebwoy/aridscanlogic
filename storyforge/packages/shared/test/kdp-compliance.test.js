import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  emptyComplianceChecklist,
  assessComplianceGate,
  missingComplianceItems,
  stampComplianceIfComplete,
  TRACEABILITY,
} from '../src/index.js'

function completeCompliance(overrides = {}) {
  return {
    ...emptyComplianceChecklist(),
    isbn_plan_acknowledged: true,
    isbn_choice: 'mvb_own',
    trademark_self_checked: true,
    rights_docs_acknowledged: true,
    used_ai: true,
    ai_generation_mode: 'prompt',
    ai_disclose_acknowledged: true,
    single_account_acknowledged: true,
    no_review_manipulation_acknowledged: true,
    ...overrides,
  }
}

describe('kdp compliance checklist', () => {
  it('requires core prevention items', () => {
    const missing = missingComplianceItems(emptyComplianceChecklist())
    assert.ok(missing.length >= 5)
    assert.ok(missing.some((m) => /ISBN/i.test(m)))
    assert.ok(missing.some((m) => /Trademark/i.test(m)))
    assert.ok(missing.some((m) => /Rights/i.test(m)))
    assert.ok(missing.some((m) => /AI/i.test(m)))
  })

  it('passes when fully acknowledged', () => {
    const gate = assessComplianceGate(completeCompliance())
    assert.equal(gate.ok, true)
    assert.equal(gate.missing.length, 0)
    assert.equal(gate.disclosure.recommendDisclose, true)
  })

  it('stamps completed_at when complete', () => {
    const stamped = stampComplianceIfComplete(completeCompliance())
    assert.ok(stamped.completed_at)
  })

  it('traceability S66 done', () => {
    assert.ok(TRACEABILITY.some((t) => t.id === 'S66' && t.status === 'done'))
  })
})
