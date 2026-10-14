import test from 'node:test'
import assert from 'node:assert/strict'
import {
  chapterDraftNodes,
  clampDraftTargetWords,
  maxTokensForDraftWords,
  MAX_SCENE_DRAFT_WORDS,
} from '../src/draftLimits.js'

function flattenLeafNodes(node, path = 'c0') {
  const children = node.children || []
  if (!children.length) return [{ key: path, node }]
  return children.flatMap((ch, i) => flattenLeafNodes(ch, `${path}.${i}`))
}

test('clampDraftTargetWords caps oversized chapter targets', () => {
  assert.equal(clampDraftTargetWords(6500), MAX_SCENE_DRAFT_WORDS)
  assert.equal(clampDraftTargetWords(800), 800)
})

test('maxTokensForDraftWords stays within 16k', () => {
  assert.ok(maxTokensForDraftWords(2000) <= 16_384)
  assert.ok(maxTokensForDraftWords(2000) >= 6144)
})

test('chapterDraftNodes splits single oversized leaf into parts', () => {
  const chapter = {
    title: 'Chapter 1',
    writing_direction: 'Open in Berlin.',
    target_words: 6000,
    children: [],
  }
  const nodes = chapterDraftNodes(chapter, 0, flattenLeafNodes)
  assert.equal(nodes.length, 3)
  assert.ok(nodes.every((n) => n.node.target_words <= MAX_SCENE_DRAFT_WORDS))
  assert.match(nodes[0].node.title, /part 1/)
})

test('chapterDraftNodes keeps multi-scene chapters', () => {
  const chapter = {
    title: 'Chapter 1',
    writing_direction: 'Open',
    target_words: 4000,
    children: [
      { title: 'A', writing_direction: 'a', target_words: 1800, children: [] },
      { title: 'B', writing_direction: 'b', target_words: 2200, children: [] },
    ],
  }
  const nodes = chapterDraftNodes(chapter, 0, flattenLeafNodes)
  assert.equal(nodes.length, 2)
  assert.equal(nodes[1].node.target_words, MAX_SCENE_DRAFT_WORDS)
})
