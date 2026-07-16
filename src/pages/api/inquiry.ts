import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { getEnv } from '../../lib/env';

export const prerender = false;

type InquiryPayload = {
  type?: string;
  name?: string;
  email?: string;
  message?: string;
  artwork?: string;
  url?: string;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const clean = (v: unknown, max: number) =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const escapeHtml = (s: string) =>
  s.replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c]!);

export const POST: APIRoute = async ({ request, locals }) => {
  let payload: InquiryPayload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const type = payload.type === 'original' ? 'original' : 'info';
  const name = clean(payload.name, 120);
  const email = clean(payload.email, 200);
  const message = clean(payload.message, 4000);
  const artwork = clean(payload.artwork, 200);
  const url = clean(payload.url, 400);

  if (!name || !EMAIL_RE.test(email) || !message) {
    return json({ error: 'invalid_fields' }, 400);
  }

  const resendKey = getEnv(locals, 'RESEND_API_KEY');
  const to = getEnv(locals, 'ORDER_NOTIFICATION_EMAIL') ?? 'boleon.art@gmail.com';
  const from = getEnv(locals, 'RESEND_FROM_EMAIL') ?? 'onboarding@resend.dev';
  if (!resendKey) {
    // Il modulo esiste ma Resend non è ancora configurato: il front-end
    // mostrerà un fallback (scrivi direttamente all'artista via email).
    return json({ error: 'not_configured' }, 503);
  }

  // Oggetto: "Richiesta originale/informazioni — <opera> — <email del cliente>"
  const kindLabel = type === 'original' ? 'Richiesta originale' : 'Richiesta informazioni';
  const subject = [kindLabel, artwork || null, email].filter(Boolean).join(' — ');

  const html = `
    <h2>${escapeHtml(kindLabel)}</h2>
    ${artwork ? `<p><strong>Opera:</strong> ${escapeHtml(artwork)}</p>` : ''}
    ${url ? `<p><strong>Pagina:</strong> <a href="${escapeHtml(url)}">${escapeHtml(url)}</a></p>` : ''}
    <p><strong>Da:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
    <p><strong>Messaggio:</strong></p>
    <p style="white-space:pre-line">${escapeHtml(message)}</p>
  `;

  try {
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: `Boleon <${from}>`,
      to,
      replyTo: email,
      subject,
      html,
    });
    return json({ ok: true });
  } catch (err) {
    console.error('Inquiry email failed:', err);
    return json({ error: 'send_failed' }, 502);
  }
};
