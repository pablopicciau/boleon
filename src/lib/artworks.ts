import type { CollectionEntry } from 'astro:content';

export type Artwork = CollectionEntry<'artworks'>;

/**
 * A purchasable variant of an artwork: the unique original and/or one or more
 * print formats. The id is what the cart and the checkout API exchange.
 */
export type PurchaseOption = {
  /** 'original' or 'print-<index>' */
  id: string;
  type: 'original' | 'print';
  dimensions: string;
  price: number;
  available: boolean;
  /** Max purchasable quantity in one order (1 for originals) */
  max: number;
  editionSize: number | null;
  stock: number | null;
};

const MAX_PER_ORDER = 10;

export function getOptions(artwork: Artwork): PurchaseOption[] {
  const options: PurchaseOption[] = [];
  const original = artwork.data.original;
  if (original.forSale && original.price != null) {
    options.push({
      id: 'original',
      type: 'original',
      dimensions: original.dimensions,
      price: original.price,
      available: !original.sold,
      max: original.sold ? 0 : 1,
      editionSize: null,
      stock: null,
    });
  }
  artwork.data.prints.forEach((print, i) => {
    const stock = Math.max(0, print.stock ?? 0);
    options.push({
      id: `print-${i}`,
      type: 'print',
      dimensions: print.dimensions,
      price: print.price,
      available: stock > 0,
      max: Math.min(stock, MAX_PER_ORDER),
      editionSize: print.editionSize ?? null,
      stock,
    });
  });
  return options;
}

export function getOption(artwork: Artwork, id: string): PurchaseOption | undefined {
  return getOptions(artwork).find((o) => o.id === id);
}

export function isAvailable(artwork: Artwork): boolean {
  return getOptions(artwork).some((o) => o.available);
}

export function minAvailablePrice(artwork: Artwork): number | null {
  const prices = getOptions(artwork)
    .filter((o) => o.available)
    .map((o) => o.price);
  return prices.length > 0 ? Math.min(...prices) : null;
}

/** What the artwork offers overall (regardless of availability). */
export function offerKind(artwork: Artwork): 'original' | 'print' | 'both' {
  const options = getOptions(artwork);
  const hasOriginal = options.some((o) => o.type === 'original');
  const hasPrint = options.some((o) => o.type === 'print');
  if (hasOriginal && hasPrint) return 'both';
  return hasPrint ? 'print' : 'original';
}

export function sortArtworks(list: Artwork[]): Artwork[] {
  return [...list].sort(
    (a, b) => a.data.sortOrder - b.data.sortOrder || b.data.year - a.data.year
  );
}
