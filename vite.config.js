import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // Cualquier petición a /api desde el frontend
      // se redirige automáticamente al backend local.
      // Esto elimina los problemas de CORS en desarrollo.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})