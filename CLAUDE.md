# CLAUDE.md — memoria del progetto Boleon

Sito galleria/shop dell'artista **Boleon** (proprietario: pablopicciau@gmail.com).
Obiettivo: costi fissi ≈ 0 € — hosting su Cloudflare Pages free tier, si paga solo il dominio.
L'utente non è uno sviluppatore: rispondere in italiano, con istruzioni semplici e passo-passo.

## Stato attuale

- Sito **completo e funzionante** ma **non ancora online**: manca il deploy su Cloudflare Pages (istruzioni nel README).
- Le 8 opere in `src/content/artworks/` sono **segnaposto** (SVG generati da `scripts/`): vanno sostituite con foto reali via Keystatic.
- Chiavi Stripe/Resend non ancora configurate (vedi `.env.example`).
- L'utente ha già un dominio da collegare al sito (Cloudflare Pages → Custom domains).

## Stack e decisioni prese

- **Astro 5** + adapter **Cloudflare** (output server per gli endpoint API, pagine prerenderizzate).
- **Tailwind CSS 4** (via `@tailwindcss/vite`, stili in `src/styles/global.css`).
- **Keystatic** come CMS: admin su `/keystatic`. In locale salva i file nel repo; in produzione GitHub mode (ogni salvataggio = commit = redeploy).
- **PhotoSwipe 5** per lo zoom ad alta definizione delle opere.
- **Stripe Checkout** per i pagamenti: i prezzi sono **sempre validati server-side** in `src/pages/api/checkout.ts` (mai fidarsi del carrello client). Paesi di spedizione: costante `SHIPPING_COUNTRIES` nello stesso file.
- **Resend** per le email di notifica ordine, inviate dal webhook Stripe (`src/pages/api/stripe-webhook.ts`, evento `checkout.session.completed`).
- Carrello in `localStorage` (`src/scripts/cart.ts`), nessun backend per il carrello.
- **7 lingue**: italiano default senza prefisso URL; `/en`, `/es`, `/fr`, `/zh`, `/hi`, `/ar` (arabo con layout RTL). Dizionari UI in `src/i18n/`; le descrizioni opere si traducono da Keystatic, con fallback sull'italiano se una lingua è vuota.
- Opere di tipo **originale** (pezzo unico, flag "venduta") o **stampa/edizione** (tiratura + copie disponibili; a 0 copie risulta esaurita).
- **SEO/AI**: sitemap multilingua (`@astrojs/sitemap`), `robots.txt` e `llms.txt` generati dinamicamente (`src/pages/robots.txt.ts` e `llms.txt.ts`, sempre allineati al catalogo), JSON-LD (`WebSite`+`Person` in home, `VisualArtwork`+`Offer` sulle opere), canonical/hreflang/Open Graph in `Base.astro`. L'URL base è `https://boleon.it` (in `astro.config.mjs`; sovrascrivibile con `PUBLIC_SITE_URL`). Dominio comprato su IONOS, nameserver spostati su Cloudflare; i 7 record email di IONOS (MX, SPF, DKIM ×2, DMARC, autodiscover) sono replicati su Cloudflare come "DNS only".
- **Tipografia**: Cormorant Variable (`@fontsource-variable/cormorant`) come font serif per titoli e prezzi, importato in `Base.astro`.
- **Hero spotlight** (`src/components/HeroSpotlight.astro`): hero a schermo intero in home, tema chiaro, con maschera radiale che segue il cursore (stile ispirato a motionsites.ai/Lithos, adattato: vanilla JS + maschera CSS). Usa un quadro REALE dell'artista: base desaturata (`src/assets/quadri/hero-spenta.jpg`) + versione a colori pieni rivelata dallo spotlight (`opera-03.jpg`). Animazioni in `global.css` con `prefers-reduced-motion`.
- **Quadri reali**: 5 foto migliorate (livelli, saturazione, nitidezza via sharp) in `src/assets/quadri/opera-01..05.jpg`, caricate dall'utente il 2026-07-02. Non ancora nel catalogo: mancano titoli/prezzi/dimensioni — quando l'utente li fornisce, creare le voci in `src/content/artworks/` e rimuovere i segnaposto SVG. Il colore `--color-accent` (#8f2b45, bordeaux) è campionato dalle pennellate di questi quadri.
- Gestione vendite **manuale**: dopo la notifica email l'artista aggiorna venduta/copie da Keystatic.

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
- **Git (richiesta esplicita dell'utente)**: un solo branch, `main` — niente branch di lavoro né PR. Committare e pushare su `main` ogni volta che si completa una modifica, senza aspettare fine sessione.
