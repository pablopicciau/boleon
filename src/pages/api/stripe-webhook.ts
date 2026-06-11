import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { getEnv } from '../../lib/env';

export const prerender = false;

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
    const to = getEnv(locals, 'ORDER_NOTIFICATION_EMAIL');
    const from = getEnv(locals, 'RESEND_FROM_EMAIL') ?? 'onboarding@resend.dev';

    if (resendKey && to) {
      const amount = ((session.amount_total ?? 0) / 100).toFixed(2);
      const customer = session.customer_details;
      const address = customer?.address;
      const addressLines = address
        ? [address.line1, address.line2, `${address.postal_code ?? ''} ${address.city ?? ''}`, address.state, address.country]
            .filter(Boolean)
            .join(', ')
        : '—';

      const html = `
        <h2>Nuovo ordine sul sito</h2>
        <p><strong>Opere:</strong> ${session.metadata?.items ?? '—'}</p>
        <p><strong>Totale:</strong> € ${amount}</p>
        <p><strong>Cliente:</strong> ${customer?.name ?? '—'} (${customer?.email ?? '—'})</p>
        <p><strong>Indirizzo di spedizione:</strong> ${addressLines}</p>
        <p><strong>ID sessione Stripe:</strong> ${session.id}</p>
        <hr />
        <p>⚠️ Ricordati di aggiornare il sito da <a href="https://keystatic.com">Keystatic</a>:
        marca l'opera come <em>venduta</em> (originali) o riduci le <em>copie disponibili</em> (stampe).</p>
      `;

      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: `Boleon <${from}>`,
          to,
          subject: `Nuovo ordine — € ${amount}`,
          html,
        });
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
