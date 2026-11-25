import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const releasesApi = "https://api.github.com/repos/PierideApp/Pieride/releases";
const blogDirectory = path.resolve("docs/updates");

function versionKey(value) {
  return value.toLowerCase().replace(/^v/, "").replace(/[^a-z0-9]/g, "");
}

function slugFor(tag) {
  return tag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function parseMarkdown(source, file) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  if (!match) throw new Error(`Frontmatter invalide dans ${file}.`);
  return { frontmatter: match[1], body: match[2] };
}

function fieldValue(frontmatter, name) {
  const match = frontmatter.match(new RegExp(`^${name}:\\s*["']?([^\\r\\n"']+)["']?\\s*$`, "m"));
  return match?.[1]?.trim();
}

function setField(frontmatter, name, value) {
  const line = `${name}: ${JSON.stringify(value)}`;
  const pattern = new RegExp(`^${name}:.*$`, "m");
  if (pattern.test(frontmatter)) return frontmatter.replace(pattern, line);

  const multilineField = frontmatter.match(/^\w+:\s*\|.*$/m);
  if (!multilineField) return `${frontmatter.trimEnd()}\n${line}`;
  const index = multilineField.index;
  return `${frontmatter.slice(0, index).trimEnd()}\n${line}\n${frontmatter.slice(index)}`;
}

function descriptionFrom(body) {
  return body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim().replace(/\s*\n\s*/g, " "))
    .find((paragraph) => paragraph && !paragraph.startsWith("#")) || "";
}

function releaseMarkdown(release, currentSource, file) {
  const tag = release.tag_name.trim();
  const title = (release.name || tag).replace(/[\r\n]+/g, " ").trim();
  const date = release.published_at.slice(0, 10);
  const body = typeof release.body === "string" ? release.body.replace(/\r\n?/g, "\n").trim() : "";
  const slug = slugFor(tag);
  const version = tag.replace(/^v/i, "");
  const description = descriptionFrom(body);

  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !body || !description) {
    throw new Error(`Release incomplète dans l’API GitHub : ${tag || "tag absent"}`);
  }

  const fields = { title, slug, tag: "MAJ", date, version, description };
  let frontmatter = "";
  if (currentSource) {
    frontmatter = parseMarkdown(currentSource, file).frontmatter;
    for (const [name, value] of Object.entries(fields)) {
      frontmatter = setField(frontmatter, name, value);
    }
  } else {
    frontmatter = Object.entries(fields)
      .map(([name, value]) => `${name}: ${JSON.stringify(value)}`)
      .join("\n");
  }

  return `---\n${frontmatter}\n---\n\n${body}\n`;
}

async function fetchReleases() {
  const releases = [];
  for (let page = 1; ; page += 1) {
    const response = await fetch(`${releasesApi}?per_page=100&page=${page}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "Pieride-site release post generator",
      },
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      throw new Error(`GitHub Releases API : ${response.status} ${response.statusText}`);
    }
    const batch = await response.json();
    if (!Array.isArray(batch)) throw new Error("Réponse GitHub Releases invalide.");
    releases.push(...batch);
    if (batch.length < 100) return releases;
  }
}

const files = (await readdir(blogDirectory)).filter((file) => file.endsWith(".md"));
const existingFiles = new Map();
for (const file of files) {
  const source = await readFile(path.join(blogDirectory, file), "utf8");
  const { frontmatter } = parseMarkdown(source, file);
  const slug = fieldValue(frontmatter, "slug");
  const version = fieldValue(frontmatter, "version");
  const key = versionKey(version || slug || path.basename(file, ".md"));
  if (key && key !== versionKey("index")) existingFiles.set(key, file);
}

let created = 0;
let updated = 0;
let unchanged = 0;
for (const release of await fetchReleases()) {
  if (release.draft || !release.published_at) continue;
  const tag = typeof release.tag_name === "string" ? release.tag_name.trim() : "";
  if (!tag) throw new Error("Release incomplète dans l’API GitHub : tag absent");

  const key = versionKey(tag);
  const existingFile = existingFiles.get(key);
  const filename = existingFile || `maj-${slugFor(tag)}.md`;
  const filePath = path.join(blogDirectory, filename);
  const currentSource = existingFile ? await readFile(filePath, "utf8") : undefined;
  const markdown = releaseMarkdown(release, currentSource, filename);

  if (currentSource === markdown) {
    unchanged += 1;
    continue;
  }

  await writeFile(filePath, markdown);
  existingFiles.set(key, filename);
  if (existingFile) updated += 1;
  else created += 1;
}

console.log(`${created} article(s) créé(s), ${updated} synchronisé(s), ${unchanged} inchangé(s).`);
