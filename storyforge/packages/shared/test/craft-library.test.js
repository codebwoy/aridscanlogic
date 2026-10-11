import test from 'node:test'
import assert from 'node:assert/strict'
import { craftLibraryPayload, STORYTELLING_COMPASS } from '../src/craft-library.js'
import { PROMPT_TEMPLATES, WORKFLOW_PLAYBOOKS, RECIPES } from '../src/launchpad-seed.js'
import { TRACEABILITY } from '../src/progress.js'

test('craft library payload has core modules', () => {
  const p = craftLibraryPayload()
  assert.equal(STORYTELLING_COMPASS.steps.length, 5)
  assert.ok(p.characterDna.fields.length >= 10)
  assert.ok(p.ipCharacterBuilder?.merchChecks?.length >= 5)
  assert.ok(p.artStyles.styles.length >= 9)
  assert.equal(p.sevenDayPlan.days.length, 7)
  assert.ok(p.externalLearningIndex.length >= 3)
  assert.match(p.meta.independenceNote, /Not affiliated/)
})

test('craft prompts and recipes are wired', () => {
  const ids = new Set(PROMPT_TEMPLATES.map((t) => t.id))
  for (const id of [
    'pt_identity_block',
    'pt_multi_char_3part',
    'pt_action_change',
    'pt_expression_change',
    'pt_style_lock',
  ]) {
    assert.ok(ids.has(id), `missing prompt ${id}`)
  }
  assert.ok(RECIPES.some((r) => r.id === 'recipe_seven_day_launch'))
  assert.ok(RECIPES.some((r) => r.id === 'recipe_coloring_from_story'))
  assert.ok(WORKFLOW_PLAYBOOKS.some((w) => w.id === 'wf_action_editor'))
})

test('traceability includes craft S39–S52 and readiness S60–S61', () => {
  for (let n = 39; n <= 52; n++) {
    assert.ok(
      TRACEABILITY.some((t) => t.id === `S${n}` && t.status === 'done'),
      `missing S${n}`,
    )
  }
  assert.ok(
    TRACEABILITY.some((t) => t.id === 'S60' && t.status === 'done'),
    'missing S60 publication readiness',
  )
  assert.ok(
    TRACEABILITY.some((t) => t.id === 'S61' && t.status === 'done'),
    'missing S61 theme-aware names',
  )
})
