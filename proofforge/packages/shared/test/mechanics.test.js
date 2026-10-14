import test from 'node:test'
import assert from 'node:assert/strict'
import {
  duplicateWordFindings,
  confusedWordFindings,
  wordinessFindings,
  styleGuideFindings,
  citationFindings,
  highStakesFindings,
  toneConsistencyFindings,
  mechanicsFindings,
  runKdpChecks,
} from '../src/index.js'

test('duplicate words flagged', () => {
  const f = duplicateWordFindings('She she walked home slowly.')
  assert.ok(f.some((x) => x.subcategory === 'duplicate_word'))
})

test('confused word pairs when both present', () => {
  const f = confusedWordFindings('Their house is over there by the lake.', {
    language: 'en',
  })
  assert.ok(f.some((x) => x.subcategory === 'confused_words'))
})

test('wordiness phrases flagged', () => {
  const f = wordinessFindings('We met in order to discuss the end result of the project.')
  assert.ok(f.some((x) => x.subcategory === 'wordiness' || x.subcategory === 'redundancy'))
})

test('style guide prefer/never', () => {
  const f = styleGuideFindings('Suddenly the door opened.', 'prefer abruptly not suddenly\nnever use suddenly')
  assert.ok(f.some((x) => x.subcategory === 'style_guide'))
})

test('citation style mix', () => {
  const text = 'Smith (2020) argued X. Later work [1] and [2] disagree.'
  const f = citationFindings(text)
  assert.ok(f.some((x) => x.subcategory === 'citation'))
})

test('high stakes disclaimer', () => {
  const f = highStakesFindings('Patients should take this dosage daily as prescribed.', {
    bookType: 'nonfiction',
    documentDomain: 'academic',
  })
  assert.ok(f.some((x) => x.subcategory === 'high_stakes'))
})

test('tone consistency across sections', () => {
  const sections = [
    { key: 'a', title: '1', content_md: 'Love hope joy glad warm grateful proud brave kind thank delight peace.' },
    { key: 'b', title: '2', content_md: 'Hope love joy glad warm grateful proud brave kind thank delight.' },
    {
      key: 'c',
      title: '3',
      content_md: 'Hate anger fear dread cruel bitter rage despair grief panic hurt lonely darkness.',
    },
  ]
  const f = toneConsistencyFindings(sections)
  assert.ok(f.length >= 1)
})

test('mechanics bundle returns findings', () => {
  const f = mechanicsFindings('She she went in order to finish the past history.', {
    language: 'en',
    sectionKey: 's1',
  })
  assert.ok(f.length >= 2)
})

test('ISBN rule when label without number', () => {
  const kdp = runKdpChecks(
    {
      title: 'Book',
      publishing_target: 'paperback',
      print_config: { trim_size_in: '6x9', outside_margin_in: 0.5, gutter_in: 0.5 },
      sections: { a: { key: 'a', content_md: 'Copyright 2026. ISBN pending assignment.' } },
    },
    { wordCountTotal: 40000, sectionCount: 8 }
  )
  assert.ok(kdp.results.some((r) => r.rule_id === 'kdp.print.isbn_format' && r.status === 'fail'))
})
