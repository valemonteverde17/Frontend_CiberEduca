import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      '.ngrok-free.dev',  // Permite cualquier dominio de ngrok-free
      'localhost',
      '127.0.0.1'
    ]
  }
})