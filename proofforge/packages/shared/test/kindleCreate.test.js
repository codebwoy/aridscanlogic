import test from 'node:test'
import assert from 'node:assert/strict'
import { runKdpChecks, KDP_RULES } from '../src/kdpRules.js'
import {
  KINDLE_CREATE_SPECS,
  analyzeKindleCreateStructure,
  kindleCreatePayload,
} from '../src/kindle-create-specs.js'
import { kdpUploadChecklist } from '../src/exportKdpFormats.js'
import { buildCorrectedDocx } from '../src/exportDocx.js'

test('Kindle Create rules are registered', () => {
  const ids = KDP_RULES.map((r) => r.id)
  assert.ok(ids.includes('kdp.ebook.kindle_create_headings'))
  assert.ok(ids.includes('kdp.ebook.kindle_create_kpf'))
  assert.equal(KINDLE_CREATE_SPECS.sourceTopicId, 'G7R2L7V5X6SJH948')
})

test('runKdpChecks flags weak Kindle Create structure', () => {
  const project = {
    title: 'Test',
    publishing_target: 'editorial_only',
    sections: {
      a: { key: 'a', title: '', content_md: 'Hello', order: 0 },
    },
  }
  const { results } = runKdpChecks(project, { wordCountTotal: 10, sectionCount: 1 })
  const headings = results.find((r) => r.rule_id === 'kdp.ebook.kindle_create_headings')
  assert.ok(headings)
  assert.equal(headings.status, 'fail')
})

test('runKdpChecks passes solid chapter structure', () => {
  const project = {
    title: 'Novel',
    author_name: 'Author',
    publishing_target: 'kindle_ebook',
    sections: {
      c: { key: 'c', title: 'Copyright', content_md: '© Novel by Author', order: 0 },
      a: { key: 'a', title: 'Chapter 1', content_md: 'One\n\nTwo', order: 1 },
      b: { key: 'b', title: 'Chapter 2', content_md: 'Three', order: 2 },
    },
  }
  const { results } = runKdpChecks(project, { wordCountTotal: 50, sectionCount: 3 })
  const headings = results.find((r) => r.rule_id === 'kdp.ebook.kindle_create_headings')
  assert.equal(headings.status, 'pass')
  const front = results.find((r) => r.rule_id === 'kdp.ebook.kindle_create_front_matter')
  assert.equal(front.status, 'pass')
})

test('upload checklist includes Kindle Create items', () => {
  const c = kdpUploadChecklist({
    publishing_target: 'kindle_ebook',
    sections: { a: {}, b: {} },
    status: 'draft',
  })
  assert.ok(c.items.some((i) => i.id === 'kc_headings'))
  assert.ok(c.items.some((i) => i.id === 'kc_kcb_backup'))
  assert.ok(c.items.some((i) => i.id === 'kc_hyperlinks'))
  const payload = kindleCreatePayload()
  assert.ok(payload.frontMatterTypes.length > 0)
  assert.ok(payload.hyperlinks)
  assert.ok(payload.indianLanguageNote)
  assert.ok(payload.sectionRoleOptions?.length >= 5)
})

test('EPUB export includes epub:type from section roles', async () => {
  const { buildCorrectedEpub } = await import('../src/exportEpub.js')
  const out = await buildCorrectedEpub({
    title: 'T',
    author_name: 'A',
    sections: {
      a: { key: 'a', title: 'Copyright', content_md: '©', order: 0, section_role: 'copyright' },
      b: { key: 'b', title: 'Chapter 1', content_md: 'Hi', order: 1 },
    },
  })
  assert.ok(out.kindleCreate?.structured)
  const JSZip = (await import('jszip')).default
  const zip = await JSZip.loadAsync(out.bytes)
  const xhtml = await zip.file('OEBPS/chap1.xhtml').async('string')
  assert.match(xhtml, /epub:type="copyright-page"/)
})

test('DOCX export includes page breaks and Kindle Create note', async () => {
  const out = await buildCorrectedDocx({
    id: 't1',
    title: 'Book',
    author_name: 'A',
    sections: {
      a: { key: 'a', title: 'Chapter 1', content_md: 'First para.\n\nSecond para.', order: 0 },
      b: { key: 'b', title: 'Chapter 2', content_md: 'More.', order: 1 },
    },
  })
  assert.ok(out.bytes?.length > 100)
  assert.ok(out.kindleCreate?.structured)
  const analysis = analyzeKindleCreateStructure([
    { title: 'Chapter 1', content_md: 'x' },
    { title: 'Chapter 2', content_md: 'y' },
  ])
  assert.equal(analysis.chapterCount, 2)
})
