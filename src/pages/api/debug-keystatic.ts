import type { APIRoute } from 'astro';
import { getEnv } from '../../lib/env';

export const prerender = false;

// Endpoint diagnostico TEMPORANEO per il login Keystatic: non espone i valori
// dei segreti (solo lunghezza/spazi/primi 2 caratteri) e chiede a GitHub se la
// coppia Client ID + Client secret è valida usando un codice fittizio.
// Da rimuovere appena il login funziona.

const inspect = (v: string | undefined) =>
  v === undefined
    ? { present: false }
    : {
        present: true,
        length: v.length,
        trimmedLength: v.trim().length,
        hasWhitespace: v !== v.trim(),
        start: v.slice(0, 2),
      };

export const GET: APIRoute = async ({ locals }) => {
  const clientId = getEnv(locals, 'KEYSTATIC_GITHUB_CLIENT_ID');
  const clientSecret = getEnv(locals, 'KEYSTATIC_GITHUB_CLIENT_SECRET');
  const secret = getEnv(locals, 'KEYSTATIC_SECRET');
  const slug = getEnv(locals, 'PUBLIC_KEYSTATIC_GITHUB_APP_SLUG');

  let githubCheck = 'skipped (variabili mancanti)';
  if (clientId && clientSecret) {
    try {
      const url = new URL('https://github.com/login/oauth/access_token');
      url.searchParams.set('client_id', clientId.trim());
      url.searchParams.set('client_secret', clientSecret.trim());
      url.searchParams.set('code', 'codice-finto-per-diagnosi');
      const res = await fetch(url, {
        method: 'POST',
        headers: { Accept: 'application/json', 'User-Agent': 'boleon-diagnostics' },
      });
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      githubCheck = body?.error ?? `http_${res.status}`;
    } catch (err) {
      githubCheck = `fetch_failed: ${(err as Error).message}`;
    }
  }

  const hints: Record<string, string> = {
    bad_verification_code:
      'CREDENZIALI CORRETTE: GitHub riconosce Client ID + secret (rifiuta solo il codice finto, come previsto).',
    incorrect_client_credentials:
      'Client ID e/o Client secret NON corrispondono alla GitHub App: o il secret è stato incollato male, o appartiene a un\'altra app.',
  };

  return new Response(
    JSON.stringify(
      {
        clientId: inspect(clientId),
        clientSecret: inspect(clientSecret),
        keystaticSecret: inspect(secret),
        slug: slug ?? null,
        githubCheck,
        diagnosi: hints[githubCheck] ?? null,
      },
      null,
      2
    ),
    { headers: { 'Content-Type': 'application/json' } }
  );
};
