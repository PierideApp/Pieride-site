"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import { Reveal } from "@/components/ui/reveal";

const repository = "https://github.com/PierideApp/Pieride";
const releases = `${repository}/releases`;
const latestReleaseApi = "https://api.github.com/repos/PierideApp/Pieride/releases?per_page=30";
type Asset = { name: string; browser_download_url: string };
type Release = { name: string; tag_name: string; html_url: string; published_at: string; assets: Asset[] };
type OS = "Windows" | "macOS" | "Linux" | "Autre";
type Architecture = "x64" | "arm64";
type LinuxFormat = "deb" | "rpm" | "appimage";

const architectures = ["x64", "arm64"] as const;
const linuxFormats = ["deb", "rpm", "appimage"] as const;
const linuxFormatLabels: Record<LinuxFormat, string> = { deb: ".deb", rpm: ".rpm", appimage: "AppImage" };

function detectSystem(): OS {
  const agent = navigator.userAgent.toLowerCase();
  if (agent.includes("windows")) return "Windows";
  if (agent.includes("macintosh") || agent.includes("mac os")) return "macOS";
  if (agent.includes("linux") && !agent.includes("android")) return "Linux";
  return "Autre";
}

function detectArchitecture(): Architecture {
  const agent = `${navigator.userAgent} ${navigator.platform}`.toLowerCase();
  return /arm64|aarch64|armv8|\barm\b/.test(agent) ? "arm64" : "x64";
}

function platformAsset(asset: Asset, system: Exclude<OS, "Autre">) {
  const name = asset.name.toLowerCase();
  if (system === "Windows") return /windows|win32|win64|\.exe(?:$|\.)|\.msi(?:$|\.)|\.msix(?:$|\.)/.test(name);
  if (system === "macOS") return /macos|mac[-_.]|darwin|\.dmg(?:$|\.)|\.pkg(?:$|\.)/.test(name);
  return /linux|appimage|\.deb(?:$|\.)|\.rpm(?:$|\.)/.test(name);
}

function assetArchitecture(asset: Asset): Architecture | "universal" | undefined {
  const name = asset.name.toLowerCase().replace(/[_\s]/g, "-");
  if (/universal|universal2/.test(name)) return "universal";
  if (/arm64|aarch64|armv8|arm-64|apple-silicon|apple-m\d/.test(name)) return "arm64";
  if (/(^|[-.])x64($|[-.])|x86-64|amd64|win64|intel/.test(name)) return "x64";
  return undefined;
}

function findAsset(assets: Asset[], system: Exclude<OS, "Autre">, architecture: Architecture) {
  const priority: Record<Exclude<OS, "Autre">, RegExp[]> = {
    Windows: [/\.exe(?:$|\.)/i, /\.msi(?:$|\.)/i, /\.msix(?:$|\.)/i],
    macOS: [/\.dmg(?:$|\.)/i, /\.pkg(?:$|\.)/i],
    Linux: [/\.appimage(?:$|\.)/i, /\.deb(?:$|\.)/i, /\.rpm(?:$|\.)/i],
  };
  const candidates = assets.filter((asset) => platformAsset(asset, system));
  const exact = candidates.filter((asset) => assetArchitecture(asset) === architecture);
  const universal = system === "macOS" ? candidates.filter((asset) => assetArchitecture(asset) === "universal") : [];
  return [...exact, ...universal].sort((first, second) => {
    const a = priority[system].findIndex((item) => item.test(first.name));
    const b = priority[system].findIndex((item) => item.test(second.name));
    return (a < 0 ? 99 : a) - (b < 0 ? 99 : b);
  })[0];
}

function findLinuxAsset(assets: Asset[], architecture: Architecture, format: LinuxFormat) {
  const suffix: Record<LinuxFormat, RegExp> = {
    deb: /\.deb$/i,
    rpm: /\.rpm$/i,
    appimage: /\.appimage$/i,
  };
  const candidates = assets.filter((asset) => suffix[format].test(asset.name));
  const exact = candidates.find((asset) => assetArchitecture(asset) === architecture);
  if (exact) return exact;
  // Releases often omit the architecture suffix for the default x64 Linux build.
  return architecture === "x64" ? candidates.find((asset) => assetArchitecture(asset) === undefined) : undefined;
}

function architectureLabel(architecture: Architecture, t: Dictionary["download"], system?: OS) {
  return system === "macOS" ? t.macArchitectureNames[architecture] : t.architectureNames[architecture];
}

