// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://boleon.pages.dev',
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [react(), markdoc(), keystatic()],
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en', 'es', 'fr', 'zh', 'hi', 'ar'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
