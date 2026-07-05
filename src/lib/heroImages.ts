import type { ImageMetadata } from 'astro';

// Tutte le immagini caricate in src/assets/hero/ (gestite da Keystatic),
// indicizzate per nome file. Usate come sfondi a rotazione della hero.
const glob = import.meta.glob('../assets/hero/*.{jpg,jpeg,png,webp}', {
  eager: true,
}) as Record<string, { default: ImageMetadata }>;

export const heroImagesByName: Record<string, ImageMetadata> = {};
for (const [path, mod] of Object.entries(glob)) {
  const name = path.split('/').pop();
  if (name) heroImagesByName[name] = mod.default;
}
