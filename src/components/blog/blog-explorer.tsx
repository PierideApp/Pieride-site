"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icon";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/lib/routes";
import { withBasePath } from "@/lib/site-path";
import { easeOutPapillon } from "@/lib/motion";

export type BlogPost = {
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  slug: string;
  source: string;
  searchText: string;
  cover: string;
  coverAlt: string;
};

type BlogCategory = { slug: string; name: string };
type SavedFilter = { id: string; name: string; categorySlug: string; keyword: string };
const storageKey = "pieride-blog-filters-v1";

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").trim();
}

function distance(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 2) return 3;
  let row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const next = [i];
    for (let j = 1; j <= b.length; j += 1) {
      next[j] = Math.min(next[j - 1] + 1, row[j] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    row = next;
  }
  return row[b.length];
}

function relevance(post: BlogPost, query: string) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return 0;
  const title = normalize(post.title);
  const description = normalize(post.description);
  const category = normalize(post.category);
  const body = normalize(post.searchText);
  let score = 0;
  for (const word of words) {
    if (title.includes(word)) score += title.startsWith(word) ? 14 : 10;
    if (description.includes(word)) score += 6;
    if (category.includes(word)) score += 5;
    if (body.includes(word)) score += 2;
    if (!title.includes(word) && !description.includes(word) && !category.includes(word) && !body.includes(word) && word.length > 3) {
      const corpus = `${title} ${description} ${category}`.split(/[^\p{L}\p{N}]+/u).filter((token) => token.length > 3);
      if (corpus.some((token) => distance(word, token) <= 1)) score += 1;
    }
  }
  return score;
}

