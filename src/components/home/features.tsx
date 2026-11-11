import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import { withBasePath } from "@/lib/site-path";

export function Features({ t }: { t: Dictionary["home"]["features"] }) {
  return (
    <section id="decouvrir" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-pieride-cyan">{t.eyebrow}</p>
        <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">{t.title}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/65">{t.description}</p>
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-7xl gap-5 md:grid-cols-3 lg:mt-16 lg:gap-7">
        {t.cards.map((card, index) => (
          <Reveal key={card.title} delay={index * 0.08} className="h-full">
            <article data-theme-surface className="group flex h-full flex-col overflow-hidden rounded-4xl border-4 border-white bg-white text-pieride-ink shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-2 hover:shadow-black/35">
              <div className="relative grid min-h-52 place-items-center overflow-hidden bg-linear-to-br from-pieride-cyan to-cyan-500 sm:min-h-60">
                {card.image ? (
                  <Image src={withBasePath(card.image)!} alt={card.alt} fill unoptimized sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <Icon name={card.icon} className="size-20 text-pieride-ink transition duration-300 group-hover:scale-110" />
                )}
                <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-pieride-ink px-4 py-2 text-sm font-bold text-white shadow-lg">
                  <Icon name={card.icon} className="size-4" />Piéride
                </span>
              </div>
              <div className="flex flex-1 flex-col px-6 py-6 sm:px-7 sm:py-7">
                <p className="text-xs font-bold uppercase tracking-widest text-pieride-violet">Piéride · {card.title}</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight">{card.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-pieride-muted">{card.description}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <p className="mx-auto mt-5 max-w-7xl text-sm text-white/45">{t.note}</p>
    </section>
  );
}
