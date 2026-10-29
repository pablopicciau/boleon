# Graph Report - boleon  (2026-10-29)

## Corpus Check
- 101 files · ~274,336 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 3, .example 1, .xml 1)

## Summary
- 558 nodes · 1194 edges · 21 communities
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 210 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Catalogo opere, stampe e prezzi
- Dizionari delle 7 lingue
- Home, hero e pagina artista
- Carrello locale e statistiche Umami
- API: contatti, newsletter, ordini
- Pagine esito ordine
- Pagina contatti
- Impostazioni Keystatic e pagina artista
- Note legali multilingua
- Carrello, spedizioni e Stripe
- Rotte per lingua e contatti
- Layout, lingue e selettore
- Galleria e collezioni
- Identità visiva, icone e graphify
- Marketing, SEO e visibilità AI
- Configurazione TypeScript
- Configurazione, dipendenze e build
- Pagine FAQ e legali (italiano)
- Dipendenze del progetto
- Quadri e collezioni (immagini)
- Piano spedizioni e concorrenti

## God Nodes (most connected - your core abstractions)
1. `Locale` - 27 edges
2. `Struttura del progetto` - 24 edges
3. `useTranslations()` - 17 edges
4. `7 lingue (it default, en, es, fr, zh, hi, ar RTL)` - 16 edges
5. `Keystatic CMS` - 16 edges
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
- `Spedizioni: logica unica in shipping.ts` --references--> `ShippingQuote`  [INFERRED]
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

## Communities (21 total, 0 thin omitted)

### Community 0 - "Catalogo opere, stampe e prezzi"
Cohesion: 0.05
Nodes (62): Props, Props, Props, Artwork, CatalogEntry, PrintFormat, PrintSupport, canvasSurchargePercent() (+54 more)

### Community 1 - "Dizionari delle 7 lingue"
Cohesion: 0.22
Nodes (13): TranslationKey, Dict, ar, en, es, fr, hi, dictionaries (+5 more)

### Community 11 - "Home, hero e pagina artista"
Cohesion: 0.10
Nodes (19): Props, urls, altName, artworkCovers, artworks, bio, configuredNames, description (+11 more)

### Community 13 - "Carrello locale e statistiche Umami"
Cohesion: 0.13
Nodes (25): Props, EventData, CartItem, Turnstile, track(), addToCart(), cartCount(), clearCart() (+17 more)

### Community 15 - "API: contatti, newsletter, ordini"
Cohesion: 0.10
Nodes (34): InquiryPayload, SegmentKey, SubscribePayload, clean(), json(), verifyTurnstile(), getEnv(), escapeHtml() (+26 more)

### Community 17 - "Pagine esito ordine"
Cohesion: 0.22
Nodes (6): Props, backHref, backLabel, message, t, title

### Community 18 - "Pagina contatti"
Cohesion: 0.31
Nodes (5): Props, form, t, lang, Pagina contatti /contatto

### Community 2 - "Impostazioni Keystatic e pagina artista"
Cohesion: 0.07
Nodes (29): Block, Props, zoneRate(), allPrintFormatIds, printFormatOptions, altName, blocks, sameAs (+21 more)

### Community 20 - "Note legali multilingua"
Cohesion: 0.21
Nodes (10): Props, LegalBlock, LegalContent, LegalSection, escapeHtml(), render(), updated, localeMeta (+2 more)

### Community 4 - "Carrello, spedizioni e Stripe"
Cohesion: 0.07
Nodes (41): Props, Ctx, FaqContent, FaqItem, ShippingConfig, ShippingQuote, ShippingZone, ZoneRate (+33 more)

### Community 5 - "Rotte per lingua e contatti"
Cohesion: 0.13
Nodes (8): Locale, secondaryLocales, lang, lang, lang, lang, lang, lang

### Community 7 - "Layout, lingue e selettore"
Cohesion: 0.13
Nodes (19): Props, Props, localizePath(), switchLocalePath(), useTranslations(), render(), t, locales (+11 more)

### Community 9 - "Galleria e collezioni"
Cohesion: 0.11
Nodes (20): Props, activate(), pickLocalized(), artworks, buttons, cards, collectionStories, empty (+12 more)

### Community 6 - "Identità visiva, icone e graphify"
Cohesion: 0.07
Nodes (29): png(), deepl(), localize(), main(), processDir(), processFile(), sourceText(), translate() (+21 more)

### Community 8 - "Marketing, SEO e visibilità AI"
Cohesion: 0.12
Nodes (19): schema, schema, canonical, prerender, llms.txt arricchito, Newsletter con Resend Audiences (pianificata), SEO/AI (sitemap, robots.txt, llms.txt, JSON-LD, hreflang), Backlink buoni (+11 more)

