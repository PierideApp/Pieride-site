import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { LocaleAttribute } from "./locale-attribute";

export function SiteFrame({ children, dictionary, locale }: { children: ReactNode; dictionary: Dictionary; locale: Locale }) {
  return (
    <div className="site-frame min-h-dvh overflow-x-clip bg-pieride-night text-white">
      <LocaleAttribute locale={locale} />
      <a href="#contenu" className="sr-only z-50 rounded-full bg-white px-4 py-2 text-pieride-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
        {dictionary.common.skipToContent}
      </a>
      <SiteHeader t={dictionary.nav} locale={locale} />
      {children}
      <SiteFooter t={dictionary.footer} nav={dictionary.nav} locale={locale} />
    </div>
  );
}
