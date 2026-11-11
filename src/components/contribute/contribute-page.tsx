import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import type { Locale } from "@/i18n/config";
import { documentationHref, localizedPath } from "@/lib/routes";
import { withBasePath } from "@/lib/site-path";

const repository = "https://github.com/PierideApp/Pieride";

export function ContributePage({ t, locale }: { t: Dictionary["contribute"]; locale: Locale }) {
  return (
    <main id="contenu" className="overflow-x-clip pb-20">
      <section data-dark-hero data-theme-preserve className="relative isolate flex min-h-[34rem] flex-col items-center justify-center overflow-hidden bg-radial from-pieride-violet-bright via-pieride-violet to-pieride-night px-5 pb-16 pt-36 text-center sm:px-8">
        <div aria-hidden className="absolute inset-0 -z-10"><Image src={withBasePath("/brand/motif.svg")!} alt="" fill unoptimized sizes="100vw" className="object-cover opacity-25" /><div className="absolute inset-0 bg-linear-to-b from-transparent to-pieride-night" /></div>
        <Reveal className="max-w-4xl"><p className="text-sm font-bold uppercase tracking-widest text-pieride-cyan">{t.eyebrow}</p><h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-balance sm:text-6xl">{t.title}</h1><p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/70">{t.description}</p><div className="mt-8 flex flex-wrap justify-center gap-3"><a href={`${repository}/issues`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-pieride-cyan px-5 font-bold text-pieride-ink transition hover:bg-white">{t.issues}<Icon name="external" className="size-4" /></a><a href={documentationHref("/develop/contribuer")} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/35 px-5 font-semibold text-white transition hover:bg-white/10">{t.guide}<Icon name="external" className="size-4" /></a></div></Reveal>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal className="mb-9 text-center"><p className="text-sm font-bold uppercase tracking-widest text-pieride-cyan">{t.stepsEyebrow}</p><h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{t.stepsTitle}</h2></Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{t.steps.map((step, index) => <Reveal key={step.title} delay={index * 0.06} className="h-full"><article className="h-full rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-pieride-cyan/40 hover:bg-white/10"><span className="grid size-11 place-items-center rounded-full bg-pieride-cyan text-lg font-bold text-pieride-ink">0{index + 1}</span><h3 className="mt-5 text-xl font-bold">{step.title}</h3><p className="mt-3 text-base leading-relaxed text-white/60">{step.description}</p></article></Reveal>)}</div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-24">
        <Reveal className="mb-8"><p className="text-sm font-bold uppercase tracking-widest text-pieride-cyan">{t.guidesEyebrow}</p><h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{t.guidesTitle}</h2></Reveal>
        <div className="grid gap-4 lg:grid-cols-3">{t.guides.map((guide, index) => <Reveal key={guide.title} delay={index * 0.06} className="h-full"><a data-theme-surface href={documentationHref(guide.href)} target="_blank" rel="noreferrer" className="group flex h-full items-start gap-4 rounded-3xl border border-pieride-line bg-white p-6 text-pieride-ink shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:shadow-black/20"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-pieride-violet/10 text-pieride-violet"><Icon name={guide.icon} className="size-6" /></span><span className="grid gap-2"><strong className="text-lg">{guide.title}</strong><span className="text-base leading-relaxed text-pieride-muted">{guide.description}</span></span><Icon name="external" className="ml-auto size-5 shrink-0 text-pieride-violet transition group-hover:translate-x-1" /></a></Reveal>)}</div>
      </section>
      <Reveal preserveTheme className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 rounded-4xl border border-pieride-violet-bright/50 bg-linear-to-br from-pieride-violet to-pieride-violet-bright p-7 sm:flex-row sm:items-center sm:p-10"><div><p className="text-sm font-bold uppercase tracking-widest text-pieride-cyan">{t.readyEyebrow}</p><h2 className="mt-3 font-display text-3xl font-extrabold">{t.readyTitle}</h2></div><a href={repository} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-pieride-cyan px-5 font-bold text-pieride-ink transition hover:bg-white">{t.readyAction}<Icon name="external" className="size-4" /></a></Reveal>
    </main>
  );
}
