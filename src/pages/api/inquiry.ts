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
  turnstile?: string;
};

// Verifica anti-spam con Cloudflare Turnstile. In caso di errore di rete non
// blocchiamo l'utente legittimo (fail-open); blocchiamo solo se Turnstile dice
// esplicitamente che il token non è valido.
async function verifyTurnstile(secret: string, token: string, request: Request): Promise<boolean> {
  try {
    const body = new URLSearchParams({ secret, response: token });
    const ip = request.headers.get('CF-Connecting-IP');
    if (ip) body.set('remoteip', ip);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return true;
  }
}

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

  // Anti-spam: attivo solo se è impostata la chiave segreta Turnstile su Cloudflare.
  const turnstileSecret = getEnv(locals, 'TURNSTILE_SECRET_KEY');
  if (turnstileSecret) {
    const token = clean(payload.turnstile, 3000);
    const ok = token && (await verifyTurnstile(turnstileSecret, token, request));
    if (!ok) return json({ error: 'captcha_failed' }, 403);
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
    // Attenzione: send() NON lancia un'eccezione in caso di errore,
    // restituisce { error } — va controllato esplicitamente.
    const { error } = await resend.emails.send({
      from: `Boleon <${from}>`,
      to,
      replyTo: email,
      subject,
      html,
    });
    if (error) {
      console.error('Inquiry email rejected by Resend:', error);
      return json({ error: 'send_failed' }, 502);
    }
    return json({ ok: true });
  } catch (err) {
    console.error('Inquiry email failed:', err);
    return json({ error: 'send_failed' }, 502);
  }
};
