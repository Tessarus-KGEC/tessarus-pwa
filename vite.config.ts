import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      injectRegister: null,  // for null -> i have to manually register the service worker

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        theme_color: '#000000',
        background_color: '#000000',
        orientation: 'portrait',
        display: 'standalone',
        lang: 'en-GB',
        name: 'Tesssarus',
        short_name: 'Tessarus',
        start_url: '/',
        description:
          'Ticketing system with check-in support  for espektro kgec ',
        id: 'tesssarus-ticketing-espektro-kgec-pwa-#0ab23nm',
        icons: [
          {
            src: 'images/icons/manifest-icon-192.maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'images/icons/manifest-icon-192.maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'images/icons/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'images/icons/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },

      devOptions: {
        enabled: true,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    }),
  ],
});