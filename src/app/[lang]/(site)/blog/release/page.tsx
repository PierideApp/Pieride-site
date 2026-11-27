import type { Metadata } from "next";
import { ReleaseArticle } from "@/components/blog/release-article";
import { getDictionary, getLocale } from "@/i18n/server";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return lang === "en"
    ? { title: "Piéride release notes", description: "Release notes loaded directly from GitHub." }
    : { title: "Notes de version Piéride", description: "Notes de version chargées directement depuis GitHub." };
}

export default async function ReleaseArticleRoute({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = getLocale(lang);
  return <ReleaseArticle t={getDictionary(locale).blog} locale={locale} />;
}
