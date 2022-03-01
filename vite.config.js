import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite';
import { resolve } from 'path';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [
    solidPlugin(),
    VitePWA({
      includeAssets: ['robots.txt'],
      manifest: {
        short_name: "mBookmark",
        name: "mBookmark",
        description: "My personal bookmark manager with my own web apps",
        display: "standalone",
        start_url: "/demo/mBookmark/index.html?utm_source=homescreen",
        theme_color: "#e4e4e4",
        background_color: "#fff",
        icons: [
          {
            "src": "/demo/mBookmark/assets/dragon_icon_128x128.d2aa5433.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "/demo/mBookmark/assets/dragon_icon_128x128.d2aa5433.png",
            "sizes": "512x512",
            "type": "image/png"
          },
          {
            src: '/demo/mBookmark/assets/dragon_icon_128x128.d2aa5433.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          }
        ]
      }
    })
  ],
  base: '/demo/mBookmark/',
  build: {
    manifest: true,
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
