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

export function writePersistedState(path, data) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf8')
}

/**
 * Debounced + flushable saver so books survive API restarts.
 * Call flush() on SIGINT/SIGTERM and after book create/update/delete.
 */
export function createDebouncedSaver(path, snapshotFn, delayMs = 400) {
  let timer = null

  function write() {
    try {
      writePersistedState(path, snapshotFn())
      return true
    } catch (e) {
      console.warn('[authorforge] persist failed', e.message)
      return false
    }
  }

  function schedule() {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      write()
    }, delayMs)
  }

  function flush() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    return write()
  }

  return { schedule, flush }
}
