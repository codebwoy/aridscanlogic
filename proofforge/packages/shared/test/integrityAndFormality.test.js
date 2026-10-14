import test from 'node:test'
import assert from 'node:assert/strict'
import {
  integrityFindingsFromText,
  terminologyDriftFindings,
  formalityFindingsFromText,
  missingCharacterFindings,
  referenceDocFindings,
  buildStyleReports,
  scoreFromFindings,
  normalizeFinding,
  runKdpChecks,
} from '../src/index.js'

test('integrity flags year spread', () => {
  const text =
    'In 1999 the war began. By 2005 peace came. Then 2010 changed everything. Finally 2018 closed the circle of history for the region forever.'
  const f = integrityFindingsFromText(text, { sectionKey: 's1' })
  assert.ok(f.some((x) => x.subcategory === 'dates'))
})

test('formality flags informal vs formal target', () => {
  const f = formalityFindingsFromText(
    'We are gonna finish the manuscript today and we wanna ship it before the weekend deadline arrives for sure.',
    {
      formality: 'formal',
      language: 'en',
    }
  )
  assert.ok(f.some((x) => x.subcategory === 'formality'))
})

test('missing character list entry', () => {
  const f = missingCharacterFindings('Ada walked home alone in the rain.', ['Ada', 'Malik'])
  assert.ok(f.some((x) => x.original_excerpt === 'Malik'))
})

test('glossary preferred term', () => {
  const f = referenceDocFindings('They used colour throughout.', {
    glossary: [{ term: 'color', preferred: 'color', aliases: ['colour'] }],
  })
  assert.ok(f.some((x) => x.subcategory === 'glossary'))
})

test('terminology drift across sections', () => {
  const f = terminologyDriftFindings([
    { content_md: 'Queen Amara ruled the north.' },
    { content_md: 'queen amara returned south.' },
  ])
  assert.ok(f.length >= 1)
})

test('paragraph length and transitions in style reports', () => {
  const longPara = Array(200).fill('word').join(' ')
  const text = `${longPara}\n\nThen he left. Suddenly she cried. Then rain fell. Then night came.`
  const { reports, findings } = buildStyleReports(text, { language: 'en', sectionKey: 's1' })
  assert.ok(reports.paragraph_length.very_long.length >= 1)
  assert.ok(reports.transitions.overused.some((t) => t.phrase === 'then'))
  assert.ok(findings.some((x) => x.subcategory === 'paragraph_length' || x.subcategory === 'transition'))
})

test('scorecard dimensions + kdp blocking drag readiness', () => {
  const s = scoreFromFindings(
    [{ severity: 'suggestion', category: 'style', resolution: 'open' }],
    { kdpBlocking: 2 }
  )
  assert.ok(s.dimensions)
  assert.ok(s.dimensions.grammar_mechanics != null)
  assert.equal(s.readiness, 'critical_issues_detected')
  assert.ok(s.overall < 90)
})

test('normalizeFinding computes offsets', () => {
  const sectionText = 'She walked to the colour shop yesterday.'
  const r = normalizeFinding(
    {
      category: 'localization',
      severity: 'minor',
      original_excerpt: 'colour shop',
      suggested_correction: 'color shop',
      explanation: 'US',
    },
    { sectionText, analysisRunId: 'run_test' }
  )
  assert.equal(r.ok, true)
  assert.equal(r.finding.start_offset, sectionText.indexOf('colour shop'))
  assert.equal(r.finding.analysis_run_id, 'run_test')
})

test('kdp blank pages and fonts rules present for paperback', () => {
  const kdp = runKdpChecks(
    {
      title: 'Book',
      publishing_target: 'paperback',
      print_config: { trim_size_in: '6x9', outside_margin_in: 0.5, gutter_in: 0.75 },
      sections: {
        a: { key: 'a', order: 0, content_md: 'hello' },
        b: { key: 'b', order: 1, content_md: '' },
        c: { key: 'c', order: 2, content_md: '' },
        d: { key: 'd', order: 3, content_md: '' },
        e: { key: 'e', order: 4, content_md: '' },
        f: { key: 'f', order: 5, content_md: '' },
        g: { key: 'g', order: 6, content_md: 'end' },
      },
    },
    { wordCountTotal: 5000, sectionCount: 7 }
  )
  assert.ok(kdp.results.some((r) => r.rule_id === 'kdp.print.fonts_embed'))
  assert.ok(kdp.results.some((r) => r.rule_id === 'kdp.print.blank_pages' && r.status === 'fail'))
})
