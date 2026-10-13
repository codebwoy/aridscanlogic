/**
 * Series manager — group StoryForge projects by IP Character seriesId.
 * SourceIds: S74. Complements listSeriesIpDna (locked heroes reuse).
 */

export const SERIES_META = {
  id: 'series_manager',
  title: 'Series manager',
  sourceIds: ['S74', 'S59'],
  disclaimer:
    'Groups books that share an IP Character seriesId so you can reuse locked DNA and track catalog progress. Not an Amazon Series Page automation.',
}

/**
 * Aggregate projects into series cards.
 * @param {Array<object>} projects — full or list projections with ip_character
 */
export function buildSeriesCatalog(projects = []) {
  const map = new Map()
  for (const p of projects) {
    const sid = String(p?.ip_character?.seriesId || p?.series_id || '')
      .trim()
    if (!sid) continue
    const key = sid.toLowerCase()
    if (!map.has(key)) {
      map.set(key, {
        seriesId: sid,
        books: [],
        lockedHeroes: 0,
        pinnedAnchors: 0,
      })
    }
    const row = map.get(key)
    const locked = Boolean(p.ip_character?.locked_at)
    const pinned = Boolean(p.pinned_anchor?.heroUrl || p.pinned_anchor_asset_id)
    if (locked) row.lockedHeroes += 1
    if (pinned) row.pinnedAnchors += 1
    row.books.push({
      projectId: p.id,
      title: p.title || 'Untitled',
      progress_step: p.progress_step || 'story',
      page_count: p.page_count,
      format_id: p.format_id,
      ip_locked: locked,
      pinned,
      characterName: p.ip_character?.name || p.pinned_anchor?.name || null,
      updated_at: p.updated_at,
    })
  }
  const series = [...map.values()].map((s) => {
    s.books.sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))
    s.bookCount = s.books.length
    s.updated_at = s.books[0]?.updated_at || null
    return s
  })
  series.sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))
  return { series, meta: SERIES_META }
}

export function seriesPayload() {
  return { meta: SERIES_META }
}
