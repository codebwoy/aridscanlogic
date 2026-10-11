import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5181,
    strictPort: true,
    proxy: {
      '/v1': 'http://127.0.0.1:8788',
      '/health': 'http://127.0.0.1:8788',
    },
  },
  preview: {
    host: '127.0.0.1',
    port: 5181,
    proxy: {
      '/v1': 'http://127.0.0.1:8788',
      '/health': 'http://127.0.0.1:8788',
    },
  },
})
