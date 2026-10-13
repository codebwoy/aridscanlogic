import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { buildSeriesCatalog, SERIES_META } from '../src/series.js'

describe('Series manager catalog (S74)', () => {
  it('groups projects by seriesId', () => {
    const catalog = buildSeriesCatalog([
      {
        id: 'p1',
        title: 'Book One',
        progress_step: 'scenes',
        updated_at: '2026-01-02T00:00:00Z',
        ip_character: { seriesId: 'Kofi-Adventures', name: 'Kofi', locked_at: '2026-01-01' },
        pinned_anchor: { heroUrl: 'data:…', name: 'Kofi' },
      },
      {
        id: 'p2',
        title: 'Book Two',
        progress_step: 'story',
        updated_at: '2026-01-03T00:00:00Z',
        ip_character: { seriesId: 'kofi-adventures', name: 'Ama' },
      },
      {
        id: 'p3',
        title: 'Standalone',
        ip_character: { seriesId: '' },
      },
    ])
    assert.equal(catalog.series.length, 1)
    assert.equal(catalog.series[0].seriesId, 'Kofi-Adventures')
    assert.equal(catalog.series[0].bookCount, 2)
    assert.equal(catalog.series[0].lockedHeroes, 1)
    assert.equal(catalog.series[0].pinnedAnchors, 1)
    assert.equal(catalog.series[0].books[0].projectId, 'p2')
    assert.equal(catalog.meta.id, SERIES_META.id)
  })

  it('returns empty when no series ids', () => {
    const catalog = buildSeriesCatalog([{ id: 'x', title: 'Solo' }])
    assert.deepEqual(catalog.series, [])
  })
})
