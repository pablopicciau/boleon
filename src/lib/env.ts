import type { APIContext } from 'astro';

/**
 * Reads a secret from the Cloudflare runtime when deployed,
 * falling back to Vite env vars (.env) during local dev.
 */
export function getEnv(locals: APIContext['locals'], key: string): string | undefined {
  const runtimeEnv = (locals as { runtime?: { env?: Record<string, unknown> } }).runtime?.env;
  const value = runtimeEnv?.[key] ?? (import.meta.env as Record<string, unknown>)[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}
