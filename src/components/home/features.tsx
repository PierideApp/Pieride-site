"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import type { Locale } from "@/i18n/config";
import { withBasePath } from "@/lib/site-path";

type FeatureCard = Dictionary["home"]["features"]["cards"][number];

export function Features({ t, locale }: { t: Dictionary["home"]["features"]; locale: Locale }) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="decouvrir" className="scroll-mt-24 px-5 pt-20 sm:px-8 sm:pt-28 lg:pt-32">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-pieride-cyan">{t.eyebrow}</p>
        <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">{t.title}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/65">{t.description}</p>
      </Reveal>

      <div className="mx-auto mt-9 grid max-w-7xl grid-cols-1 gap-5 sm:mt-12 md:grid-cols-2 lg:gap-7 xl:grid-cols-3">
        {t.cards.map((card, index) => (
          <FeatureCardView key={card.title} card={card} index={index} locale={locale} reduceMotion={Boolean(reduceMotion)} />
        ))}
      </div>

      <p className="mx-auto mt-5 max-w-7xl text-sm leading-relaxed text-white/50">{t.note}</p>
    </section>
  );
}

function FeatureCardView({ card, index, locale, reduceMotion }: { card: FeatureCard; index: number; locale: Locale; reduceMotion: boolean }) {
  return (
    <motion.article
      data-theme-surface
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -5 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="group overflow-hidden rounded-[1.5rem] border border-white/70 bg-white text-pieride-ink shadow-[0_18px_55px_-34px_rgba(0,0,0,0.8)] sm:rounded-[1.8rem]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#111326] sm:aspect-[16/9]">
        {card.image ? (
          <>
            <Image src={withBasePath(card.image)!} alt="" fill unoptimized sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" aria-hidden className="scale-110 object-cover opacity-35 blur-2xl" />
            <Image src={withBasePath(card.image)!} alt={card.alt} fill unoptimized sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-contain p-2 transition-transform duration-700 group-hover:scale-[1.025] sm:p-3" />
          </>
        ) : (
          <RepositoryPreview locale={locale} />
        )}
        <span className="absolute left-3 top-3 grid size-9 place-items-center rounded-xl border border-white/35 bg-pieride-ink/70 text-white shadow-lg backdrop-blur sm:left-4 sm:top-4 sm:size-10">
          <Icon name={card.icon} className="size-5" />
        </span>
      </div>
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-pieride-violet">Piéride · {String(index + 1).padStart(2, "0")}</p>
        <h3 className="mt-2 font-display text-xl font-extrabold leading-tight tracking-tight text-balance sm:text-2xl">{card.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-pieride-muted sm:text-base">{card.description}</p>
      </div>
    </motion.article>
  );
}
function RepositoryPreview({ locale, expanded = false }: { locale: Locale; expanded?: boolean }) {
  const filesLabel = locale === "fr" ? "Fichiers" : "Files";
  const contributeLabel = locale === "fr" ? "Contribuer" : "Contribute";
  return (
    <div aria-hidden className={`absolute inset-0 grid place-items-center overflow-hidden bg-[#17134c] ${expanded ? "p-5 sm:p-8" : "p-5 sm:p-6"}`}>
      <div className={`absolute rounded-full bg-pieride-violet-bright/60 blur-3xl ${expanded ? "-left-20 -top-24 size-96" : "-left-10 -top-16 size-52"}`} />
      <div className={`absolute rounded-full bg-pieride-cyan/25 blur-3xl ${expanded ? "-bottom-32 -right-16 size-[28rem]" : "-bottom-20 -right-8 size-56"}`} />
      <div className={`group relative w-full -rotate-1 overflow-hidden border border-white/20 bg-[#111326] text-white shadow-[0_25px_65px_-22px_rgba(0,0,0,0.8)] transition duration-500 group-hover:rotate-0 group-hover:scale-[1.015] ${expanded ? "max-w-5xl rounded-3xl sm:rounded-[2rem]" : "max-w-[430px] rounded-2xl group-hover:scale-[1.035]"}`}>
        <div className={`flex items-center gap-1.5 border-b border-white/10 bg-white/[0.045] ${expanded ? "h-12 px-5" : "h-9 px-3"}`}>
          <span className={`rounded-full bg-[#ff6a61] ${expanded ? "size-3" : "size-2"}`} /><span className={`rounded-full bg-pieride-yellow ${expanded ? "size-3" : "size-2"}`} /><span className={`rounded-full bg-[#39c66d] ${expanded ? "size-3" : "size-2"}`} />
          <span className={`ml-2 min-w-0 truncate rounded-md bg-white/[0.07] font-semibold text-white/65 ${expanded ? "px-3 py-1.5 text-xs" : "px-2 py-1 text-[9px]"}`}>github.com / PierideApp / Pieride</span>
        </div>
        <div className={`grid ${expanded ? "min-h-[270px] grid-cols-[82px_1fr] sm:min-h-[390px] sm:grid-cols-[200px_1fr]" : "min-h-40 grid-cols-[92px_1fr] sm:min-h-44 sm:grid-cols-[112px_1fr]"}`}>
          <div className={`border-r border-white/10 bg-black/10 ${expanded ? "p-2 sm:p-5" : "p-3"}`}>
            <p className={`font-bold uppercase tracking-[0.18em] text-white/40 ${expanded ? "mb-5 text-[10px]" : "mb-3 text-[8px]"}`}>{filesLabel}</p>
            <div className={`grid font-medium text-white/65 ${expanded ? "gap-3 text-xs" : "gap-2 text-[9px]"}`}>
              <span className="text-pieride-cyan">⌄ src</span><span className="pl-2">◈ app</span><span className="pl-2 text-pieride-lavender">◈ components</span><span>⌄ public</span><span className="text-white/40">＋ README.md</span>
            </div>
          </div>
          <div className={expanded ? "p-2.5 sm:p-7" : "p-3 sm:p-4"}>
            <div className="flex items-center justify-between gap-2">
              <p className={`truncate font-bold ${expanded ? "text-xs sm:text-xl" : "text-[10px] sm:text-xs"}`}>Piéride <span className="font-normal text-white/45">/ Pieride</span></p>
              <span className={`shrink-0 rounded-full border border-pieride-cyan/35 bg-pieride-cyan/10 font-semibold text-pieride-cyan ${expanded ? "px-3 py-1.5 text-[10px] sm:text-xs" : "px-2 py-1 text-[8px]"}`}>Open source</span>
            </div>
            <div className={`mt-3 grid grid-cols-3 ${expanded ? "gap-2 sm:mt-5 sm:gap-3" : "gap-1.5"}`}>
              <span className={`rounded-md border border-white/10 bg-white/[0.04] text-center text-white/65 ${expanded ? "px-2 py-2.5 text-[10px] sm:text-xs" : "px-2 py-1.5 text-[8px]"}`}>Code</span>
              <span className={`rounded-md border border-white/10 bg-white/[0.04] text-center text-white/65 ${expanded ? "px-2 py-2.5 text-[10px] sm:text-xs" : "px-2 py-1.5 text-[8px]"}`}>Issues</span>
              <span className={`rounded-md border border-white/10 bg-white/[0.04] text-center text-white/65 ${expanded ? "px-1 py-2.5 text-[9px] sm:px-2 sm:text-xs" : "px-2 py-1.5 text-[8px]"}`}>{contributeLabel}</span>
            </div>
            <div className={`grid rounded-lg border border-white/10 bg-black/15 ${expanded ? "mt-4 gap-3 p-4 sm:mt-5 sm:gap-4 sm:p-5" : "mt-3 gap-1.5 p-2.5"}`}>
              <span className={`rounded-full bg-pieride-lavender/75 ${expanded ? "h-2 w-4/5 sm:h-2.5" : "h-1.5 w-4/5"}`} />
              <span className={`rounded-full bg-white/20 ${expanded ? "h-2 w-3/5 sm:h-2.5" : "h-1.5 w-3/5"}`} />
              <span className={`rounded-full bg-pieride-cyan/75 ${expanded ? "h-2 w-2/3 sm:h-2.5" : "h-1.5 w-2/3"}`} />
              {expanded ? <span className="hidden h-2 w-1/2 rounded-full bg-pieride-lavender/45 sm:block" /> : null}
            </div>
          </div>
        </div>
      </div>
      {!expanded ? <span className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-xl border border-white/15 bg-white/10 text-white/80 shadow-lg backdrop-blur transition duration-300 group-hover:rotate-6 group-hover:scale-110"><Icon name="code" className="size-5" /></span> : null}
    </div>
  );
}
