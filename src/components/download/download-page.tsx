import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import type { Locale } from "@/i18n/config";
import { documentationHref } from "@/lib/routes";
import { ReleaseDownloads } from "./release-downloads";

export function DownloadPage({ t, locale }: { t: Dictionary["download"]; locale: Locale }) {
  return (
    <main id="contenu" className="px-5 pb-24 pt-36 sm:px-8 sm:pt-44">
      <header className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-pieride-cyan">{t.eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">{t.title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/65">{t.description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">{t.systems.map((system) => <span key={system} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70">{system}</span>)}</div>
      </header>
      <section className="mt-12"><ReleaseDownloads t={t} /></section>
      <Reveal className="mx-auto mt-10 grid max-w-5xl items-center gap-5 rounded-4xl border border-white/10 bg-white/5 p-6 sm:grid-cols-[1fr_auto] sm:p-8">
        <div><p className="text-sm font-bold uppercase tracking-widest text-pieride-cyan">{t.helpEyebrow}</p><h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">{t.helpTitle}</h2><p className="mt-3 max-w-2xl text-base leading-relaxed text-white/60">{t.helpDescription}</p></div>
        <a data-theme-preserve href={documentationHref("/welcome/installation")} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-pieride-ink bg-pieride-ink px-5 font-bold text-white transition hover:border-pieride-violet-bright hover:bg-pieride-violet-bright hover:text-white">{t.helpLink}<Icon name="external" className="size-5" /></a>
      </Reveal>
    </main>
  );
}
