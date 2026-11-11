export const locales = ["fr", "en"] as const;
export const defaultLocale = "fr";
export type Locale = (typeof locales)[number];

export function hasLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}
