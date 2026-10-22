import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import Stripe from 'stripe';
import { catalogEntries, type CatalogEntry } from '../../lib/artworks';
import { getEnv } from '../../lib/env';
import settings from '../../lib/settings';
import { DELIVERY_WEEKS, normalizeShippingConfig, quoteShipping } from '../../lib/shipping';
import { defaultLocale, locales, localizePath, useTranslations, type Locale } from '../../i18n';

export const prerender = false;

// Checkout locales supported by Stripe; the rest fall back to auto-detection
const STRIPE_LOCALES: Partial<Record<Locale, Stripe.Checkout.SessionCreateParams.Locale>> = {
  it: 'it',
  en: 'en',
  es: 'es',
  fr: 'fr',
  zh: 'zh',
};

// I Paesi serviti e le zone di spedizione stanno in src/lib/shipping.ts; le
// tariffe in site-shop.json (Keystatic → Sito → Vendita e stampe → Spedizioni).

type CheckoutPayload = {
  items?: { slug?: string; qty?: number; border?: number }[];
  locale?: string;
  /** Paese di spedizione scelto nel carrello (codice ISO a 2 lettere). */
  country?: string;
};

// Etichette dei supporti di stampa nelle email/ricevute Stripe (in italiano,
// sono per l'artista e per il laboratorio di stampa)
const SUPPORT_LABELS: Record<string, string> = {
  paper: 'carta fine art',
  canvas: 'tela artistica',
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

  const country = typeof payload.country === 'string' ? payload.country.toUpperCase() : '';
  const shippingConfig = normalizeShippingConfig((settings as { shipping?: unknown }).shipping);
  // Paese non servito (o mancante): niente checkout, il cliente deve scrivere
  if (!quoteShipping(shippingConfig, country, 0)) {
    return json({ error: 'invalid_country' }, 400);
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const summary: string[] = [];
  let subtotal = 0;

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
    // Bordo bianco extra scelto dal cliente (solo stampe, non cambia il prezzo)
    const border =
      isPrintVariant && typeof item.border === 'number' && item.border > 0 && item.border <= 10
        ? Math.round(item.border)
        : 0;
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
            isPrintVariant ? SUPPORT_LABELS[entry.variant.support ?? ''] : artwork.data.dimensions,
            border ? `bordo bianco ${border} cm per lato` : null,
          ]
            .filter(Boolean)
            .join(' · '),
          metadata: { slug: entry.id, ...(border ? { border: `${border}cm` } : {}) },
        },
      },
    });
    summary.push(`${entry.id}${border ? `+b${border}` : ''} x${qty}`);
    subtotal += entry.price * qty;
  }

  // Spedizione e dazi ricalcolati qui, mai presi dal carrello
  const quote = quoteShipping(shippingConfig, country, subtotal)!;
  if (quote.belowUkMinimum) {
    return json({ error: 'uk_minimum', min: shippingConfig.ukMinOrder }, 400);
  }
  const t = useTranslations(locale);
  if (quote.duties > 0) {
    // Dazi USA: li versa l'artista alla spedizione (Servizio Gestione Dazi di
    // Poste), quindi il cliente li paga qui e alla consegna non paga nulla.
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(quote.duties * 100),
        product_data: {
          name: t('checkout.dutiesName'),
          description: t('checkout.dutiesDesc'),
          metadata: { slug: 'us-duties' },
        },
      },
    });
  }
  const [minWeeks, maxWeeks] = DELIVERY_WEEKS[quote.zone];

  const stripe = new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });

  const origin = getEnv(locals, 'PUBLIC_SITE_URL') ?? new URL(request.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      locale: STRIPE_LOCALES[locale] ?? 'auto',
      // Solo il Paese scelto nel carrello: la tariffa dipende da lì
      shipping_address_collection: {
        allowed_countries: [
          quote.country as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry,
        ],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: Math.round(quote.shipping * 100), currency: 'eur' },
            display_name: t('checkout.shippingName'),
            delivery_estimate: {
              minimum: { unit: 'week', value: minWeeks },
              maximum: { unit: 'week', value: maxWeeks },
            },
          },
        },
      ],
      success_url: `${origin}${localizePath(locale, '/grazie')}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${localizePath(locale, '/annullato')}`,
      metadata: {
        items: summary.join(', ').slice(0, 490),
        country: quote.country,
        zone: quote.zone,
        shipping_eur: quote.shipping.toFixed(2),
        duties_eur: quote.duties.toFixed(2),
      },
    });
    return json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return json({ error: 'Could not create the checkout session.' }, 502);
  }
};
