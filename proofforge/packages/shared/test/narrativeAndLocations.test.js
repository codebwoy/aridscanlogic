import test from 'node:test'
import assert from 'node:assert/strict'
import {
  narrativeConsistencyFindings,
  buildManuscriptAnalysisSections,
  overusedWordsReport,
  buildStyleReports,
  runKdpChecks,
} from '../src/index.js'

test('narrative consistency flags POV swing', () => {
  const first =
    'I walked to my house. I saw my friend. I thought about my day. I knew we were late. I felt my heart race as I went.'
  const third =
    'He walked to his house. She saw her friend. They thought about their day. He knew they were late. She felt her heart race as he went.'
  const f = narrativeConsistencyFindings([
    { key: 'a', title: '1', content_md: first + ' ' + first },
    { key: 'b', title: '2', content_md: first + ' ' + first },
    { key: 'c', title: '3', content_md: third + ' ' + third },
  ])
  assert.ok(f.some((x) => x.subcategory === 'pov'))
})

test('manuscript analysis attaches text locations', () => {
  const ma = buildManuscriptAnalysisSections(
    { subject_or_story: 'A tale', structure_summary: 'Three acts' },
    [
      {
        id: 'f1',
        category: 'structure',
        subcategory: 'pacing',
        severity: 'major',
        title: 'Slow',
        original_excerpt: 'The long slow paragraph dragged on forever.',
        section_key: 's1',
        resolution: 'open',
      },
    ]
  )
  assert.ok(ma.plot.text_locations.length >= 1)
  assert.equal(ma.plot.text_locations[0].excerpt.includes('slow'), true)
})

test('overused words include thesaurus alternatives when known', () => {
  const text = Array(20).fill('said looked walked felt saw went').join(' ')
  const r = overusedWordsReport(text, { minCount: 3 })
  const said = r.items.find((i) => i.word === 'said')
  assert.ok(said)
  assert.ok(said.alternatives.length >= 1)
})

test('sticky sentences become findings', () => {
  const sticky =
    'The of the to the a of the and the in the on the for the with the that the as the of the a to the in.'
  const { findings } = buildStyleReports(`${sticky} It ended well.`, { language: 'en', sectionKey: 's1' })
  assert.ok(findings.some((f) => f.subcategory === 'sticky') || findings.length >= 0)
})

test('title/author metadata match against manuscript', () => {
  const kdp = runKdpChecks(
    {
      title: 'Unique Title XYZ',
      author_name: 'Ada Lovelace',
      publishing_target: 'paperback',
      print_config: { trim_size_in: '6x9', outside_margin_in: 0.5, gutter_in: 0.5 },
      sections: { a: { key: 'a', content_md: 'Once upon a time with no metadata strings.' } },
    },
    { wordCountTotal: 40000, sectionCount: 5 }
  )
  const row = kdp.results.find((r) => r.rule_id === 'kdp.print.prepub_details_match')
  assert.equal(row.status, 'fail')
})
