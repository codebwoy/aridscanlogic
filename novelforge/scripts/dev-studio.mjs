#!/usr/bin/env node
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

async function waitPort(port, timeoutMs = 60_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (await portOpen(port)) return true
    await new Promise((r) => setTimeout(r, 400))
  }
  return false
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))

console.info('[dev-studio] starting NovelForge API (:8789) + web (:5182)')
run('api', ['dev:api'])
run('web', ['dev:web'])

const apiUp = await waitPort(8789)
const webUp = await waitPort(5182)
if (!apiUp || !webUp) {
  console.error('[dev-studio] servers did not become ready in time')
  console.error('  API ready:', apiUp, '· Web ready:', webUp)
  shutdown(1)
}

console.info('')
console.info('────────────────────────────────────────────')
console.info(' NovelForge is ready')
console.info('  Studio:     http://127.0.0.1:5182/?view=studio#studio')
console.info('  Storefront: http://127.0.0.1:5182/?view=store&slug=YOUR-SLUG')
console.info('  API:        http://127.0.0.1:8789/health')
console.info('  ScanLogic Amazon Hub → Open NovelForge (desktop ≥1024px)')
console.info('────────────────────────────────────────────')
console.info('')
