// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Quando il dominio definitivo è collegato, basta impostare PUBLIC_SITE_URL
// nelle variabili di build di Cloudflare: sitemap, canonical e llms.txt si aggiornano da soli.
const site = process.env.PUBLIC_SITE_URL || 'https://boleon.pages.dev';

// https://astro.build/config
export default defineConfig({
  site,
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [
    react(),
    markdoc(),
    keystatic(),
    sitemap({
      filter: (page) => !page.includes('/keystatic') && !page.includes('/api/'),
      i18n: {
        defaultLocale: 'it',
        locales: {
          it: 'it',
          en: 'en',
          es: 'es',
          fr: 'fr',
          zh: 'zh-Hans',
          hi: 'hi',
          ar: 'ar',
        },
      },
    }),
  ],
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
