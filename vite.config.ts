import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1/usuarios': {
        target: 'https://ms-login-asas.onrender.com',
        changeOrigin: true,
        secure: true,
        xfwd: true,
        proxyTimeout: 360000,
        timeout: 360000,
        rewrite: (path) => path.replace(/^\/api\/v1\/usuarios/, '/api/v1/usuarios'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('usuarios proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to usuarios API:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from usuarios API:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/api/v1/experiencias': {
        target: 'https://ms-experiencias.onrender.com',
        changeOrigin: true,
        secure: true,
        xfwd: true,
        proxyTimeout: 360000,
        timeout: 360000,
        rewrite: (path) => path.replace(/^\/api\/v1\/experiencias/, '/api/v1/experiencias'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('experiencias proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to experiencias API:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from experiencias API:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
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