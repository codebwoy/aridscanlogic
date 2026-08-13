/** @typedef {{ completedLessonIds: string[], lastLessonId: string | null, updatedAt: string }} EduProgress */

const EMPTY = () => ({ completedLessonIds: [], lastLessonId: null, updatedAt: '' })

/** @returns {EduProgress} */
export function loadEduProgress(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return EMPTY()
    const parsed = JSON.parse(raw)
    return {
      completedLessonIds: Array.isArray(parsed.completedLessonIds) ? parsed.completedLessonIds : [],
      lastLessonId: typeof parsed.lastLessonId === 'string' ? parsed.lastLessonId : null,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
    }
  } catch {
    return EMPTY()
  }
}

/** @param {string} storageKey @param {Partial<EduProgress>} patch */
export function saveEduProgress(storageKey, patch) {
  const prev = loadEduProgress(storageKey)
  const next = {
    completedLessonIds: patch.completedLessonIds ?? prev.completedLessonIds,
    lastLessonId: patch.lastLessonId !== undefined ? patch.lastLessonId : prev.lastLessonId,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(storageKey, JSON.stringify(next))
  return next
}

export function markLessonComplete(storageKey, lessonId) {
  const prev = loadEduProgress(storageKey)
  const set = new Set(prev.completedLessonIds)
  set.add(lessonId)
  return saveEduProgress(storageKey, {
    completedLessonIds: [...set],
    lastLessonId: lessonId,
  })
}

export function isLessonComplete(lessonId, progress) {
  return progress.completedLessonIds.includes(lessonId)
}

export function countCompleted(chapters, progress) {
  const ids = new Set(progress.completedLessonIds)
  let n = 0
  for (const c of chapters) {
    for (const l of c.lessons) {
      if (ids.has(l.id)) n += 1
    }
  }
  return n
}

export function totalLessons(chapters) {
  return chapters.reduce((sum, c) => sum + c.lessons.length, 0)
}
