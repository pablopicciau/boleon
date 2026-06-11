import type { CollectionEntry } from 'astro:content';

export type Artwork = CollectionEntry<'artworks'>;

export function isAvailable(artwork: Artwork): boolean {
  return artwork.data.kind === 'original'
    ? !artwork.data.sold
    : (artwork.data.stock ?? 0) > 0;
}

export function maxQty(artwork: Artwork): number {
  if (!isAvailable(artwork)) return 0;
  return artwork.data.kind === 'original' ? 1 : Math.max(0, artwork.data.stock ?? 0);
}

export function sortArtworks(list: Artwork[]): Artwork[] {
  return [...list].sort(
    (a, b) => a.data.sortOrder - b.data.sortOrder || b.data.year - a.data.year
  );
}
