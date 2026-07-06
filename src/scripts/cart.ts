export type CartItem = { slug: string; option: string; qty: number };

const KEY = 'boleon-cart';

/** Unique key for a cart row: same artwork, different format = different row. */
export function cartKey(item: Pick<CartItem, 'slug' | 'option'>): string {
  return `${item.slug}::${item.option}`;
}

export function getCart(): CartItem[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(raw)
      ? raw.filter(
          (i) =>
            typeof i?.slug === 'string' &&
            typeof i?.option === 'string' &&
            Number.isInteger(i?.qty) &&
            i.qty > 0
        )
      : [];
  } catch {
    return [];
  }
}

function save(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('cart:updated', { detail: { count: cartCount(items) } }));
}

export function cartCount(items: CartItem[] = getCart()): number {
  return items.reduce((n, i) => n + i.qty, 0);
}

export function addToCart(slug: string, option: string, qty: number, max: number) {
  const items = getCart();
  const existing = items.find((i) => i.slug === slug && i.option === option);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, max);
  } else {
    items.push({ slug, option, qty: Math.max(1, Math.min(qty, max)) });
  }
  save(items);
}

export function setQty(slug: string, option: string, qty: number, max: number) {
  let items = getCart();
  if (qty <= 0) {
    items = items.filter((i) => !(i.slug === slug && i.option === option));
  } else {
    const item = items.find((i) => i.slug === slug && i.option === option);
    if (item) item.qty = Math.min(qty, max);
  }
  save(items);
}

export function removeFromCart(slug: string, option: string) {
  save(getCart().filter((i) => !(i.slug === slug && i.option === option)));
}

/** Drops cart entries that are unavailable or unknown; returns true if anything was removed. */
export function pruneCart(validKeys: Set<string>): boolean {
  const items = getCart();
  const kept = items.filter((i) => validKeys.has(cartKey(i)));
  if (kept.length !== items.length) {
    save(kept);
    return true;
  }
  return false;
}

export function clearCart() {
  save([]);
}
