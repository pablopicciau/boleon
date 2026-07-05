// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Dominio definitivo del sito. Si può comunque sovrascrivere con la variabile
// PUBLIC_SITE_URL nelle build di Cloudflare (es. per un dominio diverso).
const site = process.env.PUBLIC_SITE_URL || 'https://boleon.it';

// Slug della GitHub App di Keystatic (pubblico, non segreto): forzato qui così
// non dipende da una variabile di build su Cloudflare facile da sbagliare.
process.env.PUBLIC_KEYSTATIC_GITHUB_APP_SLUG = 'boleon-cms';

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
    resolve: {
      // Workaround ufficiale Astro per React 19 su Cloudflare Workers:
      // senza questo alias il bundle usa react-dom/server.browser, che
      // richiede MessageChannel (assente su Workers) e il deploy fallisce.
      // prettier-ignore
      alias: import.meta.env.PROD
        ? { 'react-dom/server': 'react-dom/server.edge' }
        : undefined,
    },
  },
});
