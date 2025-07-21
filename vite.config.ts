import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://back-services.api-reservat.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
      },
    },
  },
  build: {
    // Usa Terser para eliminar todos los console.* y debugger en el bundle de producción
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});