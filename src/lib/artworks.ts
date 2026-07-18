import type { CollectionEntry } from 'astro:content';
import settings from './settings';

export type Artwork = CollectionEntry<'artworks'>;

/** Formato standard di stampa (definito una volta sola in Sito → Vendita e stampe). */
export type PrintFormat = {
  id: string;
  label: string;
  width: number;
  height: number;
  price: number;
  /** Gruppo del menu a tendina: 'a' (serie A), 'eu' (standard europei), 'in' (pollici USA/Canada) */
  group?: string;
};

export const PRINT_SUPPORTS = ['paper', 'canvas'] as const;
export type PrintSupport = (typeof PRINT_SUPPORTS)[number];

const shop = settings as {
  printFormats?: PrintFormat[];
  canvasSurchargePercent?: number;
};

/** Tutti i formati standard configurati nelle impostazioni del negozio. */
export function standardPrintFormats(): PrintFormat[] {
  return shop.printFormats ?? [];
}

export function canvasSurchargePercent(): number {
  return shop.canvasSurchargePercent ?? 0;
}

/** Prezzi "belli": arrotondati ai 5 € più vicini. */
function roundPrice(value: number): number {
  return Math.max(5, Math.round(value / 5) * 5);
}

/** I formati di stampa offerti da un'opera (stampa su richiesta, senza magazzino). */
export function printFormatsFor(artwork: Artwork): PrintFormat[] {
  if (!artwork.data.printsEnabled) return [];
  const offered = new Set(artwork.data.printFormats ?? []);
  return standardPrintFormats().filter((f) => offered.has(f.id));
}

/** Prezzo di una stampa: standard del formato + % dell'opera + eventuale tela. */
export function printPrice(
  artwork: Artwork,
  format: PrintFormat,
  support: PrintSupport
): number {
  const markup = 1 + (artwork.data.printPricePercent ?? 0) / 100;
  const supportFactor = support === 'canvas' ? 1 + canvasSurchargePercent() / 100 : 1;
  return roundPrice(format.price * markup * supportFactor);
}

/** Il pezzo base (originale o edizione legacy) è acquistabile online? */
export function isBaseAvailable(artwork: Artwork): boolean {
  return artwork.data.kind === 'original'
    ? !artwork.data.sold && !artwork.data.originalInquiryOnly && artwork.data.price != null
    : (artwork.data.stock ?? 0) > 0;
}

/** L'originale è un pezzo unico offerto solo su richiesta (non acquistabile online)? */
export function isInquiryOnly(artwork: Artwork): boolean {
  return artwork.data.kind === 'original' && artwork.data.originalInquiryOnly && !artwork.data.sold;
}

/** L'opera ha almeno qualcosa di acquistabile (originale o una stampa)? */
export function isAvailable(artwork: Artwork): boolean {
  return isBaseAvailable(artwork) || printFormatsFor(artwork).length > 0;
}

export function maxQty(artwork: Artwork): number {
  if (!isBaseAvailable(artwork)) return 0;
  return artwork.data.kind === 'original' ? 1 : Math.max(0, artwork.data.stock ?? 0);
}

/** Prezzo minimo tra le opzioni disponibili (per la card "da …"). */
export function minPrice(artwork: Artwork): number | null {
  const prices = catalogEntries(artwork).map((e) => e.price);
  return prices.length ? Math.min(...prices) : null;
}

export type CatalogEntry = {
  /** id del carrello: slug per il pezzo base, `slug::formato::supporto` per una stampa */
  id: string;
  slug: string;
  title: string;
  /** es. "Opera originale" o "Stampa · A4 · carta" (etichette risolte altrove per i18n) */
  variant: { kind: 'base' | 'print'; size?: string; formatId?: string; support?: PrintSupport };
  price: number;
  max: number;
};

export const PRINT_ID_SEPARATOR = '::';

/** Quante copie al massimo per ordine (le stampe sono su richiesta, senza magazzino). */
const MAX_PRINTS_PER_ORDER = 10;

/**
 * Tutte le voci acquistabili di un'opera, con prezzi/limiti server-side.
 * Unica fonte di verità per carrello e checkout.
 */
export function catalogEntries(artwork: Artwork): CatalogEntry[] {
  const entries: CatalogEntry[] = [];
  if (isBaseAvailable(artwork)) {
    entries.push({
      id: artwork.id,
      slug: artwork.id,
      title: artwork.data.title,
      variant: { kind: 'base' },
      price: artwork.data.price ?? 0,
      max: Math.min(maxQty(artwork), 10),
    });
  }
  for (const format of printFormatsFor(artwork)) {
    for (const support of PRINT_SUPPORTS) {
      entries.push({
        id: [artwork.id, format.id, support].join(PRINT_ID_SEPARATOR),
        slug: artwork.id,
        title: artwork.data.title,
        variant: { kind: 'print', size: format.label, formatId: format.id, support },
        price: printPrice(artwork, format, support),
        max: MAX_PRINTS_PER_ORDER,
      });
    }
  }
  return entries;
}

export function sortArtworks(list: Artwork[]): Artwork[] {
  return [...list].sort(
    (a, b) => a.data.sortOrder - b.data.sortOrder || a.data.title.localeCompare(b.data.title)
  );
}

/**
 * Numero dell'opera nella sua collezione ("N° …"). Se l'artista ha impostato
 * un numero manuale (campo "Numero nella collezione") vince quello; altrimenti
 * è la posizione 1-based nell'ordinamento della galleria, ricalcolata a ogni
 * build: aggiungendo o riordinando opere i numeri si aggiornano da soli.
 */
export function collectionNumber(
  all: Artwork[],
  artwork: Artwork,
  collectionSlug: string
): number | null {
  if (artwork.data.collectionNumber != null) return artwork.data.collectionNumber;
  const members = sortArtworks(all.filter((a) => a.data.collections.includes(collectionSlug)));
  const index = members.findIndex((a) => a.id === artwork.id);
  return index === -1 ? null : index + 1;
}
