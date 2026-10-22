# Graph Report - boleon  (2026-10-22)

## Corpus Check
- 90 files · ~270,955 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 3, .example 1, .xml 1)

## Summary
- 508 nodes · 888 edges · 25 communities (22 shown, 3 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 51 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Dizionari i18n e pagine esito
- Carrello spedizioni e Stripe
- Architettura e deploy del progetto
- Dipendenze e configurazione Astro
- Lingue e convenzioni del sito
- Pagina opera e sistema stampe
- Collezioni e pagina artista
- Email Resend e API contatti
- Script di build (traduzioni, segnaposto)
- Catalogo opere e prezzi
- Home e sfondi copertina
- Dettaglio opera e zoom
- Contatti, carrello e statistiche
- Card opera e hero spotlight
- Schema contenuti Keystatic
- Quadri reali opera-01..05
- Pannello gestione
- Configurazione TypeScript
- Impostazioni sito e llms.txt
- Rotte dinamiche opere
- Estetica, font e palette
- Opere in catalogo (immagini)
- Favicon e texture carta
- Integrazione graphify
- PaintAccents (rimosso)

## God Nodes (most connected - your core abstractions)
1. `Locale` - 21 edges
2. `Piano Marketing & Visibilita` - 17 edges
3. `useTranslations()` - 15 edges
4. `Piano Spedizioni (v2, 22 ottobre 2026)` - 13 edges
5. `astro` - 11 edges
6. `localizePath()` - 11 edges
7. `catalogEntries()` - 11 edges
8. `isBaseAvailable()` - 10 edges
9. `Spedizioni attive (zone, soglie, dazi USA)` - 10 edges
10. `secondaryLocales` - 9 edges

## Surprising Connections (you probably didn't know these)
- `SHIPPING_COUNTRIES in checkout.ts (obsoleto)` --conceptually_related_to--> `ZONE_COUNTRIES`  [AMBIGUOUS]
  README.md → src/lib/shipping.ts
- `Tempi da comunicare (2-6 settimane)` --references--> `DELIVERY_WEEKS`  [INFERRED]
  docs/piano-spedizioni.md → src/lib/shipping.ts
- `Id carrello slug::formatId::support (PRINT_ID_SEPARATOR)` --references--> `catalogEntries()`  [EXTRACTED]
  CLAUDE.md → src/lib/artworks.ts
- `Zona USA (35 EUR + dazi 10%)` --references--> `ZONE_COUNTRIES`  [INFERRED]
  docs/piano-spedizioni.md → src/lib/shipping.ts
- `Originali: preventivo via email` --semantically_similar_to--> `Originale su richiesta (originalInquiryOnly)`  [INFERRED] [semantically similar]
  docs/piano-spedizioni.md → CLAUDE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Flusso ordine: carrello -> checkout server-side -> webhook email** — claude_localstorage_cart, claude_cart_country_selector, claude_stripe_checkout, claude_server_side_price_validation, claude_stripe_webhook, claude_resend [EXTRACTED 1.00]
- **Zone tariffarie di spedizione** — docs_piano_spedizioni_zone_italia, docs_piano_spedizioni_zona_ue, docs_piano_spedizioni_zona_europa_extra_ue, docs_piano_spedizioni_zona_mondo, docs_piano_spedizioni_zona_usa, docs_piano_spedizioni_on_request_countries [EXTRACTED 1.00]
- **Visibilita su motori e AI** — docs_piano_marketing_bing_webmaster_tools, docs_piano_marketing_google_search_console, docs_piano_marketing_geo, docs_piano_marketing_entity_building, claude_llms_txt, claude_json_ld [INFERRED 0.85]
- **Shared abstract organic watercolor style** — src_assets_artworks_sea_drop_cover_image, src_assets_artworks_night_sea_shooting_star_cover_image, src_assets_artworks_shy_carnivorous_plant_images_0_image [INFERRED 0.85]
- **Paintings sharing the stalk-ending-in-dot motif** — src_assets_quadri_opera_02_image, src_assets_quadri_opera_03_image, src_assets_quadri_opera_05_image [INFERRED 0.85]

## Communities (25 total, 3 thin omitted)

### Community 0 - "Dizionari i18n e pagine esito"
Cohesion: 0.07
Nodes (25): backHref, backLabel, message, Props, t, title, ar, en (+17 more)

### Community 1 - "Carrello spedizioni e Stripe"
Cohesion: 0.07
Nodes (41): Menu Paese nel carrello (CartPage), Spedizioni attive (zone, soglie, dazi USA), Stripe Checkout, STRIPE_SECRET_KEY (Secret runtime Cloudflare), Implementazione sul sito (carrello, checkout, Keystatic, email), SHIPPING_COUNTRIES in checkout.ts (obsoleto), Setup Stripe (API key, webhook), catalog (+33 more)

### Community 2 - "Architettura e deploy del progetto"
Cohesion: 0.06
Nodes (36): Pagina L'artista /artista, Astro 5 + adapter Cloudflare, Progetto Boleon (sito galleria/shop), Deploy Cloudflare Workers + assets (progetto boleon), Commenti con verifica email (D1, Turnstile), Dominio boleon.it (IONOS, DNS su Cloudflare), Pannello privato /gestione, GitHub Pages disattivato (+28 more)

### Community 3 - "Dipendenze e configurazione Astro"
Cohesion: 0.05
Nodes (41): dependencies, astro, @astrojs/cloudflare, @astrojs/markdoc, @astrojs/react, @astrojs/sitemap, @fontsource/beth-ellen, @fontsource-variable/cormorant (+33 more)

### Community 4 - "Lingue e convenzioni del sito"
Cohesion: 0.06
Nodes (32): Tipi opera: originale / stampa-edizione, Lingua automatica (redirect al primo accesso), 7 lingue (it default, en, es, fr, zh, hi, ar RTL), Menu mobile hamburger, showAvailability (copie rimaste pezzo base), Titoli traducibili (titles, pickLocalized), README Boleon — sito galleria / shop, Deploy su Cloudflare Pages (istruzioni) (+24 more)

### Community 5 - "Pagina opera e sistema stampe"
Cohesion: 0.07
Nodes (30): Pagina opera (carosello, stampe, potrebbero piacerti), Supporto tela (canvasSurchargePercent 60%), Id carrello slug::formatId::support (PRINT_ID_SEPARATOR), Modale richiesta originale/informazioni (dialog), Originale su richiesta (originalInquiryOnly), PhotoSwipe 5 (zoom HD), 17 formati in 3 gruppi (serie A, EU, pollici), Sistema stampe (formati standard in site-shop.json) (+22 more)

### Community 6 - "Collezioni e pagina artista"
Cohesion: 0.06
Nodes (28): Collezione Fiori, Collezione Ispirazioni, collectionNumber (N° in collezione), Collezione Shades, Galleria con collezioni (/galleria, linguette), Night Sea Shooting Star (Shades n.2), Sea Drop (Shades n.1), altName (+20 more)

### Community 7 - "Email Resend e API contatti"
Cohesion: 0.16
Nodes (17): Pagina contatti /contatto (modulo), astro, resend, getEnv(), GET(), inspect(), prerender, clean() (+9 more)

### Community 8 - "Script di build (traduzioni, segnaposto)"
Cohesion: 0.14
Nodes (16): artworks, makeSvg(), outBase, rng(), root, cache, deepl(), DEEPL_TARGET (+8 more)

### Community 9 - "Catalogo opere e prezzi"
Cohesion: 0.18
Nodes (20): canvasSurchargePercent(), catalogEntries(), CatalogEntry, collectionNumber(), isAvailable(), isBaseAvailable(), maxQty(), minPrice() (+12 more)

### Community 10 - "Home e sfondi copertina"
Cohesion: 0.11
Nodes (16): Sfondi hero a rotazione (useArtworkImages/heroImages), Home essenziale, altName, artworkCovers, artworks, bio, configuredNames, description (+8 more)

### Community 11 - "Dettaglio opera e zoom"
Cohesion: 0.11
Nodes (17): alsoLike, available, canonical, description, entries, inquiryInfoMessage, inquiryOnly, inquiryOriginalMessage (+9 more)

### Community 12 - "Contatti, carrello e statistiche"
Cohesion: 0.20
Nodes (15): form, Props, t, EventData, track(), addToCart(), cartCount(), CartItem (+7 more)

### Community 13 - "Card opera e hero spotlight"
Cohesion: 0.15
Nodes (10): available, cheapest, href, Props, t, Props, t, urls (+2 more)

### Community 14 - "Schema contenuti Keystatic"
Cohesion: 0.15
Nodes (7): allPrintFormatIds, printFormatOptions, @keystatic/core, artCollections, artworks, collections, localized

### Community 15 - "Quadri reali opera-01..05"
Cohesion: 0.42
Nodes (9): Organic biomorphic abstraction on white watercolor paper, Painting palette: bordeaux/magenta, ochre-yellow, olive and leaf green, Motif: thin stalks/lines ending in dots or eye-pods, hero-spenta.jpg — desaturated grayscale version of opera-03 (home hero base layer), opera-01.jpg — close-up of thick impasto shell/hood form in mauve, ochre-yellow and orange with green wavy drips, opera-02.jpg — diagonal ochre/olive and pink brushstrokes crossed by fine red string lines ending in dots, harp-like grid, opera-03.jpg — whimsical bird/fish-like creature in yellow-olive, crimson and teal with radiating drip lines and dotted trails, opera-04.jpg — two tall horn/sprout-like watercolor forms in ochre and burgundy, row of green dots, red base line (+1 more)

### Community 16 - "Pannello gestione"
Cohesion: 0.22
Nodes (7): artCollections, artworks, buttons, cards, collectionCounts, collectionName, toneClass

### Community 17 - "Configurazione TypeScript"
Cohesion: 0.25
Nodes (7): astro/tsconfigs/strict, compilerOptions, jsx, jsxImportSource, exclude, extends, include

### Community 18 - "Impostazioni sito e llms.txt"
Cohesion: 0.29
Nodes (3): isInquiryOnly(), settings, prerender

### Community 20 - "Estetica, font e palette"
Cohesion: 0.29
Nodes (6): Cormorant Variable, Hero spotlight (maschera radiale sul cursore), PaintAccents (rimosso), Palette dai dipinti (accent #8f2b45 ...), Estetica carta (Beth Ellen, texture carta.webp, paper-btn), Quadri reali opera-01..05

### Community 21 - "Opere in catalogo (immagini)"
Cohesion: 0.47
Nodes (6): Abstract organic watercolor forms with granulated texture and accent dots on white paper, Sea / night theme in blue-violet palette (Shades collection), Night Sea Shooting Star (cover) - abstract watercolor: violet/magenta wave form, blue dripping band descending like a falling star trail, bright yellow sun-like circle; red and blue dots on cream paper; dreamy nocturnal mood, Sea Drop (cover) - abstract watercolor: curving blue-violet wave shape and a separate pink-red teardrop/leaf form with small droplet dots on white paper; granulated texture; calm fluid marine mood, Shy Carnivorous Plant - abstract watercolor: olive-green, brown and crimson organic plant/jaw forms with toothed fringe, yellow-magenta petal, continuous magenta line with dots weaving through; botanical, playful-uncanny mood, Shy Carnivorous Plant - interior mockup: the painting in a large green frame on a wall in a sunlit modern living room with green velvet sofa and marble table

### Community 22 - "Favicon e texture carta"
Cohesion: 0.67
Nodes (3): Astro starter template logo (unbranded placeholder favicon), Favicon (default Astro logo SVG, black/white via prefers-color-scheme), Carta paper texture tile (rough white paper, 1024x1024 webp)

## Ambiguous Edges - Review These
- `ZONE_COUNTRIES` → `SHIPPING_COUNTRIES in checkout.ts (obsoleto)`  [AMBIGUOUS]
  README.md · relation: conceptually_related_to
- `Estetica carta (Beth Ellen, texture carta.webp, paper-btn)` → `Cormorant Variable`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to
- `Deploy Cloudflare Workers + assets (progetto boleon)` → `Deploy su Cloudflare Pages (istruzioni)`  [AMBIGUOUS]
  README.md · relation: conceptually_related_to
- `Favicon (default Astro logo SVG, black/white via prefers-color-scheme)` → `Carta paper texture tile (rough white paper, 1024x1024 webp)`  [AMBIGUOUS]
  public/favicon.svg · relation: conceptually_related_to

## Knowledge Gaps
- **36 isolated node(s):** `photoswipe`, `react`, `react-dom`, `tailwindcss`, `astro/tsconfigs/strict` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 249 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `astro` connect `Email Resend e API contatti` to `Carrello spedizioni e Stripe`, `Architettura e deploy del progetto`, `Dipendenze e configurazione Astro`, `Home e sfondi copertina`, `Schema contenuti Keystatic`, `Impostazioni sito e llms.txt`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **What connects `photoswipe`, `react`, `react-dom` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dizionari i18n e pagine esito` be split into smaller, more focused modules?**
  _Cohesion score 0.07020408163265306 - nodes in this community are weakly interconnected._
- **Why does `Spedizioni attive (zone, soglie, dazi USA)` connect `Carrello spedizioni e Stripe` to `Architettura e deploy del progetto`, `Pagina opera e sistema stampe`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `Carrello spedizioni e Stripe` be split into smaller, more focused modules?**
  _Cohesion score 0.06648936170212766 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `ZONE_COUNTRIES` and `SHIPPING_COUNTRIES in checkout.ts (obsoleto)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Estetica carta (Beth Ellen, texture carta.webp, paper-btn)` and `Cormorant Variable`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._