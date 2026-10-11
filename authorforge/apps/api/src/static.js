import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
}

/**
 * Resolve web dist folder. Prefer AUTHORFORGE_WEB_DIST, else sibling apps/web/dist.
 */
export function resolveWebDist() {
  if (process.env.AUTHORFORGE_WEB_DIST) return resolve(process.env.AUTHORFORGE_WEB_DIST)
  const here = fileURLToPath(new URL('.', import.meta.url))
  // apps/api/src → apps/web/dist
  return resolve(here, '../../web/dist')
}

/**
 * @returns {boolean} true if a response was sent
 */
export function tryServeStatic(req, res, distRoot, pathname) {
  if (!distRoot || !existsSync(distRoot)) return false
  if (req.method !== 'GET' && req.method !== 'HEAD') return false

  let rel = decodeURIComponent(pathname || '/')
  if (rel.includes('..')) return false
  if (rel === '/') rel = '/index.html'
  // SPA deep links
  let filePath = normalize(join(distRoot, rel))
  if (!filePath.startsWith(distRoot)) return false

  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = join(distRoot, 'index.html')
    if (!existsSync(filePath)) return false
  }

  const ext = extname(filePath).toLowerCase()
  const type = MIME[ext] || 'application/octet-stream'
  const stat = statSync(filePath)
  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': stat.size,
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400',
    'X-Content-Type-Options': 'nosniff',
  })
  if (req.method === 'HEAD') {
    res.end()
    return true
  }
  createReadStream(filePath).pipe(res)
  return true
}
