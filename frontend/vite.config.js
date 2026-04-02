import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/chat': 'http://localhost:5000',
      '/socket.io': 'http://localhost:5000'
    },
    cache: false
  },
  build: {
    sourcemap: true
  }
})

