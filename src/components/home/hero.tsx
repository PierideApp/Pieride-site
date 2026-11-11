"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/ui/icon";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/lib/routes";
import { withBasePath } from "@/lib/site-path";
import { easeOutPapillon } from "@/lib/motion";

export function HomeHero({ t, locale }: { t: Dictionary["home"]["hero"]; locale: Locale }) {
  const reduceMotion = useReducedMotion();
  const reveal = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: easeOutPapillon },
  });

  return (
    <section data-dark-hero data-theme-preserve className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-linear-to-br from-pieride-violet-bright via-pieride-violet to-pieride-night px-6 pb-14 pt-32 text-center sm:pt-36">
      <motion.div aria-hidden initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease: easeOutPapillon }} className="absolute inset-0 -z-10">
        <Image src={withBasePath("/brand/motif.svg")!} alt="" fill priority unoptimized sizes="100vw" className="object-cover object-center opacity-95" />
        <div className="absolute inset-0 bg-radial from-pieride-violet-bright/55 via-transparent to-pieride-night/45" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-pieride-night to-transparent" />
      </motion.div>

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
        <motion.div {...reveal(0.16)} className="mb-6 flex items-center gap-4 sm:mb-8">
          <Image src={withBasePath("/brand/pieride-icon.png")!} alt={t.logoAlt} width={90} height={90} className="size-16 rounded-3xl shadow-2xl shadow-black/25 sm:size-20 lg:size-24" priority />
          <span className="font-display text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">Piéride</span>
        </motion.div>
        <motion.p {...reveal(0.3)} className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-pieride-cyan sm:text-base">
          <Icon name="butterfly" className="size-5" />{t.label}
        </motion.p>
        <motion.h1 {...reveal(0.42)} className="flex flex-col font-sans text-5xl font-medium leading-tight tracking-tight text-balance sm:text-6xl lg:text-8xl">
          <span>{t.title}</span>
          <span className="mt-1 text-pieride-lavender">{t.titleAccent}</span>
        </motion.h1>
        <motion.p {...reveal(0.54)} className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 text-pretty sm:text-xl">{t.description}</motion.p>
        <motion.div {...reveal(0.66)} className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#decouvrir" className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-pieride-cyan bg-pieride-cyan px-6 text-base font-bold text-pieride-ink shadow-lg shadow-black/20 transition duration-200 hover:-translate-y-1 hover:border-white hover:bg-white hover:text-pieride-ink hover:shadow-xl active:translate-y-0 active:scale-95">
            {t.primaryAction}<Icon name="arrow" className="size-5" />
          </a>
          <Link href={localizedPath(locale, "/telecharger")} className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-white/60 bg-pieride-ink/60 px-6 text-base font-bold text-white shadow-lg shadow-black/20 backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-white hover:bg-white hover:text-pieride-ink hover:shadow-xl active:translate-y-0 active:scale-95">
            {t.secondaryAction}<Icon name="download" className="size-5" />
          </Link>
        </motion.div>
        <motion.p {...reveal(0.78)} className="mt-7 flex items-center gap-2 text-sm text-white/60">
          <span className="size-2 rounded-full bg-pieride-cyan shadow-md" />{t.status}
        </motion.p>
        <motion.a {...reveal(0.9)} href="#decouvrir" aria-label={t.scrollLabel} className="mt-9 grid size-10 place-items-center rounded-full border border-white/35 text-white/75 transition hover:border-white hover:text-white">
          <Icon name="chevron" className="size-5 rotate-90" />
        </motion.a>
      </div>
    </section>
  );
}
