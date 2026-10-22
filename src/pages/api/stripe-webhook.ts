import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { getEnv } from '../../lib/env';

export const prerender = false;

// Nome e indirizzo li scrive il cliente: niente HTML nell'email all'artista
const escapeHtml = (s: string) =>
  s.replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c]!);

export const POST: APIRoute = async ({ request, locals }) => {
  const secretKey = getEnv(locals, 'STRIPE_SECRET_KEY');
  const webhookSecret = getEnv(locals, 'STRIPE_WEBHOOK_SECRET');
  if (!secretKey || !webhookSecret) {
    return new Response('Webhook not configured', { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }

  const stripe = new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });

  let event: Stripe.Event;
  try {
    // Async verification: required on Cloudflare Workers (SubtleCrypto)
    event = await stripe.webhooks.constructEventAsync(
      await request.text(),
      signature,
      webhookSecret,
      undefined,
      Stripe.createSubtleCryptoProvider()
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const resendKey = getEnv(locals, 'RESEND_API_KEY');
    // Stessa logica del modulo contatti: se non è impostato un indirizzo
    // dedicato, le notifiche d'ordine arrivano all'email dell'artista.
    const to = getEnv(locals, 'ORDER_NOTIFICATION_EMAIL') ?? 'boleon.art@gmail.com';
    const from = getEnv(locals, 'RESEND_FROM_EMAIL') ?? 'onboarding@resend.dev';

    if (resendKey && to) {
      const amount = ((session.amount_total ?? 0) / 100).toFixed(2);
      const customer = session.customer_details;
      // Indirizzo di SPEDIZIONE (può essere diverso da quello di fatturazione)
      const ship = session.collected_information?.shipping_details;
      const address = ship?.address ?? customer?.address;
      const addressLines = address
        ? [address.line1, address.line2, `${address.postal_code ?? ''} ${address.city ?? ''}`, address.state, address.country]
            .filter(Boolean)
            .join(', ')
        : '—';

      // Spedizione e dazi calcolati dal checkout (src/lib/shipping.ts)
      const meta = session.metadata ?? {};
      const shippingPaid = Number(meta.shipping_eur ?? (session.shipping_cost?.amount_total ?? 0) / 100);
      const duties = Number(meta.duties_eur ?? 0);
      const howToShip =
        meta.zone === 'usa'
          ? `Poste Delivery International Standard con il <strong>Servizio Gestione Dazi</strong>: versa i dazi incassati (€ ${duties.toFixed(2)}), il cliente non deve pagare nulla alla consegna.`
          : meta.zone === 'italy' || meta.zone === 'eu'
            ? 'Packlink o Spedire.com: confronta i corrieri e stampa l’etichetta.'
            : 'Poste Delivery International Standard online (con la pre-accettazione web costa meno). Dogana e tasse d’importazione le paga il destinatario.';

      const html = `
        <h2>Nuovo ordine sul sito</h2>
        <p><strong>Opere:</strong> ${escapeHtml(meta.items ?? '—')}</p>
        <p><strong>Totale incassato:</strong> € ${amount}</p>
        <p><strong>Spedizione pagata dal cliente:</strong> ${shippingPaid > 0 ? `€ ${shippingPaid.toFixed(2)}` : 'gratuita (soglia superata)'}</p>
        ${duties > 0 ? `<p><strong>Dazi USA incassati:</strong> € ${duties.toFixed(2)}</p>` : ''}
        <p><strong>Cliente:</strong> ${escapeHtml(customer?.name ?? '—')} (${escapeHtml(customer?.email ?? '—')})</p>
        <p><strong>Destinatario:</strong> ${escapeHtml(ship?.name ?? customer?.name ?? '—')}</p>
        <p><strong>Indirizzo di spedizione:</strong> ${escapeHtml(addressLines)}</p>
        <p><strong>Come spedire:</strong> ${howToShip}</p>
        <p><strong>ID sessione Stripe:</strong> ${session.id}</p>
        <hr />
        <p>📦 Prima di chiudere il pacco: firma, certificato di autenticità, foto della stampa e del pacco. Poi manda al cliente il numero di tracciamento.</p>
        <p>⚠️ Se era un originale o un'edizione limitata, aggiorna il sito da <a href="https://boleon.it/keystatic">Keystatic</a>:
        marca l'opera come <em>venduta</em> o riduci le <em>copie disponibili</em>.</p>
      `;

      try {
        const resend = new Resend(resendKey);
        // send() non lancia eccezioni in caso di errore: va letto { error }
        const { error } = await resend.emails.send({
          from: `Boleon <${from}>`,
          to,
          subject: `Nuovo ordine — € ${amount}${meta.country ? ` — ${meta.country}` : ''}`,
          html,
        });
        if (error) console.error('Resend notification rejected:', error);
      } catch (err) {
        // Never fail the webhook because of the notification email
        console.error('Resend notification failed:', err);
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
