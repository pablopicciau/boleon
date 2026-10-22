# Graph Report - boleon  (2026-10-22)

## Corpus Check
- 90 files · ~262,529 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 3, .example 1, .xml 1)

## Summary
- 519 nodes · 1108 edges · 15 communities
- Extraction: 81% EXTRACTED · 19% INFERRED · 0% AMBIGUOUS · INFERRED: 213 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Catalogo opere, stampe e prezzi
- Lingue, stile e testi del sito
- Keystatic, contatti e richieste originali
- Configurazione Astro e dipendenze
- Carrello, spedizioni e Stripe
- Pagine contatti ed esito ordine
- Identità visiva, icone e graphify
- Hosting Cloudflare e servizi
- Marketing, SEO e visibilità AI
- Galleria e collezioni
- Piano spedizioni e concorrenti
- Home e copertina
- Quadri e collezioni (immagini)
- Carrello locale e statistiche Umami
- Configurazione TypeScript

## God Nodes (most connected - your core abstractions)
1. `Struttura del progetto` - 24 edges
2. `Locale` - 21 edges
3. `useTranslations()` - 16 edges
4. `Keystatic CMS` - 16 edges
5. `7 lingue (it default, en, es, fr, zh, hi, ar RTL)` - 16 edges
6. `Piano Marketing & Visibilita` - 15 edges
7. `SEO/AI (sitemap, robots.txt, llms.txt, JSON-LD, hreflang)` - 14 edges
8. `Galleria con collezioni (linguette)` - 13 edges
9. `Spedizioni: logica unica in shipping.ts` - 13 edges
10. `Piano Spedizioni (v2, 22 ottobre 2026)` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Galleria con collezioni (linguette)` --references--> `artCollections`  [INFERRED]
  CLAUDE.md → src/content.config.ts
- `Tempi da comunicare (2-6 settimane)` --references--> `DELIVERY_WEEKS`  [INFERRED]
  docs/piano-spedizioni.md → src/lib/shipping.ts
- `Icone del sito (favicon B su bordeaux)` --references--> `sizes`  [INFERRED]
  CLAUDE.md → scripts/generate-favicons.mjs
- `Hero spotlight (maschera radiale che segue il cursore)` --references--> `urls`  [INFERRED]
  CLAUDE.md → src/components/HeroSpotlight.astro
- `Pagina L'artista /artista` --references--> `blocks`  [INFERRED]
  CLAUDE.md → src/components/pages/ArtistPage.astro

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Visibilita su motori e AI** — docs_piano_marketing_bing_webmaster_tools, docs_piano_marketing_google_search_console, docs_piano_marketing_geo, docs_piano_marketing_entity_building, claude_llms_txt, claude_seo_ai [INFERRED 0.85]
- **Zone tariffarie di spedizione** — docs_piano_spedizioni_zone_italia, docs_piano_spedizioni_zona_ue, docs_piano_spedizioni_zona_europa_extra_ue, docs_piano_spedizioni_zona_mondo, docs_piano_spedizioni_zona_usa, docs_piano_spedizioni_on_request_countries [EXTRACTED 1.00]
- **Shared abstract organic watercolor style** — src_assets_artworks_sea_drop_cover_image, src_assets_artworks_night_sea_shooting_star_cover_image, src_assets_artworks_shy_carnivorous_plant_images_0_image [INFERRED 0.85]
- **Paintings sharing the stalk-ending-in-dot motif** — src_assets_quadri_opera_02_image, src_assets_quadri_opera_03_image, src_assets_quadri_opera_05_image [INFERRED 0.85]
- **Flusso ordine stampa: carrello, prezzi server-side, spedizione, Stripe, webhook ed email** — claude_local_storage_cart, claude_catalog_entries_source_of_truth, claude_shipping, claude_stripe_checkout, claude_stripe_webhook, claude_resend, claude_manual_sales [INFERRED 0.85]
- **Richiesta originale/informazioni via /api/inquiry** — claude_original_inquiry_only, claude_inquiry_modal, claude_contact_page, claude_resend, claude_contacts_info [EXTRACTED 1.00]
- **Pipeline multilingua (dizionari UI, DeepL in build, campi localized, redirect lingua)** — claude_i18n_seven_languages, claude_deepl_build_translation, claude_localized_titles, claude_collection_stories, claude_ui_strings_convention, claude_auto_language [INFERRED 0.85]
- **Icone del sito generate da favicon.svg** — public_favicon_image, public_apple_touch_icon_image, public_icon_192_image, public_icon_512_image, scripts_generate_favicons [EXTRACTED 1.00]

