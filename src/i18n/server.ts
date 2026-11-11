import { notFound } from "next/navigation";
import { defaultLocale, hasLocale, type Locale } from "./config";
import dictionary from "./dictionaries/fr";
import englishDictionary from "./dictionaries/en";

export function getDictionary(locale: string = defaultLocale) {
  if (!hasLocale(locale)) notFound();
  return locale === "en" ? englishDictionary : dictionary;
}

export function getLocale(value: string) {
  if (!hasLocale(value)) notFound();
  return value as Locale;
}
