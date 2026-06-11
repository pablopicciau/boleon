export type CartItem = { slug: string; qty: number };

const KEY = 'boleon-cart';

export function getCart(): CartItem[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(raw)
      ? raw.filter((i) => typeof i?.slug === 'string' && Number.isInteger(i?.qty) && i.qty > 0)
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

export function addToCart(slug: string, qty: number, max: number) {
  const items = getCart();
  const existing = items.find((i) => i.slug === slug);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, max);
  } else {
    items.push({ slug, qty: Math.max(1, Math.min(qty, max)) });
  }
  save(items);
}

export function setQty(slug: string, qty: number, max: number) {
  let items = getCart();
  if (qty <= 0) {
    items = items.filter((i) => i.slug !== slug);
  } else {
    const item = items.find((i) => i.slug === slug);
    if (item) item.qty = Math.min(qty, max);
  }
  save(items);
}

export function removeFromCart(slug: string) {
  save(getCart().filter((i) => i.slug !== slug));
}

/** Drops cart entries that are unavailable or unknown; returns true if anything was removed. */
export function pruneCart(validSlugs: Set<string>): boolean {
  const items = getCart();
  const kept = items.filter((i) => validSlugs.has(i.slug));
  if (kept.length !== items.length) {
    save(kept);
    return true;
  }
  return false;
}

export function clearCart() {
  save([]);
}
