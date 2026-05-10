import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    open: false,
  },
  test: {
    root: resolve(__dirname),
    include: ['test/**/*.test.ts'],
    environment: 'node',
    globals: true,
  },
});
