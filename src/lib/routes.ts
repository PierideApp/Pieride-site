import type { Locale } from "@/i18n/config";

export const documentationUrl = "https://pierideapp.github.io/Docs-Pieride";

export function documentationHref(path: string = "/") {
  const suffix = path === "/" ? "/" : `${path.startsWith("/") ? path : `/${path}`}/`;
  return `${documentationUrl}${suffix}`;
}

export function localeSwitchPath(locale: Locale, currentPath: string) {
  const suffix = currentPath.replace(/^\/(?:fr|en)(?=\/|$)/, "") || "";
  return localizedPath(locale, suffix);
}

export function localizedPath(locale: Locale, path: string = "") {
  const suffix = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${suffix}`;
}
