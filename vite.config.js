import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'admin-and-mime-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Route /admin or /admin/ to /admin.html
          if (req.url === '/admin' || req.url === '/admin/') {
            req.url = '/admin.html';
          }
          if (req.url && (req.url.endsWith('.js') || req.url.includes('.js?') || req.url.endsWith('.jsx') || req.url.includes('.jsx?'))) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          }
          next();
        });
      }
    }
  ],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    open: false,
    host: true
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'admin.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
