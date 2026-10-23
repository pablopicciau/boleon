// Modulo di iscrizione alla newsletter nel footer (invia a /api/subscribe).
import { track } from './analytics';

type Turnstile = {
  render: (el: HTMLElement, options: { sitekey: string }) => string;
  getResponse: (widgetId: string) => string | undefined;
  reset: (widgetId: string) => void;
};

export function initNewsletter() {
  const form = document.querySelector<HTMLFormElement>('[data-newsletter]');
  if (!form) return;
  const input = form.querySelector<HTMLInputElement>('[data-nl-email]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-nl-submit]')!;
  const status = form.querySelector<HTMLElement>('[data-nl-status]')!;
  const captcha = form.querySelector<HTMLElement>('[data-nl-captcha]')!;
  const labels = form.dataset;

  // Anti-spam Turnstile (se configurato): il widget si crea solo quando
  // qualcuno inizia a scrivere, così non pesa su tutte le pagine
  let widgetId: string | undefined;
  const turnstile = () => (window as unknown as { turnstile?: Turnstile }).turnstile;
  input.addEventListener('focus', () => {
    if (!labels.sitekey || widgetId !== undefined) return;
    widgetId = turnstile()?.render(captcha, { sitekey: labels.sitekey });
  });

  const show = (text: string, tone: 'ok' | 'muted' | 'error') => {
    status.textContent = text;
    status.className = `mt-3 text-sm ${tone === 'ok' ? 'text-olive' : tone === 'error' ? 'text-accent' : 'opacity-80'}`;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!input.checkValidity() || !email) {
      show(labels.labelInvalid!, 'error');
      return;
    }
    submit.disabled = true;
    submit.textContent = labels.labelSending!;
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          locale: labels.locale,
          website: form.querySelector<HTMLInputElement>('[data-nl-trap]')?.value ?? '',
          turnstile: widgetId !== undefined ? (turnstile()?.getResponse(widgetId) ?? '') : '',
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      input.value = '';
      form.querySelector('[data-nl-row]')?.classList.add('hidden');
      captcha.classList.add('hidden');
      show(labels.labelSuccess!, 'ok');
      track('newsletter_signup', { locale: labels.locale ?? '' });
    } catch (err) {
      if (widgetId !== undefined) turnstile()?.reset(widgetId);
      const code = err instanceof Error ? err.message : '';
      if (code === '400') show(labels.labelInvalid!, 'error');
      else if (code === '503') show(labels.labelUnavailable!, 'muted');
      else show(labels.labelError!, 'error');
    } finally {
      submit.disabled = false;
      submit.textContent = labels.labelSubmit!;
    }
  });
}
