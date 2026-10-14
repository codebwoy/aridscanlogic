import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildStyleReports,
  runKdpChecks,
  localizationFindings,
  filterFindingsByPreferences,
  buildCsvFindings,
} from '../src/index.js'

test('style reports flag cliches and sentence starts', () => {
  const text = `At the end of the day she smiled. At the end of the day he left. At the end of the day they met. At the end of the day rain fell. Suddenly she quickly slowly walked.`
  const { reports, findings } = buildStyleReports(text, { language: 'en', sectionKey: 's1' })
  assert.ok(reports.cliches.length >= 1)
  assert.ok(findings.some((f) => f.subcategory === 'cliche' || f.subcategory === 'adverb'))
})

test('localization finds UK spelling when US variety selected', () => {
  const section = {
    key: 's1',
    title: 'Ch1',
    content_md: 'The colour of the centre was odd.',
  }
  const f = localizationFindings(section, 'en', 'us')
  assert.ok(f.some((x) => x.original_excerpt.toLowerCase().includes('colour')))
})

test('kdp gutter needs config when print margins missing', () => {
  const kdp = runKdpChecks(
    { title: 'Book', publishing_target: 'paperback', print_config: {} },
    { wordCountTotal: 50000, sectionCount: 12 }
  )
  assert.ok(kdp.summary.needs_config >= 1)
  assert.ok(kdp.estimated_pages >= 24)
})

test('preferences can disable cliche findings', () => {
  const filtered = filterFindingsByPreferences(
    [{ category: 'style', subcategory: 'cliche', title: 'c' }],
    { style_cliches: false }
  )
  assert.equal(filtered.length, 0)
})

test('csv export has header', () => {
  const csv = buildCsvFindings([{ id: '1', severity: 'minor', category: 'grammar', title: 't' }])
  assert.ok(csv.startsWith('id,'))
})
