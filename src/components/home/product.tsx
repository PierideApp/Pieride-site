import { Icon } from "@/components/ui/icon";
import { DesktopMonitor } from "@/components/home/desktop-monitor";
import { Reveal } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/dictionaries/fr";

export function Product({ t }: { t: Dictionary["home"]["product"] }) {
  return (
    <section className="mx-auto grid max-w-screen-2xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[minmax(340px,0.82fr)_minmax(0,1.18fr)] lg:gap-14 lg:py-28 xl:gap-20">
      <Reveal className="relative z-10">
        <p className="text-sm font-bold uppercase tracking-widest text-pieride-cyan">{t.eyebrow}</p>
        <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-5xl">{t.title}<br /><span className="text-pieride-lavender">{t.titleAccent}</span></h2>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/65">{t.description}</p>
        <ul className="mt-8 grid gap-4">
          {t.points.map((point) => (
            <li key={point.title} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-pieride-cyan/40 hover:bg-white/10">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-pieride-cyan text-pieride-ink"><Icon name={point.icon} className="size-6" /></span>
              <span className="grid gap-0.5"><strong className="text-lg">{point.title}</strong><small className="text-base text-white/55">{point.description}</small></span>
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.12} className="relative isolate lg:-mr-6 xl:-mr-10">
        <div aria-hidden className="absolute -inset-8 -z-10 rounded-[3rem] bg-radial from-pieride-violet/55 via-pieride-violet/15 to-transparent blur-xl" />
        <DesktopMonitor src="/visuels/accueil.jpg" alt={t.imageAlt} caption={t.imageNote} sizes="(min-width: 1536px) 58vw, (min-width: 1024px) 60vw, 100vw" />
      </Reveal>
    </section>
  );
}
