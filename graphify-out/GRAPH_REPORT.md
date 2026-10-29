# Graph Report - boleon  (2026-10-29)

## Corpus Check
- 91 files · ~277,101 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 3, .example 1, .xml 1)

## Summary
- 563 nodes · 1200 edges · 25 communities (23 shown, 2 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 208 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c91f9d08`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Catalogo opere, stampe e prezzi
- index.ts
- Impostazioni Keystatic e pagina artista
- translate.mjs
- Carrello, spedizioni e Stripe
- Locale
- Identità visiva, icone e graphify
- Keystatic CMS
- Marketing, SEO e visibilità AI
- Galleria e collezioni
- Piano spedizioni e concorrenti
- secondaryLocales
- Quadri e collezioni (immagini)
- CartPage.astro
- Configurazione TypeScript
- API: contatti, newsletter, ordini
- dependencies
- Base.astro
- Stack (tabella componenti)
- package.json
- Sviluppo locale e prova con wrangler dev
- ResultPage.astro
- defaultLocale
- [lang]/index.astro

## God Nodes (most connected - your core abstractions)
1. `Locale` - 27 edges
2. `Struttura del progetto` - 24 edges
3. `useTranslations()` - 19 edges
4. `7 lingue (it default, en, es, fr, zh, hi, ar RTL)` - 16 edges
5. `Keystatic CMS` - 16 edges
6. `Piano Marketing & Visibilita` - 15 edges
7. `Spedizioni: logica unica in shipping.ts` - 13 edges
8. `SEO/AI (sitemap, robots.txt, llms.txt, JSON-LD, hreflang)` - 13 edges
9. `Galleria con collezioni (linguette)` - 13 edges
10. `astro` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Originali: preventivo via email` --semantically_similar_to--> `Originale su richiesta (originalInquiryOnly)`  [INFERRED] [semantically similar]
  docs/piano-spedizioni.md → CLAUDE.md
- `Icone del sito (favicon B su bordeaux)` --references--> `sizes`  [INFERRED]
  CLAUDE.md → scripts/generate-favicons.mjs
- `Traduzione DeepL in build` --references--> `deepl()`  [INFERRED]
  CLAUDE.md → scripts/translate.mjs
- `Hero spotlight (maschera radiale che segue il cursore)` --references--> `urls`  [INFERRED]
  CLAUDE.md → src/components/HeroSpotlight.astro
- `Pagina L'artista /artista` --references--> `blocks`  [INFERRED]
  CLAUDE.md → src/components/pages/ArtistPage.astro

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Icone del sito generate da favicon.svg** — public_favicon_image, public_apple_touch_icon_image, public_icon_192_image, public_icon_512_image, scripts_generate_favicons [EXTRACTED 1.00]
- **Richiesta originale/informazioni via /api/inquiry** — claude_original_inquiry_only, claude_inquiry_modal, claude_contact_page, claude_resend, claude_contacts_info [EXTRACTED 1.00]
- **Zone tariffarie di spedizione** — docs_piano_spedizioni_zone_italia, docs_piano_spedizioni_zona_ue, docs_piano_spedizioni_zona_europa_extra_ue, docs_piano_spedizioni_zona_mondo, docs_piano_spedizioni_zona_usa, docs_piano_spedizioni_on_request_countries [EXTRACTED 1.00]
- **Visibilita su motori e AI** — docs_piano_marketing_bing_webmaster_tools, docs_piano_marketing_google_search_console, docs_piano_marketing_geo, docs_piano_marketing_entity_building, claude_llms_txt, claude_seo_ai [INFERRED 0.85]
- **Shared abstract organic watercolor style** — src_assets_artworks_sea_drop_cover_image, src_assets_artworks_night_sea_shooting_star_cover_image, src_assets_artworks_shy_carnivorous_plant_images_0_image [INFERRED 0.85]
- **Paintings sharing the stalk-ending-in-dot motif** — src_assets_quadri_opera_02_image, src_assets_quadri_opera_03_image, src_assets_quadri_opera_05_image [INFERRED 0.85]
- **Pipeline multilingua (dizionari UI, DeepL in build, campi localized, redirect lingua)** — claude_i18n_seven_languages, claude_deepl_build_translation, claude_localized_titles, claude_collection_stories, claude_ui_strings_convention, claude_auto_language [INFERRED 0.85]
- **Flusso ordine stampa: carrello, prezzi server-side, spedizione, Stripe, webhook ed email** — claude_local_storage_cart, claude_catalog_entries_source_of_truth, claude_shipping, claude_stripe_checkout, claude_stripe_webhook, claude_resend, claude_manual_sales [INFERRED 0.85]

## Communities (25 total, 2 thin omitted)

### Community 0 - "Catalogo opere, stampe e prezzi"
Cohesion: 0.05
Nodes (66): Tipi di opera: originale o stampa/edizione, Pagina opera (carosello, Potrebbero piacerti anche), Supporto carta o tela (canvasSurchargePercent), Campo collectionNumber (N°), Contatti (boleon.art@gmail.com, Instagram boleon.art), Modale richiesta originale/informazioni, PhotoSwipe 5 (zoom alta definizione), Id carrello stampe (slug::formatId::support) (+58 more)

### Community 1 - "index.ts"
Cohesion: 0.18
Nodes (16): Lingua automatica (redirect al primo accesso), Traduzione DeepL in build, 7 lingue (it default, en, es, fr, zh, hi, ar RTL), Titoli traducibili (titles), Lingue (7, arabo RTL, DeepL in build), ar, en, es (+8 more)

### Community 2 - "Impostazioni Keystatic e pagina artista"
Cohesion: 0.08
Nodes (25): Pagina L'artista /artista, Sfondi copertina dalle opere (useArtworkImages), Sfondi hero a rotazione, Hero spotlight (maschera radiale che segue il cursore), Impostazioni in 4 singleton (identity, cover, contacts, shop), Props, t, urls (+17 more)

### Community 3 - "translate.mjs"
Cohesion: 0.24
Nodes (11): cache, deepl(), DEEPL_TARGET, LOCALES, localize(), main(), processDir(), processFile() (+3 more)

### Community 4 - "Carrello, spedizioni e Stripe"
Cohesion: 0.08
Nodes (41): docs/piano-spedizioni.md, Spedizioni: logica unica in shipping.ts, Tariffe di spedizione in Keystatic (campo shipping), Zone di spedizione (italy, eu, europe, world, usa), Stripe Checkout, Minimo d'ordine UK (ukMinOrder 160 €), Dazi USA prepagati (usDutiesPercent), Tempi da comunicare (2-6 settimane) (+33 more)

### Community 5 - "Locale"
Cohesion: 0.18
Nodes (11): escapeHtml(), Props, render(), updated, Locale, legal, LEGAL_UPDATED, LegalBlock (+3 more)

### Community 6 - "Identità visiva, icone e graphify"
Cohesion: 0.11
Nodes (15): Palette dai dipinti (bordeaux, ocra, oliva, foglia, sole), Estetica carta (texture carta.webp, paper-btn, paper-panel), Icone del sito (favicon B su bordeaux), Tipografia Beth Ellen (Cormorant di riserva), Apple touch icon 180px (B di Boleòn, quadrato pieno), Favicon Boleòn: B in Beth Ellen color carta su bordeaux #8f2b45 con puntino ocra #dfb43c, Icona Android 192px (B di Boleòn), Icona Android 512px / maskable (B di Boleòn) (+7 more)

### Community 7 - "Keystatic CMS"
Cohesion: 0.15
Nodes (16): Pannello privato /gestione, Keystatic CMS, GitHub App boleon-cms, Gestione vendite manuale, Originale su richiesta (originalInquiryOnly), site-shop.json (Vendita e stampe), Descrizioni opere uniche, allPrintFormatIds (+8 more)

### Community 8 - "Marketing, SEO e visibilità AI"
Cohesion: 0.11
Nodes (21): Storie collezioni (descriptions), llms.txt arricchito, Newsletter con Resend Audiences (pianificata), docs/piano-marketing.md, SEO/AI (sitemap, robots.txt, llms.txt, JSON-LD, hreflang), Backlink buoni, Portfolio Behance (backlink), Bing Webmaster Tools (+13 more)

### Community 9 - "Galleria e collezioni"
Cohesion: 0.09
Nodes (20): Flag bestseller (I più venduti), Galleria con collezioni (linguette), Collezione Ispirazioni (ancora senza opere), activate(), artworks, buttons, cards, empty (+12 more)

### Community 10 - "Piano spedizioni e concorrenti"
Cohesion: 0.10
Nodes (19): Analisi concorrenti (Desenio, Juniqe, INPRNT, Saatchi Art), Gelato (stampa e spedizione delegata), Paesi su richiesta (BR, MX, IN, CN, SA), Originali: preventivo via email, Packlink / Spedire.com (aggregatori), Piano Spedizioni (v2, 22 ottobre 2026), Poste Delivery International Standard, Esempi pratici (Milano, Berlino, Londra, New York...) (+11 more)

### Community 11 - "secondaryLocales"
Cohesion: 0.15
Nodes (5): secondaryLocales, lang, lang, lang, lang

### Community 12 - "Quadri e collezioni (immagini)"
Cohesion: 0.17
Nodes (21): Organic biomorphic abstraction on white watercolor paper, Painting palette: bordeaux/magenta, ochre-yellow, olive and leaf green, Motif: thin stalks/lines ending in dots or eye-pods, Catalogo attuale (3 opere reali), Collezione Fiori, Night Sea Shooting Star (Shades n.2), Quadri reali da catalogare (opera-01..05), Sea Drop (Shades n.1) (+13 more)

### Community 13 - "CartPage.astro"
Cohesion: 0.09
Nodes (31): Carrello con selezione Paese e preventivo spedizione, Pagina contatti /contatto, Carrello in localStorage, Statistiche Umami (senza cookie), Bordo bianco extra (border), Struttura del progetto, catalog, clientData (+23 more)

### Community 14 - "Configurazione TypeScript"
Cohesion: 0.25
Nodes (7): astro/tsconfigs/strict, compilerOptions, jsx, jsxImportSource, exclude, extends, include

### Community 15 - "API: contatti, newsletter, ordini"
Cohesion: 0.14
Nodes (26): Resend (email), Webhook Stripe (checkout.session.completed), Configurazione Resend, Variabili runtime (Secret: Stripe, Resend, Keystatic, Turnstile), Configurazione Stripe (API key e webhook), astro, resend, clean() (+18 more)

### Community 16 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, astro, @astrojs/cloudflare, @astrojs/markdoc, @astrojs/react, @astrojs/sitemap, @fontsource/beth-ellen, @keystatic/astro (+8 more)

### Community 17 - "Base.astro"
Cohesion: 0.16
Nodes (16): Menu mobile hamburger, Props, t, localeMeta, locales, localizePath(), switchLocalePath(), alternates (+8 more)

### Community 18 - "Stack (tabella componenti)"
Cohesion: 0.21
Nodes (13): graphify skill (/graphify), Astro 5 + adapter Cloudflare, Dominio boleon.it (IONOS, DNS su Cloudflare), Progetto Boleon (sito galleria/shop), Cloudflare Workers (hosting con custom domain), Commenti con verifica email su Cloudflare D1 (pianificati), GitHub Pages (disattivato), Knowledge graph graphify (graphify-out) (+5 more)

### Community 19 - "package.json"
Cohesion: 0.20
Nodes (11): Tailwind CSS 4, name, type, version, @astrojs/markdoc, @astrojs/react, @keystatic/astro, react (+3 more)

### Community 20 - "Sviluppo locale e prova con wrangler dev"
Cohesion: 0.22
Nodes (13): Sviluppo locale e prova con wrangler dev, Workers Builds (production branch main), engines, node, scripts, astro, build, dev (+5 more)

### Community 21 - "ResultPage.astro"
Cohesion: 0.17
Nodes (7): backHref, backLabel, message, Props, t, title, lang

### Community 23 - "defaultLocale"
Cohesion: 0.25
Nodes (6): FAQ e pagina legale (dazi, danni, resi), defaultLocale, prerender, t, prerender, prerender

## Knowledge Gaps
- **16 isolated node(s):** `react`, `astro/tsconfigs/strict`, `Shy Carnivorous Plant - interior mockup: the painting in a large green frame on a wall in a sunlit modern living room with green velvet sofa and marble table`, `Gelato (stampa e spedizione delegata)`, `Checklist prima della prima spedizione USA` (+11 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 190 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Struttura del progetto` connect `CartPage.astro` to `Catalogo opere, stampe e prezzi`, `index.ts`, `Impostazioni Keystatic e pagina artista`, `translate.mjs`, `Carrello, spedizioni e Stripe`, `Identità visiva, icone e graphify`, `Marketing, SEO e visibilità AI`, `Galleria e collezioni`, `API: contatti, newsletter, ordini`, `Base.astro`, `Stack (tabella componenti)`, `defaultLocale`, `[lang]/index.astro`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `Struttura del progetto` (e.g. with `Knowledge graph graphify (graphify-out)` and `docs/piano-marketing.md`) actually correct?**
  _`Struttura del progetto` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `react`, `astro/tsconfigs/strict`, `Shy Carnivorous Plant - interior mockup: the painting in a large green frame on a wall in a sunlit modern living room with green velvet sofa and marble table` to the rest of the system?**
  _16 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Catalogo opere, stampe e prezzi` be split into smaller, more focused modules?**
  _Cohesion score 0.05030834144758196 - nodes in this community are weakly interconnected._
- **Why does `astro` connect `API: contatti, newsletter, ordini` to `Catalogo opere, stampe e prezzi`, `Impostazioni Keystatic e pagina artista`, `Carrello, spedizioni e Stripe`, `Marketing, SEO e visibilità AI`, `Galleria e collezioni`, `Stack (tabella componenti)`, `package.json`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `7 lingue (it default, en, es, fr, zh, hi, ar RTL)` (e.g. with `Lingua automatica (redirect al primo accesso)` and `ar.ts`) actually correct?**
  _`7 lingue (it default, en, es, fr, zh, hi, ar RTL)` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Should `Impostazioni Keystatic e pagina artista` be split into smaller, more focused modules?**
  _Cohesion score 0.08367071524966262 - nodes in this community are weakly interconnected._