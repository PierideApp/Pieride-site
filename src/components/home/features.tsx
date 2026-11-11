"use client";

import Image from "next/image";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import type { MotionValue } from "motion/react";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import type { Locale } from "@/i18n/config";
import { withBasePath } from "@/lib/site-path";

type FeatureCard = Dictionary["home"]["features"]["cards"][number];

export function Features({ t, locale }: { t: Dictionary["home"]["features"]; locale: Locale }) {
  const sequenceRef = useRef<HTMLDivElement>(null);
  const [accessibleScene, setAccessibleScene] = useState(-1);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sequenceRef, offset: ["start start", "end start"] });

  // Keep the opening overview on screen for a full scroll, then scrub each feature into view.
  const overviewOpacity = useTransform(scrollYProgress, [0, 0.11, 0.19, 0.24], [1, 1, 0.45, 0]);
  const overviewScale = useTransform(scrollYProgress, [0, 0.11, 0.24], [1, 1, 0.93]);
  const overviewY = useTransform(scrollYProgress, [0, 0.11, 0.24], [0, 0, -36]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const nextScene = progress < 0.14 ? -1 : progress < 0.43 ? 0 : progress < 0.72 ? 1 : 2;
    setAccessibleScene((current) => (current === nextScene ? current : nextScene));
  });

  const cards = t.cards;
  const goToProgress = (progress: number) => {
    const sequence = sequenceRef.current;
    if (!sequence) return;
    const distance = Math.max(sequence.offsetHeight - window.innerHeight, 0);
    const top = window.scrollY + sequence.getBoundingClientRect().top + distance * progress;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  };
  const goToFeature = (index: number) => goToProgress([0.28, 0.57, 0.86][index] ?? 0.86);

  return (
    <section id="decouvrir" className="scroll-mt-24 px-5 pt-20 sm:px-8 sm:pt-28 lg:pt-32">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-pieride-cyan">{t.eyebrow}</p>
        <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">{t.title}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/65">{t.description}</p>
      </Reveal>

      <div className="mx-auto mt-9 grid max-w-2xl gap-5 sm:mt-12 lg:hidden">
        {cards.map((card, index) => (
          <MobileFeatureCard key={card.title} card={card} index={index} locale={locale} reduceMotion={Boolean(reduceMotion)} />
        ))}
      </div>

      <div ref={sequenceRef} className="relative -mx-5 mt-9 hidden h-[650vh] lg:-mx-8 lg:mt-12 lg:block">
        <div className="sticky top-0 isolate h-dvh min-h-0 overflow-hidden bg-pieride-night sm:min-h-[580px]">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-radial from-pieride-violet/45 via-pieride-night/40 to-pieride-night" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28 bg-linear-to-t from-pieride-night/70 to-transparent" />

          <motion.div
            aria-hidden={accessibleScene !== -1}
            style={{ opacity: overviewOpacity, scale: reduceMotion ? 1 : overviewScale, y: reduceMotion ? 0 : overviewY }}
            className={`absolute inset-0 z-10 grid items-center ${accessibleScene === -1 ? "" : "pointer-events-none"}`}
          >
            <div className="mx-auto grid w-full max-w-7xl grid-cols-3 gap-2 px-3 sm:gap-5 sm:px-8 lg:gap-7">
              {cards.map((card, index) => <OverviewCard key={card.title} card={card} index={index} locale={locale} reduceMotion={Boolean(reduceMotion)} onSelect={() => goToFeature(index)} />)}
            </div>
          </motion.div>

          {cards.map((card, index) => (
            <FeatureSlide key={card.title} card={card} index={index} cards={cards} locale={locale} progress={scrollYProgress} isAccessible={accessibleScene === index} reduceMotion={Boolean(reduceMotion)} onSelect={goToFeature} />
          ))}

        </div>
      </div>
      <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/50 lg:mt-4 lg:max-w-7xl lg:pb-10">{t.note}</p>
    </section>
  );
}

