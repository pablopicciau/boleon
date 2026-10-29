// La "carta d'identità" dell'artista per Google e per le AI (dati strutturati
// schema.org). È la stessa su home, pagina artista e opere (stesso @id), così i
// motori capiscono che si tratta di un'unica persona: un pittore italiano che
// dipinge ad acquerello. Senza questi dati le AI tiravano a indovinare
// ("arte digitale", confusione con Bolaño…).
import settings from './settings';
import { useTranslations, type Locale } from '../i18n';

export function artistId(site: URL): string {
  return new URL('/#artist', site).href;
}

/** Variante del nome senza accento ("Boleon"), per chi la cerca così. */
export function artistAltName(): string | undefined {
  const plain = settings.artistName.normalize('NFD').replace(/[̀-ͯ]/g, '');
  return plain && plain !== settings.artistName ? plain : undefined;
}

export function artistSummary(locale: Locale): string {
  return useTranslations(locale)('seo.artistSummary', { name: settings.artistName });
}

export function artistPerson(locale: Locale, site: URL, image?: string) {
  const t = useTranslations(locale);
  const alternateName = artistAltName();
  const sameAs = [settings.instagram, settings.facebook].filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': artistId(site),
    name: settings.artistName,
    ...(alternateName ? { alternateName } : {}),
    url: site.href,
    description: artistSummary(locale),
    jobTitle: t('seo.jobTitle'),
    hasOccupation: { '@type': 'Occupation', name: 'Painter' },
    knowsAbout: ['Watercolor painting', 'Acquerello', 'Fine art prints'],
    nationality: { '@type': 'Country', name: 'Italy' },
    ...(image ? { image } : {}),
    ...(settings.contactEmail ? { email: `mailto:${settings.contactEmail}` } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** Riferimento breve all'artista, da usare come autore delle opere. */
export function artistRef(site: URL) {
  return { '@type': 'Person', '@id': artistId(site), name: settings.artistName, url: site.href };
}
