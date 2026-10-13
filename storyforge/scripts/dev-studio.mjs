#!/usr/bin/env node
/**
 * Boot API first, then web — avoids Vite proxy ECONNREFUSED on cold start.
 * Usage: npm run dev:studio
 */
import { spawn } from 'node:child_process'
import net from 'node:net'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const children = []

function run(name, args) {
  const child = spawn('npm', ['run', ...args], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
    shell: process.platform === 'win32',
  })
  child.on('exit', (code, signal) => {
    if (signal) return
    if (code && code !== 0) {
      console.error(`[dev-studio] ${name} exited with ${code}`)
      shutdown(code)
    }
  })
  children.push(child)
  return child
}

function shutdown(code = 0) {
  for (const c of children) {
    try {
      c.kill('SIGTERM')
    } catch {
      /* ignore */
    }
  }
  process.exit(code)
}

function portOpen(port, host = '127.0.0.1') {
  return new Promise((resolveWait) => {
    const sock = net.connect({ port, host }, () => {
      sock.end()
      resolveWait(true)
    })
    sock.setTimeout(600)
    sock.on('timeout', () => {
      sock.destroy()
      resolveWait(false)
    })
    sock.on('error', () => {
      sock.destroy()
      resolveWait(false)
    })
  })
}

async function waitPort(port, timeoutMs = 60_000, label = `:${port}`) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (await portOpen(port)) return true
    await new Promise((r) => setTimeout(r, 400))
  }
  console.error(`[dev-studio] timed out waiting for ${label}`)
  return false
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))

console.info('[dev-studio] starting StoryForge API (:8787)…')
run('api', ['dev:api'])

const apiUp = await waitPort(8787, 60_000, 'API :8787')
if (!apiUp) {
  console.error('[dev-studio] API did not become ready — not starting web')
  shutdown(1)
}

console.info('[dev-studio] API ready — starting web (:5180)…')
run('web', ['dev:web'])

const webUp = await waitPort(5180, 60_000, 'web :5180')
if (!webUp) {
  console.error('[dev-studio] web did not become ready')
  shutdown(1)
}

console.info('')
console.info('────────────────────────────────────────────')
console.info(' StoryForge is ready')
console.info('  Studio:    http://127.0.0.1:5180/?view=studio#studio')
console.info('  Launchpad: http://127.0.0.1:5180/?view=launchpad#launchpad')
console.info('  API:       http://127.0.0.1:8787/health')
console.info('  ScanLogic Amazon Hub → Open StoryForge (desktop ≥1024px)')
console.info('────────────────────────────────────────────')
console.info('')
