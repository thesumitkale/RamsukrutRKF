import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2019',
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 900,
    // Split the big third party libraries into their own files. Page code changes
    // often, these libraries almost never do, so returning visitors keep them cached
    // instead of re-downloading everything after each deploy.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('framer-motion')) return 'vendor-motion'
          if (id.includes('react-router')) return 'vendor-router'
          if (id.includes('react')) return 'vendor-react'
          return 'vendor'
        },
      },
    },
  },
})