## Communities (15 total, 0 thin omitted)

### Community 0 - "Catalogo opere, stampe e prezzi"
Cohesion: 0.06
Nodes (62): Tipi di opera: originale o stampa/edizione, Pagina opera (carosello, Potrebbero piacerti anche), Campo collectionNumber (N°), Id carrello stampe (slug::formatId::support), 17 formati in 3 gruppi (serie A, standard EU, pollici USA-CA), Sistema stampe (formati e prezzi standard), showAvailability (copie rimaste del pezzo base), Selettore cm/in (+54 more)

### Community 1 - "Lingue, stile e testi del sito"
Cohesion: 0.07
Nodes (41): Lingua automatica (redirect al primo accesso), 7 lingue (it default, en, es, fr, zh, hi, ar RTL), FAQ e pagina legale (dazi, danni, resi), Menu mobile hamburger, Estetica carta (texture carta.webp, paper-btn, paper-panel), Tipografia Beth Ellen (Cormorant di riserva), Carta paper texture tile (rough white paper, 1024x1024 webp), Lingue (7, arabo RTL, DeepL in build) (+33 more)

### Community 2 - "Keystatic, contatti e richieste originali"
Cohesion: 0.06
Nodes (44): Contatti (boleon.art@gmail.com, Instagram boleon.art), Pannello privato /gestione, Modale richiesta originale/informazioni, Keystatic CMS, GitHub App boleon-cms, Impostazioni in 4 singleton (identity, cover, contacts, shop), Gestione vendite manuale, Originale su richiesta (originalInquiryOnly) (+36 more)

### Community 3 - "Configurazione Astro e dipendenze"
Cohesion: 0.05
Nodes (43): Sviluppo locale e prova con wrangler dev, PhotoSwipe 5 (zoom alta definizione), Tailwind CSS 4, Workers Builds (production branch main), dependencies, astro, @astrojs/cloudflare, @astrojs/markdoc (+35 more)

### Community 4 - "Carrello, spedizioni e Stripe"
Cohesion: 0.07
Nodes (42): Carrello con selezione Paese e preventivo spedizione, Spedizioni: logica unica in shipping.ts, Tariffe di spedizione in Keystatic (campo shipping), Zone di spedizione (italy, eu, europe, world, usa), Stripe Checkout, Minimo d'ordine UK (ukMinOrder 160 €), Dazi USA prepagati (usDutiesPercent), Implementazione sul sito (carrello, checkout, Keystatic, email) (+34 more)

### Community 5 - "Pagine contatti ed esito ordine"
Cohesion: 0.08
Nodes (18): Pagina contatti /contatto, form, Props, t, backHref, backLabel, message, Props (+10 more)

### Community 6 - "Identità visiva, icone e graphify"
Cohesion: 0.08
Nodes (23): graphify skill (/graphify), Pagina L'artista /artista, Knowledge graph graphify (graphify-out), Palette dai dipinti (bordeaux, ocra, oliva, foglia, sole), docs/piano-spedizioni.md, Icone del sito (favicon B su bordeaux), Apple touch icon 180px (B di Boleòn, quadrato pieno), Favicon Boleòn: B in Beth Ellen color carta su bordeaux #8f2b45 con puntino ocra #dfb43c (+15 more)

### Community 7 - "Hosting Cloudflare e servizi"
Cohesion: 0.12
Nodes (24): Astro 5 + adapter Cloudflare, Dominio boleon.it (IONOS, DNS su Cloudflare), Progetto Boleon (sito galleria/shop), Cloudflare Workers (hosting con custom domain), Commenti con verifica email su Cloudflare D1 (pianificati), Traduzione DeepL in build, GitHub Pages (disattivato), Cloudflare Turnstile (anti-spam) (+16 more)

