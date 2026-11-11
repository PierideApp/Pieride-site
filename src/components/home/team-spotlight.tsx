import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/lib/routes";
import { withBasePath } from "@/lib/site-path";

export function TeamSpotlight({ t, locale }: { t: Dictionary["home"]["team"]; locale: Locale }) {
  return (
    <Reveal preserveTheme className="mx-auto my-8 grid max-w-7xl gap-6 rounded-4xl border border-pieride-violet-bright/50 bg-linear-to-br from-pieride-violet to-pieride-violet-bright p-6 shadow-2xl shadow-black/25 sm:my-12 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8 sm:p-10">
      <Image src={withBasePath("/brand/pieride-icon.png")!} alt="" width={96} height={96} className="size-16 rounded-3xl shadow-xl sm:size-24" />
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-pieride-cyan">{t.eyebrow}</p>
        <h2 className="mt-2 max-w-3xl font-display text-2xl font-extrabold tracking-tight text-balance sm:text-4xl">{t.title}</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{t.description}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={localizedPath(locale, "/equipe")} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-pieride-cyan px-5 font-bold text-pieride-ink transition hover:-translate-y-0.5 hover:bg-white">
            {t.link}<Icon name="arrow" className="size-5" />
          </Link>
          <a href="https://github.com/PierideApp/Pieride" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-white/45 bg-pieride-ink/30 px-5 font-bold text-white transition hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-pieride-ink">
            <Icon name="code" className="size-5" />{t.repoLink}<Icon name="external" className="size-4" />
          </a>
        </div>
      </div>
    </Reveal>
  );
}
