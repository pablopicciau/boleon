// Genera le icone del sito partendo da public/favicon.svg (la "B" di Boleòn nel
// font Beth Ellen, già convertita in tracciato). Run: node scripts/generate-favicons.mjs
//
// - favicon.ico (16/32/48 px, per Windows e per Google nei risultati di ricerca)
// - apple-touch-icon.png (180 px, icona su iPhone/iPad)
// - icon-192.png / icon-512.png (Android e site.webmanifest)
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const pub = new URL('../public/', import.meta.url);
const svg = await readFile(new URL('favicon.svg', pub), 'utf8');
// iPhone e Android ritagliano da soli gli angoli: lì serve il quadrato pieno
const fullBleed = svg.replace(/rx="\d+"/, 'rx="0"');

const png = (source, size) =>
  sharp(Buffer.from(source), { density: 600 }).resize(size, size).png().toBuffer();

await writeFile(new URL('apple-touch-icon.png', pub), await png(fullBleed, 180));
await writeFile(new URL('icon-192.png', pub), await png(fullBleed, 192));
await writeFile(new URL('icon-512.png', pub), await png(fullBleed, 512));

// .ico con PNG incorporati (supportato da tutti i browser attuali)
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(svg, s)));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((size, i) => {
  const entry = 6 + 16 * i;
  header.writeUInt8(size, entry);
  header.writeUInt8(size, entry + 1);
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(images[i].length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += images[i].length;
});
await writeFile(new URL('favicon.ico', pub), Buffer.concat([header, ...images]));

console.log('Icone generate in public/');
