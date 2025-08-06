import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, '../shared')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress TypeScript warnings during build
        if (warning.code === 'TS2307' || warning.code === 'TS2339' || warning.code === 'TS2304') {
          return;
        }
        warn(warning);
      }
    }
  },
  publicDir: 'public',
  server: {
    port: 5173,
    host: '0.0.0.0'
  }
}) 