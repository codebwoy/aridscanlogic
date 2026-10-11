import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../')
const defaultPath = resolve(root, '.data/state.json')

export function resolveDataPath(envPath) {
  if (envPath) return resolve(envPath)
  return defaultPath
}

export function loadPersistedState(filePath) {
  try {
    if (!existsSync(filePath)) return null
    const raw = readFileSync(filePath, 'utf8')
    const data = JSON.parse(raw)
    if (!data || typeof data !== 'object') return null
    return data
  } catch (err) {
    console.warn('[storyforge] failed to load persisted state:', err.message)
    return null
  }
}

export function savePersistedState(filePath, state) {
  try {
    mkdirSync(dirname(filePath), { recursive: true })
    writeFileSync(filePath, JSON.stringify(state), 'utf8')
  } catch (err) {
    console.warn('[storyforge] failed to persist state:', err.message)
  }
}

export function createDebouncedSaver(filePath, getState, ms = 400) {
  let timer = null
  let pending = false
  return function scheduleSave() {
    pending = true
    if (timer) return
    timer = setTimeout(() => {
      timer = null
      if (!pending) return
      pending = false
      savePersistedState(filePath, getState())
    }, ms)
  }
}
