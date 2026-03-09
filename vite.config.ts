import { defineConfig } from 'vite';
import { resolve } from 'path';
export default defineConfig({
  root: '.',
  publicDir: false,
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'preact',
    // pure: ['console.log', 'console.info'],  // disabled for debugging
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/ts'),
      '@legacy': resolve(__dirname, 'src/main/webapp/javascript'),
    },
  },
  base: '/javascript/ts-bundle/',
  build: {
    outDir: resolve(__dirname, 'src/main/webapp/javascript/ts-bundle'),
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/ts/main.ts'),
      formats: ['iife'],
      fileName: () => 'main.js',
      name: 'XBWorld',
    },
    rollupOptions: {},
    target: 'es2022',
    minify: 'esbuild',
  },
  server: {
    port: 8080,
    proxy: {
      '/civsocket': {
        target: 'ws://localhost:8002',
        ws: true,
      },
      '/civclientlauncher': 'http://localhost:8002',
    },
  },
});
