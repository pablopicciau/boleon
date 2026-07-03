import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import settings from '../content/settings.json';
import { availablePrintSizes, isBaseAvailable, sortArtworks } from '../lib/artworks';

export const prerender = true;

// llms.txt: riassunto del sito in markdown per gli assistenti AI (https://llmstxt.org).
// Generato dal catalogo a ogni build, quindi sempre allineato a opere, prezzi e disponibilità.
export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://boleon.it');
  const artworks = sortArtworks(await getCollection('artworks'));

  const lines = artworks.map((a) => {
    const url = new URL(`/opere/${a.id}`, base).href;
    const baseStatus = isBaseAvailable(a)
      ? a.data.kind === 'original'
        ? `original available, €${a.data.price}`
        : `available, €${a.data.price}, edition of ${a.data.editionSize}, ${a.data.stock} left`
      : a.data.kind === 'original'
        ? 'original sold'
        : 'sold out';
    const prints = availablePrintSizes(a)
      .map((p) => `${p.size} €${p.price} (${p.stock} left)`)
      .join(', ');
    const status = prints ? `${baseStatus}; fine art prints: ${prints}` : baseStatus;
    const desc = a.data.descriptions.en || a.data.descriptions.it || '';
    const details = [
      `${a.data.year}`,
      a.data.technique,
      a.data.dimensions,
      a.data.kind === 'original' ? 'original artwork (unique piece)' : 'limited edition print',
      status,
    ]
      .filter(Boolean)
      .join(' · ');
    return `- [${a.data.title}](${url}): ${details}${desc ? ` — ${desc}` : ''}`;
  });

  const body = `# ${settings.artistName}

> ${settings.taglines.en || settings.taglines.it} — online gallery and shop of the artist ${settings.artistName}. Original artworks (unique pieces) and limited edition prints, purchasable online with worldwide shipping. Secure checkout via Stripe.

${settings.bios.en || settings.bios.it || ''}

The site is available in 7 languages: Italian (default, ${base.href}), English (${new URL('/en/', base).href}), Spanish (/es), French (/fr), Chinese (/zh), Hindi (/hi), Arabic (/ar).

Contact: ${settings.contactEmail}

## Artworks

${lines.join('\n')}

## Pages

- [Gallery / Home](${base.href}): all artworks with prices and availability
- [Cart](${new URL('/carrello', base).href}): shopping cart and Stripe checkout
- [Sitemap](${new URL('/sitemap-index.xml', base).href})
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
