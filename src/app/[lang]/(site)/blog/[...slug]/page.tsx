import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostArticle } from "@/components/blog/post-article";
import { getDictionary, getLocale } from "@/i18n/server";
import { getBlogArchive, type BlogArticle } from "@/lib/blog-content";

function nestedSlug(page: BlogArticle) {
  if (page.slug === "index") return [];
  const value = page.slug.endsWith("/index") ? page.slug.slice(0, -6) : page.slug;
  return value ? value.split("/") : [];
}

export async function generateStaticParams() {
  const blog = await getBlogArchive();
  return blog.pages.map((page) => ({ slug: [page.categorySlug, ...nestedSlug(page)] }));
}

export const dynamicParams = false;

async function resolve(slug: string[]) {
  const blog = await getBlogArchive();
  const requested = slug.slice(1).join("/");
  const page = blog.pages.find((item) => item.categorySlug === slug[0] &&
    (item.slug === requested || item.slug === requested + "/index" || (!requested && item.slug === "index")));
  const category = blog.categories.find((item) => item.slug === slug[0]);
  return page && category ? { page, category } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string[] }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const article = await resolve(slug);
  if (!article) return { title: lang === "en" ? "Article not found" : "Article introuvable" };
  return lang === "en"
    ? { title: article.page.titleEn || article.page.title, description: article.page.descriptionEn || article.page.description }
    : { title: article.page.title, description: article.page.description };
}

export default async function BlogArticleRoute({ params }: { params: Promise<{ lang: string; slug: string[] }> }) {
  const { lang, slug } = await params;
  const locale = getLocale(lang);
  const article = await resolve(slug);
  if (!article) notFound();
  return <PostArticle t={getDictionary(locale).blog} page={article.page} category={article.category} locale={locale} />;
}
