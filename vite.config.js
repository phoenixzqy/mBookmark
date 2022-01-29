import { defineConfig } from 'vite';
import { resolve } from 'path';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  base: '/demo/mBookmark/',
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // nested: resolve(__dirname, 'extension_index.html')
      }
    }
  },
});
