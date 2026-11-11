"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/lib/routes";
import { withBasePath } from "@/lib/site-path";

export default function NotFound() {
  const pathname = usePathname() || "/fr";
  const locale: Locale = pathname.startsWith("/en") ? "en" : "fr";
  const english = locale === "en";

  return (
    <main className="not-found relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 py-8 text-center sm:px-8">
      <Image src={withBasePath("/brand/motif.svg")!} alt="" fill priority unoptimized sizes="100vw" className="pointer-events-none absolute inset-0 -z-10 object-cover opacity-35" />
      <div aria-hidden className="not-found-glow pointer-events-none absolute inset-0 -z-10" />

      <header className="absolute inset-x-5 top-5 mx-auto flex max-w-6xl items-center justify-between rounded-full border border-pieride-line/70 bg-white/95 p-2 pl-3 shadow-xl shadow-pieride-ink/10 backdrop-blur-xl sm:inset-x-8 sm:top-7 sm:pl-4">
        <Link href={localizedPath(locale)} className="flex items-center gap-2.5 rounded-full pr-2 transition hover:opacity-75">
          <Image src={withBasePath("/brand/pieride-icon.png")!} alt="" width={40} height={40} className="size-9 rounded-full sm:size-10" />
          <span className="font-display text-base font-extrabold tracking-tight text-pieride-ink sm:text-lg">Piéride</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <nav aria-label={english ? "Language" : "Langue"} className="flex items-center gap-2 text-xs font-bold">
            <Link href={localizedPath("fr")} lang="fr" aria-current={!english ? "page" : undefined} className={!english ? "text-pieride-violet" : "text-pieride-muted transition hover:text-pieride-ink"}>FR</Link>
            <span aria-hidden className="text-pieride-line">/</span>
            <Link href={localizedPath("en")} lang="en" aria-current={english ? "page" : undefined} className={english ? "text-pieride-violet" : "text-pieride-muted transition hover:text-pieride-ink"}>EN</Link>
          </nav>
          <ThemeToggle toLight={english ? "Switch to light mode" : "Activer le mode clair"} toDark={english ? "Switch to dark mode" : "Activer le mode sombre"} />
        </div>
      </header>

      <section className="not-found-card relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] border border-pieride-line/80 bg-white px-6 py-12 shadow-2xl shadow-pieride-ink/15 sm:px-14 sm:py-16">
        <Icon name="butterfly" className="not-found-butterfly pointer-events-none absolute -right-7 -top-10 size-36 rotate-12 text-pieride-violet/10 sm:-right-4 sm:-top-14 sm:size-52" />
        <p className="relative text-xs font-extrabold uppercase tracking-[0.22em] text-pieride-violet">{english ? "Lost in the garden" : "Perdu dans le jardin"}</p>
        <p aria-hidden className="not-found-number relative mt-5 font-display text-[clamp(6rem,24vw,13rem)] font-black leading-[0.82] tracking-[-0.1em] text-pieride-violet">404</p>
        <div className="relative mx-auto mt-7 max-w-xl">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-pieride-ink text-balance sm:text-4xl">{english ? "This page flew away." : "Cette page s’est envolée."}</h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-pieride-muted sm:text-lg">{english ? "The link may be old, or the page may have moved. Let’s get you back to the Piéride site." : "Le lien est peut-être ancien ou la page a changé d’adresse. Retrouvons ensemble le site Piéride."}</p>
        </div>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Link href={localizedPath(locale)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-pieride-violet px-6 font-bold text-white shadow-lg shadow-pieride-violet/20 transition duration-200 hover:-translate-y-0.5 hover:bg-pieride-violet-bright hover:shadow-xl active:translate-y-0 active:scale-95">
            <Icon name="home" className="size-5" />{english ? "Back to home" : "Retour à l’accueil"}
          </Link>
          <Link href={localizedPath(locale, "/blog")} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-pieride-line bg-pieride-surface px-6 font-bold text-pieride-ink transition duration-200 hover:-translate-y-0.5 hover:border-pieride-violet/50 hover:bg-pieride-soft active:translate-y-0 active:scale-95">
            {english ? "Read the articles" : "Lire les articles"}<Icon name="arrow" className="size-5" />
          </Link>
        </div>
      </section>
      <p className="mt-6 text-xs font-medium text-pieride-muted">{english ? "A little detour on your school journey." : "Un petit détour sur ton parcours scolaire."}</p>
    </main>
  );
}
