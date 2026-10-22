# Boleòn — sito galleria / shop

Sito dell'artista **Boleòn** (https://boleon.it): galleria di acquerelli con zoom ad alta definizione, originali su richiesta, stampe fine art acquistabili online con checkout Stripe e spedizione calcolata per Paese, 7 lingue. Costi fissi ≈ 0 € (solo il dominio): hosting sul piano gratuito di Cloudflare Workers.

## Stack

| Componente | Tecnologia |
|---|---|
| Framework | [Astro 5](https://astro.build) + adapter Cloudflare (pagine prerenderizzate + endpoint API) |
| Stile | Tailwind CSS 4 |
| CMS | [Keystatic](https://keystatic.com) (admin su `/keystatic`) |
| Zoom opere | PhotoSwipe 5 |
| Pagamenti | Stripe Checkout (prezzi e spedizione validati server-side) |
| Email | Resend (moduli di contatto e notifica ordini via webhook Stripe) |
| Traduzioni | DeepL, in fase di build (`scripts/translate.mjs`) |
| Statistiche | Umami (senza cookie) |
| Anti-spam | Cloudflare Turnstile (attivo solo se ci sono le chiavi) |
| Hosting | Cloudflare Workers + assets (`wrangler.toml`) |

**Lingue**: italiano (default, senza prefisso URL), inglese `/en`, spagnolo `/es`, francese `/fr`, cinese `/zh`, hindi `/hi`, arabo `/ar` (con layout RTL). I testi dell'interfaccia sono in `src/i18n/`; in Keystatic si scrive solo in italiano e le altre lingue le genera DeepL durante la build (senza chiave DeepL il sito usa l'italiano).

## Sviluppo locale

```sh
npm install
npm run dev
```

- Sito: http://localhost:4321
- **Admin contenuti (Keystatic)**: http://localhost:4321/keystatic — in locale salva direttamente i file nel repository; fai commit e push delle modifiche.

Per provare il checkout in locale copia `.env.example` in `.env` e inserisci le chiavi **test** di Stripe.

`npm run preview` non funziona con l'adapter Cloudflare: per provare la build completa (API comprese) usa `npm run build && npx wrangler dev --port 4329`, con eventuali segreti di prova in `.dev.vars` (escluso da git).

## Gestione contenuti

Da `/keystatic` puoi:

- **Aggiungere/modificare opere**: titolo, dimensioni, immagini (la prima è la copertina), descrizione, collezioni, flag "più venduti".
- **Originale**: di default è *su richiesta* (il cliente invia una richiesta dalla pagina dell'opera); dopo una vendita spunta **Originale venduto**.
- **Stampe**: formati e prezzi standard sono uguali per tutte le opere (Sito → Vendita e stampe); su ogni opera scegli i formati attivi e un eventuale aumento percentuale.
- **Spedizioni**: tariffe e soglie di spedizione gratuita per zona, dazi USA e minimo d'ordine per il Regno Unito (Sito → Vendita e stampe → Spedizioni).
- **Collezioni**, **copertina**, **identità** (nome, storia dell'artista) e **contatti**.

Il pannello privato `/gestione` mostra tutte le opere con il loro stato e apre la scheda Keystatic con un clic.

## Deploy su Cloudflare (Workers Builds)

1. **Workers & Pages** → progetto `boleon` collegato a questo repository, **production branch `main`**.
2. Build command `npm run build`, deploy command `npx wrangler deploy`, variabile `NODE_VERSION=22.12.0`.
3. **Variabili runtime** (Settings → Variables and Secrets, tipo *Secret*):
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
   - `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ORDER_NOTIFICATION_EMAIL`
   - `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`
   - `TURNSTILE_SECRET_KEY` (facoltativa)
4. **Variabili di build** (facoltative): `DEEPL_API_KEY`, `PUBLIC_TURNSTILE_SITE_KEY`, `PUBLIC_UMAMI_WEBSITE_ID` (l'ID Umami del sito è già nel codice).
5. Le variabili non segrete di Keystatic e i domini `boleon.it`/`www.boleon.it` sono già in `wrangler.toml`, insieme al flag `nodejs_compat`.

### Stripe

1. Prendi la **Secret key** da *Developers → API keys*.
2. In *Developers → Webhooks* aggiungi l'endpoint `https://boleon.it/api/stripe-webhook`, evento **`checkout.session.completed`**; copia il **Signing secret** in `STRIPE_WEBHOOK_SECRET`.
3. Paesi serviti, zone e calcolo della spedizione sono in `src/lib/shipping.ts`; le tariffe si cambiano da Keystatic.

### Resend

1. Crea un account su [resend.com](https://resend.com) e genera una API key.
2. Verifica il dominio (con `onboarding@resend.dev` come mittente si può scrivere solo all'email dell'account Resend).
3. `ORDER_NOTIFICATION_EMAIL` è l'indirizzo dove arrivano le notifiche dei nuovi ordini (se manca: boleon.art@gmail.com).

### Keystatic in produzione

Keystatic usa la **GitHub mode** (GitHub App `boleon-cms`): ogni salvataggio da `https://boleon.it/keystatic` diventa un commit e fa ripartire il deploy.

## Struttura del progetto

```
src/
├── i18n/                  # dizionari UI (7 lingue) + helper
├── content/artworks/      # opere (JSON, gestite da Keystatic)
├── content/collections/   # collezioni
├── content/site-*.json    # impostazioni sito (4 sezioni Keystatic, unite da lib/settings.ts)
├── assets/                # immagini delle opere
├── layouts/Base.astro     # header, footer, switcher lingua, badge carrello, icone
├── components/pages/      # corpi pagina condivisi tra italiano e [lang]/
├── lib/                   # catalogo e prezzi (artworks.ts), spedizioni (shipping.ts), impostazioni
├── scripts/               # carrello (localStorage) e statistiche
└── pages/
    ├── index, opere/[slug], galleria, artista, contatto, carrello, faq, …   # italiano
    ├── [lang]/…                                                              # altre 6 lingue
    └── api/checkout.ts, api/stripe-webhook.ts, api/inquiry.ts               # endpoint server
scripts/
├── translate.mjs          # traduzioni DeepL in build
└── generate-favicons.mjs  # icone (favicon.ico, apple-touch-icon, icon-192/512) da public/favicon.svg
docs/                      # piano marketing e piano spedizioni
graphify-out/              # mappa del codice per gli assistenti AI (graphify)
```
