import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/searxng': {
        target: 'http://localhost:8888',
        rewrite: (path) => path.replace(/^\/api\/searxng/, ''),
        changeOrigin: true,
      },
    },
  },
})
