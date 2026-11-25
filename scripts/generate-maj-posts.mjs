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

async function fetchReleases() {
  const releases = [];
  for (let page = 1; ; page += 1) {
    const response = await fetch(`${releasesApi}?per_page=100&page=${page}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "Pieride-site release post generator",
      },
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
const existingVersions = new Set();
for (const file of files) {
  const source = await readFile(path.join(blogDirectory, file), "utf8");
  const slug = source.match(/^slug:\s*["']?(.+?)["']?\s*$/m)?.[1];
  existingVersions.add(versionKey(slug || path.basename(file, ".md")));
  const version = source.match(/^version:\s*["']?(.+?)["']?\s*$/m)?.[1];
  if (version) existingVersions.add(versionKey(version));
}

let created = 0;
for (const release of await fetchReleases()) {
  if (release.draft || !release.published_at) continue;
  const tag = release.tag_name?.trim();
  const title = (release.name || tag || "").replace(/[\r\n]+/g, " ").trim();
  const date = release.published_at.slice(0, 10);
  const body = typeof release.body === "string" ? release.body.replace(/\r\n?/g, "\n").trim() : "";
  if (!tag || !title || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !body) {
    throw new Error(`Release incomplète dans l’API GitHub : ${tag || "tag absent"}`);
  }

  const key = versionKey(tag);
  if (existingVersions.has(key)) continue;
  const slug = slugFor(tag);
  const filename = `maj-${slug}.md`;
  const markdown = `---\ntitle: ${title}\nslug: ${slug}\ntag: MAJ\ndate: ${date}\nversion: ${tag.replace(/^v/i, "")}\n---\n\n${body}\n`;
  await writeFile(path.join(blogDirectory, filename), markdown, { flag: "wx" });
  existingVersions.add(key);
  created += 1;
}

console.log(`${created} article(s) MAJ généré(s) dans docs/updates/.`);
