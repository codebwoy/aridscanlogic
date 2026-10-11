import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../')

export function resolveDataPath(custom) {
  if (custom) return resolve(custom)
  return resolve(root, '.data/state.json')
}

export function loadPersistedState(path) {
  try {
    if (!existsSync(path)) return null
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return null
  }
}

export function createDebouncedSaver(path, snapshotFn, delayMs = 400) {
  let timer = null
  return () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      try {
        mkdirSync(dirname(path), { recursive: true })
        writeFileSync(path, JSON.stringify(snapshotFn(), null, 2), 'utf8')
      } catch (e) {
        console.warn('[authorforge] persist failed', e.message)
      }
    }, delayMs)
  }
}