### Community 8 - "Marketing, SEO e visibilità AI"
Cohesion: 0.12
Nodes (19): llms.txt arricchito, Newsletter con Resend Audiences (pianificata), docs/piano-marketing.md, SEO/AI (sitemap, robots.txt, llms.txt, JSON-LD, hreflang), Backlink buoni, Portfolio Behance (backlink), Bing Webmaster Tools, Google Search Console (+11 more)

### Community 9 - "Galleria e collezioni"
Cohesion: 0.11
Nodes (20): Flag bestseller (I più venduti), Storie collezioni (descriptions), Galleria con collezioni (linguette), Collezione Ispirazioni (ancora senza opere), Titoli traducibili (titles), activate(), artworks, buttons (+12 more)

### Community 10 - "Piano spedizioni e concorrenti"
Cohesion: 0.10
Nodes (20): Supporto carta o tela (canvasSurchargePercent), Analisi concorrenti (Desenio, Juniqe, INPRNT, Saatchi Art), Tempi da comunicare (2-6 settimane), Gelato (stampa e spedizione delegata), Imballaggio standard (busta rigida, tubo, certificato, foto), Packlink / Spedire.com (aggregatori), Piano Spedizioni (v2, 22 ottobre 2026), Poste Delivery International Standard (+12 more)

### Community 11 - "Home e copertina"
Cohesion: 0.11
Nodes (19): Sfondi copertina dalle opere (useArtworkImages), Sfondi hero a rotazione, Hero spotlight (maschera radiale che segue il cursore), Home essenziale, urls, altName, artworkCovers, artworks (+11 more)

### Community 12 - "Quadri e collezioni (immagini)"
Cohesion: 0.17
Nodes (21): Organic biomorphic abstraction on white watercolor paper, Painting palette: bordeaux/magenta, ochre-yellow, olive and leaf green, Motif: thin stalks/lines ending in dots or eye-pods, Catalogo attuale (3 opere reali), Collezione Fiori, Night Sea Shooting Star (Shades n.2), Quadri reali da catalogare (opera-01..05), Sea Drop (Shades n.1) (+13 more)

### Community 13 - "Carrello locale e statistiche Umami"
Cohesion: 0.26
Nodes (15): Carrello in localStorage, Statistiche Umami (senza cookie), Bordo bianco extra (border), EventData, track(), addToCart(), cartCount(), CartItem (+7 more)

### Community 14 - "Configurazione TypeScript"
Cohesion: 0.25
Nodes (7): astro/tsconfigs/strict, compilerOptions, jsx, jsxImportSource, exclude, extends, include

## Knowledge Gaps
- **19 isolated node(s):** `react`, `astro/tsconfigs/strict`, `graphify skill (/graphify)`, `Accelerazione a pagamento (Ads, facoltativo)`, `Regola 135 GBP (IVA UK)` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 172 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Struttura del progetto` connect `Identità visiva, icone e graphify` to `Catalogo opere, stampe e prezzi`, `Lingue, stile e testi del sito`, `Keystatic, contatti e richieste originali`, `Carrello, spedizioni e Stripe`, `Pagine contatti ed esito ordine`, `Hosting Cloudflare e servizi`, `Marketing, SEO e visibilità AI`, `Galleria e collezioni`, `Home e copertina`, `Carrello locale e statistiche Umami`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `Struttura del progetto` (e.g. with `Knowledge graph graphify (graphify-out)` and `docs/piano-marketing.md`) actually correct?**
  _`Struttura del progetto` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `react`, `astro/tsconfigs/strict`, `graphify skill (/graphify)` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Catalogo opere, stampe e prezzi` be split into smaller, more focused modules?**
  _Cohesion score 0.055087719298245616 - nodes in this community are weakly interconnected._
- **Why does `SEO/AI (sitemap, robots.txt, llms.txt, JSON-LD, hreflang)` connect `Marketing, SEO e visibilità AI` to `Catalogo opere, stampe e prezzi`, `Lingue, stile e testi del sito`, `Configurazione Astro e dipendenze`, `Hosting Cloudflare e servizi`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `Keystatic CMS` (e.g. with `Workers Builds (production branch main)` and `keystatic.config.ts`) actually correct?**
  _`Keystatic CMS` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Should `Lingue, stile e testi del sito` be split into smaller, more focused modules?**
  _Cohesion score 0.07207792207792207 - nodes in this community are weakly interconnected._