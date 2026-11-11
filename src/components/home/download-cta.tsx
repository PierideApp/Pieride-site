import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/lib/routes";

export function DownloadCta({ t, locale }: { t: Dictionary["home"]["download"]; locale: Locale }) {
  return (
    <Reveal surface className="mx-auto my-12 flex max-w-7xl flex-col items-start justify-between gap-6 rounded-4xl bg-white p-7 text-pieride-ink shadow-2xl shadow-black/25 sm:my-20 sm:flex-row sm:items-center sm:p-10">
      <div><p className="text-sm font-bold uppercase tracking-widest text-pieride-violet">{t.eyebrow}</p><h2 className="mt-3 max-w-3xl font-display text-2xl font-extrabold tracking-tight text-balance sm:text-4xl">{t.title}</h2><p className="mt-3 max-w-2xl text-base leading-relaxed text-pieride-muted">{t.description}</p></div>
      <Link href={localizedPath(locale, "/telecharger")} className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-pieride-violet px-6 font-bold text-white transition hover:-translate-y-0.5 hover:bg-pieride-ink">
        {t.link}<Icon name="arrow" className="size-5" />
      </Link>
    </Reveal>
  );
}
