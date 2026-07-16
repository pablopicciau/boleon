import type { CollectionEntry } from 'astro:content';

export type Artwork = CollectionEntry<'artworks'>;
export type PrintSize = {
  size: string;
  price: number;
  stock: number;
  editionSize?: number | null;
};

/** Formati stampa ancora ordinabili (stock > 0). */
export function availablePrintSizes(artwork: Artwork): PrintSize[] {
  return (artwork.data.printSizes ?? []).filter((p) => (p.stock ?? 0) > 0);
}

/** Il pezzo base (originale o edizione legacy) è acquistabile? */
export function isBaseAvailable(artwork: Artwork): boolean {
  return artwork.data.kind === 'original'
    ? !artwork.data.sold
    : (artwork.data.stock ?? 0) > 0;
}

/** L'opera ha almeno qualcosa di acquistabile (originale o una stampa)? */
export function isAvailable(artwork: Artwork): boolean {
  return isBaseAvailable(artwork) || availablePrintSizes(artwork).length > 0;
}

export function maxQty(artwork: Artwork): number {
  if (!isBaseAvailable(artwork)) return 0;
  return artwork.data.kind === 'original' ? 1 : Math.max(0, artwork.data.stock ?? 0);
}

/** Prezzo minimo tra le opzioni disponibili (per la card "da …"). */
export function minPrice(artwork: Artwork): number | null {
  const prices: number[] = [];
  if (isBaseAvailable(artwork)) prices.push(artwork.data.price);
  for (const p of availablePrintSizes(artwork)) prices.push(p.price);
  return prices.length ? Math.min(...prices) : null;
}

export type CatalogEntry = {
  /** id del carrello: slug per il pezzo base, `slug::formato` per una stampa */
  id: string;
  slug: string;
  title: string;
  /** es. "Opera originale" o "Stampa · 30 × 40 cm" (chiave risolta altrove per i18n) */
  variant: { kind: 'base' | 'print'; size?: string };
  price: number;
  max: number;
};

export const PRINT_ID_SEPARATOR = '::';

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
      price: artwork.data.price,
      max: Math.min(maxQty(artwork), 10),
    });
  }
  for (const p of availablePrintSizes(artwork)) {
    entries.push({
      id: `${artwork.id}${PRINT_ID_SEPARATOR}${p.size}`,
      slug: artwork.id,
      title: artwork.data.title,
      variant: { kind: 'print', size: p.size },
      price: p.price,
      max: Math.min(p.stock, 10),
    });
  }
  return entries;
}

export function sortArtworks(list: Artwork[]): Artwork[] {
  return [...list].sort(
    (a, b) => a.data.sortOrder - b.data.sortOrder || b.data.year - a.data.year
  );
}

/**
 * Numero progressivo dell'opera nella sua collezione (1-based), calcolato
 * sull'ordinamento della galleria ("Ordinamento", poi anno). Ricalcolato a
 * ogni build: aggiungendo o riordinando opere i numeri si aggiornano da soli.
 */
export function collectionNumber(
  all: Artwork[],
  artwork: Artwork,
  collectionSlug: string
): number | null {
  const members = sortArtworks(all.filter((a) => a.data.collections.includes(collectionSlug)));
  const index = members.findIndex((a) => a.id === artwork.id);
  return index === -1 ? null : index + 1;
}