export function BlogExplorer({ t, posts, locale, categories }: { t: Dictionary["blog"]; posts: BlogPost[]; locale: Locale; categories: BlogCategory[] }) {
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterKeyword, setFilterKeyword] = useState("");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        setSavedFilters(Array.isArray(parsed) ? parsed.filter((item): item is SavedFilter => Boolean(item) && typeof item === "object" && "id" in item && typeof item.id === "string" && "name" in item && typeof item.name === "string" && "categorySlug" in item && typeof item.categorySlug === "string" && "keyword" in item && typeof item.keyword === "string") : []);
      }
    } catch {
      setSavedFilters([]);
    }
  }, []);

  const results = useMemo(() => posts
    .filter((post) => !categorySlug || post.categorySlug === categorySlug)
    .map((post) => ({ post, score: relevance(post, query) }))
    .filter(({ score }) => !query.trim() || score > 0)
    .sort((a, b) => query.trim() ? b.score - a.score || a.post.title.localeCompare(b.post.title, "fr") : a.post.title.localeCompare(b.post.title, "fr"))
    .map(({ post }) => post), [categorySlug, posts, query]);

  const suggestions = useMemo(() => {
    const term = normalize(query);
    if (term.length < 2) return [];
    const seen = new Set<string>();
    return posts.flatMap((post) => [post.title, post.category])
      .filter((value) => {
        const candidate = normalize(value);
        if (!candidate.includes(term) || seen.has(candidate)) return false;
        seen.add(candidate);
        return true;
      }).slice(0, 4);
  }, [posts, query]);

  function persistFilters(filters: SavedFilter[]) {
    setSavedFilters(filters);
    try { window.localStorage.setItem(storageKey, JSON.stringify(filters)); } catch { /* Local storage may be unavailable. */ }
  }

  function saveFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = filterName.trim();
    if (!name || (!filterCategory && !filterKeyword.trim())) return;
    const filter: SavedFilter = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
      name,
      categorySlug: filterCategory,
      keyword: filterKeyword.trim(),
    };
    persistFilters([...savedFilters, filter]);
    setCategorySlug(filter.categorySlug);
    setQuery(filter.keyword);
    setFilterName("");
    setFilterCategory("");
    setFilterKeyword("");
    setShowForm(false);
  }

  function applyFilter(filter: SavedFilter) {
    setCategorySlug(filter.categorySlug);
    setQuery(filter.keyword);
  }

  function removeFilter(id: string) {
    persistFilters(savedFilters.filter((filter) => filter.id !== id));
  }

  return (
    <section className="mx-auto max-w-7xl pt-10 sm:pt-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><h2 className="font-display text-2xl font-bold sm:text-3xl">{t.titleList}</h2><p className="mt-2 text-sm text-white/65">{t.markdownNotice}</p></div>
        <button type="button" onClick={() => setShowForm((value) => !value)} aria-expanded={showForm} className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-pieride-cyan bg-pieride-cyan px-5 text-sm font-bold text-pieride-ink shadow-lg shadow-black/15 transition duration-200 hover:-translate-y-0.5 hover:border-white hover:bg-white active:translate-y-0 active:scale-95">
          <Icon name={showForm ? "close" : "filter"} className="size-4" />{showForm ? t.closeFilterForm : t.createFilter}
        </button>
      </div>

      <div className="grid gap-5 rounded-4xl border border-white/15 bg-white/7 p-5 shadow-xl shadow-black/10 sm:p-7">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="grid gap-2 text-sm font-bold text-white">
            <label htmlFor="blog-search">{t.searchLabel}</label>
            <span data-theme-surface className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-white/20 bg-white px-4 text-pieride-ink transition focus-within:border-pieride-cyan focus-within:ring-4 focus-within:ring-pieride-cyan/20">
              <Icon name="search" className="size-5 shrink-0 text-pieride-violet" />
              <input id="blog-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} className="min-w-0 flex-1 bg-transparent text-base font-medium text-pieride-ink outline-none placeholder:text-pieride-muted" />
              {query && <button type="button" onClick={() => setQuery("")} aria-label={t.clearSearch} className="grid size-9 shrink-0 place-items-center rounded-full text-pieride-muted transition hover:bg-pieride-violet/10 hover:text-pieride-ink"><Icon name="close" className="size-4" /></button>}
            </span>
          </div>
          <p className="pb-3 text-xs leading-relaxed text-white/55 sm:max-w-56">{t.smartSuggestions}</p>
        </div>

        <div className="flex flex-wrap gap-2" aria-label={t.categoryLabel}>
          <button type="button" onClick={() => setCategorySlug("")} aria-pressed={!categorySlug} className={`min-h-10 rounded-full border-2 px-4 text-sm font-bold transition duration-200 hover:-translate-y-0.5 ${!categorySlug ? "border-pieride-cyan bg-pieride-cyan text-pieride-ink" : "border-white/20 bg-pieride-night text-white hover:border-pieride-cyan"}`}>{t.all}</button>
          {categories.map((category) => <button key={category.slug} type="button" onClick={() => setCategorySlug(category.slug)} aria-pressed={categorySlug === category.slug} className={`min-h-10 rounded-full border-2 px-4 text-sm font-bold transition duration-200 hover:-translate-y-0.5 ${categorySlug === category.slug ? "border-pieride-cyan bg-pieride-cyan text-pieride-ink" : "border-white/20 bg-pieride-night text-white hover:border-pieride-cyan"}`}>{category.name}</button>)}
        </div>

        {suggestions.length > 0 && <div className="flex flex-wrap items-center gap-2" aria-live="polite"><span className="mr-1 text-xs font-bold uppercase tracking-wider text-white/50">{t.smartSuggestions}</span>{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => setQuery(suggestion)} className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/85 transition hover:border-pieride-cyan hover:bg-pieride-cyan hover:text-pieride-ink">{suggestion}</button>)}</div>}

        {savedFilters.length > 0 && <div className="grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-[auto_1fr] sm:items-center"><span className="text-xs font-bold uppercase tracking-wider text-white/50">{t.savedFilters}</span><div className="flex flex-wrap gap-2">{savedFilters.map((filter) => <div key={filter.id} className="inline-flex items-center overflow-hidden rounded-full border border-white/20 bg-white/10"><button type="button" onClick={() => applyFilter(filter)} aria-label={`${t.applyFilter} : ${filter.name}`} className="min-h-10 px-4 text-sm font-bold text-white transition hover:bg-pieride-cyan hover:text-pieride-ink">{filter.name}</button><button type="button" onClick={() => removeFilter(filter.id)} aria-label={`${t.removeFilter} : ${filter.name}`} className="grid size-10 place-items-center border-l border-white/15 text-white/70 transition hover:bg-red-400 hover:text-pieride-ink"><Icon name="close" className="size-4" /></button></div>)}</div></div>}

        <AnimatePresence initial={false}>
          {showForm && <motion.form key="filter-form" onSubmit={saveFilter} initial={reduceMotion ? false : { opacity: 0, height: 0, y: -8 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -8 }} transition={{ duration: 0.25, ease: easeOutPapillon }} className="grid gap-4 overflow-hidden border-t border-white/10 pt-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-white">{t.filterName}<input data-theme-surface required value={filterName} onChange={(event) => setFilterName(event.target.value)} placeholder={t.filterName} className="min-h-11 rounded-xl border-2 border-pieride-line bg-white px-3 text-pieride-ink outline-none placeholder:text-pieride-muted focus:border-pieride-violet" /></label>
            <label className="grid gap-2 text-sm font-semibold text-white">{t.categoryLabel}<select data-theme-surface value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)} className="min-h-11 rounded-xl border-2 border-pieride-line bg-white px-3 text-pieride-ink outline-none focus:border-pieride-violet"><option value="">{t.anyCategory}</option>{categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></label>
            <label className="grid gap-2 text-sm font-semibold text-white sm:col-span-2">{t.keywordLabel}<input data-theme-surface value={filterKeyword} onChange={(event) => setFilterKeyword(event.target.value)} placeholder={t.searchPlaceholder} className="min-h-11 rounded-xl border-2 border-pieride-line bg-white px-3 text-pieride-ink outline-none placeholder:text-pieride-muted focus:border-pieride-violet" /></label>
            <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-2 border-pieride-cyan bg-pieride-cyan px-5 text-sm font-bold text-pieride-ink shadow-md transition duration-200 hover:-translate-y-0.5 hover:border-white hover:bg-white sm:col-span-2 sm:justify-self-start">{t.saveFilter}<Icon name="check" className="size-4" /></button>
          </motion.form>}
        </AnimatePresence>
      </div>

      <p className="mt-7 text-sm font-semibold text-white/65" aria-live="polite">{results.length} {t.resultCount}</p>
      {results.length === 0 ? <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-base text-white/70">{t.noResults}</div> : (
        <LayoutGroup>
          <motion.div layout className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {results.map((post, index) => (
                <motion.article key={post.source} layout initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.35, delay: reduceMotion ? 0 : Math.min(index * 0.025, 0.15), ease: easeOutPapillon }} whileHover={reduceMotion ? undefined : { y: -5 }} className="group h-full">
                  <Link data-theme-surface href={localizedPath(locale, post.slug)} className="flex h-full min-h-80 flex-col overflow-hidden rounded-3xl border border-white/15 bg-white text-pieride-ink shadow-xl shadow-black/15 transition-colors hover:border-pieride-cyan focus-visible:outline-pieride-cyan">
                    <div className="relative h-48 overflow-hidden bg-linear-to-br from-pieride-violet to-pieride-night">
                      <Image src={withBasePath(post.cover)!} alt={post.coverAlt || t.imageFallback} fill unoptimized sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 ease-out group-hover:scale-105" />
                      <span className="absolute bottom-3 left-3 rounded-full border border-white/80 bg-pieride-ink/90 px-3 py-1.5 text-xs font-bold text-white shadow-lg">{post.category}</span>
                    </div>
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <h3 className="text-xl font-bold leading-snug text-pieride-ink">{post.title}</h3>
                      <p className="mt-3 line-clamp-3 flex-1 text-base leading-relaxed text-pieride-muted">{post.description}</p>
                      <span className="mt-5 inline-flex min-h-10 items-center gap-2 self-start rounded-full border-2 border-pieride-violet bg-white px-4 text-sm font-bold text-pieride-violet transition duration-200 group-hover:bg-pieride-violet group-hover:text-white">{t.readArticle}<Icon name="arrow" className="size-4 transition group-hover:translate-x-1" /></span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      )}
    </section>
  );
}
