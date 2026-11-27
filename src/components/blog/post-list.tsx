"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import type { Locale } from "@/i18n/config";
import type { BlogArchive, BlogArticle } from "@/lib/blog-content";
import { fetchPublishedReleases } from "@/lib/github-releases";
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

function plainText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~`>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function releaseDescription(body: string, locale: Locale) {
  const paragraph = body.split(/\n\s*\n/).map((part) => part.trim()).find((part) => part && !part.startsWith("#"));
  return paragraph
    ? plainText(paragraph).slice(0, 220)
    : locale === "fr" ? "Notes de version de Piéride." : "Piéride release notes.";
}

const englishCategories: Record<string, string> = { updates: "Updates" };
export function PostList({ t, blog, locale }: { t: Dictionary["blog"]; blog: BlogArchive; locale: Locale }) {
  const [releasePosts, setReleasePosts] = useState<BlogPost[]>([]);
  const [releaseStatus, setReleaseStatus] = useState<"loading" | "ready" | "error">("loading");
  const articles = blog.pages.filter((page) => page.slug !== "index" && !page.slug.endsWith("/index"));
  const regularPosts: BlogPost[] = articles.map((page) => ({
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

  useEffect(() => {
    const controller = new AbortController();
    fetchPublishedReleases(controller.signal)
      .then((releases) => {
        const posts = releases
          .map((release): BlogPost => {
            const body = release.body?.trim() || "";
            return {
              title: release.name?.trim() || release.tag_name,
              description: releaseDescription(body, locale),
              category: locale === "en" ? "Updates" : "MAJ",
              categorySlug: "updates",
              slug: "",
              source: `release:${release.id}`,
              searchText: plainText(body),
              cover: "/visuels/accueil.jpg",
              coverAlt: locale === "en" ? `Piéride release ${release.tag_name}` : `Release Piéride ${release.tag_name}`,
              publishedAt: release.published_at || undefined,
              version: release.tag_name,
            };
          });
        setReleasePosts(posts);
        setReleaseStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setReleaseStatus("error");
      });

    return () => controller.abort();
  }, [locale]);

  const posts = [...regularPosts, ...releasePosts];
  const categories = blog.categories.map(({ slug, name }) => ({ slug, name: locale === "en" ? englishCategories[slug] || slug : name }));

  return (
    <main id="contenu" className="min-h-dvh px-5 pb-20 pt-36 sm:px-8 sm:pt-44">
      <header className="mx-auto max-w-5xl border-b border-white/10 pb-10 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-pieride-cyan">{t.eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">{t.title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/65">{t.description}</p>
        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80">{posts.length} {t.articleCount}</span>
      </header>
      <BlogExplorer t={t} posts={posts} locale={locale} categories={categories} releaseStatus={releaseStatus} />
    </main>
  );
}
