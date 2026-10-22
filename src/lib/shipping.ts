// Spedizioni: zone, Paesi serviti e calcolo del costo di un ordine.
//
// Modulo "puro" (non importa le impostazioni): lo usa il carrello nel browser
// per mostrare i costi e lo usa il checkout sul server per ricalcolarli, con
// la stessa identica logica. Le tariffe arrivano da Keystatic (site-shop.json,
// campo `shipping`) e passano da normalizeShippingConfig.
//
// Analisi e motivazioni delle tariffe: docs/piano-spedizioni.md

export type ShippingZone = 'italy' | 'eu' | 'europe' | 'world' | 'usa';

/**
 * Paesi serviti dal checkout, divisi per zona (codici ISO a 2 lettere).
 * Gli altri Paesi (es. Brasile, Messico, India, Cina) sono "su richiesta":
 * il cliente scrive e l'artista prepara un preventivo.
 */
export const ZONE_COUNTRIES: Record<ShippingZone, string[]> = {
  italy: ['IT'],
  eu: [
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
    'IE', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  ],
  // Europa fuori dall'UE: dogana/IVA a carico del destinatario. Per il Regno
  // Unito c'è un ordine minimo (sopra 135 £ l'IVA inglese la paga chi riceve,
  // sotto dovremmo registrarci all'IVA inglese).
  europe: ['CH', 'NO', 'GB'],
  world: ['CA', 'JP', 'KR', 'SG', 'AU', 'NZ', 'AE'],
  // USA: dazi prepagati da noi alla spedizione (Servizio Gestione Dazi di Poste)
  // e quindi aggiunti al totale; il cliente non paga nulla alla consegna.
  usa: ['US'],
};

export const SHIPPING_COUNTRIES: string[] = Object.values(ZONE_COUNTRIES).flat();

/** Tempi di consegna indicativi (lavorazione + viaggio), in settimane. */
export const DELIVERY_WEEKS: Record<ShippingZone, [number, number]> = {
  italy: [2, 3],
  eu: [2, 4],
  europe: [3, 6],
  world: [3, 6],
  usa: [3, 6],
};

export function zoneForCountry(country: string): ShippingZone | null {
  const code = country.toUpperCase();
  for (const [zone, countries] of Object.entries(ZONE_COUNTRIES)) {
    if (countries.includes(code)) return zone as ShippingZone;
  }
  return null;
}

/** Tariffa di una zona: costo per ordine e soglia oltre la quale è gratis (0 = mai). */
export type ZoneRate = { price: number; freeOver: number };

export type ShippingConfig = {
  zones: Record<ShippingZone, ZoneRate>;
  /** Stima dei dazi USA, in % del valore delle opere. */
  usDutiesPercent: number;
  /** Ordine minimo (€) per spedire nel Regno Unito. */
  ukMinOrder: number;
};

export const DEFAULT_SHIPPING: ShippingConfig = {
  zones: {
    italy: { price: 8, freeOver: 90 },
    eu: { price: 18, freeOver: 150 },
    europe: { price: 25, freeOver: 300 },
    world: { price: 35, freeOver: 300 },
    usa: { price: 35, freeOver: 300 },
  },
  usDutiesPercent: 10,
  ukMinOrder: 160,
};

const num = (value: unknown, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback;

/** Legge la configurazione di Keystatic: i campi vuoti prendono i valori di default. */
export function normalizeShippingConfig(raw: unknown): ShippingConfig {
  const src = (raw ?? {}) as Partial<Record<ShippingZone, Partial<ZoneRate>>> & {
    usDutiesPercent?: unknown;
    ukMinOrder?: unknown;
  };
  const zones = {} as Record<ShippingZone, ZoneRate>;
  for (const zone of Object.keys(DEFAULT_SHIPPING.zones) as ShippingZone[]) {
    const fallback = DEFAULT_SHIPPING.zones[zone];
    zones[zone] = {
      price: num(src[zone]?.price, fallback.price),
      freeOver: num(src[zone]?.freeOver, fallback.freeOver),
    };
  }
  return {
    zones,
    usDutiesPercent: num(src.usDutiesPercent, DEFAULT_SHIPPING.usDutiesPercent),
    ukMinOrder: num(src.ukMinOrder, DEFAULT_SHIPPING.ukMinOrder),
  };
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export type ShippingQuote = {
  country: string;
  zone: ShippingZone;
  /** Costo di spedizione dell'ordine (0 = gratuita). */
  shipping: number;
  /** Dazi USA prepagati (0 fuori dagli USA). */
  duties: number;
  /** Soglia di spedizione gratuita della zona (0 = nessuna soglia). */
  freeOver: number;
  /** Quanto manca alla spedizione gratuita (0 se già gratuita o senza soglia). */
  missingForFree: number;
  /** Fuori UE (esclusi gli USA): tasse d'importazione al destinatario, alla consegna. */
  customsOnDelivery: boolean;
  /** Regno Unito sotto l'ordine minimo: l'ordine non si può completare online. */
  belowUkMinimum: boolean;
  /** Subtotale opere + spedizione + dazi. */
  total: number;
};

/**
 * Calcola spedizione e dazi di un ordine. `subtotal` è il valore delle opere
 * in euro. Una sola spedizione per ordine: più stampe viaggiano insieme.
 * Ritorna null se il Paese non è servito dal checkout.
 */
export function quoteShipping(
  config: ShippingConfig,
  country: string,
  subtotal: number
): ShippingQuote | null {
  const zone = zoneForCountry(country);
  if (!zone) return null;
  const rate = config.zones[zone];
  const isFree = rate.freeOver > 0 && subtotal >= rate.freeOver;
  const shipping = isFree ? 0 : rate.price;
  const duties = zone === 'usa' ? round2((subtotal * config.usDutiesPercent) / 100) : 0;
  return {
    country: country.toUpperCase(),
    zone,
    shipping,
    duties,
    freeOver: rate.freeOver,
    missingForFree: rate.freeOver > 0 && !isFree ? round2(rate.freeOver - subtotal) : 0,
    customsOnDelivery: zone === 'europe' || zone === 'world',
    belowUkMinimum: country.toUpperCase() === 'GB' && subtotal < config.ukMinOrder,
    total: round2(subtotal + shipping + duties),
  };
}
