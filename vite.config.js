import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/philanthropy-app/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react:    ['react', 'react-dom'],
          recharts: ['recharts'],
          jspdf:    ['jspdf', 'jspdf-autotable'],
        },
      },
    },
  },
})
