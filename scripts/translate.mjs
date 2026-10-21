// Traduzione automatica di tutti i testi del sito con DeepL.
//
// Gira PRIMA di `astro build` (vedi "build" in package.json). Tu scrivi i
// testi in UNA sola lingua da Keystatic (l'italiano, o per i titoli la lingua
// che preferisci); qui vengono generate tutte le altre lingue.
//
// Robusto per definizione: se manca la chiave DEEPL_API_KEY, o DeepL dà
// errore, lo script NON blocca la build — le lingue mancanti restano vuote e
// il sito mostra l'italiano (o il titolo base) come ripiego. Così build locali
// e anteprime funzionano anche senza chiave.
//
// La chiave va messa nelle variabili di BUILD di Cloudflare (non runtime),
// come Secret di nome DEEPL_API_KEY.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const KEY = process.env.DEEPL_API_KEY;
const LOCALES = ['it', 'en', 'es', 'fr', 'zh', 'hi', 'ar'];

// Lingua di partenza preferita quando il testo è un oggetto già parzialmente
// compilato (prima l'italiano, poi l'inglese, poi la prima lingua piena).
const SOURCE_ORDER = ['it', 'en'];

// Codici lingua di destinazione per DeepL.
// Nota: DeepL non supporta ancora l'hindi (hi) → quella lingua resta vuota e
// il sito mostra l'italiano. Tutte le altre sono coperte.
const DEEPL_TARGET = {
  it: 'IT',
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
    // source_lang omesso di proposito: DeepL rileva la lingua da solo, così
    // non importa se scrivi in italiano o in inglese.
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

// Trova il testo "sorgente" in un oggetto localizzato (prima it, poi en, poi
// la prima lingua non vuota).
function sourceText(obj) {
  for (const l of [...SOURCE_ORDER, ...LOCALES]) {
    if (obj?.[l] && String(obj[l]).trim()) return { text: obj[l], lang: l };
  }
  return null;
}

// Riempie le lingue mancanti di un campo localizzato. Non sovrascrive mai una
// traduzione già presente. `baseText` è un ripiego (es. il titolo base) usato
// come sorgente quando l'oggetto è vuoto. Ritorna { value, changed }.
async function localize(value, baseText) {
  const obj = value && typeof value === 'object' ? value : {};
  let src = sourceText(obj);
  if (!src && baseText && String(baseText).trim()) src = { text: String(baseText), lang: null };
  if (!src) return { value: obj, changed: false };
  let changed = false;
  for (const loc of LOCALES) {
    if (src.lang && loc === src.lang) continue; // non tradurre una lingua in sé stessa
    if (obj[loc] && String(obj[loc]).trim()) continue; // già presente
    const target = DEEPL_TARGET[loc];
    if (!target) continue; // lingua non supportata da DeepL (es. hindi)
    try {
      obj[loc] = await translate(src.text, target);
      changed = true;
    } catch (e) {
      console.warn(`[translate] ${loc} non riuscito: ${e.message}`);
    }
  }
  return { value: obj, changed };
}

// specs: [{ field, baseField? }]
async function processFile(path, specs) {
  let data;
  try {
    data = JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return; // file assente o non valido: salta
  }
  let changed = false;
  for (const { field, baseField } of specs) {
    const base = baseField ? data[baseField] : undefined;
    const res = await localize(data[field], base);
    if (res.changed) {
      data[field] = res.value;
      changed = true;
    }
  }
  if (changed) {
    await writeFile(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`[translate] aggiornato ${path}`);
  }
}

async function processDir(dir, specs) {
  let files;
  try {
    files = await readdir(dir);
  } catch {
    return;
  }
  for (const f of files) {
    if (f.endsWith('.json')) await processFile(join(dir, f), specs);
  }
}

async function main() {
  if (!KEY) {
    console.log(
      '[translate] DEEPL_API_KEY assente: salto la traduzione (il sito userà l’italiano).'
    );
    return;
  }
  // Opere: il titolo si genera dal titolo base; la descrizione dall'italiano.
  await processDir('src/content/artworks', [
    { field: 'titles', baseField: 'title' },
    { field: 'descriptions' },
  ]);
  // Collezioni: il nome dal nome base; la storia dall'italiano.
  await processDir('src/content/collections', [
    { field: 'names', baseField: 'name' },
    { field: 'descriptions' },
  ]);
  // Testi del sito.
  await processFile('src/content/site-identity.json', [
    { field: 'taglines' },
    { field: 'bios' },
    { field: 'stories' },
  ]);
  await processFile('src/content/site-shop.json', [{ field: 'printMaterials' }]);
  console.log('[translate] completato.');
}

main().catch((e) => {
  // Mai far fallire la build per un problema di traduzione.
  console.warn('[translate] errore generale, continuo comunque la build:', e.message);
});
