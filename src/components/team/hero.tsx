"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/ui/icon";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/lib/routes";
import { easeOutPapillon } from "@/lib/motion";
import { GridMotion } from "./grid-motion";

export function TeamHero({ t, locale }: { t: Dictionary["team"]; locale: Locale }) {
  const reduceMotion = useReducedMotion();
  const reveal = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: easeOutPapillon },
  });

  return (
    <section data-dark-section data-theme-preserve data-photo-hero className="theme-dark relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-pieride-night px-5 pb-20 pt-36 text-center sm:px-8">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden"><GridMotion /><div className="absolute inset-0 bg-radial from-pieride-night/70 via-pieride-night/70 to-pieride-night/90" /><div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-pieride-night to-transparent" /></div>
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-5">
        <motion.p {...reveal(0.2)} className="flex items-center gap-2 text-xl font-bold text-pieride-cyan sm:text-2xl"><Icon name="butterfly" className="size-7" />{t.eyebrow}</motion.p>
        <motion.h1 {...reveal(0.32)} className="font-sans text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl">{t.title}</motion.h1>
        <motion.p {...reveal(0.44)} className="max-w-3xl text-lg leading-relaxed text-white/70 text-pretty sm:text-xl">{t.description}</motion.p>
        <motion.div {...reveal(0.56)} className="mt-3 flex flex-wrap justify-center gap-3">
          <a href="#contributeurs" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-pieride-cyan px-5 font-bold text-pieride-ink transition hover:-translate-y-0.5 hover:bg-white active:scale-95"><Icon name="user" className="size-5" />{t.discover}</a>
          <a href="#histoire" className="inline-flex min-h-11 items-center rounded-full border border-white/35 px-5 font-semibold text-white/75 transition hover:border-white/70 hover:text-white">{t.story}</a>
          <Link href={localizedPath(locale, "/contribuer")} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/35 px-5 font-semibold text-white/75 transition hover:border-white/70 hover:text-white">{t.joinLink}<Icon name="arrow" className="size-4" /></Link>
        </motion.div>
      </div>
    </section>
  );
}
