/**
 * Eventi verso Umami (se lo script è caricato in Base.astro).
 * Se l'analytics non è configurato, non fa nulla: il sito funziona uguale.
 * L'URL della pagina viene allegato automaticamente da Umami a ogni evento.
 */
type EventData = Record<string, string | number>;

export function track(event: string, data?: EventData) {
  try {
    (window as unknown as { umami?: { track: (e: string, d?: EventData) => void } }).umami?.track(
      event,
      data
    );
  } catch {
    /* analytics assente o bloccato: ignora */
  }
}
