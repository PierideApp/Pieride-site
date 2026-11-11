import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import { withBasePath } from "@/lib/site-path";

export function Product({ t }: { t: Dictionary["home"]["product"] }) {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-20 lg:py-28">
      <Reveal>
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
      <Reveal delay={0.12} className="relative">
        <div aria-hidden className="absolute -inset-5 -z-10 rounded-4xl bg-radial from-pieride-violet/50 to-transparent" />
        <figure className="overflow-hidden rounded-4xl border-8 border-white bg-white shadow-2xl shadow-black/30">
          <div className="flex h-11 items-center gap-2 border-b border-black/10 px-4 text-xs font-semibold text-pieride-muted">
            <span className="size-2.5 rounded-full bg-pieride-cyan" /><span className="size-2.5 rounded-full bg-pieride-yellow" /><span className="size-2.5 rounded-full bg-pieride-violet" /><span className="ml-3">Piéride · Accueil</span>
          </div>
          <Image src={withBasePath("/visuels/accueil.jpg")!} alt={t.imageAlt} width={1440} height={980} unoptimized sizes="(min-width: 1024px) 50vw, 100vw" className="block h-auto w-full" />
          <figcaption className="px-4 py-3 text-sm text-pieride-muted">{t.imageNote}</figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
