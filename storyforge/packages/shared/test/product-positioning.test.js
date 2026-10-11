import test from 'node:test'
import assert from 'node:assert/strict'
import {
  STORYFORGE_PRODUCT,
  STORYFORGE_NICHES,
  applyStoryforgeNiche,
  STORYFORGE_MARKET_DISCLAIMER,
} from '../src/index.js'

test('StoryForge product is children’s picture books with AuthorForge sibling', () => {
  assert.equal(STORYFORGE_PRODUCT.category, 'childrens_picture_books')
  assert.equal(STORYFORGE_PRODUCT.sibling, 'authorforge')
  assert.match(STORYFORGE_MARKET_DISCLAIMER, /⚠/)
})

test('StoryForge niches seed bilingual Twi pairs', () => {
  assert.ok(STORYFORGE_NICHES.length >= 2)
  const en = applyStoryforgeNiche('bilingual_childrens_books')
  assert.equal(en.language, 'tw')
  assert.equal(en.secondary_language, 'en')
  const de = applyStoryforgeNiche('bilingual_childrens_books_de')
  assert.equal(de.secondary_language, 'de')
  const activity = applyStoryforgeNiche('childrens_activity_workbooks')
  assert.match(activity.title, /ABC|Twi/i)
})
