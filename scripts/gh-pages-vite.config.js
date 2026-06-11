/** Vercel runs `vite build` on gh-pages; this config repackages the prebuilt static files. */
import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  publicDir: false,
  build: {
    outDir: 'out',
    emptyOutDir: true,
    rollupOptions: {
      input: './index.html',
    },
  },
})
