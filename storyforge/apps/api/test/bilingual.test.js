import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createMemoryStore } from '../src/db/memoryStore.js'
import { buildInteriorPdf } from '../src/services/pdfExport.js'
import { normalizeLanguagePair } from '@storyforge/shared'

describe('bilingual project mode', () => {
  it('stores selectable primary + secondary pairs (not DE-only)', async () => {
    const store = createMemoryStore({ persist: false })
    const user = await store.ensureUser('bilingual-test')
    const project = await store.createProject(user.id, {
      title: 'Hola Luna',
      language: 'es',
      secondary_language: 'tw',
      bilingual_layout: 'side_by_side',
      page_count: 24,
    })
    assert.equal(project.language, 'es')
    assert.equal(project.secondary_language, 'tw')
    assert.equal(project.bilingual_layout, 'side_by_side')
    assert.equal(project.pages[0].text_secondary, '')

    const page = await store.setPage(user.id, project.id, 0, {
      text_content: 'Te quiero',
      text_secondary: 'Me dɔ wo',
    })
    assert.equal(page.text_content, 'Te quiero')
    assert.equal(page.text_secondary, 'Me dɔ wo')

    const updated = await store.updateProject(user.id, project.id, {
      language: 'fr',
      secondary_language: 'ig',
      bilingual_layout: 'stacked',
      secondary_verified: true,
    })
    assert.equal(updated.language, 'fr')
    assert.equal(updated.secondary_language, 'ig')
    assert.equal(updated.secondary_verified, true)
  })

  it('normalizer rejects same-language pairs', () => {
    const r = normalizeLanguagePair({ primary: 'it', secondary: 'it' })
    assert.equal(r.ok, false)
  })

  it('interior PDF accepts bilingual page texts', async () => {
    const pdf = await buildInteriorPdf({
      title: 'Ciao Amico',
      trimId: 'sq_85',
      pageCount: 2,
      language: 'it',
      secondaryLanguage: 'en',
      bilingualLayout: 'stacked',
      pages: [
        {
          page_index: 0,
          text_content: 'Ciao amico',
          text_secondary: 'Hello friend',
        },
        {
          page_index: 1,
          text_content: 'Buonanotte',
          text_secondary: 'Good night',
        },
      ],
    })
    assert.equal(pdf.printReady, true)
    assert.equal(pdf.pageCount, 2)
    assert.ok(pdf.byteLength > 400)
  })
})