function MobileFeatureCard({ card, index, locale, reduceMotion }: { card: FeatureCard; index: number; locale: Locale; reduceMotion: boolean }) {
  return (
    <motion.article
      data-theme-surface
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.55, delay: index * 0.07 }}
      className="group overflow-hidden rounded-[1.5rem] border border-white/70 bg-white text-pieride-ink shadow-[0_18px_55px_-34px_rgba(0,0,0,0.8)] sm:rounded-[1.8rem]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#111326] sm:aspect-[16/9]">
        {card.image ? (
          <>
            <Image src={withBasePath(card.image)!} alt="" fill unoptimized sizes="(min-width: 640px) 640px, 100vw" aria-hidden className="scale-110 object-cover opacity-35 blur-2xl" />
            <Image src={withBasePath(card.image)!} alt={card.alt} fill unoptimized sizes="(min-width: 640px) 640px, 100vw" className="object-contain p-2 transition-transform duration-700 group-hover:scale-[1.025] sm:p-3" />
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

function FeatureSlide({ card, index, cards, locale, progress, isAccessible, reduceMotion, onSelect }: { card: FeatureCard; index: number; cards: readonly FeatureCard[]; locale: Locale; progress: MotionValue<number>; isAccessible: boolean; reduceMotion: boolean; onSelect: (index: number) => void }) {
  const start = [0.14, 0.43, 0.72][index] ?? 0.14;
  const end = [0.23, 0.52, 0.81][index] ?? 0.23;
  const exitStart = [0.43, 0.72, 1][index] ?? 1;
  const exitEnd = [0.51, 0.8, 1][index] ?? 1;
  const input = index === 2 ? [start, end, exitStart] : [start, end, exitStart, exitEnd];
  const opacityOutput = index === 2 ? [0, 1, 1] : [0, 1, 1, 0];
  const opacity = useTransform(progress, input, opacityOutput);
  const scale = useTransform(progress, input, index === 0 ? [0.56, 1, 1, 0.97] : index === 2 ? [0.97, 1, 1] : [0.97, 1, 1, 0.97]);
  const x = useTransform(progress, input, index === 0 ? ["0%", "0%", "0%", "-100%"] : index === 1 ? ["100%", "0%", "0%", "-100%"] : ["100%", "0%", "0%"]);
  const y = useTransform(progress, input, index === 0 ? [34, 0, 0, 0] : index === 2 ? [0, 0, 0] : [0, 0, 0, 0]);
  const imageScale = useTransform(progress, input, index === 2 ? [1.12, 1, 1] : [1.14, 1, 1, 1.07]);
  const imageX = useTransform(progress, input, index === 2 ? [42, 0, -18] : [42, 0, -10, -44]);
  const copyY = useTransform(progress, input, index === 2 ? [32, 0, 0] : [32, 0, 0, -12]);
  const copyOpacity = useTransform(progress, input, index === 2 ? [0, 1, 1] : [0, 1, 1, 0]);

  return (
    <motion.article aria-hidden={!isAccessible} style={{ opacity, scale: reduceMotion ? 1 : scale, x: reduceMotion ? 0 : x, y: reduceMotion ? 0 : y }} className="pointer-events-none absolute inset-0 z-20 mx-auto flex h-full w-full max-w-[1480px] flex-col px-5 pb-8 pt-14 sm:px-8 sm:pb-10 sm:pt-16">
      <nav aria-label={locale === "fr" ? "Parcourir les fonctionnalités" : "Browse features"} className="pointer-events-auto mx-auto flex items-center gap-3 sm:gap-5">
        {cards.map((item, itemIndex) => (
          <button type="button" key={item.title} onClick={() => onSelect(itemIndex)} aria-label={`${locale === "fr" ? "Voir" : "View"} : ${item.title}`} aria-current={itemIndex === index ? "step" : undefined} className={`grid size-11 place-items-center rounded-2xl border transition duration-300 hover:-translate-y-1 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pieride-cyan sm:size-14 sm:rounded-[1.15rem] ${itemIndex === index ? "scale-110 border-pieride-cyan bg-pieride-cyan text-pieride-ink shadow-lg shadow-pieride-cyan/20" : "border-white/15 bg-white/[0.07] text-white/55 hover:border-pieride-cyan/70 hover:text-white"}`}>
            <Icon name={item.icon} className="size-5 sm:size-6" />
          </button>
        ))}
      </nav>

      <div className="relative mx-auto mt-5 flex min-h-0 w-full max-w-6xl flex-1 items-center justify-center overflow-hidden rounded-[1.7rem] border border-white/15 bg-[#111326] shadow-[0_35px_100px_-35px_rgba(0,0,0,0.85)] sm:mt-6 sm:rounded-[2rem]">
        <motion.div aria-hidden={card.image ? undefined : true} style={{ scale: reduceMotion ? 1 : imageScale, x: reduceMotion ? 0 : imageX }} className="absolute inset-0 grid place-items-center">
          {card.image ? (
            <Image src={withBasePath(card.image)!} alt={card.alt} fill unoptimized sizes="(min-width: 1280px) 80vw, 96vw" className="object-contain" />
          ) : (
            <RepositoryPreview locale={locale} expanded />
          )}
        </motion.div>
        {card.image ? <Image src={withBasePath(card.image)!} alt={card.alt} fill unoptimized sizes="(min-width: 1280px) 80vw, 96vw" className="pointer-events-none object-cover opacity-[0.16] blur-2xl" aria-hidden /> : null}
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#111326]/35 to-transparent" />
      </div>

      <motion.div style={{ opacity: copyOpacity, y: reduceMotion ? 0 : copyY }} className="mx-auto w-full max-w-5xl shrink-0 pb-1 pt-4 text-center sm:pt-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-pieride-cyan">{String(index + 1).padStart(2, "0")} · {card.title}</p>
        <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-white text-balance sm:text-4xl">{card.title}</h3>
        <p className="mx-auto mt-2 max-w-3xl text-sm leading-relaxed text-white/65 sm:mt-3 sm:text-lg">{card.description}</p>
      </motion.div>
    </motion.article>
  );
}

function OverviewCard({ card, index, locale, reduceMotion, onSelect }: { card: FeatureCard; index: number; locale: Locale; reduceMotion: boolean; onSelect: () => void }) {
  return (
    <motion.button type="button" onClick={onSelect} aria-label={`${locale === "fr" ? "Découvrir" : "Explore"} : ${card.title}`} whileHover={reduceMotion ? undefined : { y: -8, scale: 1.025 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }} data-theme-surface className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-white/80 bg-white text-left text-pieride-ink shadow-[0_24px_65px_-35px_rgba(0,0,0,0.75)] transition duration-500 hover:border-pieride-cyan hover:shadow-[0_32px_70px_-32px_rgba(0,0,0,0.8)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pieride-cyan sm:rounded-[1.8rem] sm:border-2">
      <div className="relative grid h-24 place-items-center overflow-hidden bg-linear-to-br from-pieride-cyan to-cyan-500 sm:h-52 md:h-64">
        {card.image ? (
          <Image src={withBasePath(card.image)!} alt={card.alt} fill unoptimized sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.06]" />
        ) : (
          <>
            <div aria-hidden className="absolute inset-0 bg-linear-to-br from-pieride-violet to-pieride-ink sm:hidden" />
            <Icon name={card.icon} className="relative size-9 text-white sm:hidden" />
            <div className="absolute inset-0 hidden sm:block"><RepositoryPreview locale={locale} /></div>
          </>
        )}
        {card.image ? <span className="absolute bottom-3 right-3 hidden items-center gap-2 rounded-full bg-pieride-ink px-3.5 py-2 text-xs font-bold text-white shadow-lg sm:inline-flex"><Icon name={card.icon} className="size-4" />Piéride</span> : null}
        <span className="absolute left-2 top-2 grid size-7 place-items-center rounded-lg border border-white/40 bg-pieride-ink/60 text-white shadow-md backdrop-blur-sm transition duration-300 group-hover:scale-110 group-hover:bg-pieride-cyan group-hover:text-pieride-ink sm:left-4 sm:top-4 sm:size-9 sm:rounded-xl">
          <Icon name={card.icon} className="size-5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col px-2.5 py-2.5 sm:px-6 sm:py-6">
        <p className="hidden text-[11px] font-bold uppercase tracking-widest text-pieride-violet sm:block">Piéride · {String(index + 1).padStart(2, "0")}</p>
        <h3 className="text-[11px] font-bold leading-tight tracking-tight text-balance sm:mt-2 sm:text-xl md:text-2xl">{card.title}</h3>
        <p className="mt-2 hidden text-sm leading-relaxed text-pieride-muted sm:block md:text-base">{card.description}</p>
      </div>
    </motion.button>
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
