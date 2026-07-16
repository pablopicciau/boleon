# CLAUDE.md — memoria del progetto Boleon

Sito galleria/shop dell'artista **Boleon** (proprietario: pablopicciau@gmail.com).
Obiettivo: costi fissi ≈ 0 € — hosting su Cloudflare Pages free tier, si paga solo il dominio.
L'utente non è uno sviluppatore: rispondere in italiano, con istruzioni semplici e passo-passo.

## Stato attuale

- Sito **ONLINE su https://boleon.it** (e www) dal 2026-07-03: Worker Cloudflare con custom domain, verificato HTTP 200. Anche `boleon-art.boleon.it` è collegato.
- In catalogo ci sono **2 opere reali**: "Sea Drop" (collezione Shades n.1) e "Night Sea Shooting Star" (collezione Shades n.2), acquerelli inviati in chat il 2026-07-16. Originale **solo su richiesta** (non acquistabile online), stampe A4→A0. Le altre 5 foto reali restano in `src/assets/quadri/` in attesa di essere catalogate.
- **Originale su richiesta** (`originalInquiryOnly`, default acceso in Keystatic): il pezzo unico non si compra online; la pagina opera mostra un modulo "Richiedi informazioni" che invia un'email all'artista via `src/pages/api/inquiry.ts` (Resend, reply-to = email del visitatore; fallback mailto se Resend non è configurato). Helper `isInquiryOnly` in `src/lib/artworks.ts`; `price` sull'opera è ora opzionale.
- **Stampe standard A4→A0** (`printSizes`): prezzi = costo stampa "fatto bene" +50% (A4 45 €, A3 75 €, A2 120 €, A1 195 €, A0 330 €).
- **Sfondi copertina dalle opere** (`useArtworkImages` in site-cover.json, checkbox in Keystatic → Sfondi della copertina): se attivo (default ora) la hero ruota a caso tra le copertine delle opere in catalogo; se spento usa la lista manuale `heroImages`.
- Campo **`collectionNumber`** sull'opera: numero manuale mostrato come "N° …"; vuoto = calcolato dall'ordinamento nella collezione.
- **Stripe in configurazione**: l'utente ha le chiavi TEST (sk_test/pk_test). La secret key va SOLO nelle variabili runtime di Cloudflare (Settings → Variables and Secrets, tipo Secret, nome `STRIPE_SECRET_KEY`) — mai nel repo. Webhook + Resend ancora da configurare.
- Keystatic in produzione: GitHub App `boleoncms` creata e installata sul repo; variabili KEYSTATIC_* su Cloudflare (runtime) + PUBLIC_KEYSTATIC_GITHUB_APP_SLUG (build). Admin: https://boleon.it/keystatic (login con GitHub).
- GitHub Pages: disattivato/inerte (source "GitHub Actions" senza workflow) — lasciare così.

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
- **Stampe in vari formati** (`printSizes` sullo schema opera): ogni opera può offrire, oltre all'originale, stampe fine art in formati con prezzo/stock indipendenti (e tiratura `editionSize` opzionale per formato). Id carrello: `slug` per il pezzo base, `slug::formato` per una stampa (separatore in `PRINT_ID_SEPARATOR`). `catalogEntries()` in `src/lib/artworks.ts` è l'unica fonte di verità per varianti/prezzi, usata sia dal carrello sia da `checkout.ts`.
- **`showAvailability`** per opera (default spento): se attivo, il sito mostra ai visitatori quante copie restano — sia per il pezzo base (se `kind: print`) sia per ogni formato in `printSizes` — es. "7 di 30 disponibili" o solo "7 disponibili" se il formato non ha tiratura. Attivo di default sulle 3 opere che già lo mostravano prima di questa modifica (costellazione-minore, eco-di-luna, giardino-segreto).
- **Lingua automatica**: al primo accesso della sessione uno script inline in `Base.astro` reindirizza alla lingua salvata (`localStorage['boleon-lang']`, impostata dallo switcher) o a quella del browser; guardia anti-loop in `sessionStorage`.
- **`/gestione`**: pannello privato (noindex, escluso dalla sitemap, solo italiano) con galleria cliccabile delle opere, filtri (Tutte/Con originale/Con stampe/Vendute-esaurite) e badge di stato; ogni card apre la scheda Keystatic corrispondente (`/keystatic/collection/artworks/item/<slug>`). Sezioni anche per collezioni, impostazioni sito e collegamenti utili. Non linkato dal sito pubblico.
- **Galleria con collezioni** (`/galleria` + wrapper `[lang]`, corpo in `GalleryPage.astro`): linguette client-side — "I più venduti" (aperta per prima, opere con flag `bestseller`), "Tutte le opere", poi una per collezione. Le collezioni sono una collection Keystatic (`src/content/collections/*.json`: `name` italiano/slug, `names` tradotti, `sortOrder`); le opere vi si assegnano col campo `collections` (array di slug, `fields.relationship` in Keystatic). Link diretto a una linguetta: `/galleria#c-<slug>` (prefisso `c-` per le collezioni, `piu-venduti`, `tutte`). Voce "Galleria" nell'header.
- **Keystatic**: menu laterale raggruppato via `ui.navigation` in "Galleria" (opere) e "Sito", con le impostazioni divise in 4 singleton/file: `identity` (site-identity.json: nome, tagline, bio), `cover` (site-cover.json: heroImages), `contacts` (site-contacts.json: email/social), `shop` (site-shop.json: printMaterials). Il codice le legge unite tramite `src/lib/settings.ts` (stessa forma del vecchio `settings.json`, che non esiste più).
- **Pagina contatti** `/contatto` (+ wrapper `[lang]`, corpo in `ContactPage.astro`): bottone mailto verso `contactEmail`; link "Richiedi informazioni" (mailto con oggetto = titolo opera) su ogni pagina opera; voce "Contatti" in header e footer.
- **SEO/AI**: sitemap multilingua (`@astrojs/sitemap`), `robots.txt` e `llms.txt` generati dinamicamente (`src/pages/robots.txt.ts` e `llms.txt.ts`, sempre allineati al catalogo), JSON-LD (`WebSite`+`Person` in home, `VisualArtwork`+`Offer` sulle opere), canonical/hreflang/Open Graph in `Base.astro`. L'URL base è `https://boleon.it` (in `astro.config.mjs`; sovrascrivibile con `PUBLIC_SITE_URL`). Dominio comprato su IONOS, nameserver spostati su Cloudflare; i 7 record email di IONOS (MX, SPF, DKIM ×2, DMARC, autodiscover) sono replicati su Cloudflare come "DNS only".
- **Tipografia**: Cormorant Variable (`@fontsource-variable/cormorant`) come font serif per titoli e prezzi, importato in `Base.astro`.
- **Sfondi hero a rotazione**: scelti da Keystatic (Impostazioni → "Sfondi della copertina", salvati in `src/assets/hero/`, elenco in `settings.heroImages`). Uno a caso all'apertura, poi cambio casuale ogni 10 s con dissolvenza (doppio buffer). La versione "spenta" è ottenuta con filtro CSS grayscale, quindi funziona con qualsiasi immagine. Risoluzione nomi-file in `src/lib/heroImages.ts` (ATTENZIONE: `import.meta.glob` va messo in file .ts, dentro i .astro genera errori di compilazione).
- **Palette dai dipinti** in `global.css`: accent #8f2b45 (bordeaux), ochre #c08430, olive #74803a, leaf #3e7a4e, sun #dfb43c. Prezzi: originale in bordeaux con bottone "Acquista l'originale"; stampe in riquadro oliva col prezzo che segue il formato selezionato.
- **Tracce di pittura** (`src/components/PaintAccents.astro`): piccoli segni SVG nei colori della palette, sparsi ai margini, randomizzati (rotazione/scala/visibilità) a ogni visita. In `Base.astro`, sotto main/footer (z-0 vs z-10).
- **Hero spotlight** (`src/components/HeroSpotlight.astro`): hero a schermo intero in home, tema chiaro, con maschera radiale che segue il cursore (stile ispirato a motionsites.ai/Lithos, adattato: vanilla JS + maschera CSS). Usa un quadro REALE dell'artista: base desaturata (`src/assets/quadri/hero-spenta.jpg`) + versione a colori pieni rivelata dallo spotlight (`opera-03.jpg`). Animazioni in `global.css` con `prefers-reduced-motion`.
- **Quadri reali**: 5 foto migliorate (livelli, saturazione, nitidezza via sharp) in `src/assets/quadri/opera-01..05.jpg`, caricate dall'utente il 2026-07-02. Non ancora nel catalogo: mancano titoli/prezzi/dimensioni — quando l'utente li fornisce, creare le voci in `src/content/artworks/` e rimuovere i segnaposto SVG. Il colore `--color-accent` (#8f2b45, bordeaux) è campionato dalle pennellate di questi quadri.
- Gestione vendite **manuale**: dopo la notifica email l'artista aggiorna venduta/copie da Keystatic.

- **Contatti**: email `boleon.art@gmail.com`, Instagram `boleon.art` (in `site-contacts.json`).
- **Richiesta originale / informazioni via finestra (modale)**: la pagina opera ha un tasto rosso materico "Originale su richiesta" e un tasto "Richiedi informazioni"; entrambi aprono un `<dialog>` (`.paper-panel`) col modulo, che invia a `/api/inquiry` con `type` (original/info) → oggetto email "Richiesta originale/informazioni — <opera> — <email cliente>", destinatario `boleon.art@gmail.com`, reply-to = cliente; fallback mailto se Resend non configurato.
- **Titoli traducibili** (`titles` localized sull'opera, opzionale): `pickLocalized(titles) || title` in card/dettaglio/carrello; lo slug resta il titolo base.
- **Storie collezioni** (`descriptions` localized sulla collezione): mostrate nella galleria quando si apre la relativa linguetta. Collezioni attuali: Shades (con Sea Drop e Night Sea Shooting Star), Ispirazioni, Fiori (queste due ancora senza opere).
- **Estetica carta**: font "caratteristico" Beth Ellen su tutti i titoli/prezzi/header (via `--font-serif`); texture di carta ruvida BEN VISIBILE: tile raster `public/textures/carta.webp` (generato con sharp da SVG feTurbulence+feDiffuseLighting, rigenerabile) su `body` (con velo chiaro al 45%) e `.paper-panel`; bottoni materici `.paper-btn`/`.paper-btn-outline`. Rimosso `PaintAccents`; footer trasparente.
- **Pagina "L'artista"** `/artista`: storia in 7 lingue TUTTA in font-hand, dal campo `stories` del singleton identity (Keystatic → Nome e testi, raggiungibile da /gestione). Testo attuale: misterioso artista italiano + parafrasi poetica delle parole dell'utente (mai dubitato di essere artista; vede solo la nascita delle opere, mai la fine; la cornice che valorizza; ogni cosa nel giusto contesto ha valore). JSON-LD Person; voce "L'artista" nell'header.
- **Home essenziale**: hero solo col nome (niente tagline né invito), due tasti gemelli "Scopri le opere" + "Galleria"; a fine pagina tasto "Scopri altre opere in galleria" (`home.moreWorks`). Sulla pagina opera è rimasto SOLO il tasto rosso "Originale su richiesta" (rimosso il tasto informazioni generiche; la pagina Contatti resta per quello).
- **Pagina contatti col modulo**: form nome/email/messaggio che invia a `/api/inquiry` (type info, oggetto "Richiesta informazioni — email cliente"), fallback mailto. Niente più bottone mailto.
- **Pagina opera riordinata**: prima il riquadro stampe (testo `printMaterials` promozionale in alto, 7 lingue), poi la riga compatta "Originale · pezzo unico su richiesta" con i due tasti (rosso + outline).
- **llms.txt** arricchito: stato "available on request" per gli originali su richiesta, collezioni con storie, pagine galleria/artista/contatti, titoli inglesi.

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
