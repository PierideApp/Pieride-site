import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import type { Locale } from "@/i18n/config";
import type { BlogCategory, BlogArticle } from "@/lib/blog-content";
import { stripFrontmatter } from "@/lib/blog-content";
import { localizedPath } from "@/lib/routes";
import { BlogMarkdown } from "./blog-markdown";

export function PostArticle({ t, page, category, locale }: { t: Dictionary["blog"]; page: BlogArticle; category: BlogCategory; locale: Locale }) {
  const bodyLength = page.searchText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(2, Math.ceil(bodyLength / 200));
  const source = locale === "en" ? page.contentEn || page.content : page.content;
  const title = locale === "en" ? page.titleEn || page.title : page.title;
  const description = locale === "en" ? page.descriptionEn || page.description : page.description;
  const categoryName = locale === "en" ? ({ updates: "Updates" }[category.slug] || category.name) : category.name;
  const content = stripFrontmatter(source).replace(/^\s*#\s+[^\n]+\s*(?:\r?\n)+/, "");

  return (
    <main id="contenu" className="px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
      <article className="mx-auto max-w-4xl">
        <nav aria-label={t.breadcrumbsHome} className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/45">
          <Link href={localizedPath(locale)} className="transition hover:text-white">{t.breadcrumbsHome}</Link><Icon name="chevron" className="size-4" />
          <Link href={localizedPath(locale, "/blog")} className="transition hover:text-white">{t.eyebrow}</Link><Icon name="chevron" className="size-4" />
          <span className="text-white/70">{categoryName}</span>
        </nav>
        <header className="border-b border-white/10 pb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-pieride-cyan">{categoryName}</p>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/65">{description}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm text-white/50"><Icon name="paper" className="size-4" />{minutes} {t.readingTime}</span>
        </header>
        <div data-theme-surface className="article-content mt-8 rounded-3xl bg-white px-5 py-7 text-pieride-ink shadow-2xl shadow-black/20 sm:px-10 sm:py-12">
          <BlogMarkdown content={content} locale={locale} />
        </div>
        <div className="mt-6 flex justify-end border-t border-white/10 pt-5 text-sm font-semibold">
          <Link href={localizedPath(locale, "/blog")} className="text-white/60 transition hover:text-white">{t.backToBlog}</Link>
        </div>
      </article>
    </main>
  );
}
