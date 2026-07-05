import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import Stripe from 'stripe';
import { catalogEntries, type CatalogEntry } from '../../lib/artworks';
import { getEnv } from '../../lib/env';
import { defaultLocale, locales, localizePath, type Locale } from '../../i18n';

export const prerender = false;

// Checkout locales supported by Stripe; the rest fall back to auto-detection
const STRIPE_LOCALES: Partial<Record<Locale, Stripe.Checkout.SessionCreateParams.Locale>> = {
  it: 'it',
  en: 'en',
  es: 'es',
  fr: 'fr',
  zh: 'zh',
};

const SHIPPING_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] =
  [
    'IT', 'FR', 'DE', 'ES', 'PT', 'AT', 'BE', 'NL', 'LU', 'IE', 'GB', 'CH',
    'SE', 'DK', 'FI', 'NO', 'PL', 'CZ', 'GR', 'US', 'CA', 'MX', 'BR', 'JP',
    'CN', 'IN', 'AU', 'NZ', 'AE', 'SA',
  ];

type CheckoutPayload = {
  items?: { slug?: string; qty?: number }[];
  locale?: string;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request, locals }) => {
  const secretKey = getEnv(locals, 'STRIPE_SECRET_KEY');
  if (!secretKey) {
    return json({ error: 'Stripe is not configured (missing STRIPE_SECRET_KEY).' }, 500);
  }

  let payload: CheckoutPayload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  const items = payload.items ?? [];
  if (!Array.isArray(items) || items.length === 0 || items.length > 20) {
    return json({ error: 'Invalid cart.' }, 400);
  }

  const locale: Locale = locales.includes(payload.locale as Locale)
    ? (payload.locale as Locale)
    : defaultLocale;

  // Prices and availability always come from the build-time catalog, never from the client
  const artworks = await getCollection('artworks');
  const bySlug = new Map(artworks.map((a) => [a.id, a]));
  const entryById = new Map<string, CatalogEntry>();
  for (const artwork of artworks) {
    for (const entry of catalogEntries(artwork)) entryById.set(entry.id, entry);
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const summary: string[] = [];

  for (const item of items) {
    const entry = item.slug ? entryById.get(item.slug) : undefined;
    const qty = item.qty ?? 0;
    if (!Number.isInteger(qty) || qty < 1) {
      return json({ error: `Unknown or invalid item: ${item.slug ?? '?'}` }, 400);
    }
    if (!entry || qty > entry.max) {
      return json({ error: `No longer available: ${item.slug}`, slug: item.slug }, 409);
    }
    const artwork = bySlug.get(entry.slug)!;
    const isPrintVariant = entry.variant.kind === 'print';
    lineItems.push({
      quantity: qty,
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(entry.price * 100),
        product_data: {
          name: isPrintVariant
            ? `${entry.title} — stampa fine art ${entry.variant.size}`
            : entry.title,
          description: [
            isPrintVariant
              ? `Stampa fine art - ${entry.variant.size}`
              : artwork.data.kind === 'print'
                ? 'Stampa - edizione limitata'
                : 'Opera originale',
            artwork.data.technique,
            isPrintVariant ? null : artwork.data.dimensions,
            String(artwork.data.year),
          ]
            .filter(Boolean)
            .join(' · '),
          metadata: { slug: entry.id },
        },
      },
    });
    summary.push(`${entry.id} x${qty}`);
  }

  const stripe = new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });

  const origin = getEnv(locals, 'PUBLIC_SITE_URL') ?? new URL(request.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      locale: STRIPE_LOCALES[locale] ?? 'auto',
      shipping_address_collection: { allowed_countries: SHIPPING_COUNTRIES },
      success_url: `${origin}${localizePath(locale, '/grazie')}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${localizePath(locale, '/annullato')}`,
      metadata: { items: summary.join(', ').slice(0, 490) },
    });
    return json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return json({ error: 'Could not create the checkout session.' }, 502);
  }
};
