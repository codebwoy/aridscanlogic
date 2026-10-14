import test from 'node:test'
import assert from 'node:assert/strict'
import {
  NOVELFORGE_PRODUCT,
  productCopy,
  RECOMMENDED_NICHES,
  applyRecommendedNiche,
  nicheContextForBook,
  productPositioningPayload,
} from '../src/product-positioning.js'
import { UNIVERSAL_FICTION_RULES } from '../src/coauthor-rules.js'
import { WIZARD_STEPS } from '../src/wizard.js'
import { costFor, estimateBookCredits } from '../src/credits.js'

test('NovelForge product category is adult fiction', () => {
  assert.equal(NOVELFORGE_PRODUCT.category, 'fiction')
  assert.equal(NOVELFORGE_PRODUCT.audience, 'adult_readers')
})

test('product copy steers away from non-fiction and picture books', () => {
  const copy = productCopy('en')
  assert.match(copy.categoryLabel, /fiction/i)
  assert.ok(copy.notLines.some((l) => /AuthorForge/i.test(l)))
  assert.ok(copy.notLines.some((l) => /StoryForge/i.test(l)))
})

test('recommended niches include diaspora fiction and sibling redirects', () => {
  assert.ok(RECOMMENDED_NICHES.some((n) => n.studio === 'novelforge' && n.id === 'diaspora_contemporary'))
  assert.ok(RECOMMENDED_NICHES.some((n) => n.studio === 'authorforge'))
  assert.ok(RECOMMENDED_NICHES.some((n) => n.studio === 'storyforge'))
})

test('applyRecommendedNiche seeds bible for fiction', () => {
  const patch = applyRecommendedNiche('romance_cross_cultural', 'en')
  assert.ok(patch)
  assert.equal(patch.bible.genre, 'romance')
  assert.ok(patch.target_words > 10000)
})

test('nicheContextForBook and specs payload expose ladder', () => {
  const ctx = nicheContextForBook({ bible: { recommended_niche_id: 'thriller_europe' }, language: 'en' })
  assert.equal(ctx.niche.id, 'thriller_europe')
  const payload = productPositioningPayload('en')
  assert.ok(payload.niches.length >= 3)
})

test('universal fiction rules allow invention but ban picture books and NF', () => {
  assert.match(UNIVERSAL_FICTION_RULES, /Inventing plot/i)
  assert.match(UNIVERSAL_FICTION_RULES, /StoryForge/)
  assert.match(UNIVERSAL_FICTION_RULES, /AuthorForge/)
  assert.match(UNIVERSAL_FICTION_RULES, /Do not use STORY_SLOT or CLAIM_NEEDED/)
})

test('fiction wizard has genre→publish path', () => {
  assert.equal(WIZARD_STEPS[0].id, 'genre')
  assert.ok(WIZARD_STEPS.some((s) => s.id === 'cast'))
  assert.ok(WIZARD_STEPS.some((s) => s.id === 'continuity'))
  assert.equal(WIZARD_STEPS.at(-1).id, 'publish')
})

test('costFor returns known fiction actions', () => {
  assert.equal(costFor('premise_generate'), 3)
  assert.equal(costFor('section_draft'), 4)
  assert.equal(costFor('nope'), null)
})

test('estimateBookCredits positive total', () => {
  const e = estimateBookCredits({ chapters: 10, sectionsPerChapter: 2 })
  assert.ok(e.total > 0)
})
