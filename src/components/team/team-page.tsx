import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/lib/routes";
import { Contributors } from "./contributors";
import { TeamHero } from "./hero";

export function TeamPage({ t, locale }: { t: Dictionary["team"]; locale: Locale }) {
  return (
    <main id="contenu" className="overflow-x-clip">
      <TeamHero t={t} locale={locale} />
      <section id="histoire" className="mx-auto grid max-w-6xl gap-6 border-b border-white/10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-16">
        <Reveal><p className="text-sm font-bold uppercase tracking-widest text-pieride-cyan">{t.originEyebrow}</p><h2 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-4xl">{t.originTitle}</h2></Reveal>
        <Reveal delay={0.08}><p className="text-lg leading-relaxed text-white/65">{t.originDescription}</p></Reveal>
      </section>
      <section id="contributeurs" className="px-5 py-16 sm:px-8 sm:py-24">
        <Reveal className="mx-auto mb-10 max-w-3xl text-center"><p className="text-sm font-bold uppercase tracking-widest text-pieride-cyan">{t.membersEyebrow}</p><h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">{t.membersTitle}</h2><p className="mt-5 text-lg leading-relaxed text-white/60">{t.membersDescription}</p></Reveal>
        <Contributors t={t} />
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-5 pb-16 sm:grid-cols-3 sm:px-8 sm:pb-24">
        {t.values.map((value, index) => <Reveal key={value.title} delay={index * 0.07} className="h-full"><article data-theme-surface className="h-full rounded-3xl border border-pieride-line bg-white p-6 text-pieride-ink shadow-xl shadow-black/10"><span className="grid size-12 place-items-center rounded-2xl bg-pieride-violet/10 text-pieride-violet"><Icon name={value.icon} className="size-6" /></span><h3 className="mt-5 text-xl font-bold">{value.title}</h3><p className="mt-2 text-base leading-relaxed text-pieride-muted">{value.description}</p></article></Reveal>)}
      </section>
      <section data-theme-preserve className="mx-auto mb-16 flex max-w-7xl flex-col items-start justify-between gap-6 rounded-4xl border border-pieride-violet-bright/50 bg-linear-to-br from-pieride-violet to-pieride-violet-bright p-7 sm:mb-24 sm:flex-row sm:items-center sm:p-10">
        <div><p className="text-sm font-bold uppercase tracking-widest text-pieride-cyan">{t.joinEyebrow}</p><h2 className="mt-3 max-w-2xl font-display text-2xl font-extrabold tracking-tight sm:text-4xl">{t.joinTitle}</h2></div>
        <Link href={localizedPath(locale, "/contribuer")} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-pieride-cyan px-5 font-bold text-pieride-ink transition hover:bg-white">{t.joinLink}<Icon name="arrow" className="size-5" /></Link>
      </section>
    </main>
  );
}
