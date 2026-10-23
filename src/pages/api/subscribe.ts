import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { getEnv } from '../../lib/env';
import { clean, EMAIL_RE, json, verifyTurnstile } from '../../lib/api';

export const prerender = false;

// Iscrizione alla newsletter: l'email finisce tra i contatti di Resend, in un
// segmento per lingua (gli annunci si scrivono e si inviano dal pannello
// Resend → Broadcasts, scegliendo il segmento). I segmenti si creano da soli
// alla prima iscrizione: non serve configurare nulla oltre a RESEND_API_KEY,
// che però deve avere i permessi "Full access" (una chiave "Sending access"
// può solo inviare email, non gestire i contatti).

type SubscribePayload = {
  email?: string;
  locale?: string;
  website?: string; // campo trappola per i bot, invisibile alle persone
  turnstile?: string;
};

const SEGMENTS = {
  it: 'Newsletter – italiano',
  intl: 'Newsletter – international',
} as const;
type SegmentKey = keyof typeof SEGMENTS;

// Id dei segmenti già trovati, finché il Worker resta in memoria
const segmentIds: Partial<Record<SegmentKey, string>> = {};

async function segmentId(resend: Resend, key: SegmentKey): Promise<string> {
  const cached = segmentIds[key];
  if (cached) return cached;
  const name = SEGMENTS[key];
  const { data: list, error: listError } = await resend.segments.list();
  if (listError) throw listError;
  let id = list.data.find((s) => s.name === name)?.id;
  if (!id) {
    const { data: created, error } = await resend.segments.create({ name });
    if (error) throw error;
    id = created.id;
  }
  segmentIds[key] = id;
  return id;
}

const isAuthError = (err: unknown) =>
  ['restricted_api_key', 'invalid_api_key', 'missing_api_key'].includes(
    (err as { name?: string } | null)?.name ?? ''
  );

export const POST: APIRoute = async ({ request, locals }) => {
  let payload: SubscribePayload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const email = clean(payload.email, 200).toLowerCase();
  if (!EMAIL_RE.test(email)) return json({ error: 'invalid_email' }, 400);

  // Un bot che compila anche il campo nascosto riceve un "ok" ma non viene iscritto
  if (clean(payload.website, 200)) return json({ ok: true });

  const turnstileSecret = getEnv(locals, 'TURNSTILE_SECRET_KEY');
  if (turnstileSecret) {
    const token = clean(payload.turnstile, 3000);
    const ok = token && (await verifyTurnstile(turnstileSecret, token, request));
    if (!ok) return json({ error: 'captcha_failed' }, 403);
  }

  const resendKey = getEnv(locals, 'RESEND_API_KEY');
  if (!resendKey) return json({ error: 'not_configured' }, 503);

  const resend = new Resend(resendKey);
  const key: SegmentKey = payload.locale === 'it' ? 'it' : 'intl';

  try {
    const segment = await segmentId(resend, key);
    const { error } = await resend.contacts.create({
      email,
      unsubscribed: false,
      segments: [{ id: segment }],
    });
    if (!error) return json({ ok: true });
    if (isAuthError(error)) throw error;

    // Contatto già presente (magari disiscritto in passato): chi compila di
    // nuovo il modulo vuole ricevere la newsletter, quindi lo riattiviamo
    const { error: updateError } = await resend.contacts.update({ email, unsubscribed: false });
    if (updateError) {
      console.error('Newsletter: contact create/update rejected by Resend:', error, updateError);
      return json({ error: 'subscribe_failed' }, 502);
    }
    await resend.contacts.segments.add({ email, segmentId: segment });
    return json({ ok: true });
  } catch (err) {
    console.error('Newsletter subscription failed:', err);
    // Chiave mancante o senza permessi sui contatti: per il visitatore
    // l'iscrizione "non è ancora attiva", nei log resta il motivo preciso
    const auth = isAuthError(err);
    return json({ error: auth ? 'not_configured' : 'subscribe_failed' }, auth ? 503 : 502);
  }
};
