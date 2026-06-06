import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
      '/cart': 'http://localhost:3000',
      '/order': 'http://localhost:3000',
      '/client/assets': 'http://localhost:3000',
    }
  }
})
