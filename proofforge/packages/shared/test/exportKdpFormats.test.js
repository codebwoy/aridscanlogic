import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildPlainTextManuscript,
  buildEbookHtml,
  buildRtfManuscript,
  kdpUploadChecklist,
} from '../src/index.js'

const project = {
  id: 'p1',
  title: 'Demo',
  author_name: 'Ada',
  language: 'en',
  status: 'analyzed',
  scores: { counts: { critical: 0 } },
  publishing_target: 'multiple',
  print_config: { trim_size_in: '6x9', outside_margin_in: 0.5, gutter_in: 0.75 },
  sections: {
    a: { key: 'a', order: 0, title: 'One', content_md: 'Hello **world**.\n\nNext para.' },
  },
}

test('plain text strips markdown markers', () => {
  const { text, filename } = buildPlainTextManuscript(project)
  assert.ok(text.includes('Hello world'))
  assert.ok(!text.includes('**'))
  assert.ok(filename.endsWith('.txt'))
})

test('ebook html includes title and chapter', () => {
  const { html, filename } = buildEbookHtml(project)
  assert.ok(html.includes('<!DOCTYPE html>'))
  assert.ok(html.includes('Demo'))
  assert.ok(html.includes('One'))
  assert.ok(filename.endsWith('.html'))
})

test('rtf manuscript is valid-ish RTF with title', () => {
  const { text, filename } = buildRtfManuscript(project)
  assert.ok(text.startsWith('{\\rtf1'))
  assert.ok(text.includes('Demo'))
  assert.ok(text.includes('Ada'))
  assert.ok(filename.endsWith('.rtf'))
})

test('kdp checklist includes ebook and print items', () => {
  const c = kdpUploadChecklist(project)
  assert.ok(c.items.some((i) => i.id === 'previewer_ebook'))
  assert.ok(c.items.some((i) => i.id === 'print_pdf'))
  assert.ok(c.items.find((i) => i.id === 'trim')?.done)
  assert.ok(c.formats.kindle_ebook.includes('docx'))
  assert.ok(c.formats.kindle_ebook.includes('rtf'))
  assert.equal(
    c.items.find((i) => i.id === 'cover')?.link,
    'https://kdp.amazon.com/en_US/cover-calculator'
  )
})
