# CLAUDE.md — memoria del progetto Boleon

Sito galleria/shop dell'artista **Boleon** (proprietario: pablopicciau@gmail.com).
Obiettivo: costi fissi ≈ 0 € — hosting su Cloudflare Workers (piano gratuito), si paga solo il dominio.
L'utente non è uno sviluppatore: rispondere in italiano, con istruzioni semplici e passo-passo.

## Stato attuale

- Sito **ONLINE su https://boleon.it** (e www) dal 2026-07-03: Worker Cloudflare con custom domain, verificato HTTP 200. Anche `boleon-art.boleon.it` è collegato.
- In catalogo ci sono **3 opere reali**: "Sea Drop" (Shades n.1), "Night Sea Shooting Star" (Shades n.2) e "Shy Carnivorous Plant" (Fiori n.1). Originale **solo su richiesta** (non acquistabile online), stampe in tutti i formati. Le altre 5 foto reali restano in `src/assets/quadri/` in attesa di essere catalogate.
- **Originale su richiesta** (`originalInquiryOnly`, default acceso in Keystatic): il pezzo unico non si compra online; la pagina opera mostra un modulo "Richiedi informazioni" che invia un'email all'artista via `src/pages/api/inquiry.ts` (Resend, reply-to = email del visitatore; fallback mailto se Resend non è configurato). Helper `isInquiryOnly` in `src/lib/artworks.ts`; `price` sull'opera è ora opzionale.
- **Sistema stampe rifatto (2026-07-17)**: i formati/prezzi standard vivono in `site-shop.json` (Keystatic → Sito → "Vendita e stampe"), uguali per tutte le opere: serie A (A4 45 € … A0 330 €) + formati in pollici USA/Canada (8×10" 40 € … 24×36" 210 €), ognuno con `width`/`height` in cm. Ogni opera ha solo `printsEnabled` (default ON), `printFormats` (multiselect, default tutti — `keystatic.config.ts` importa site-shop.json per generare le opzioni) e `printPricePercent` (aumento % sui prezzi standard, default 0). Supporto a scelta: carta o **tela** (`canvasSurchargePercent`, default 60%). **Bordo bianco extra** opzionale (0/2/3/5 cm per lato, gratuito, viaggia nel carrello come `border` e finisce nella descrizione Stripe). Prezzi arrotondati ai 5 €. Id carrello stampe: `slug::formatId::support`. Avviso proporzioni + anteprima del foglio (aspect-ratio e padding in scala) sulla pagina opera; pannelli `<details>` con info stampa/formati/cornici. Anno e tecnica RIMOSSI da schema e sito; "Venduta" ora si chiama "Originale venduto". Stock per formato eliminato (stampa su richiesta).
- **Sfondi copertina dalle opere** (`useArtworkImages` in site-cover.json, checkbox in Keystatic → Sfondi della copertina): se attivo (default ora) la hero ruota a caso tra le copertine delle opere in catalogo; se spento usa la lista manuale `heroImages`.
- Campo **`collectionNumber`** sull'opera: numero manuale mostrato come "N° …"; vuoto = calcolato dall'ordinamento nella collezione.
- **Stripe, webhook e Resend attivi**. Le chiavi (Stripe, Resend, DeepL, Turnstile, Keystatic) vanno SOLO nelle variabili di Cloudflare (Settings → Variables and Secrets, tipo Secret) — mai nel repo; una chiave incollata in chat va considerata compromessa e rigenerata.
- Keystatic in produzione: GitHub App `boleon-cms` creata e installata sul repo; segreti KEYSTATIC_* su Cloudflare (runtime), Client ID e slug `boleon-cms` in `wrangler.toml` [vars]. Admin: https://boleon.it/keystatic (login con GitHub).
- GitHub Pages: disattivato/inerte (source "GitHub Actions" senza workflow) — lasciare così.

## Stack e decisioni prese

