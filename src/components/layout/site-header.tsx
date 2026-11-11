"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import { documentationHref, localeSwitchPath, localizedPath } from "@/lib/routes";
import { withBasePath } from "@/lib/site-path";
import { Icon } from "@/components/ui/icon";
import { easeOutPapillon } from "@/lib/motion";
import { ThemeToggle } from "./theme-toggle";

function LanguageSwitch({ locale, pathname, label, className = "", onSelect }: { locale: Locale; pathname: string; label: string; className?: string; onSelect?: () => void }) {
  return (
    <div role="group" aria-label={label} className={`inline-flex shrink-0 items-center rounded-full border border-pieride-line bg-pieride-soft p-1 text-xs font-bold ${className}`}>
      {(["fr", "en"] as const).map((target) => (
        <span key={target}>
          {target === locale
            ? <span aria-current="page" className="inline-flex min-w-9 justify-center rounded-full bg-pieride-violet px-2.5 py-1.5 text-white">{target.toUpperCase()}</span>
            : <Link href={localeSwitchPath(target, pathname)} lang={target} onClick={onSelect} className="inline-flex min-w-9 justify-center rounded-full px-2.5 py-1.5 text-pieride-muted transition hover:bg-white hover:text-pieride-ink">{target.toUpperCase()}</Link>}
        </span>
      ))}
    </div>
  );
}

export function SiteHeader({ t, locale }: { t: Dictionary["nav"]; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname() || localizedPath(locale);
  const links = [
    { href: localizedPath(locale), label: t.home },
    { href: localizedPath(locale, "/equipe"), label: t.team },
    { href: localizedPath(locale, "/blog"), label: t.blog },
    { href: localizedPath(locale, "/contribuer"), label: t.contribute },
  ];
  const themeToggle = <ThemeToggle toLight={t.themeToLight} toDark={t.themeToDark} />;

  return (
    <header className="absolute inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 sm:pt-5">
      <div data-theme-surface className="relative mx-auto flex max-w-7xl items-center gap-3 rounded-full bg-white/96 p-2 text-pieride-ink shadow-xl shadow-black/15 backdrop-blur-xl sm:gap-5 sm:px-3">
        <Link href={localizedPath(locale)} className="flex shrink-0 items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-opacity hover:opacity-75">
          <Image src={withBasePath("/brand/pieride-icon.png")!} alt="" width={42} height={42} className="size-10 rounded-full object-cover sm:size-11" priority />
          <span className="font-display text-lg font-extrabold tracking-tight sm:text-xl">Piéride</span>
        </Link>
        <nav aria-label={t.label} className="mx-auto hidden items-center gap-1 lg:flex">
          {links.map((link) => <Link key={link.href} href={link.href} className="rounded-full px-3 py-2 text-sm font-semibold text-pieride-muted transition-colors hover:bg-pieride-violet/10 hover:text-pieride-ink xl:px-4">{link.label}</Link>)}
          <a href={documentationHref()} target="_blank" rel="noreferrer" className="rounded-full px-3 py-2 text-sm font-semibold text-pieride-muted transition-colors hover:bg-pieride-violet/10 hover:text-pieride-ink xl:px-4">{t.guides}<Icon name="external" className="ml-1 inline size-3.5" /></a>
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <LanguageSwitch locale={locale} pathname={pathname} label={t.language} className="hidden lg:inline-flex" />
          <div className="hidden lg:block">{themeToggle}</div>
          <Link data-theme-preserve href={localizedPath(locale, "/telecharger")} className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full bg-pieride-violet px-4 text-sm font-semibold text-white transition hover:bg-pieride-violet-bright active:scale-95 sm:px-5">
            <span className="hidden sm:inline">{t.download}</span>
            <span className="sm:hidden">{t.download.split(" ")[0]}</span>
            <Icon name="download" className="size-4" />
          </Link>
        </div>
        <button type="button" className="grid size-10 shrink-0 place-items-center rounded-full text-pieride-ink transition hover:bg-pieride-violet/10 lg:hidden" aria-label={open ? t.closeMenu : t.openMenu} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <Icon name={open ? "close" : "menu"} className="size-5" />
        </button>
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: easeOutPapillon }}
              aria-label={t.label}
              data-theme-surface
              className="absolute inset-x-0 top-full mt-2 grid gap-1 rounded-3xl bg-white p-3 text-pieride-ink shadow-2xl shadow-black/20 lg:hidden"
            >
              {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-base font-semibold transition-colors hover:bg-pieride-violet/10">{link.label}</Link>)}
              <a href={documentationHref()} target="_blank" rel="noreferrer" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-base font-semibold transition-colors hover:bg-pieride-violet/10">{t.guides}<Icon name="external" className="ml-2 inline size-4" /></a>
              <div className="mt-2 flex items-center justify-between border-t border-pieride-line px-4 pt-3">
                <span className="text-sm font-semibold text-pieride-muted">{t.language}</span>
                <LanguageSwitch locale={locale} pathname={pathname} label={t.language} onSelect={() => setOpen(false)} />
              </div>
              <div className="flex items-center justify-between px-4 pb-1">
                <span className="text-sm font-semibold text-pieride-muted">{t.theme}</span>
                <ThemeToggle toLight={t.themeToLight} toDark={t.themeToDark} />
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
