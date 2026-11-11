import Link from "next/link";
import { DesktopMonitor } from "@/components/home/desktop-monitor";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/lib/routes";

export function Stories({ t, locale }: { t: Dictionary["home"]["stories"]; locale: Locale }) {
  return (
    <section className="mx-auto grid max-w-screen-2xl gap-5 px-5 pb-20 sm:px-8 sm:pb-28">
      {t.map((story, index) => (
        <Reveal key={story.number} delay={index * 0.08}>
          <article className="grid items-center gap-8 rounded-4xl border border-white/10 bg-linear-to-br from-pieride-surface to-pieride-night p-6 shadow-xl shadow-black/15 transition duration-500 hover:border-white/20 sm:p-8 lg:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.18fr)] lg:gap-12 lg:p-10 xl:gap-16">
            <div className={index % 2 ? "lg:order-2" : ""}>
              <p className="text-sm font-bold uppercase tracking-widest text-pieride-cyan">{story.number} · {story.eyebrow}</p>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{story.title}<br /><span className="text-pieride-lavender">{story.titleAccent}</span></h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/65">{story.description}</p>
              {story.href === "/contribuer" ? <Link href={localizedPath(locale, story.href)} className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-pieride-cyan transition hover:gap-3">{story.link}<Icon name="arrow" className="size-5" /></Link> : null}
            </div>
            {story.image ? (
              <DesktopMonitor src={story.image} alt={story.alt} sizes="(min-width: 1536px) 55vw, (min-width: 1024px) 58vw, 100vw" className={index % 2 ? "lg:order-1" : ""} />
            ) : (
              <div className={index % 2 ? "grid min-h-64 place-items-center rounded-3xl border border-white/10 bg-radial from-pieride-violet-bright/50 to-pieride-night sm:min-h-80 lg:order-1" : "grid min-h-64 place-items-center rounded-3xl border border-white/10 bg-radial from-pieride-violet-bright/50 to-pieride-night sm:min-h-80"}>
                <span className="grid size-20 place-items-center rounded-3xl bg-white text-pieride-violet shadow-2xl sm:size-24"><Icon name={story.icon} className="size-11" /></span>
              </div>
            )}
          </article>
        </Reveal>
      ))}
    </section>
  );
}