- **Astro 5** + adapter **Cloudflare** (output server per gli endpoint API, pagine prerenderizzate).
- **Tailwind CSS 4** (via `@tailwindcss/vite`, stili in `src/styles/global.css`).
- **Keystatic** come CMS: admin su `/keystatic`. In locale salva i file nel repo; in produzione GitHub mode (ogni salvataggio = commit = redeploy).
- **PhotoSwipe 5** per lo zoom ad alta definizione delle opere.
- **Stripe Checkout** per i pagamenti: i prezzi sono **sempre validati server-side** in `src/pages/api/checkout.ts` (mai fidarsi del carrello client). Paesi, zone e calcolo della spedizione in `src/lib/shipping.ts` (vedi sezione Spedizioni).
- **Resend** per le email di notifica ordine, inviate dal webhook Stripe (`src/pages/api/stripe-webhook.ts`, evento `checkout.session.completed`).
- Carrello in `localStorage` (`src/scripts/cart.ts`), nessun backend per il carrello.
- **7 lingue**: italiano default senza prefisso URL; `/en`, `/es`, `/fr`, `/zh`, `/hi`, `/ar` (arabo con layout RTL). Dizionari UI in `src/i18n/`. In Keystatic c'è un solo campo (italiano) per i testi: titoli/descrizioni di opere, collezioni e identità sono tradotti da DeepL in build (`scripts/translate.mjs`, chiave di build `DEEPL_API_KEY`), con fallback sull'italiano.
- Opere di tipo **originale** (pezzo unico, flag "venduta") o **stampa/edizione** (tiratura + copie disponibili; a 0 copie risulta esaurita).
- **Varianti e prezzi**: `catalogEntries()` in `src/lib/artworks.ts` è l'unica fonte di verità (pezzo base + formato×supporto per le stampe), usata sia dal carrello sia da `checkout.ts`. Id carrello: `slug` per il pezzo base, `slug::formatId::support` per una stampa (separatore in `PRINT_ID_SEPARATOR`); il bordo bianco è un campo `border` sulla riga del carrello (righe distinte per bordi diversi).
- **`showAvailability`** per opera (default spento): se attivo, il sito mostra quante copie restano del **pezzo base** (solo `kind: print`, es. "7 di 30 disponibili"). I formati di stampa non hanno più stock (stampa su richiesta).
- **Lingua automatica**: al primo accesso della sessione uno script inline in `Base.astro` reindirizza alla lingua salvata (`localStorage['boleon-lang']`, impostata dallo switcher) o a quella del browser; guardia anti-loop in `sessionStorage`.
- **`/gestione`**: pannello privato (noindex, escluso dalla sitemap, solo italiano) con galleria cliccabile delle opere, filtri (Tutte/Con originale/Con stampe/Vendute-esaurite) e badge di stato; ogni card apre la scheda Keystatic corrispondente (`/keystatic/collection/artworks/item/<slug>`). Sezioni anche per collezioni, impostazioni sito e collegamenti utili. Non linkato dal sito pubblico.
- **Galleria con collezioni** (`/galleria` + wrapper `[lang]`, corpo in `GalleryPage.astro`): linguette client-side — "I più venduti" (aperta per prima, opere con flag `bestseller`), "Tutte le opere", poi una per collezione. Le collezioni sono una collection Keystatic (`src/content/collections/*.json`: `name` italiano/slug, `names` tradotti, `sortOrder`); le opere vi si assegnano col campo `collections` (array di slug, `fields.relationship` in Keystatic). Link diretto a una linguetta: `/galleria#c-<slug>` (prefisso `c-` per le collezioni, `piu-venduti`, `tutte`). Voce "Galleria" nell'header.
- **Keystatic**: menu laterale raggruppato via `ui.navigation` in "Galleria" (opere) e "Sito", con le impostazioni divise in 4 singleton/file: `identity` (site-identity.json: nome, tagline, bio), `cover` (site-cover.json: heroImages), `contacts` (site-contacts.json: email/social), `shop` (site-shop.json: printMaterials). Il codice le legge unite tramite `src/lib/settings.ts` (stessa forma del vecchio `settings.json`, che non esiste più).
- **Pagina contatti** `/contatto` (+ wrapper `[lang]`, corpo in `ContactPage.astro`): modulo che invia a `/api/inquiry` (vedi sotto); voce "Contatti" in header e footer.
- **SEO/AI**: sitemap multilingua (`@astrojs/sitemap`), `robots.txt` e `llms.txt` generati dinamicamente (`src/pages/robots.txt.ts` e `llms.txt.ts`, sempre allineati al catalogo), JSON-LD (`WebSite`+`Person` in home, `VisualArtwork`+`Offer` sulle opere), canonical/hreflang/Open Graph in `Base.astro`. L'URL base è `https://boleon.it` (in `astro.config.mjs`; sovrascrivibile con `PUBLIC_SITE_URL`). Dominio comprato su IONOS, nameserver spostati su Cloudflare; i 7 record email di IONOS (MX, SPF, DKIM ×2, DMARC, autodiscover) sono replicati su Cloudflare come "DNS only".
- **Tipografia**: Beth Ellen per titoli/header (`--font-serif`/`--font-hand`, precaricato in `Base.astro`), Cormorant Variable solo come riserva.
- **Icone del sito**: `public/favicon.svg` = "B" di Beth Ellen (convertita in tracciato) color carta su bordeaux con puntino ocra. `favicon.ico`, `apple-touch-icon.png`, `icon-192/512.png` si rigenerano con `node scripts/generate-favicons.mjs`; `site.webmanifest` per Android.
- **Sfondi hero a rotazione**: scelti da Keystatic (Impostazioni → "Sfondi della copertina", salvati in `src/assets/hero/`, elenco in `settings.heroImages`). Uno a caso all'apertura, poi cambio casuale ogni 10 s con dissolvenza (doppio buffer). La versione "spenta" è ottenuta con filtro CSS grayscale, quindi funziona con qualsiasi immagine. Risoluzione nomi-file in `src/lib/heroImages.ts` (ATTENZIONE: `import.meta.glob` va messo in file .ts, dentro i .astro genera errori di compilazione).
- **Palette dai dipinti** in `global.css`: accent #8f2b45 (bordeaux), ochre #c08430, olive #74803a, leaf #3e7a4e, sun #dfb43c. Prezzi: originale in bordeaux con bottone "Acquista l'originale"; stampe in riquadro oliva col prezzo che segue il formato selezionato.
- **Hero spotlight** (`src/components/HeroSpotlight.astro`): hero a schermo intero in home, tema chiaro, con maschera radiale che segue il cursore (stile ispirato a motionsites.ai/Lithos, adattato: vanilla JS + maschera CSS). Usa le copertine delle opere (fallback `opera-03.jpg`): base desaturata via filtro CSS grayscale + versione a colori pieni rivelata dallo spotlight. Animazioni in `global.css` con `prefers-reduced-motion`.
- **Quadri reali**: 5 foto migliorate (livelli, saturazione, nitidezza via sharp) in `src/assets/quadri/opera-01..05.jpg`, caricate dall'utente il 2026-07-02. Non ancora nel catalogo: mancano titoli/prezzi/dimensioni — quando l'utente li fornisce, creare le voci in `src/content/artworks/`. Il colore `--color-accent` (#8f2b45, bordeaux) è campionato dalle pennellate di questi quadri.
- Gestione vendite **manuale**: dopo la notifica email l'artista aggiorna venduta/copie da Keystatic.

- **Contatti**: email `boleon.art@gmail.com`, Instagram `boleon.art` (in `site-contacts.json`).
- **Richiesta originale / informazioni via finestra (modale)**: la pagina opera ha un tasto rosso materico "Originale su richiesta" e un tasto "Richiedi informazioni"; entrambi aprono un `<dialog>` (`.paper-panel`) col modulo, che invia a `/api/inquiry` con `type` (original/info) → oggetto email "Richiesta originale/informazioni — <opera> — <email cliente>", destinatario `boleon.art@gmail.com`, reply-to = cliente; fallback mailto se Resend non configurato.
- **Titoli traducibili** (`titles` localized sull'opera, opzionale): `pickLocalized(titles) || title` in card/dettaglio/carrello; lo slug resta il titolo base.
- **Storie collezioni** (`descriptions` localized sulla collezione): mostrate nella galleria quando si apre la relativa linguetta. Collezioni attuali: Shades (Sea Drop, Night Sea Shooting Star), Fiori (Shy Carnivorous Plant), Ispirazioni (ancora senza opere).
- **Estetica carta**: font "caratteristico" Beth Ellen su tutti i titoli/prezzi/header (via `--font-serif`); texture di carta ruvida BEN VISIBILE: tile raster `public/textures/carta.webp` (generato con sharp da SVG feTurbulence+feDiffuseLighting, rigenerabile) su `body` (con velo chiaro al 45%) e `.paper-panel`; bottoni materici `.paper-btn`/`.paper-btn-outline`. Rimosso `PaintAccents`; footer trasparente.
- **Pagina "L'artista"** `/artista` (rifatta 2026-07-17): testo definitivo dell'artista ("Mi chiamano Boleòn…"), tradotto in 7 lingue nel campo `stories` del singleton identity. Solo il nome in grande (font-hand) in cima; corpo nel font normale leggibile; titoli di capitolo (righe `## L'inizio` ecc. — o righe brevi senza punteggiatura finale) resi grandi in font-hand. `artistName` non più obbligatorio in Keystatic (fallback "Boleòn" in `settings.ts`). JSON-LD Person; voce "L'artista" nell'header.
- **Menu mobile (2026-07-17)**: su schermi piccoli le voci dell'header stanno in un menu hamburger in `Base.astro` (prima erano nascoste: da telefono le pagine erano irraggiungibili).
- **Pagina opera (2026-07-17/18)**: titolo (e riga collezione) SOPRA la foto; carosello senza frecce disegnate — zone invisibili ai bordi (1/6 sinistra/destra) per scorrere, centro = zoom, miniature sotto; via la riga "Opera originale · pezzo unico", anno e tecnica; prezzi in font normale; in fondo "Potrebbero piacerti anche" (bestseller prima, ordine mescolato a ogni visita).
- **Formati 2026-07-18**: 17 formati in 3 gruppi (`group` su ogni formato in site-shop.json: `a` serie A, `eu` standard europei cornici IKEA/Desenio 13×18/30×40/40×50/50×70/70×100, `in` pollici USA-CA 5×7…24×36), select con optgroup. **Selettore cm/in** accanto a "Formato": riscrive le misure delle opzioni nell'unità scelta (default: `in` per locale en, `cm` altrove). Ricerca: 8×10 e 5×7 i più venduti USA; 30×40/50×70/70×100 gli standard europei.
- **Modulo contatti (2026-07-17)**: corretto bug per cui `resend.emails.send()` non lancia eccezioni (l'errore va letto da `{error}`); finché `RESEND_API_KEY` manca su Cloudflare l'API risponde 503 e il sito mostra un messaggio gentile + bottone mailto con messaggio precompilato (nome/email inclusi). Per attivare l'invio automatico: account Resend con boleon.art@gmail.com → API key → variabile runtime `RESEND_API_KEY` su Cloudflare.
- **Home essenziale**: hero solo col nome (niente tagline né invito), due tasti gemelli "Scopri le opere" + "Galleria"; a fine pagina tasto "Scopri altre opere in galleria" (`home.moreWorks`). Sulla pagina opera è rimasto SOLO il tasto rosso "Originale su richiesta" (rimosso il tasto informazioni generiche; la pagina Contatti resta per quello).
- **Pagina contatti col modulo**: form nome/email/messaggio che invia a `/api/inquiry` (type info, oggetto "Richiesta informazioni — email cliente"), fallback mailto. Niente più bottone mailto.
- **Pagina opera riordinata**: prima il riquadro stampe (testo `printMaterials` promozionale in alto, 7 lingue), poi la riga compatta "Originale · pezzo unico su richiesta" con i due tasti (rosso + outline).
- **llms.txt** arricchito: stato "available on request" per gli originali su richiesta, collezioni con storie, pagine galleria/artista/contatti, titoli inglesi.

- **Statistiche (Umami, senza cookie/banner)**: ATTIVE: script in `Base.astro` con il Website ID del sito (scritto nel codice, sovrascrivibile con la variabile di build `PUBLIC_UMAMI_WEBSITE_ID`); numeri su cloud.umami.is (link anche in /gestione). Eventi tracciati via `src/scripts/analytics.ts` (no-op se Umami assente): add_to_cart, remove_from_cart, checkout_start, purchase (pagina /grazie), zoom (PhotoSwipe), inquiry_open/inquiry_sent (type original/info), contact_sent, gallery_tab. L'URL pagina è allegato automaticamente da Umami. Per "ogni click"/registrazioni (Clarity/GA4) servirebbe il banner cookie: scelta rimandata.

## Prossimi passi (piano concordato 2026-07-18)

1. ~~Email (Resend)~~ e ~~Statistiche (Umami)~~: FATTI. Resta consigliato verificare il dominio boleon.it in Resend (record DNS su Cloudflare) per inviare da es. info@boleon.it: con `onboarding@resend.dev` si può inviare SOLO all'email dell'account Resend.
2. **Turnstile**: codice pronto, mancano le chiavi (`PUBLIC_TURNSTILE_SITE_KEY` build + `TURNSTILE_SECRET_KEY` runtime).
3. **Newsletter**: Resend Audiences (gratis fino a 1.000 contatti). Da fare: modulo iscrizione sul sito (7 lingue) → endpoint `/api/subscribe` che aggiunge il contatto all'Audience + riga privacy; l'invio degli annunci si fa dal pannello Resend (Broadcasts), senza codice.
4. **Commenti con verifica email**: Cloudflare D1 (database gratuito) + `/api/comments` + codice di verifica a 6 cifre via Resend + Turnstile anti-spam + moderazione (pending finché l'artista non approva da /gestione). 2–3 sessioni di lavoro.
5. **Catalogare** le 5 foto in `src/assets/quadri/` (servono titolo, dimensioni, collezione).

## Marketing e visibilità

Piano completo e aggiornabile in `docs/piano-marketing.md` (SEO Google + Bing/AI, Pinterest, image SEO, marketplace, newsletter, costruzione del nome "Boleòn" come entità). Da rivedere e spuntare man mano insieme all'utente.

## Spedizioni (ATTIVE dal 2026-10-22)

Analisi concorrenti, listini reali e motivazioni in `docs/piano-spedizioni.md`.
- **Logica unica** in `src/lib/shipping.ts` (modulo puro, usato dal carrello nel browser e da `checkout.ts` sul server): `ZONE_COUNTRIES` (italy, eu = 26 Paesi UE, europe = CH/NO/GB, world = CA/JP/KR/SG/AU/NZ/AE, usa = US), `quoteShipping(config, country, subtotal)` → spedizione, dazi, soglia, `belowUkMinimum`, totale; `DELIVERY_WEEKS` per i tempi. Altri Paesi (BR, MX, IN, CN, SA…) = su richiesta.
- **Tariffe in Keystatic** (Vendita e stampe → Spedizioni, campo `shipping` di site-shop.json, letto con `normalizeShippingConfig`): Italia 8 € gratis ≥90; UE 18 € ≥150; Europa extra UE 25 € ≥300; Mondo 35 € ≥300; USA 35 € ≥300 + `usDutiesPercent` 10% del valore opere (prepagati dall'artista con il Servizio Gestione Dazi di Poste, il cliente non paga alla consegna); `ukMinOrder` 160 € (sotto 135 £ servirebbe la registrazione IVA UK). Una spedizione per ordine, nessun supplemento per formato. Tela trattata come arrotolata.
- **Carrello** (`CartPage.astro`): menu Paese con optgroup per zona e nomi via `Intl.DisplayNames`, preselezione da `localStorage['boleon-ship-country']` o dalla regione del browser; subtotale/spedizione/dazi/totale, "ti mancano X €", tempi, avvisi dogana/USA/UK; evento Umami `shipping_country`.
- **Checkout**: payload con `country`; 400 `invalid_country` / `uk_minimum`; Stripe `shipping_options` (fixed_amount + `delivery_estimate`), `allowed_countries: [country]`, riga "Dazi USA" separata, metadata `country/zone/shipping_eur/duties_eur`.
- **Webhook**: email con indirizzo di spedizione (`collected_information.shipping_details`), spedizione e dazi incassati, istruzioni "come spedire".
- FAQ e llms.txt leggono le tariffe dalle impostazioni; pagina legale con dazi, danni (ristampa gratis con foto entro 48 h) e resi (14 giorni, reso a carico del cliente).
- **Font**: Beth Ellen è precaricato con `<link rel="preload">` in `Base.astro` (senza, alla prima visita della home si vedeva il font di riserva finché il file non era in cache).

## Comandi

```sh
npm run dev       # sviluppo: http://localhost:4321 (admin: /keystatic)
npm run build     # build di produzione in dist/
node scripts/generate-favicons.mjs   # rigenera le icone da public/favicon.svg
```

Node >= 22.12. Per provare il checkout in locale: copiare `.env.example` in `.env` con le chiavi **test** di Stripe.

`astro preview` NON funziona con l'adapter Cloudflare: per provare la build completa (API comprese) usare `npm run build && npx wrangler dev --port 4329`, con eventuali segreti di prova in `.dev.vars` (escluso da git).

## Struttura (punti chiave)

- `src/layouts/Base.astro` — header, footer, switcher lingua, badge carrello.
- `src/components/pages/` — corpi pagina condivisi tra italiano e `[lang]/` (evitare duplicazioni: le pagine localizzate sono wrapper sottili).
- `src/lib/artworks.ts` — caricamento/ordinamento opere e helper traduzioni.
- `src/content.config.ts` + `keystatic.config.ts` — schema contenuti: tenerli **allineati** se si modifica lo schema.
- `wrangler.toml` — deploy come **Worker + assets** (non Pages): `main = ./dist/_worker.js/index.js` + `[assets] directory = ./dist`; `public/.assetsignore` esclude `_worker.js`/`_routes.json`. Flag `nodejs_compat` per Stripe/Resend.

## Deploy su Cloudflare (Workers Builds)

- Progetto **`boleon`** in Workers & Pages, connesso al repo GitHub. **Production branch: `main`** (fondamentale: se punta a un altro branch, i push su `main` usano solo `wrangler versions upload` = carica ma non pubblica → "No active routes").
- Build command `npm run build`, deploy command `npx wrangler deploy`, `NODE_VERSION=22.12.0`.
- React 19 su Workers: serve l'alias `react-dom/server` → `react-dom/server.edge` in `astro.config.mjs` (senza, deploy fallisce con `MessageChannel is not defined`).
- Intestazioni di sicurezza in `public/_headers`. GitHub Pages NON usato (disattivato).

## Convenzioni

- Testi UI: mai hardcodare stringhe nelle pagine — aggiungerle a tutti i 7 dizionari in `src/i18n/`.
- Nuove pagine: creare la versione italiana in `src/pages/` e il wrapper in `src/pages/[lang]/`, con il corpo condiviso in `src/components/pages/`.
- Prima di committare: `npm run build` deve passare senza errori.
- **Git (richiesta esplicita dell'utente)**: un solo branch, `main` — niente branch di lavoro né PR. Committare e pushare su `main` ogni volta che si completa una modifica, senza aspettare fine sessione.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
