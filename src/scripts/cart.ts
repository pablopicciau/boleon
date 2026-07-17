import { track } from './analytics';

/**
 * Una riga del carrello: `slug` è l'id di catalogo (pezzo base o stampa
 * `slug::formato::supporto`); `border` è il bordo bianco extra in cm scelto
 * per le stampe (0/assente = nessun bordo, non cambia il prezzo).
 */
export type CartItem = { slug: string; qty: number; border?: number };

const KEY = 'boleon-cart';

function sameLine(a: CartItem, slug: string, border?: number): boolean {
  return a.slug === slug && (a.border ?? 0) === (border ?? 0);
}

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

export function addToCart(slug: string, qty: number, max: number, border?: number) {
  const items = getCart();
  const existing = items.find((i) => sameLine(i, slug, border));
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, max);
  } else {
    const item: CartItem = { slug, qty: Math.max(1, Math.min(qty, max)) };
    if (border && border > 0) item.border = border;
    items.push(item);
  }
  save(items);
  track('add_to_cart', { item: slug, qty });
}

export function setQty(slug: string, qty: number, max: number, border?: number) {
  let items = getCart();
  if (qty <= 0) {
    items = items.filter((i) => !sameLine(i, slug, border));
  } else {
    const item = items.find((i) => sameLine(i, slug, border));
    if (item) item.qty = Math.min(qty, max);
  }
  save(items);
}

export function removeFromCart(slug: string, border?: number) {
  save(getCart().filter((i) => !sameLine(i, slug, border)));
  track('remove_from_cart', { item: slug });
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
