import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Proxy para el backend en desarrollo.
    // Esto permite que las cookies HttpOnly funcionen correctamente
    // ya que el navegador las trata como same-origin al usar el proxy.
    // En producción, el frontend y backend deben estar en el mismo dominio
    // o configurar correctamente SameSite=None; Secure.
    proxy: {
      '/api': {
        target: 'http://localhost:5205',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
