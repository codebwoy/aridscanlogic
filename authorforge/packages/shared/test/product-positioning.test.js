import test from 'node:test'
import assert from 'node:assert/strict'
import {
  AUTHORFORGE_PRODUCT,
  PRODUCT_COPY,
  productCopy,
  UNIVERSAL_COAUTHOR_RULES,
  RECOMMENDED_NICHES,
  MARKET_DISCLAIMER,
  applyRecommendedNiche,
  nichesForStudio,
  nicheContextForBook,
  productPositioningPayload,
} from '../src/index.js'

test('AuthorForge product category is adult non-fiction', () => {
  assert.equal(AUTHORFORGE_PRODUCT.category, 'non_fiction')
  assert.equal(AUTHORFORGE_PRODUCT.audience, 'adult_readers')
  assert.equal(AUTHORFORGE_PRODUCT.sibling, 'storyforge')
  assert.match(AUTHORFORGE_PRODUCT.strategy, /Niche down/i)
})

test('product copy steers away from fiction and picture books', () => {
  for (const lang of ['en', 'de']) {
    const copy = productCopy(lang)
    assert.ok(copy.forLines.length >= 2)
    assert.ok(copy.notLines.some((l) => /fiction|Roman/i.test(l)))
    assert.ok(copy.notLines.some((l) => /StoryForge|picture|Bilderbuch/i.test(l)))
    assert.ok(copy.hybridHint.includes('StoryForge'))
    assert.ok(copy.strategyLine.length > 20)
  }
  assert.equal(PRODUCT_COPY.en.categoryLabel, 'Non-fiction only')
})

test('recommended niches cover full ladder including activity books', () => {
  assert.ok(RECOMMENDED_NICHES.length >= 6)
  const kids = RECOMMENDED_NICHES.find((n) => n.id === 'bilingual_childrens_books')
  const parenting = RECOMMENDED_NICHES.find((n) => n.id === 'culturally_specific_parenting')
  const activity = RECOMMENDED_NICHES.find((n) => n.id === 'childrens_activity_workbooks')
  const identity = RECOMMENDED_NICHES.find((n) => n.id === 'identity_self_help')
  assert.equal(kids?.studio, 'storyforge')
  assert.equal(kids?.priority, 1)
  assert.equal(parenting?.studio, 'authorforge')
  assert.equal(parenting?.priority, 2)
  assert.equal(identity?.priority, 5)
  assert.equal(activity?.studio, 'storyforge')
  assert.equal(activity?.priority, 6)
  assert.ok(nichesForStudio('authorforge').every((n) => n.studio === 'authorforge'))
  assert.match(MARKET_DISCLAIMER, /⚠/)
  assert.match(MARKET_DISCLAIMER, /not verified Amazon/i)
})

test('applyRecommendedNiche seeds bible and workbook formatting', () => {
  const patch = applyRecommendedNiche('culturally_specific_parenting', 'en')
  assert.ok(patch)
  assert.match(patch.working_title, /Bilingual|Parent/i)
  assert.ok(patch.bible.usp)
  assert.ok(patch.bible.audience)
  assert.equal(patch.bible.recommended_niche_id, 'culturally_specific_parenting')
  assert.equal(patch.formatting.preset, 'workbook')
  assert.equal(applyRecommendedNiche('bilingual_childrens_books'), null)
})

test('nicheContextForBook and specs payload expose ladder', () => {
  const ctx = nicheContextForBook({
    bible: { recommended_niche_id: 'culturally_specific_parenting' },
  })
  assert.equal(ctx.recommended_niche_id, 'culturally_specific_parenting')
  assert.ok(ctx.niche?.title)
  assert.ok(ctx.ladder.length >= 6)
  const payload = productPositioningPayload('en')
  assert.equal(payload.product.id, 'authorforge')
  assert.ok(payload.niches.some((n) => n.id === 'coaching_workbooks_immigrant_pros'))
})

test('universal coauthor rules ban fiction and invented proverbs', () => {
  assert.match(UNIVERSAL_COAUTHOR_RULES, /non-fiction/i)
  assert.match(UNIVERSAL_COAUTHOR_RULES, /Do NOT write[\s\S]*fiction/i)
  assert.match(UNIVERSAL_COAUTHOR_RULES, /StoryForge/)
  assert.match(UNIVERSAL_COAUTHOR_RULES, /proverbs/i)
  assert.match(UNIVERSAL_COAUTHOR_RULES, /Niche down/i)
})
