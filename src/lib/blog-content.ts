import { readdir, readFile } from "node:fs/promises";
import { watch, type FSWatcher } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "docs");
export type BlogArticle = {
  source: string;
  slug: string;
  href: string;
  categorySlug: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  cover?: string;
  featured: boolean;
  content: string;
  contentEn?: string;
  searchText: string;
};

export type BlogCategory = {
  slug: string;
  name: string;
  icon: string;
  accent: string;
  description: string;
  order: number;
  href: string;
  pages: BlogArticle[];
};

export type BlogArchive = { categories: BlogCategory[]; pages: BlogArticle[] };
type BlogCache = { promise?: Promise<BlogArchive>; watcher?: FSWatcher; loadedAt?: number };
const cacheGlobal = globalThis as typeof globalThis & { __pierideBlogCache?: BlogCache };
const blogCache = cacheGlobal.__pierideBlogCache ??= {};

export function stripFrontmatter(source: string) {
  return source.replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*(?:\r?\n|$)/, "");
}

function field(source: string, name: string): string | undefined {
  return source.match(new RegExp("^" + name + ":\\s*[\\\"']?(.+?)[\\\"']?\\s*$", "m"))?.[1]?.trim();
}

function plainText(source: string) {
  return stripFrontmatter(source)
    .replace(/\x60{3}[\s\S]*?\x60{3}/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~\x60>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function descriptionFrom(source: string, frontmatter: string) {
  const direct = field(frontmatter, "description");
  if (direct && !/^(?:>|\|)[+-]?$/.test(direct)) return direct;
  const blocks = stripFrontmatter(source).replace(/\r\n/g, "\n").split(/\n\s*\n/);
  for (const block of blocks) {
    const candidate = plainText(block);
    if (candidate.length > 25) return candidate.slice(0, 190);
  }
  return plainText(source).slice(0, 190);
}

function hrefFor(category: string, slug: string) {
  const cleanSlug = slug === "index" ? "" : slug.endsWith("/index") ? slug.slice(0, -6) : slug;
  return cleanSlug ? `/${category}/${cleanSlug.split("/").map(encodeURIComponent).join("/")}` : `/${category}`;
}

async function walk(dir: string, relative: string, out: string[]): Promise<void> {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  entries.sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" }));
  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "assets") continue;
    const rel = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isDirectory()) await walk(path.join(dir, entry.name), rel, out);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md") && entry.name.toLowerCase() !== "summary.md") out.push(rel);
  }
}

async function loadBlogArchive(): Promise<BlogArchive> {
  let roots;
  try { roots = await readdir(ROOT, { withFileTypes: true }); } catch { return { categories: [], pages: [] }; }
  const categories: BlogCategory[] = [];

  for (const root of roots.filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))) {
    const dir = path.join(ROOT, root.name);
    let config: Record<string, unknown>;
    try { config = JSON.parse(await readFile(path.join(dir, "category.json"), "utf8")); } catch { continue; }
    if (typeof config.name !== "string" || !config.name.trim()) continue;

    const sources: string[] = [];
    await walk(dir, "", sources);
    const pages = await Promise.all(sources.map(async (relative) => {
      const original = await readFile(path.join(dir, ...relative.split("/")), "utf8");
      const front = original.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/m)?.[1] || "";
      const sourcePath = relative.replace(/\\/g, "/").replace(/\.md$/i, "");
      const filename = path.posix.basename(sourcePath);
      const slug = field(front, "slug")?.replace(/^\/+|\/+$/g, "") || (
        filename.toLowerCase() === "readme"
          ? (path.posix.dirname(sourcePath) === "." ? "index" : path.posix.join(path.posix.dirname(sourcePath), "index"))
          : sourcePath
      );
      const content = original;
      const englishBlock = front.match(/^content_en:\s*\|[+-]?\s*\r?\n((?:(?:[ \t]+.*)?(?:\r?\n|$))*)/m)?.[1]?.replace(/^[ \t]{2}/gm, "");
      const heading = stripFrontmatter(original).match(/^#\s+(.+?)\s*#*\s*$/m)?.[1]?.replace(/[*_`]/g, "").trim();
      const title = field(front, "title") || heading || path.posix.basename(sourcePath).replace(/[-_]/g, " ");
      return {
        source: `${root.name}/${relative.replace(/\\/g, "/")}`,
        slug,
        href: hrefFor(root.name, slug),
        categorySlug: root.name,
        title,
        titleEn: field(front, "title_en"),
        description: descriptionFrom(original, front),
        descriptionEn: field(front, "description_en"),
        cover: field(front, "cover"),
        featured: field(front, "featured") === "true",
        content,
        contentEn: englishBlock,
        searchText: plainText(original).slice(0, 12000),
      } satisfies BlogArticle;
    }));

    pages.sort((a, b) => a.slug === "index" ? -1 : b.slug === "index" ? 1 : a.title.localeCompare(b.title, "fr", { sensitivity: "base" }));
    categories.push({
      slug: root.name,
      name: config.name.trim(),
      icon: typeof config.icon === "string" ? config.icon : "news",
      accent: typeof config.accent === "string" && /^#[\da-f]{6}$/i.test(config.accent) ? config.accent : "#5556F2",
      description: typeof config.description === "string" ? config.description : "",
      order: typeof config.order === "number" ? config.order : 99,
      href: `/${root.name}`,
      pages,
    });
  }

  categories.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "fr"));
  return { categories, pages: categories.flatMap((category) => category.pages) };
}

export function getBlogArchive(): Promise<BlogArchive> {
  const isDevelopment = process.env.NODE_ENV === "development";
  if (isDevelopment && !blogCache.watcher) {
    try {
      blogCache.watcher = watch(ROOT, { recursive: true }, (_event, filename) => {
        const changed = filename?.toString() || "";
        if (!changed || /\.(?:md|json)$/i.test(changed)) {
          blogCache.promise = undefined;
          blogCache.loadedAt = undefined;
        }
      });
      blogCache.watcher.on("error", () => {
        blogCache.watcher?.close();
        blogCache.watcher = undefined;
      });
    } catch {
      // Fall back to a short development cache where recursive watching is unavailable.
    }
  }
  const fallbackExpired = isDevelopment && !blogCache.watcher && Date.now() - (blogCache.loadedAt || 0) > 1000;
  if (!blogCache.promise || fallbackExpired) {
    blogCache.promise = loadBlogArchive().then((archive) => {
      blogCache.loadedAt = Date.now();
      return archive;
    }).catch((error) => {
      blogCache.promise = undefined;
      blogCache.loadedAt = undefined;
      throw error;
    });
  }
  return blogCache.promise;
}