export function ReleaseDownloads({ t }: { t: Dictionary["download"] }) {
  const [release, setRelease] = useState<Release | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "empty" | "unavailable">("loading");
  const [system, setSystem] = useState<OS>("Autre");
  const [architecture, setArchitecture] = useState<Architecture>("x64");

  useEffect(() => {
    setSystem(detectSystem());
    setArchitecture(detectArchitecture());
    const userAgentData = (navigator as Navigator & { userAgentData?: { getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string }> } }).userAgentData;
    userAgentData?.getHighEntropyValues?.(["architecture"]).then((hints) => {
      if (hints.architecture?.toLowerCase().includes("arm")) setArchitecture("arm64");
      else if (hints.architecture) setArchitecture("x64");
    }).catch(() => undefined);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 9000);
    let active = true;
    fetch(latestReleaseApi, { headers: { Accept: "application/vnd.github+json" }, signal: controller.signal })
      .then(async (response) => {
        if (response.status === 404) return null;
        if (!response.ok) throw new Error("GitHub unavailable");
        return response.json() as Promise<Release[]>;
      })
      .then((data) => {
        if (!active) return;
        const latest = data?.filter((item) => item.published_at).sort((first, second) => Date.parse(second.published_at) - Date.parse(first.published_at))[0];
        if (!latest) { setStatus("empty"); return; }
        setRelease(latest);
        setStatus("ready");
      })
      .catch(() => { if (active) setStatus("unavailable"); })
      .finally(() => window.clearTimeout(timeout));
    return () => { active = false; window.clearTimeout(timeout); controller.abort(); };
  }, []);

  const selected = release && system !== "Autre"
    ? system === "Linux"
      ? linuxFormats.map((format) => findLinuxAsset(release.assets, architecture, format)).find((asset) => asset !== undefined)
      : findAsset(release.assets, system, architecture)
    : undefined;
  const recommendedAsset = selected;
  const publishDate = release?.published_at ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(release.published_at)) : "";
  const systems = ["Windows", "macOS", "Linux"] as const;
  const releaseTitle = status === "loading" ? t.releaseLoading : release ? release.name || release.tag_name : status === "empty" ? t.noRelease : t.notAvailable;
  const releaseNote = status === "loading" ? t.releaseChecking : publishDate ? `${release?.tag_name} · ${publishDate}` : status === "empty" ? t.releasePublished : t.unavailableDescription;

  return (
    <div data-theme-surface className="mx-auto max-w-5xl rounded-4xl bg-white p-5 text-pieride-ink shadow-2xl shadow-black/25 sm:p-8" aria-live="polite">
      <div className="flex items-center gap-4 border-b border-pieride-line pb-5">
        <span className="grid size-12 place-items-center rounded-2xl bg-pieride-violet/10 text-pieride-violet"><Icon name="download" className="size-6" /></span>
        <span className="grid gap-1"><strong className="text-lg">{releaseTitle}</strong><small className="text-sm text-pieride-muted">{releaseNote}</small></span>
      </div>
      <Reveal surface className="mt-6 flex flex-col items-start justify-between gap-5 rounded-3xl border-2 border-pieride-violet/25 bg-pieride-violet/5 p-6 shadow-lg shadow-pieride-violet/10 sm:flex-row sm:items-center sm:p-8">
        <div className="min-w-0"><span className="text-xs font-extrabold uppercase tracking-widest text-pieride-violet">{t.detectedTitle}</span><h2 className="mt-2 text-2xl font-extrabold text-pieride-ink">{system === "Autre" ? t.chooseSystem : `${t.systemNames[system]} · ${architectureLabel(architecture, t, system)}`}</h2><p className="mt-2 break-all text-sm font-medium text-pieride-muted">{recommendedAsset?.name || (system === "Autre" ? t.fileBelow : status === "loading" ? t.searchLoading : t.noFile)}</p>{system === "macOS" ? <p className="mt-2 text-xs leading-relaxed text-pieride-muted">{t.architectureNote}</p> : null}</div>
        <a href={recommendedAsset?.browser_download_url || releases} target={recommendedAsset ? undefined : "_blank"} rel={recommendedAsset ? undefined : "noreferrer"} data-theme-preserve className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-full border-2 border-pieride-ink bg-pieride-ink px-7 text-base font-extrabold text-white shadow-lg shadow-pieride-ink/20 transition duration-200 hover:-translate-y-0.5 hover:border-pieride-violet-bright hover:bg-pieride-violet-bright hover:text-white hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pieride-violet active:translate-y-0 active:scale-95">{recommendedAsset ? t.downloadAction : t.versionsAction}<Icon name={recommendedAsset ? "download" : "external"} className="size-5" /></a>
      </Reveal>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {systems.map((item, index) => {
          const name = t.systemNames[item];
          const detected = system === item;
          const choicesLabel = item === "Linux" ? t.chooseLinuxFormat : t.chooseArchitecture;
          return (
            <Reveal key={item} delay={index * 0.05}>
              <article data-theme-surface className={`h-full rounded-3xl border-2 p-5 transition-colors ${detected ? "border-pieride-violet bg-pieride-violet/5" : "border-pieride-line bg-white"}`}>
                <div className="flex min-h-14 items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-pieride-violet/10 text-pieride-violet">
                    <Icon name={item === "Windows" ? "grid" : item === "macOS" ? "apple" : "download"} className="size-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block text-lg font-extrabold text-pieride-ink">{name}</strong>
                    {detected ? <span className="text-xs font-bold text-pieride-violet">{t.detection}</span> : null}
                  </span>
                </div>
                <p className="mt-4 text-sm font-semibold text-pieride-muted">{choicesLabel}</p>

                {item === "Linux" ? (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {linuxFormats.map((format) => {
                      const asset = release ? findLinuxAsset(release.assets, architecture, format) : undefined;
                      const label = linuxFormatLabels[format];
                      const active = detected && asset?.name === recommendedAsset?.name;
                      const unavailable = status !== "loading" && !asset;
                      const buttonClass = `flex min-h-12 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl border-2 px-1.5 text-xs font-extrabold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pieride-violet ${active ? "border-pieride-ink bg-pieride-ink text-white" : "border-pieride-violet bg-white text-pieride-violet"}`;
                      return asset ? (
                        <a key={format} href={asset.browser_download_url} aria-label={`${t.downloadFor} ${name} ${architectureLabel(architecture, t, item)} ${label}`} className={`${buttonClass} hover:-translate-y-0.5 hover:bg-pieride-violet hover:text-white hover:shadow-lg active:translate-y-0`}>
                          <span className="truncate">{label}</span><Icon name="download" className="size-3.5" />
                        </a>
                      ) : (
                        <button key={format} type="button" disabled aria-label={`${name} ${label} : ${unavailable ? t.noFile : t.searchLoading}`} className={`${buttonClass} cursor-not-allowed border-pieride-line bg-pieride-soft text-pieride-muted`}>
                          <span className="truncate">{label}</span><small className="text-[8px] font-semibold">{unavailable ? t.unavailableShort : t.searchLoading}</small>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {architectures.map((variant) => {
                      const asset = release ? findAsset(release.assets, item, variant) : undefined;
                      const active = detected && architecture === variant;
                      const unavailable = status !== "loading" && !asset;
                      const label = architectureLabel(variant, t, item);
                      const buttonClass = `inline-flex min-h-12 min-w-0 items-center justify-center gap-1.5 rounded-xl border-2 px-2 text-xs font-extrabold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pieride-violet sm:text-sm ${active ? "border-pieride-ink bg-pieride-ink text-white" : "border-pieride-violet bg-white text-pieride-violet"}`;
                      return asset ? (
                        <a key={variant} href={asset.browser_download_url} aria-label={`${t.downloadFor} ${name} ${label}`} className={`${buttonClass} hover:-translate-y-0.5 hover:bg-pieride-violet hover:text-white hover:shadow-lg active:translate-y-0`}>
                          <span className="truncate">{label}</span><Icon name="download" className="size-4 shrink-0" />
                        </a>
                      ) : (
                        <button key={variant} type="button" disabled aria-label={`${name} ${label} : ${unavailable ? t.noFile : t.searchLoading}`} className={`${buttonClass} cursor-not-allowed border-pieride-line bg-pieride-soft text-pieride-muted`}>
                          <span className="truncate">{label}</span><small className="text-[8px] font-semibold">{unavailable ? t.unavailableShort : t.searchLoading}</small>
                        </button>
                      );
                    })}
                  </div>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>
      {release?.assets.length ? <details data-theme-surface className="mt-5 rounded-2xl border border-pieride-line p-4"><summary className="cursor-pointer text-sm font-semibold">{t.allFiles}</summary><ul className="mt-3 grid gap-2">{release.assets.map((asset) => <li key={asset.name}><a href={asset.browser_download_url} className="text-sm text-pieride-violet underline">{asset.name}</a></li>)}</ul></details> : null}
      <p className="mt-5 text-sm text-pieride-muted">{t.sources} · <a href={releases} target="_blank" rel="noreferrer" className="font-semibold text-pieride-violet">{t.allVersions}</a></p>
    </div>
  );
}
