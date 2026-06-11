import type { APIRoute } from 'astro';

export const prerender = true;

// Crawler benvenuti, inclusi quelli delle AI; esclusi solo admin e API.
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://boleon.pages.dev');
  const body = `User-agent: *
Allow: /
Disallow: /keystatic
Disallow: /api/

Sitemap: ${new URL('/sitemap-index.xml', base).href}

# AI crawlers are welcome — see also /llms.txt
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
