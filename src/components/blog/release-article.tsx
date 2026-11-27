"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import type { Locale } from "@/i18n/config";
import { cacheRelease, fetchReleaseByTag, getCachedRelease, type GitHubRelease } from "@/lib/github-releases";
import { localizedPath } from "@/lib/routes";
import { BlogMarkdown } from "./blog-markdown";

function descriptionFrom(body: string, locale: Locale) {
  const firstParagraph = body.split(/\n\s*\n/).map((part) => part.trim()).find((part) => part && !part.startsWith("#"));
  return firstParagraph
    ?.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_~`>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220) || (locale === "fr" ? "Notes de version de Piéride." : "Piéride release notes.");
}

export function ReleaseArticle({ t, locale }: { t: Dictionary["blog"]; locale: Locale }) {
  const [release, setRelease] = useState<GitHubRelease | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const tag = new URLSearchParams(window.location.search).get("tag")?.trim();
    if (!tag) {
      setLoading(false);
      setFailed(true);
      return;
    }

    const cached = getCachedRelease(tag);
    if (cached) {
      setRelease(cached);
      setLoading(false);
    }

    const controller = new AbortController();
    fetchReleaseByTag(tag, controller.signal)
      .then((fresh) => {
        cacheRelease(fresh);
        setRelease(fresh);
        setFailed(false);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setFailed(!cached);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const title = release?.name?.trim() || release?.tag_name || "";
  const body = release?.body?.trim() || "";
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  const category = locale === "en" ? "Updates" : "MAJ";

  return (
    <main id="contenu" className="min-h-dvh px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
      <article className="mx-auto max-w-4xl">
        <nav aria-label={t.breadcrumbsHome} className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/45">
          <Link href={localizedPath(locale)} className="transition hover:text-white">{t.breadcrumbsHome}</Link>
          <Icon name="chevron" className="size-4" />
          <Link href={localizedPath(locale, "/blog")} className="transition hover:text-white">{t.eyebrow}</Link>
          <Icon name="chevron" className="size-4" />
          <span className="text-white/70">{category}</span>
        </nav>

        {release ? (
          <>
            <header className="border-b border-white/10 pb-8">
              <p className="text-sm font-bold uppercase tracking-widest text-pieride-cyan">{category}</p>
              <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-5xl">{title}</h1>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/65">{descriptionFrom(body, locale)}</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/50">
                {release.published_at && <time dateTime={release.published_at}>{new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(release.published_at))}</time>}
                <span className="inline-flex items-center gap-2"><Icon name="paper" className="size-4" />{minutes} {t.readingTime}</span>
                {loading && <span role="status">{t.refreshingRelease}</span>}
              </div>
            </header>
            <div data-theme-surface className="article-content mt-8 rounded-3xl bg-white px-5 py-7 text-pieride-ink shadow-2xl shadow-black/20 sm:px-10 sm:py-12">
              <BlogMarkdown content={body} locale={locale} />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-sm font-semibold">
              <Link href={localizedPath(locale, "/blog")} className="text-white/60 transition hover:text-white">{t.backToBlog}</Link>
              <a href={release.html_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-pieride-cyan transition hover:text-white">{t.releasesGithub}<Icon name="arrow" className="size-4" /></a>
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <p role={failed ? "alert" : "status"} className="text-white/75">{failed ? t.releaseArticleUnavailable : t.releasesLoading}</p>
            {failed && <Link href={localizedPath(locale, "/blog")} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full border-2 border-pieride-cyan px-4 font-bold text-pieride-cyan">{t.backToBlog}<Icon name="arrow" className="size-4" /></Link>}
            {!failed && loading && <div aria-hidden className="mx-auto mt-6 grid max-w-3xl gap-4"><span className="h-8 animate-pulse rounded-lg bg-white/10" /><span className="h-28 animate-pulse rounded-2xl bg-white/10" /><span className="h-56 animate-pulse rounded-2xl bg-white/10" /></div>}
          </div>
        )}
      </article>
    </main>
  );
}
