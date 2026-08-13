import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://dexa-backend.test',
        changeOrigin: true,
      },
    },
    host: true, // escucha en todas las interfaces, no solo localhost
    allowedHosts: ['dexa.test'], // o true para permitir cualquiera
  },
})
