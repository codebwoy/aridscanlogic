import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function apiProxy() {
  return {
    target: 'http://127.0.0.1:8787',
    changeOrigin: true,
    /** During API --watch restarts, return 503 instead of crashing the proxy pipe. */
    configure(proxy) {
      proxy.on('error', (err, _req, res) => {
        const code = err?.code || 'ECONNREFUSED'
        console.warn(`[vite] StoryForge API briefly unavailable (${code}) — retry in the browser`)
        if (res && !res.headersSent && typeof res.writeHead === 'function') {
          res.writeHead(503, { 'Content-Type': 'application/json' })
          res.end(
            JSON.stringify({
              error: 'StoryForge API is starting or restarting. Retry in a moment.',
              code: 'api_unavailable',
            }),
          )
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5180,
    strictPort: true,
    proxy: {
      '/v1': apiProxy(),
      '/health': apiProxy(),
    },
  },
  preview: {
    host: '127.0.0.1',
    port: 5180,
  },
})
