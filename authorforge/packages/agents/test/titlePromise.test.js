import test from 'node:test'
import assert from 'node:assert/strict'
import { extractTitlePromises, checkTitlePromises, countNounHits } from '../src/titlePromise.js'
import { flagSweepingClaims } from '../src/factCheck.js'
import { parseManuscriptText, manuscriptToBookPatch } from '../src/manuscriptImport.js'
import { finishRepetitionScan } from '../src/finishScan.js'

test('extractTitlePromises finds countable nouns', () => {
  const p = extractTitlePromises('50 Recipes for Busy Parents', 'A practical guide')
  assert.equal(p.length, 1)
  assert.equal(p[0].count, 50)
  assert.match(p[0].noun, /recipes/i)
})

test('checkTitlePromises flags short delivery', () => {
  const report = checkTitlePromises({
    working_title: '7 Habits for Immigrant Parents',
    outline: { chapters: [{ title: 'Habit overview', writing_direction: 'One habit', children: [] }] },
    sections: {
      a: { title: 'One', content_md: 'This habit matters. Another habit tip.' },
    },
  })
  assert.equal(report.promises.length, 1)
  assert.equal(report.passed, false)
  assert.ok(['short', 'partial'].includes(report.results[0].status))
})

test('countNounHits is plural-tolerant', () => {
  assert.ok(countNounHits('recipe recipes Recipe', 'recipes') >= 3)
})

test('flagSweepingClaims suggests milder wording', () => {
  const f = flagSweepingClaims('This method always outperforms all alternatives for everyone.')
  assert.ok(f.length >= 1)
  assert.match(f[0].milder, /often|many/i)
})

test('parseManuscriptText detects markdown chapters', () => {
  const parsed = parseManuscriptText('# Intro\nHello world.\n\n# Practice\nDo the work.')
  assert.equal(parsed.chapters.length, 2)
  assert.equal(parsed.chapters[0].title, 'Intro')
  const patch = manuscriptToBookPatch(parsed)
  assert.equal(patch.outline.chapters.length, 2)
  assert.ok(Object.keys(patch.sections).length === 2)
})

test('finishRepetitionScan handles empty book', async () => {
  const r = await finishRepetitionScan({ sections: {} })
  assert.equal(r.passed, true)
  assert.match(r.note, /No written/)
})

test('finishRepetitionScan flags cross-section overlap', async () => {
  const blob =
    'The weekly drill builds confidence through repeated practice and clear feedback loops for families. '.repeat(8)
  const r = await finishRepetitionScan({
    sections: {
      a: { title: 'A', content_md: blob },
      b: { title: 'B', content_md: blob },
    },
  })
  assert.ok(r.pairs.length >= 1 || r.sections.some((s) => s.severity !== 'ok'))
})
