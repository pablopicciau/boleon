import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import settings from '../lib/settings';
import {
  isBaseAvailable,
  isInquiryOnly,
  printFormatsFor,
  printPrice,
  sortArtworks,
} from '../lib/artworks';
import { DELIVERY_WEEKS, normalizeShippingConfig, type ZoneRate } from '../lib/shipping';

export const prerender = true;

// llms.txt: riassunto del sito in markdown per gli assistenti AI (https://llmstxt.org).
// Generato dal catalogo a ogni build, quindi sempre allineato a opere, prezzi e disponibilità.
export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://boleon.it');
  const artworks = sortArtworks(await getCollection('artworks'));
  const artCollections = (await getCollection('collections')).sort(
    (a, b) => a.data.sortOrder - b.data.sortOrder
  );
  const collectionName = new Map(artCollections.map((c) => [c.id, c.data.name]));

  const lines = artworks.map((a) => {
    const url = new URL(`/opere/${a.id}`, base).href;
    const baseStatus = isBaseAvailable(a)
      ? a.data.kind === 'original'
        ? `original available, €${a.data.price}`
        : `available, €${a.data.price}, edition of ${a.data.editionSize}, ${a.data.stock} left`
      : isInquiryOnly(a)
        ? 'original: unique piece, available on request via the site contact form (not sold online)'
        : a.data.kind === 'original'
          ? 'original sold'
          : 'sold out';
    const prints = printFormatsFor(a)
      .map((f) => `${f.label} from €${printPrice(a, f, 'paper')}`)
      .join(', ');
    const status = prints
      ? `${baseStatus}; museum-grade fine art prints (pigment giclée, signed and numbered, on cotton paper or artist canvas, optional extra white border for framing): ${prints}`
      : baseStatus;
    const desc = a.data.descriptions.en || a.data.descriptions.it || '';
    const coll = a.data.collections
      .map((c) => collectionName.get(c) ?? c)
      .join(', ');
    const details = [
      a.data.dimensions,
      a.data.kind === 'original' ? 'original artwork (unique piece)' : 'limited edition print',
      coll ? `collection: ${coll}` : '',
      status,
    ]
      .filter(Boolean)
      .join(' · ');
    const title = a.data.titles?.en || a.data.title;
    return `- [${title}](${url}): ${details}${desc ? ` — ${desc}` : ''}`;
  });

  const collectionLines = artCollections.map((c) => {
    const desc = c.data.descriptions?.en || c.data.descriptions?.it || '';
    return `- ${c.data.names?.en || c.data.name}${desc ? `: ${desc}` : ''}`;
  });

  // Testi del sito: in Keystatic c'è solo l'italiano, le altre lingue le
  // aggiunge la traduzione automatica in build (quindi possono mancare)
  const bios = settings.bios as Record<string, string | undefined>;
  const taglines = settings.taglines as Record<string, string | undefined>;
  const story =
    (settings as { stories?: Record<string, string | null> }).stories?.en ||
    bios.en ||
    bios.it ||
    '';

  // Spedizioni: stesse tariffe del carrello (Keystatic → Vendita e stampe)
  const ship = normalizeShippingConfig((settings as { shipping?: unknown }).shipping);
  const rate = (z: ZoneRate) => `€${z.price}${z.freeOver > 0 ? ` (free over €${z.freeOver})` : ''}`;
  const weeks = ([min, max]: [number, number]) => `${min}–${max} weeks`;

  const body = `# ${settings.artistName}

> ${[taglines.en || taglines.it,`online gallery and shop of the artist ${settings.artistName}, a mysterious Italian artist`].filter(Boolean).join(' — ')}. Original artworks are unique pieces available on request via the site contact form; museum-grade fine art prints (pigment giclée on 100% cotton archival paper or artist canvas, signed and numbered, each with a certificate of authenticity) are purchasable online in European A sizes (A4–A0) and US/Canada inch sizes (8×10 to 24×36), with an optional extra white border for framing, tracked shipping to Italy, the EU, Switzerland, Norway, the UK, the USA (import duties included), Canada, Japan, South Korea, Singapore, Australia, New Zealand and the UAE, and secure Stripe checkout.

${story}

The site is available in 7 languages: Italian (default, ${base.href}), English (${new URL('/en/', base).href}), Spanish (/es), French (/fr), Chinese (/zh), Hindi (/hi), Arabic (/ar).

Contact: ${settings.contactEmail}
Instagram: ${settings.instagram || '—'}

## Artworks

${lines.join('\n')}

## Collections

${collectionLines.join('\n')}

## FAQ

- **Who is Boleòn?** An anonymous watercolor artist who prefers the works to speak rather than the name behind them.
- **What can I buy?** Original one-of-a-kind watercolors (available on request via the contact form, not sold directly online) and museum-grade fine art prints of the works, in many sizes.
- **How do I buy an original?** From the artwork page send a request ("Original on request"); Boleòn replies personally by email to arrange price, shipping and details.
- **Are prints available now?** Prints are currently available for pre-order: you pay now and receive the print once it is ready (made on request, so it takes a little longer).
- **How can I pay?** Secure card payment via Stripe; card data never passes through the site.
- **Where do you ship?** Italy, all EU countries, Switzerland, Norway, the UK (orders from €${ship.ukMinOrder}), the USA, Canada, Japan, South Korea, Singapore, Australia, New Zealand and the UAE; other countries on request. Boleòn is a solo artisan and personally prepares, signs and ships every piece, always with tracking.
- **How much is shipping?** Shown in the cart before payment, based on the destination country: Italy ${rate(ship.zones.italy)}, EU ${rate(ship.zones.eu)}, Switzerland, Norway and UK ${rate(ship.zones.europe)}, rest of the world ${rate(ship.zones.world)}, USA ${rate(ship.zones.usa)} plus import duties already included in the total. One shipping fee per order, even with several prints.
- **How long does delivery take?** Prints are made on request, signed and shipped by the artist: usually ${weeks(DELIVERY_WEEKS.italy)} in Italy, ${weeks(DELIVERY_WEEKS.eu)} in the EU and ${weeks(DELIVERY_WEEKS.world)} elsewhere, customs included. Original artwork timelines are arranged directly with the artist.
- **Will I pay duties or taxes on delivery?** Not in the EU. Not in the USA either: import duties are included in the total and paid by the artist when shipping. In Switzerland, Norway, the UK and other non-EU countries any duties, VAT and clearance fees are paid by the recipient on delivery.
- **Are the works signed? Is there a certificate?** Yes — every piece, original or print, is signed and comes with a certificate of authenticity.
- **Can I return a work?** Yes. Consumers can withdraw within 14 days of delivery; the work must come back intact, return shipping is paid by the customer and the refund includes the original shipping. If a print arrives damaged, send a photo within 48 hours and it is reprinted and reshipped free of charge.
- **Which languages?** Italian, English, Spanish, French, Chinese, Hindi, Arabic.
- **How do I get in touch?** The contact page, the "Request information" form on each artwork, or Instagram — messages go straight to the artist.

## Pages

- [Home](${base.href}): featured artworks with prices and availability
- [Gallery](${new URL('/galleria', base).href}): all artworks by collection (best sellers, Shades, Inspirations, Flowers)
- [The artist](${new URL('/artista', base).href}): who Boleòn is
- [Contact](${new URL('/contatto', base).href}): contact form for inquiries and original requests
- [FAQ](${new URL('/faq', base).href}): frequently asked questions — originals, prints, shipping, payment, returns, authenticity
- [Cart](${new URL('/carrello', base).href}): shopping cart and Stripe checkout
- [Sitemap](${new URL('/sitemap-index.xml', base).href})
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
