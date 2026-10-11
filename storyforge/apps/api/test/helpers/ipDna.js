import { emptyIpCharacter, validateIpCharacterForLock } from '@storyforge/shared'

/** Lock a valid merch-ready DNA on a project for tests. */
export async function lockTestIpDna(store, userId, projectId, overrides = {}) {
  const draft = emptyIpCharacter({
    name: 'Luna',
    signatureColor: 'blue',
    definingTrait: 'curious',
    signatureObject: 'yellow backpack',
    emotionalHook: 'courage',
    silhouetteNote: 'round head, short legs, backpack silhouette',
    merchChecks: {
      silhouette: true,
      simple_shapes: true,
      one_colour_role: true,
      signature_object: true,
      tee_first: true,
      series_intent: true,
    },
    ...overrides,
  })
  const validated = validateIpCharacterForLock(draft)
  if (!validated.ok) throw new Error(validated.error)
  return store.setIpCharacter(userId, projectId, validated.dna, { lock: true })
}
