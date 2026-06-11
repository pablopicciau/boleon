# Boleon — sito galleria / shop

Sito statico dell'artista **Boleon**: galleria di opere con zoom ad alta definizione, shop con checkout Stripe, 7 lingue. Costi fissi ≈ 0 € (solo il dominio): hosting su Cloudflare Pages free tier.

## Stack

| Componente | Tecnologia |
|---|---|
| Framework | [Astro 5](https://astro.build) + adapter Cloudflare |
| Stile | Tailwind CSS 4 |
| CMS | [Keystatic](https://keystatic.com) (admin su `/keystatic`) |
| Zoom opere | PhotoSwipe 5 |
| Pagamenti | Stripe Checkout (prezzi validati server-side) |
| Email | Resend (notifica ordini via webhook Stripe) |
| Hosting | Cloudflare Pages |

**Lingue**: italiano (default, senza prefisso URL), inglese `/en`, spagnolo `/es`, francese `/fr`, cinese `/zh`, hindi `/hi`, arabo `/ar` (con layout RTL). I testi dell'interfaccia sono in `src/i18n/`; le descrizioni delle opere si traducono da Keystatic (se una lingua è vuota viene usato l'italiano).

## Sviluppo locale

```sh
npm install
npm run dev
```

- Sito: http://localhost:4321
- **Admin contenuti (Keystatic)**: http://localhost:4321/keystatic — in locale salva direttamente i file nel repository; fai commit e push delle modifiche.

Per provare il checkout in locale copia `.env.example` in `.env` e inserisci le chiavi **test** di Stripe.

## Gestione contenuti

Da `/keystatic` puoi:

- **Aggiungere/modificare opere**: titolo, anno, tecnica, dimensioni, prezzo, immagini (la prima è la copertina), descrizioni nelle 7 lingue.
- **Tipo di opera**: *originale* (pezzo unico) o *stampa/edizione limitata* (con tiratura e copie disponibili).
- **Dopo una vendita** (ricevi un'email di notifica): spunta **Venduta** per gli originali, oppure riduci **Copie disponibili** per le stampe. Quando le copie sono 0 l'opera risulta "esaurita" e non è acquistabile.
- **Impostazioni sito**: nome, tagline, bio, email di contatto, social.

Le opere attuali sono **segnaposto**: sostituiscile con le tue (foto JPG di buona qualità — più sono grandi, migliore sarà lo zoom).

## Deploy su Cloudflare Pages

1. Vai su [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → collega questo repository GitHub.
2. Build settings: framework **Astro**, build command `npm run build`, output `dist` (rilevati in automatico).
3. In **Settings → Environment variables** aggiungi le variabili di `.env.example`:
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
   - `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ORDER_NOTIFICATION_EMAIL`
   - `PUBLIC_SITE_URL` = URL pubblico del sito (es. `https://boleon.com`)
4. Collega il tuo dominio in **Custom domains**.

Il flag `nodejs_compat` è già configurato in `wrangler.toml`.

### Stripe

1. Crea un account su [stripe.com](https://stripe.com) e prendi la **Secret key** da *Developers → API keys*.
2. In *Developers → Webhooks* aggiungi un endpoint: `https://TUO-DOMINIO/api/stripe-webhook`, evento **`checkout.session.completed`**; copia il **Signing secret** in `STRIPE_WEBHOOK_SECRET`.
3. Per modificare i paesi di spedizione consentiti: `SHIPPING_COUNTRIES` in `src/pages/api/checkout.ts`.

### Resend

1. Crea un account su [resend.com](https://resend.com), genera una API key.
2. Verifica il tuo dominio (oppure usa `onboarding@resend.dev` come mittente per i test).
3. `ORDER_NOTIFICATION_EMAIL` è l'indirizzo dove ricevi le notifiche dei nuovi ordini.

### Keystatic in produzione (modifica contenuti dal browser)

In produzione Keystatic usa la **GitHub mode**: apri `https://TUO-DOMINIO/keystatic`, segui la procedura guidata di creazione della GitHub App sul repository e aggiungi su Cloudflare le variabili che ti fornisce (`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`). Ogni salvataggio diventa un commit sul repository e fa ripartire il deploy automatico.

In alternativa puoi sempre modificare i contenuti in locale con `npm run dev` → `/keystatic` e poi fare push.

## Struttura del progetto

```
src/
├── i18n/                  # dizionari UI (7 lingue) + helper
├── content/artworks/      # opere (JSON, gestite da Keystatic)
├── content/settings.json  # impostazioni sito
├── assets/artworks/       # immagini delle opere
├── layouts/Base.astro     # header, footer, switcher lingua, badge carrello
├── components/            # card opera, switcher, corpi pagina condivisi
├── scripts/cart.ts        # carrello (localStorage)
└── pages/
    ├── index, opere/[slug], carrello, grazie, annullato   # italiano
    ├── [lang]/…                                           # altre 6 lingue
    └── api/checkout.ts, api/stripe-webhook.ts             # endpoint server
```