### Community 14 - "Configurazione TypeScript"
Cohesion: 0.25
Nodes (7): compilerOptions, jsx, jsxImportSource, exclude, extends, include, astro/tsconfigs/strict

### Community 16 - "Configurazione, dipendenze e build"
Cohesion: 0.07
Nodes (37): engines, node, name, scripts, astro, build, dev, preview (+29 more)

### Community 22 - "Pagine FAQ e legali (italiano)"
Cohesion: 0.40
Nodes (4): defaultLocale, prerender, prerender, FAQ e pagina legale (dazi, danni, resi)

### Community 3 - "Dipendenze del progetto"
Cohesion: 0.12
Nodes (16): dependencies, astro, @astrojs/cloudflare, @astrojs/markdoc, @astrojs/react, @astrojs/sitemap, @fontsource/beth-ellen, @keystatic/astro (+8 more)

### Community 12 - "Quadri e collezioni (immagini)"
Cohesion: 0.17
Nodes (21): Night Sea Shooting Star (cover) - abstract watercolor: violet/magenta wave form, blue dripping band descending like a falling star trail, bright yellow sun-like circle; red and blue dots on cream paper; dreamy nocturnal mood, Sea Drop (cover) - abstract watercolor: curving blue-violet wave shape and a separate pink-red teardrop/leaf form with small droplet dots on white paper; granulated texture; calm fluid marine mood, Shy Carnivorous Plant - abstract watercolor: olive-green, brown and crimson organic plant/jaw forms with toothed fringe, yellow-magenta petal, continuous magenta line with dots weaving through; botanical, playful-uncanny mood, Shy Carnivorous Plant - interior mockup: the painting in a large green frame on a wall in a sunlit modern living room with green velvet sofa and marble table, Organic biomorphic abstraction on white watercolor paper, Painting palette: bordeaux/magenta, ochre-yellow, olive and leaf green, Motif: thin stalks/lines ending in dots or eye-pods, Catalogo attuale (3 opere reali) (+13 more)

### Community 10 - "Piano spedizioni e concorrenti"
Cohesion: 0.11
Nodes (18): Analisi concorrenti (Desenio, Juniqe, INPRNT, Saatchi Art), Gelato (stampa e spedizione delegata), Paesi su richiesta (BR, MX, IN, CN, SA), Originali: preventivo via email, Packlink / Spedire.com (aggregatori), Poste Delivery International Standard, Esempi pratici (Milano, Berlino, Londra, New York...), Checklist prima della prima spedizione USA (+10 more)

## Knowledge Gaps
- **16 isolated node(s):** `astro/tsconfigs/strict`, `react`, `Shy Carnivorous Plant - interior mockup: the painting in a large green frame on a wall in a sunlit modern living room with green velvet sofa and marble table`, `Gelato (stampa e spedizione delegata)`, `Checklist prima della prima spedizione USA` (+11 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 193 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Struttura del progetto` connect `Identità visiva, icone e graphify` to `Catalogo opere, stampe e prezzi`, `Dizionari delle 7 lingue`, `Impostazioni Keystatic e pagina artista`, `Carrello, spedizioni e Stripe`, `Layout, lingue e selettore`, `Marketing, SEO e visibilità AI`, `Galleria e collezioni`, `Home, hero e pagina artista`, `Carrello locale e statistiche Umami`, `API: contatti, newsletter, ordini`, `Configurazione, dipendenze e build`, `Pagina contatti`, `Pagine FAQ e legali (italiano)`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `Struttura del progetto` (e.g. with `Knowledge graph graphify (graphify-out)` and `docs/piano-marketing.md`) actually correct?**
  _`Struttura del progetto` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `astro/tsconfigs/strict`, `react`, `Shy Carnivorous Plant - interior mockup: the painting in a large green frame on a wall in a sunlit modern living room with green velvet sofa and marble table` to the rest of the system?**
  _16 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Catalogo opere, stampe e prezzi` be split into smaller, more focused modules?**
  _Cohesion score 0.05331510594668489 - nodes in this community are weakly interconnected._
- **Why does `astro` connect `API: contatti, newsletter, ordini` to `Catalogo opere, stampe e prezzi`, `Impostazioni Keystatic e pagina artista`, `Carrello, spedizioni e Stripe`, `Marketing, SEO e visibilità AI`, `Home, hero e pagina artista`, `Configurazione, dipendenze e build`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `7 lingue (it default, en, es, fr, zh, hi, ar RTL)` (e.g. with `Lingua automatica (redirect al primo accesso)` and `Titoli traducibili (titles)`) actually correct?**
  _`7 lingue (it default, en, es, fr, zh, hi, ar RTL)` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Should `Home, hero e pagina artista` be split into smaller, more focused modules?**
  _Cohesion score 0.10153846153846154 - nodes in this community are weakly interconnected._