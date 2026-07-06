// One-off generator for placeholder artwork SVGs. Run: node scripts/generate-placeholders.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outBase = join(root, 'src/assets/artworks');

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

function makeSvg({ seed, w, h, palette, bg }) {
  const r = rng(seed);
  const pick = (arr) => arr[Math.floor(r() * arr.length)];
  const parts = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`
  );
  parts.push(`<rect width="${w}" height="${h}" fill="${bg}"/>`);

  // large translucent colour fields
  for (let i = 0; i < 7; i++) {
    const cx = r() * w;
    const cy = r() * h;
    const rw = (0.2 + r() * 0.5) * w;
    const rh = (0.15 + r() * 0.45) * h;
    const rot = Math.floor(r() * 60 - 30);
    parts.push(
      `<rect x="${(cx - rw / 2).toFixed(0)}" y="${(cy - rh / 2).toFixed(0)}" width="${rw.toFixed(0)}" height="${rh.toFixed(0)}" fill="${pick(palette)}" opacity="${(0.25 + r() * 0.45).toFixed(2)}" transform="rotate(${rot} ${cx.toFixed(0)} ${cy.toFixed(0)})"/>`
    );
  }

  // brush-like strokes
  for (let i = 0; i < 10; i++) {
    const x1 = r() * w;
    const y1 = r() * h;
    const x2 = x1 + (r() - 0.5) * w * 0.8;
    const y2 = y1 + (r() - 0.5) * h * 0.5;
    const cxp = (x1 + x2) / 2 + (r() - 0.5) * 300;
    const cyp = (y1 + y2) / 2 + (r() - 0.5) * 300;
    parts.push(
      `<path d="M ${x1.toFixed(0)} ${y1.toFixed(0)} Q ${cxp.toFixed(0)} ${cyp.toFixed(0)} ${x2.toFixed(0)} ${y2.toFixed(0)}" stroke="${pick(palette)}" stroke-width="${(6 + r() * 40).toFixed(0)}" stroke-linecap="round" fill="none" opacity="${(0.3 + r() * 0.5).toFixed(2)}"/>`
    );
  }

  // circles / suns
  for (let i = 0; i < 3; i++) {
    parts.push(
      `<circle cx="${(r() * w).toFixed(0)}" cy="${(r() * h).toFixed(0)}" r="${(20 + r() * 160).toFixed(0)}" fill="${pick(palette)}" opacity="${(0.35 + r() * 0.45).toFixed(2)}"/>`
    );
  }

  // fine grain: tiny marks that reward deep zoom
  for (let i = 0; i < 450; i++) {
    const x = r() * w;
    const y = r() * h;
    if (r() < 0.5) {
      parts.push(
        `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(0.6 + r() * 2.4).toFixed(1)}" fill="${pick(palette)}" opacity="${(0.2 + r() * 0.5).toFixed(2)}"/>`
      );
    } else {
      parts.push(
        `<line x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x + (r() - 0.5) * 24).toFixed(0)}" y2="${(y + (r() - 0.5) * 24).toFixed(0)}" stroke="${pick(palette)}" stroke-width="${(0.6 + r() * 1.6).toFixed(1)}" opacity="${(0.2 + r() * 0.45).toFixed(2)}"/>`
      );
    }
  }

  parts.push('</svg>');
  return parts.join('\n');
}

// Palette volutamente sobrie e desaturate: i segnaposto devono presentare
// bene il sito finché non vengono caricate le foto reali delle opere.
const artworks = [
  { slug: 'aurora-di-campo', seed: 11, w: 1400, h: 2000, bg: '#f3ece1', palette: ['#b08968', '#ddb892', '#e6ccb2', '#9c6644', '#ede0d4', '#7f5539'] },
  { slug: 'notturno-n-3', seed: 23, w: 1800, h: 1800, bg: '#151a24', palette: ['#232b3a', '#33415c', '#5c677d', '#7d8597', '#979dac', '#404a63'] },
  { slug: 'frammenti-di-mare', seed: 37, w: 1400, h: 1960, bg: '#eef2f1', palette: ['#4f6d7a', '#7a9e9f', '#b8d8d8', '#a3b9b9', '#56707b', '#2f4550'] },
  { slug: 'terra-rossa', seed: 41, w: 2000, h: 1400, bg: '#f0e6dc', palette: ['#772e25', '#9a3b32', '#58281f', '#c08552', '#a45a52', '#6f1d1b'] },
  { slug: 'vento-d-estate', seed: 53, w: 1320, h: 1980, bg: '#f9f4e6', palette: ['#d4b483', '#e6cf9e', '#c2a878', '#a89f68', '#e9dcbe', '#b49d5e'] },
  { slug: 'vento-d-estate-dettaglio', seed: 59, w: 1600, h: 1600, bg: '#f7f0dd', palette: ['#d4b483', '#c2a878', '#b49d5e', '#a89f68'] },
  { slug: 'costellazione-minore', seed: 67, w: 1500, h: 2000, bg: '#1e2030', palette: ['#494d6b', '#6c6f93', '#9c9ebf', '#d9dae8', '#3a3d58', '#7d81a8'] },
  { slug: 'giardino-segreto', seed: 79, w: 1400, h: 2000, bg: '#eef0e7', palette: ['#5a6f52', '#7f9070', '#a3b18a', '#c8cdb6', '#465943', '#8a9b6e'] },
  { slug: 'eco-di-luna', seed: 97, w: 1700, h: 1700, bg: '#e9e8ec', palette: ['#9b96a6', '#b9b4c2', '#6e6a7c', '#d8d5df', '#4c4956', '#a9a5b6'] },
];

for (const a of artworks) {
  const dir = a.slug.endsWith('-dettaglio')
    ? join(outBase, a.slug.replace(/-dettaglio$/, ''))
    : join(outBase, a.slug);
  mkdirSync(dir, { recursive: true });
  const name = a.slug.endsWith('-dettaglio') ? 'dettaglio.svg' : 'cover.svg';
  writeFileSync(join(dir, name), makeSvg(a));
  console.log('written', join(dir, name));
}
