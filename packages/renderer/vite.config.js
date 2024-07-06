/*eslint-env node*/
import { builtinModules } from 'module';
import { join } from 'path';
import { defineConfig, loadEnv } from 'vite';
import solid from 'vite-plugin-solid';
import svg from 'vite-plugin-solid-svg';
import { chrome } from '../../.electron-vendors.cache.json';

const PACKAGE_ROOT = __dirname;

export default defineConfig({
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  resolve: {
    alias: {
      '@': join(PACKAGE_ROOT, 'src'),
      'msw/node': '/node_modules/msw/lib/native/index.mjs', // https://github.com/solidjs/vite-plugin-solid/issues/125
    },
  },
  plugins: [solid(), svg({ defaultAsComponent: true })],
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
        auth: join(PACKAGE_ROOT, 'auth.html'),
        dashboard: join(PACKAGE_ROOT, 'dashboard.html'),
        select: join(PACKAGE_ROOT, 'select.html'),
      },
      external: [...builtinModules.flatMap(p => [p, `node:${p}`])],
    },
    emptyOutDir: true,
    brotliSize: false,
  },
  test: {
    coverage: {
      all: true,
      src: join(PACKAGE_ROOT, 'src'),
      exclude: [
        '__bootstrap__',
        '**/__fixtures__',
        '**/__tests__',
        '**/*.d.ts',
        '**/*.spec.{ts,tsx}',
        '**/index.{ts,tsx}',
      ],
    },
    env: loadEnv(process.env.MODE, join(process.cwd(), '../..')),
    environment: 'jsdom',
    globals: true,
    setupFiles: './setupTests.ts',
  },
});
