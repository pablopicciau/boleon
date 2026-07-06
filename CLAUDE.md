# CLAUDE.md — memoria del progetto Boleon

Sito galleria/shop dell'artista **Boleon** (proprietario: pablopicciau@gmail.com).
Obiettivo: costi fissi ≈ 0 € — hosting su Cloudflare Pages free tier, si paga solo il dominio.
L'utente non è uno sviluppatore: rispondere in italiano, con istruzioni semplici e passo-passo.

## Stato attuale

- Sito **completo e funzionante** ma **non ancora online**: manca il deploy su Cloudflare Pages (istruzioni nel README).
- Le 8 opere in `src/content/artworks/` sono **segnaposto** (SVG generati da `scripts/`): vanno sostituite con foto reali via Keystatic.
- Chiavi Stripe/Resend non ancora configurate (vedi `.env.example`).
- Branch di lavoro: `claude/boleon-site-management-design-o2t73p` (base: `claude/artist-static-site-vt93u2`).

## Stack e decisioni prese

- **Astro 5** + adapter **Cloudflare** (output server per gli endpoint API, pagine prerenderizzate).
- **Tailwind CSS 4** (via `@tailwindcss/vite`, stili in `src/styles/global.css`).
- **Keystatic** come CMS: admin su `/keystatic`. In locale salva i file nel repo; in produzione GitHub mode (ogni salvataggio = commit = redeploy).
- **PhotoSwipe 5** per lo zoom ad alta definizione delle opere.
- **Stripe Checkout** per i pagamenti: i prezzi sono **sempre validati server-side** in `src/pages/api/checkout.ts` (mai fidarsi del carrello client). Paesi di spedizione: costante `SHIPPING_COUNTRIES` nello stesso file.
- **Resend** per le email di notifica ordine, inviate dal webhook Stripe (`src/pages/api/stripe-webhook.ts`, evento `checkout.session.completed`).
- Carrello in `localStorage` (`src/scripts/cart.ts`), nessun backend per il carrello.
- **7 lingue**: italiano default senza prefisso URL; `/en`, `/es`, `/fr`, `/zh`, `/hi`, `/ar` (arabo con layout RTL). Dizionari UI in `src/i18n/`; le descrizioni opere si traducono da Keystatic, con fallback sull'italiano se una lingua è vuota.
- **Lingua automatica**: al primo accesso della sessione uno script inline in `Base.astro` reindirizza alla lingua salvata (`localStorage['boleon-lang']`, impostata dallo switcher) o a quella del browser; guardia anti-loop in `sessionStorage`. Tag `hreflang` in ogni pagina.
- **Ogni opera può avere due possibilità di acquisto insieme**: l'**originale** (pezzo unico: prezzo, dimensioni, flag "venduta", attivo con `original.forSale`) e più **formati di stampa** (`prints[]`: dimensioni, prezzo, tiratura, copie per formato). Il modello è `PurchaseOption` in `src/lib/artworks.ts` (id `original` / `print-<indice>`); carrello e checkout usano `{slug, option, qty}`.
- `showAvailability` per opera: se attivo il sito mostra ai visitatori le copie rimaste ("7 di 30 disponibili").
- Gestione vendite **manuale**: dopo la notifica email l'artista aggiorna venduta/copie da `/gestione` o Keystatic.
- **`/gestione`**: pannello privato (noindex, solo italiano) con galleria cliccabile delle opere, filtri e badge di stato; ogni card apre la scheda Keystatic corrispondente. Non linkato dal sito pubblico.
- **Font self-hosted** via `@fontsource-variable/cormorant` (titoli) e `@fontsource-variable/inter` (testo), importati in `global.css`; palette calda (`--color-neutral-*` ridefiniti su toni caldi).

## Comandi

```sh
npm run dev       # sviluppo: http://localhost:4321 (admin: /keystatic)
npm run build     # build di produzione in dist/
npm run preview   # anteprima della build
```

Node >= 22.12. Per provare il checkout in locale: copiare `.env.example` in `.env` con le chiavi **test** di Stripe.

## Struttura (punti chiave)

- `src/layouts/Base.astro` — header, footer, switcher lingua, badge carrello.
- `src/components/pages/` — corpi pagina condivisi tra italiano e `[lang]/` (evitare duplicazioni: le pagine localizzate sono wrapper sottili).
- `src/lib/artworks.ts` — caricamento/ordinamento opere e helper traduzioni.
- `src/content.config.ts` + `keystatic.config.ts` — schema contenuti: tenerli **allineati** se si modifica lo schema.
- `wrangler.toml` — flag `nodejs_compat` necessario per Stripe/Resend su Cloudflare.

## Convenzioni

- Testi UI: mai hardcodare stringhe nelle pagine — aggiungerle a tutti i 7 dizionari in `src/i18n/`.
- Nuove pagine: creare la versione italiana in `src/pages/` e il wrapper in `src/pages/[lang]/`, con il corpo condiviso in `src/components/pages/`.
- Prima di committare: `npm run build` deve passare senza errori.
- Commit e push sul branch indicato dalla sessione; **non** aprire PR se non richiesto.
