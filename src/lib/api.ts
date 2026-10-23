// Piccoli strumenti condivisi dagli endpoint in src/pages/api/.

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const clean = (v: unknown, max: number) =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Verifica anti-spam con Cloudflare Turnstile. In caso di errore di rete non
// blocchiamo l'utente legittimo (fail-open); blocchiamo solo se Turnstile dice
// esplicitamente che il token non è valido.
export async function verifyTurnstile(
  secret: string,
  token: string,
  request: Request
): Promise<boolean> {
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
