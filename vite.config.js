import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { llmProxyPlugin } from './server/vite-llm-proxy.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const siteUrl = (env.VITE_SITE_URL || 'https://codebwoy.github.io/aridscanlogic').replace(
    /\/$/,
    ''
  )
  const base =
    env.VITE_BASE_PATH ||
    (process.env.GITHUB_PAGES === 'true' ? '/aridscanlogic/' : '/')

  const getApiKey = () => (env.ANTHROPIC_API_KEY || '').trim()
  const getModel = () => env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514'
  const getDatabaseUrl = () => (env.DATABASE_URL || env.SUPABASE_DB_URL || '').trim()
  const getApiSecret = () => (env.SCANLOGIC_API_SECRET || '').trim()
  const getJwtSecret = () => (env.SUPABASE_JWT_SECRET || env.JWT_SECRET || '').trim()

  return {
    base,
    server: {
      watch: {
        // Server middleware is loaded dynamically; avoid dev restarts on API edits.
        ignored: ['**/server/**', '**/api/**'],
      },
    },
    plugins: [
      {
        name: 'scanlogic-html-seo',
        transformIndexHtml(html) {
          return html.replaceAll('__SITE_URL__', siteUrl)
        },
      },
      react(),
      tailwindcss(),
      llmProxyPlugin({ getApiKey, getModel, getDatabaseUrl, getApiSecret, getJwtSecret }),
      VitePWA({
        registerType: 'prompt',
        includeAssets: ['favicon.png', 'favicon-32.png', 'favicon-16.png', 'brand-logo.png', 'apple-touch-icon.png'],
        manifest: {
          name: 'ScanLogic Business Suite',
          short_name: 'ScanLogic',
          description:
            'Document scanning, Tax Vault, DocDraft, contracts, and Herr Müller AI — mobile-first business suite.',
          theme_color: '#0f172a',
          background_color: '#0a0f1a',
          display: 'standalone',
          orientation: 'portrait-primary',
          scope: base,
          start_url: base,
          lang: 'de',
          categories: ['business', 'finance', 'productivity'],
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512-maskable.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          navigateFallback: base.endsWith('/') ? `${base}index.html` : `${base}/index.html`,
          navigateFallbackDenylist: [/^\/api\//],
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        },
        // PWA service worker is built for production; dev mode caused empty dev-dist glob warnings.
        devOptions: {
          enabled: false,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
