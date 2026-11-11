import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import { localizedPath } from "@/lib/routes";
import { Icon } from "@/components/ui/icon";

const repository = "https://github.com/PierideApp/Pieride";
export function SiteFooter({ t, nav, locale }: { t: Dictionary["footer"]; nav: Dictionary["nav"]; locale: Locale }) {
  const links = [
    [localizedPath(locale, "/equipe"), t.team],
    [localizedPath(locale, "/telecharger"), t.downloads],
    [localizedPath(locale, "/blog"), t.blog],
    [localizedPath(locale, "/contribuer"), t.contribute],
  ];

  return (
    <footer data-theme-preserve className="relative isolate mt-24 overflow-hidden bg-pieride-ink px-6 pb-8 pt-16 text-white sm:pt-20">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-radial from-pieride-violet/30 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">
        <div className="flex flex-col items-start gap-5">
          <Link href={localizedPath(locale)} className="flex items-center gap-3">
            <Icon name="butterfly" className="size-8 text-pieride-cyan" />
            <span className="font-display text-2xl font-extrabold tracking-tight">Piéride</span>
          </Link>
          <p className="max-w-sm text-base leading-relaxed text-white/65">{t.description}</p>
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/75">{t.copyright}</span>
        </div>
        <nav aria-label={nav.label} className="grid content-start gap-4 sm:grid-cols-2">
          {links.map(([href, label]) => <Link key={href} href={href} className="text-base text-white/70 transition-colors hover:text-white">{label}</Link>)}
        </nav>
        <div className="flex flex-col items-start gap-4">
          <p className="text-lg font-semibold">{t.tagline}</p>
          <a href={repository} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/50 hover:bg-white/10 hover:text-white">
            {t.github}<Icon name="external" className="size-4" />
          </a>
        </div>
      </div>
      <p className="mx-auto max-w-7xl pt-6 text-sm text-white/40">{t.tagline}</p>
    </footer>
  );
}
