import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import type { Locale } from "@/i18n/config";
import type { BlogCategory, BlogArticle } from "@/lib/blog-content";
import { localizedPath } from "@/lib/routes";
import { withBasePath } from "@/lib/site-path";

function articlePath(page: BlogArticle) {
  const slug = page.slug === "index" ? "" : page.slug.endsWith("/index") ? page.slug.slice(0, -6) : page.slug;
  return `/blog/${page.categorySlug}${slug ? `/${slug}` : ""}`;
}

function articleCover(page: BlogArticle) {
  if (page.cover?.startsWith("/")) return page.cover;
  const embedded = page.content.match(/!\[([^\]]*)\]\(([^)]+)\)/)?.[2];
  if (embedded?.startsWith("/")) return embedded;
  const title = `${page.title} ${page.slug}`.toLocaleLowerCase("fr");
  if (/cours|emploi|module/.test(title)) return "/visuels/cours.jpg";
  if (/note|devoir|tache/.test(title)) return "/visuels/taches.jpg";
  return "/visuels/accueil.jpg";
}

const englishCategories: Record<string, string> = { updates: "Updates" };

export function BlogTeaser({ t, locale, pages, categories }: { t: Dictionary["home"]["blog"]; locale: Locale; pages: BlogArticle[]; categories: BlogCategory[] }) {
  const featured = pages.filter((page) => page.featured).slice(0, 3);
  const visible = featured.length ? featured : pages.slice(0, 3);
  if (!visible.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-20">
      <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div><p className="text-sm font-bold uppercase tracking-widest text-pieride-cyan">{t.eyebrow}</p><h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{t.title}</h2></div>
        <Link href={localizedPath(locale, "/blog")} className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-pieride-violet bg-pieride-violet px-5 text-sm font-bold text-white transition hover:border-pieride-violet-bright hover:bg-pieride-violet-bright hover:text-white">{t.link}<Icon name="arrow" className="size-5" /></Link>
      </Reveal>
      <div className="grid gap-5 md:grid-cols-3">
        {visible.map((page, index) => {
          const frenchCategory = categories.find((item) => item.slug === page.categorySlug)?.name || page.categorySlug;
          const category = locale === "en" ? englishCategories[page.categorySlug] || frenchCategory : frenchCategory;
          const title = locale === "en" ? page.titleEn || page.title : page.title;
          const description = locale === "en" ? page.descriptionEn || page.description : page.description;
          return (
            <Reveal key={page.source} delay={index * 0.07} className="h-full">
              <Link data-theme-surface href={localizedPath(locale, articlePath(page))} className="group flex h-full flex-col overflow-hidden rounded-4xl border border-white/15 bg-white text-pieride-ink shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1.5 hover:border-pieride-cyan hover:shadow-2xl focus-visible:outline-pieride-cyan">
                <div data-theme-preserve className="relative aspect-[1.58] overflow-hidden bg-pieride-night">
                  <Image src={withBasePath(articleCover(page))!} alt={page.cover ? title : `Piéride desktop app — ${title}`} fill unoptimized sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition duration-500 ease-out group-hover:scale-105" />
                  <div aria-hidden className="absolute inset-0 bg-linear-to-t from-pieride-night/75 via-transparent to-pieride-night/15" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-pieride-night/90 px-3 py-1.5 text-xs font-bold text-white shadow-lg">{category}</span>
                  <span className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-xl bg-white/95 text-pieride-violet shadow-lg"><Icon name="grid" className="size-5" /></span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="mt-2 text-xl font-extrabold leading-snug text-pieride-ink">{title}</h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-pieride-muted">{description}</p>
                  <span className="mt-5 inline-flex min-h-10 items-center gap-2 self-start rounded-full border-2 border-pieride-violet bg-white px-4 text-sm font-bold text-pieride-violet transition duration-200 group-hover:bg-pieride-violet group-hover:text-white">{t.readArticle}<Icon name="arrow" className="size-4 transition group-hover:translate-x-1" /></span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
