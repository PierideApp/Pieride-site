import type { Dictionary } from "@/i18n/dictionaries/fr";
import type { Locale } from "@/i18n/config";
import type { BlogArchive, BlogArticle } from "@/lib/blog-content";
import { BlogExplorer, type BlogPost } from "./blog-explorer";

function postPath(page: BlogArticle) {
  const slug = page.slug === "index" ? "" : page.slug.endsWith("/index") ? page.slug.slice(0, -6) : page.slug;
  return `/blog/${page.categorySlug}${slug ? `/${slug}` : ""}`;
}

function postCover(page: BlogArticle) {
  if (page.cover?.startsWith("/")) return page.cover;
  const embedded = page.content.match(/!\[([^\]]*)\]\(([^)]+)\)/)?.[2];
  if (embedded?.startsWith("/")) return embedded;
  const title = `${page.title} ${page.slug}`.toLocaleLowerCase("fr");
  if (/cours|emploi|module/.test(title)) return "/visuels/cours.jpg";
  if (/note|devoir|tache/.test(title)) return "/visuels/taches.jpg";
  return "/visuels/accueil.jpg";
}

const englishCategories: Record<string, string> = { updates: "Updates" };

export function PostList({ t, blog, locale }: { t: Dictionary["blog"]; blog: BlogArchive; locale: Locale }) {
  const posts: BlogPost[] = blog.pages.map((page) => ({
    title: locale === "en" ? page.titleEn || page.title : page.title,
    description: locale === "en" ? page.descriptionEn || page.description : page.description,
    category: locale === "en" ? englishCategories[page.categorySlug] || page.categorySlug : blog.categories.find((category) => category.slug === page.categorySlug)?.name || page.categorySlug,
    categorySlug: page.categorySlug,
    slug: postPath(page),
    source: page.source,
    searchText: page.searchText,
    cover: postCover(page),
    coverAlt: page.title,
  }));
  const categories = blog.categories.map(({ slug, name }) => ({ slug, name: locale === "en" ? englishCategories[slug] || slug : name }));

  return (
    <main id="contenu" className="min-h-dvh px-5 pb-20 pt-36 sm:px-8 sm:pt-44">
      <header className="mx-auto max-w-5xl border-b border-white/10 pb-10 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-pieride-cyan">{t.eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">{t.title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/65">{t.description}</p>
        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80">{blog.pages.length} {t.articleCount}</span>
      </header>
      <BlogExplorer t={t} posts={posts} locale={locale} categories={categories} />
    </main>
  );
}
