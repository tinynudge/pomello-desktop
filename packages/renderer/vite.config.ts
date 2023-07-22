import { svelte } from '@sveltejs/vite-plugin-svelte';
import { builtinModules } from 'module';
import { join } from 'path';
import { defineConfig } from 'vite';
import { chrome } from '../../.electron-vendors.cache.json';

const PACKAGE_ROOT = __dirname;

export default defineConfig(({ mode }) => ({
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  resolve: {
    alias: {
      '@/': join(PACKAGE_ROOT, 'src') + '/',
      '@domain': join(PACKAGE_ROOT, '../domain'),
    },
  },
  plugins: [
    svelte({
      hot: mode !== 'test',
    }),
  ],
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      input: {
        app: join(PACKAGE_ROOT, 'app.html'),
      },
      external: [...builtinModules.flatMap(p => [p, `node:${p}`])],
    },
    emptyOutDir: true,
  },
  test: {
    coverage: {
      all: true,
      src: [join(PACKAGE_ROOT, 'src')],
      exclude: [
        '**/__fixtures__',
        '**/__tests__',
        '**/*.d.ts',
        '**/*.spec.ts',
        '**/domain',
        '**/index.ts',
      ],
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
  },
}));
