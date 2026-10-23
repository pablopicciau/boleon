# Graph Report - boleon  (2026-10-23)

## Corpus Check
- 93 files · ~264,360 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 3, .example 1, .xml 1)

## Summary
- 534 nodes · 1144 edges · 19 communities (18 shown, 1 thin omitted)
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 211 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Catalogo opere, stampe e prezzi
- Layout, lingue e font
- Home, hero e pagina artista
- Carrello locale e statistiche Umami
- API: contatti, newsletter, ordini
- Carrello, spedizioni e Stripe
- Dizionari i18n e rotte
- Galleria e collezioni
- Schema Keystatic e pannello gestione
- Identità visiva, icone e graphify
- Marketing, SEO e visibilità AI
- Configurazione TypeScript
- Configurazione Astro e Tailwind
- Script npm, build e deploy
- Zoom PhotoSwipe
- Dipendenze del progetto
- Hosting Cloudflare e architettura
- Quadri e collezioni (immagini)
- Piano spedizioni e concorrenti

## God Nodes (most connected - your core abstractions)
1. `Struttura del progetto` - 24 edges
2. `Locale` - 21 edges
3. `useTranslations()` - 16 edges
4. `Keystatic CMS` - 16 edges
5. `7 lingue (it default, en, es, fr, zh, hi, ar RTL)` - 16 edges
6. `Piano Marketing & Visibilita` - 15 edges
7. `SEO/AI (sitemap, robots.txt, llms.txt, JSON-LD, hreflang)` - 14 edges
8. `Spedizioni: logica unica in shipping.ts` - 13 edges
9. `Galleria con collezioni (linguette)` - 13 edges
10. `astro` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Galleria con collezioni (linguette)` --references--> `artCollections`  [INFERRED]
  CLAUDE.md → src/content.config.ts
- `Originali: preventivo via email` --semantically_similar_to--> `Originale su richiesta (originalInquiryOnly)`  [INFERRED] [semantically similar]
  docs/piano-spedizioni.md → CLAUDE.md
- `Sistema stampe (formati e prezzi standard)` --references--> `PrintFormat`  [INFERRED]
  CLAUDE.md → src/lib/artworks.ts
- `Modale richiesta originale/informazioni` --references--> `InquiryPayload`  [INFERRED]
  CLAUDE.md → src/pages/api/inquiry.ts
- `Tariffe di spedizione in Keystatic (campo shipping)` --references--> `ShippingConfig`  [INFERRED]
  CLAUDE.md → src/lib/shipping.ts

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

## Communities (19 total, 1 thin omitted)

### Community 0 - "Catalogo opere, stampe e prezzi"
Cohesion: 0.06
Nodes (60): Props, Props, Artwork, PrintFormat, PrintSupport, ZoneRate, formatPrice(), canvasSurchargePercent() (+52 more)

### Community 1 - "Layout, lingue e font"
Cohesion: 0.08
Nodes (27): Props, localizePath(), switchLocalePath(), render(), eur(), rate(), defaultLocale, alternates (+19 more)

### Community 11 - "Home, hero e pagina artista"
Cohesion: 0.06
Nodes (31): Props, Block, Props, Props, t, urls, altName, blocks (+23 more)

### Community 13 - "Carrello locale e statistiche Umami"
Cohesion: 0.22
Nodes (17): EventData, CartItem, Turnstile, track(), addToCart(), cartCount(), clearCart(), getCart() (+9 more)

### Community 15 - "API: contatti, newsletter, ordini"
Cohesion: 0.11
Nodes (32): InquiryPayload, SegmentKey, SubscribePayload, clean(), json(), verifyTurnstile(), getEnv(), escapeHtml() (+24 more)

### Community 4 - "Carrello, spedizioni e Stripe"
Cohesion: 0.09
Nodes (38): Props, CatalogEntry, ShippingConfig, ShippingQuote, ShippingZone, CheckoutPayload, zoneRate(), normalizeShippingConfig() (+30 more)

### Community 5 - "Dizionari i18n e rotte"
Cohesion: 0.06
Nodes (38): Props, Props, Props, Locale, TranslationKey, Dict, useTranslations(), t (+30 more)

### Community 9 - "Galleria e collezioni"
Cohesion: 0.12
Nodes (19): Props, activate(), pickLocalized(), artworks, buttons, cards, collectionEntries, collectionStories (+11 more)

### Community 2 - "Schema Keystatic e pannello gestione"
Cohesion: 0.11
Nodes (19): allPrintFormatIds, printFormatOptions, inquiryOnly, artCollections, artworks, collections, localized, shop (+11 more)

### Community 6 - "Identità visiva, icone e graphify"
Cohesion: 0.10
Nodes (23): png(), deepl(), localize(), main(), processDir(), processFile(), sourceText(), translate() (+15 more)

### Community 8 - "Marketing, SEO e visibilità AI"
Cohesion: 0.12
Nodes (19): schema, schema, canonical, prerender, llms.txt arricchito, Newsletter con Resend Audiences (pianificata), SEO/AI (sitemap, robots.txt, llms.txt, JSON-LD, hreflang), Backlink buoni (+11 more)

### Community 14 - "Configurazione TypeScript"
Cohesion: 0.25
Nodes (7): compilerOptions, jsx, jsxImportSource, exclude, extends, include, astro/tsconfigs/strict

### Community 16 - "Configurazione Astro e Tailwind"
Cohesion: 0.19
Nodes (12): name, type, version, @astrojs/markdoc, @astrojs/react, @astrojs/sitemap, @keystatic/astro, react (+4 more)

### Community 17 - "Script npm, build e deploy"
Cohesion: 0.22
Nodes (13): engines, node, scripts, astro, build, dev, preview, translate (+5 more)

### Community 3 - "Dipendenze del progetto"
Cohesion: 0.12
Nodes (17): dependencies, astro, @astrojs/cloudflare, @astrojs/markdoc, @astrojs/react, @astrojs/sitemap, @fontsource/beth-ellen, @fontsource-variable/cormorant (+9 more)

### Community 7 - "Hosting Cloudflare e architettura"
Cohesion: 0.21
Nodes (13): @astrojs/cloudflare, graphify skill (/graphify), Astro 5 + adapter Cloudflare, Dominio boleon.it (IONOS, DNS su Cloudflare), Cloudflare Workers (hosting con custom domain), Commenti con verifica email su Cloudflare D1 (pianificati), GitHub Pages (disattivato), Knowledge graph graphify (graphify-out) (+5 more)

### Community 12 - "Quadri e collezioni (immagini)"
Cohesion: 0.17
Nodes (21): Night Sea Shooting Star (cover) - abstract watercolor: violet/magenta wave form, blue dripping band descending like a falling star trail, bright yellow sun-like circle; red and blue dots on cream paper; dreamy nocturnal mood, Sea Drop (cover) - abstract watercolor: curving blue-violet wave shape and a separate pink-red teardrop/leaf form with small droplet dots on white paper; granulated texture; calm fluid marine mood, Shy Carnivorous Plant - abstract watercolor: olive-green, brown and crimson organic plant/jaw forms with toothed fringe, yellow-magenta petal, continuous magenta line with dots weaving through; botanical, playful-uncanny mood, Shy Carnivorous Plant - interior mockup: the painting in a large green frame on a wall in a sunlit modern living room with green velvet sofa and marble table, Organic biomorphic abstraction on white watercolor paper, Painting palette: bordeaux/magenta, ochre-yellow, olive and leaf green, Motif: thin stalks/lines ending in dots or eye-pods, Catalogo attuale (3 opere reali) (+13 more)

### Community 10 - "Piano spedizioni e concorrenti"
Cohesion: 0.11
Nodes (18): Analisi concorrenti (Desenio, Juniqe, INPRNT, Saatchi Art), Gelato (stampa e spedizione delegata), Paesi su richiesta (BR, MX, IN, CN, SA), Originali: preventivo via email, Packlink / Spedire.com (aggregatori), Poste Delivery International Standard, Esempi pratici (Milano, Berlino, Londra, New York...), Checklist prima della prima spedizione USA (+10 more)

## Knowledge Gaps
- **16 isolated node(s):** `astro/tsconfigs/strict`, `react`, `Shy Carnivorous Plant - interior mockup: the painting in a large green frame on a wall in a sunlit modern living room with green velvet sofa and marble table`, `Gelato (stampa e spedizione delegata)`, `Checklist prima della prima spedizione USA` (+11 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 178 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Struttura del progetto` connect `Identità visiva, icone e graphify` to `Catalogo opere, stampe e prezzi`, `Layout, lingue e font`, `Carrello, spedizioni e Stripe`, `Dizionari i18n e rotte`, `Hosting Cloudflare e architettura`, `Marketing, SEO e visibilità AI`, `Galleria e collezioni`, `Home, hero e pagina artista`, `Carrello locale e statistiche Umami`, `API: contatti, newsletter, ordini`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `Struttura del progetto` (e.g. with `Knowledge graph graphify (graphify-out)` and `docs/piano-marketing.md`) actually correct?**
  _`Struttura del progetto` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `astro/tsconfigs/strict`, `react`, `Shy Carnivorous Plant - interior mockup: the painting in a large green frame on a wall in a sunlit modern living room with green velvet sofa and marble table` to the rest of the system?**
  _16 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Catalogo opere, stampe e prezzi` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Why does `SEO/AI (sitemap, robots.txt, llms.txt, JSON-LD, hreflang)` connect `Marketing, SEO e visibilità AI` to `Configurazione Astro e Tailwind`, `Layout, lingue e font`, `Catalogo opere, stampe e prezzi`, `Hosting Cloudflare e architettura`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `Keystatic CMS` (e.g. with `Workers Builds (production branch main)` and `@keystatic/astro`) actually correct?**
  _`Keystatic CMS` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Should `Layout, lingue e font` be split into smaller, more focused modules?**
  _Cohesion score 0.08021390374331551 - nodes in this community are weakly interconnected._