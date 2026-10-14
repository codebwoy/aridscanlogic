import test from 'node:test'
import assert from 'node:assert/strict'
import { createLlmProvider } from '@proofforge/llm'
import { runManuscriptAnalysis, parseAgentJson } from '../src/index.js'

test('parseAgentJson validates proofread output', () => {
  const data = parseAgentJson(
    JSON.stringify({
      findings: [
        {
          category: 'grammar',
          severity: 'minor',
          title: 'Dup',
          explanation: 'x',
          original_excerpt: 'the the',
          suggested_correction: 'the',
        },
      ],
    }),
    'proofread.v1'
  )
  assert.equal(data.findings.length, 1)
})

test('runManuscriptAnalysis returns findings with fake LLM', async () => {
  const llm = createLlmProvider({ provider: 'fake' })
  const project = {
    title: 'Test Book',
    language: 'en',
    language_variety: 'us',
    book_type: 'fiction',
    edit_mode: 'natural',
    sections: {
      s1: {
        key: 's1',
        title: 'Chapter 1',
        order: 0,
        content_md:
          'She she walked to the market and she she smiled at the colour of the sky over Berlin.',
        word_count: 20,
      },
    },
  }
  const result = await runManuscriptAnalysis(llm, project)
  assert.ok(result.overview)
  assert.ok(Array.isArray(result.findings))
  assert.ok(result.findings.length >= 1)
  assert.ok(result.scores.overall >= 0)
  assert.ok(result.chapter_critiques?.length >= 1)
  assert.ok(result.word_gate)
  assert.ok(result.manuscript_analysis?.about_story)
  assert.ok(result.tone?.overall)
  assert.ok(result.findings.some((f) => f.feedback_level))
  assert.equal(result.coverage.checks.chapter_critique, true)
  assert.equal(result.coverage.checks.pdf_ocr, true)
  assert.equal(result.coverage.checks.manuscript_analysis_sections, true)
  assert.equal(result.coverage.checks.tone_detector, true)
  assert.ok(result.style_reports?.summary_report)
  assert.ok(result.style_reports?.overused_words)
  assert.ok(result.style_reports?.sentence_structure)
  assert.equal(result.coverage.checks.summary_report, true)
  assert.ok(result.action_plan?.steps)
  assert.equal(result.coverage.checks.action_plan, true)
})

test('translation mode and plagiarism consent paths', async () => {
  process.env.PROOFFORGE_PLAGIARISM_PROVIDER = 'mock'
  const llm = createLlmProvider({ provider: 'fake' })
  const project = {
    title: 'Bilingual',
    language: 'en',
    language_variety: 'us',
    book_type: 'fiction',
    translation_mode: true,
    plagiarism_consent: true,
    document_domain: 'creative',
    sections: {
      s1: {
        key: 's1',
        title: 'One',
        order: 0,
        content_md: 'She walked. Der Himmel war grau over the Spree.',
        word_count: 10,
      },
    },
  }
  const result = await runManuscriptAnalysis(llm, project)
  assert.ok(result.translation)
  assert.ok(result.plagiarism)
  assert.equal(result.plagiarism.provider, 'mock')
  assert.equal(result.coverage.plagiarism_consent, true)
  delete process.env.PROOFFORGE_PLAGIARISM_PROVIDER
})
