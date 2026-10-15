import { test } from 'node:test'
import assert from 'node:assert/strict'
import JSZip from 'jszip'
import { buildDocx } from '../src/docx.js'
import { buildEpub } from '../src/epub.js'
import { buildKdpPackage } from '../src/kdpPackage.js'

test('DOCX includes Heading 1 and page breaks for Kindle Create', async () => {
  const { bytes, kindleCreate } = await buildDocx({
    title: 'Demo',
    author: 'Ada',
    chapters: [
      { title: 'Copyright', content_md: '© 2026', role: 'copyright' },
      { title: 'Chapter 1', content_md: 'First para.\n\nSecond para.' },
      { title: 'Chapter 2', content_md: 'More.' },
    ],
  })
  assert.ok(kindleCreate?.structured)
  assert.equal(kindleCreate.sectionCount, 3)
  const zip = await JSZip.loadAsync(bytes)
  const xml = await zip.file('word/document.xml').async('string')
  assert.match(xml, /Heading1|w:val="Heading1"|w:outlineLvl/)
  assert.match(xml, /w:pageBreakBefore|w:br w:type="page"|pageBreakBefore/)
  assert.match(xml, /Chapter 1/)
})

test('EPUB uses epub:type and TOC from classified roles', async () => {
  const { bytes } = await buildEpub({
    title: 'Demo',
    author: 'Ada',
    chapters: [
      { title: 'Copyright', content_md: '©', role: 'copyright' },
      { title: 'Chapter 1', content_md: 'Body' },
    ],
    language: 'en',
  })
  const zip = await JSZip.loadAsync(bytes)
  const chap1 = await zip.file('OEBPS/chap1.xhtml').async('string')
  assert.match(chap1, /epub:type="copyright-page"/)
  const chap2 = await zip.file('OEBPS/chap2.xhtml').async('string')
  assert.match(chap2, /epub:type="chapter"/)
  const nav = await zip.file('OEBPS/nav.xhtml').async('string')
  assert.match(nav, /Chapter 1/)
})

test('KDP package includes KINDLE-CREATE-NOTES.txt', async () => {
  const pack = await buildKdpPackage({
    book: { working_title: 'T', author_name: 'A', trim_size: '6x9', language: 'en' },
    chapters: [
      { title: 'Chapter 1', content_md: 'Hello world.' },
      { title: 'Chapter 2', content_md: 'Again.' },
    ],
  })
  assert.ok(pack.files.includes('KINDLE-CREATE-NOTES.txt'))
  const zip = await JSZip.loadAsync(pack.bytes)
  const notes = await zip.file('KINDLE-CREATE-NOTES.txt').async('string')
  assert.match(notes, /Kindle Create/)
  assert.match(notes, /G7R2L7V5X6SJH948|kdp\.amazon/)
  const preflight = JSON.parse(await zip.file('preflight.json').async('string'))
  assert.ok(preflight.kindle_create?.structured || preflight.kindle_create?.structure)
})
