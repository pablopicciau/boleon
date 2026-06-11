import { it, type Dict } from './it';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { zh } from './zh';
import { hi } from './hi';
import { ar } from './ar';

export type Locale = 'it' | 'en' | 'es' | 'fr' | 'zh' | 'hi' | 'ar';

export const locales: Locale[] = ['it', 'en', 'es', 'fr', 'zh', 'hi', 'ar'];
export const defaultLocale: Locale = 'it';
export const secondaryLocales = locales.filter((l) => l !== defaultLocale);

export const localeMeta: Record<Locale, { label: string; dir: 'ltr' | 'rtl'; lang: string }> = {
  it: { label: 'Italiano', dir: 'ltr', lang: 'it' },
  en: { label: 'English', dir: 'ltr', lang: 'en' },
  es: { label: 'Español', dir: 'ltr', lang: 'es' },
  fr: { label: 'Français', dir: 'ltr', lang: 'fr' },
  zh: { label: '中文', dir: 'ltr', lang: 'zh-Hans' },
  hi: { label: 'हिन्दी', dir: 'ltr', lang: 'hi' },
  ar: { label: 'العربية', dir: 'rtl', lang: 'ar' },
};

const dictionaries: Record<Locale, Dict> = { it, en, es, fr, zh, hi, ar };

export type TranslationKey = keyof Dict;

export function useTranslations(locale: Locale) {
  const dict = dictionaries[locale] ?? dictionaries[defaultLocale];
  return function t(key: TranslationKey, vars?: Record<string, string | number>): string {
    let text: string = dict[key] ?? dictionaries[defaultLocale][key] ?? key;
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        text = text.replaceAll(`{${name}}`, String(value));
      }
    }
    return text;
  };
}

/** Prefixes a root-relative path with the locale (default locale has no prefix). */
export function localizePath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return locale === defaultLocale ? clean : `/${locale}${clean}`;
}

/** Returns the same page path under a different locale (used by the language switcher). */
export function switchLocalePath(currentPath: string, from: Locale, to: Locale): string {
  let path = currentPath;
  if (from !== defaultLocale && path.startsWith(`/${from}`)) {
    path = path.slice(from.length + 1) || '/';
  }
  return localizePath(to, path);
}

/** Picks the value for a locale from a localized record, falling back to Italian. */
export function pickLocalized(
  values: Partial<Record<Locale, string | null>> | undefined,
  locale: Locale
): string {
  if (!values) return '';
  return values[locale] || values[defaultLocale] || '';
}

export function formatPrice(eur: number, locale: Locale): string {
  return new Intl.NumberFormat(localeMeta[locale].lang, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(eur);
}
