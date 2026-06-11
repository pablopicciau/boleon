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

const artworks = [
  { slug: 'aurora-di-campo', seed: 11, w: 1400, h: 2000, bg: '#f6ede2', palette: ['#e07a5f', '#f2cc8f', '#e6b89c', '#9c6644', '#f4f1de', '#c44536'] },
  { slug: 'notturno-n-3', seed: 23, w: 1800, h: 1800, bg: '#10131f', palette: ['#1f2a48', '#3d5a80', '#98c1d9', '#e0fbfc', '#293241', '#5c6f9c'] },
  { slug: 'frammenti-di-mare', seed: 37, w: 1400, h: 1960, bg: '#eef4f2', palette: ['#0a9396', '#94d2bd', '#005f73', '#e9d8a6', '#5aa9a3', '#001219'] },
  { slug: 'terra-rossa', seed: 41, w: 2000, h: 1400, bg: '#f1e3d3', palette: ['#9b2226', '#ae2012', '#bb3e03', '#ca6702', '#6a040f', '#e09f3e'] },
  { slug: 'vento-d-estate', seed: 53, w: 1320, h: 1980, bg: '#fdf8e7', palette: ['#f7b32b', '#f6e27f', '#e4cc37', '#a8c256', '#dd9633', '#f9f1c9'] },
  { slug: 'vento-d-estate-dettaglio', seed: 59, w: 1600, h: 1600, bg: '#fbf3d4', palette: ['#f7b32b', '#e4cc37', '#dd9633', '#a8c256'] },
  { slug: 'costellazione-minore', seed: 67, w: 1500, h: 2000, bg: '#1b1f3a', palette: ['#f1e4f3', '#c5a3ff', '#7f7caf', '#fdfdff', '#4f518c', '#907ad6'] },
  { slug: 'giardino-segreto', seed: 79, w: 1400, h: 2000, bg: '#eef2e6', palette: ['#386641', '#6a994e', '#a7c957', '#bc4749', '#f2e8cf', '#52796f'] },
  { slug: 'eco-di-luna', seed: 97, w: 1700, h: 1700, bg: '#e8e9ed', palette: ['#9a8c98', '#c9ada7', '#4a4e69', '#f2e9e4', '#22223b', '#b8bedd'] },
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
