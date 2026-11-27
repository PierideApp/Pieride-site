export type GitHubRelease = {
  id: number;
  tag_name: string;
  name: string | null;
  html_url: string;
  published_at: string | null;
  body: string | null;
  draft: boolean;
};

const releasesApi = "https://api.github.com/repos/PierideApp/Pieride/releases";
const releaseCache = new Map<string, GitHubRelease>();

function cacheKey(tag: string) {
  return `pieride-release-v1:${tag}`;
}

export function cacheRelease(release: GitHubRelease) {
  releaseCache.set(release.tag_name, release);
  try {
    window.sessionStorage.setItem(cacheKey(release.tag_name), JSON.stringify(release));
  } catch {
    // The in-memory copy remains available when session storage is blocked or full.
  }
}

export function getCachedRelease(tag: string) {
  const memory = releaseCache.get(tag);
  if (memory) return memory;

  try {
    const stored = window.sessionStorage.getItem(cacheKey(tag));
    if (!stored) return null;
    const release = JSON.parse(stored) as GitHubRelease;
    if (release.tag_name !== tag || release.draft || !release.published_at) return null;
    releaseCache.set(tag, release);
    return release;
  } catch {
    return null;
  }
}

async function readRelease<T>(response: Response): Promise<T> {
  if (!response.ok) throw new Error(`GitHub Releases API: ${response.status}`);
  return await response.json() as T;
}

export async function fetchPublishedReleases(signal: AbortSignal) {
  const response = await fetch(`${releasesApi}?per_page=100`, {
    headers: { Accept: "application/vnd.github+json" },
    cache: "no-store",
    signal,
  });
  const releases = await readRelease<GitHubRelease[]>(response);
  if (!Array.isArray(releases)) throw new Error("Invalid GitHub releases response");
  const published = releases.filter((release) => !release.draft && Boolean(release.published_at && release.tag_name && release.html_url));
  published.forEach(cacheRelease);
  return published;
}

export async function fetchReleaseByTag(tag: string, signal: AbortSignal) {
  const response = await fetch(`${releasesApi}/tags/${encodeURIComponent(tag)}`, {
    headers: { Accept: "application/vnd.github+json" },
    cache: "no-store",
    signal,
  });
  const release = await readRelease<GitHubRelease>(response);
  if (release.tag_name !== tag || release.draft || !release.published_at) {
    throw new Error("Release unavailable");
  }
  cacheRelease(release);
  return release;
}
