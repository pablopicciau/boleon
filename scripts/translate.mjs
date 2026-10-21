// Traduzione automatica dei testi delle opere e delle collezioni con DeepL.
//
// Gira PRIMA di `astro build` (vedi "build" in package.json): riempie le
// lingue vuote partendo dall'italiano (o dall'inglese se l'italiano manca).
// Tu scrivi i testi in UNA sola lingua da Keystatic, le altre si riempiono qui.
//
// Robusto per definizione: se manca la chiave DEEPL_API_KEY, o DeepL dà
// errore, lo script NON blocca la build — le lingue vuote restano vuote e
// il sito mostra l'italiano come ripiego. Così build locali e anteprime
// funzionano anche senza chiave.
//
// La chiave va messa nelle variabili di BUILD di Cloudflare (non runtime),
// come Secret di nome DEEPL_API_KEY.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const KEY = process.env.DEEPL_API_KEY;
const LOCALES = ['it', 'en', 'es', 'fr', 'zh', 'hi', 'ar'];

// Lingua di partenza preferita (quella in cui scrivi tu), in ordine.
const SOURCE_ORDER = ['it', 'en'];

// Codici lingua di destinazione per DeepL.
// Nota: DeepL non supporta ancora l'hindi (hi) → quella lingua resta vuota
// e il sito mostra l'italiano. Tutte le altre sono coperte.
const DEEPL_TARGET = {
  en: 'EN-US',
  es: 'ES',
  fr: 'FR',
  zh: 'ZH',
  ar: 'AR',
};

// Le chiavi gratuite di DeepL finiscono con ":fx" e usano un endpoint diverso.
const endpoint =
  KEY && KEY.endsWith(':fx')
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate';

async function deepl(text, target) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: [text], target_lang: target }),
  });
  if (!res.ok) throw new Error(`DeepL ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return data.translations?.[0]?.text ?? '';
}

// Evita di tradurre due volte lo stesso testo nella stessa build.
const cache = new Map();
async function translate(text, target) {
  const k = `${target}:::${text}`;
  if (cache.has(k)) return cache.get(k);
  const out = await deepl(text, target);
  cache.set(k, out);
  return out;
}

// Trova il testo "sorgente" di un campo localizzato (prima it, poi en, poi
// la prima lingua non vuota).
function sourceText(obj) {
  for (const l of [...SOURCE_ORDER, ...LOCALES]) {
    if (obj?.[l] && String(obj[l]).trim()) return { text: obj[l], lang: l };
  }
  return null;
}

// Riempie le lingue vuote di un campo localizzato. Non tocca mai le
// traduzioni già presenti (scritte a mano). Ritorna true se cambia qualcosa.
async function fillField(obj) {
  if (!obj || typeof obj !== 'object') return false;
  const src = sourceText(obj);
  if (!src) return false;
  let changed = false;
  for (const loc of LOCALES) {
    if (loc === src.lang) continue;
    if (obj[loc] && String(obj[loc]).trim()) continue; // già tradotto
    const target = DEEPL_TARGET[loc];
    if (!target) continue; // lingua non supportata da DeepL (es. hindi)
    try {
      obj[loc] = await translate(src.text, target);
      changed = true;
    } catch (e) {
      console.warn(`[translate] ${loc} non riuscito: ${e.message}`);
    }
  }
  return changed;
}

async function processFile(path, fields) {
  const data = JSON.parse(await readFile(path, 'utf8'));
  let changed = false;
  for (const f of fields) {
    if (data[f]) changed = (await fillField(data[f])) || changed;
  }
  if (changed) {
    await writeFile(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`[translate] aggiornato ${path}`);
  }
}

async function processDir(dir, fields) {
  let files;
  try {
    files = await readdir(dir);
  } catch {
    return;
  }
  for (const f of files) {
    if (f.endsWith('.json')) await processFile(join(dir, f), fields);
  }
}

async function main() {
  if (!KEY) {
    console.log(
      '[translate] DEEPL_API_KEY assente: salto la traduzione (il sito userà l’italiano).'
    );
    return;
  }
  await processDir('src/content/artworks', ['titles', 'descriptions']);
  await processDir('src/content/collections', ['names', 'descriptions']);
  console.log('[translate] completato.');
}

main().catch((e) => {
  // Mai far fallire la build per un problema di traduzione.
  console.warn('[translate] errore generale, continuo comunque la build:', e.message);
});
