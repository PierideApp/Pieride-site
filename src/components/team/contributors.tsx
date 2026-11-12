"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { Dictionary } from "@/i18n/dictionaries/fr";

const repository = "https://github.com/PierideApp/Pieride";
const contributorsApi = "https://api.github.com/repos/PierideApp/Pieride/contributors?per_page=8";
type Contributor = { login: string; html_url: string; avatar_url: string; contributions: number };

export function Contributors({ t }: { t: Dictionary["team"] }) {
  const [people, setPeople] = useState<Contributor[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 9000);
    let active = true;
    fetch(contributorsApi, { headers: { Accept: "application/vnd.github+json" }, signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("GitHub unavailable");
        if (response.status === 204) return [];
        return response.json() as Promise<Contributor[]>;
      })
      .then((data) => {
        if (!active) return;
        setPeople(Array.isArray(data) ? data.filter((person) => person.login && person.html_url) : []);
        setStatus("ready");
      })
      .catch(() => { if (active) setStatus("unavailable"); })
      .finally(() => window.clearTimeout(timeout));
    return () => { active = false; window.clearTimeout(timeout); controller.abort(); };
  }, []);

  return (
    <div data-theme-surface className="mx-auto max-w-4xl rounded-3xl bg-white p-5 text-pieride-ink shadow-2xl shadow-black/20 sm:p-7" aria-live="polite">
      <div className="flex items-center gap-4 border-b border-pieride-line pb-5">
        <span className="grid size-12 place-items-center rounded-2xl bg-pieride-violet/10 text-pieride-violet"><Icon name="heart" className="size-6" /></span>
        <span className="grid gap-1"><strong className="text-lg">{t.contributorsTitle}</strong><small className="text-sm text-pieride-muted">{t.contributorsDescription}</small></span>
      </div>
      {status === "loading" && <p className="py-6 text-base text-pieride-muted">{t.loading}</p>}
      {status === "unavailable" && <p className="py-6 text-base text-pieride-muted">{t.unavailable}</p>}
      {status === "ready" && !people.length && <p className="py-6 text-base text-pieride-muted">{t.empty}</p>}
      {people.length > 0 && (
        <ul className="grid gap-3 py-5 sm:grid-cols-2">
          {people.map((person) => (
            <li key={person.login}>
              <a href={person.html_url} target="_blank" rel="noreferrer" aria-label={`${t.profileLabel} ${person.login}`} className="flex items-center gap-3 rounded-2xl border border-pieride-line p-3 transition hover:border-pieride-violet/40 hover:bg-pieride-violet/5">
                <Image src={person.avatar_url} alt="" width={44} height={44} unoptimized className="size-11 rounded-full object-cover" />
                <span className="grid min-w-0 flex-1 gap-1"><strong className="truncate">{person.login}</strong><small className="text-sm text-pieride-muted">{person.contributions} {person.contributions === 1 ? t.contribution : t.contributions}</small></span>
                <Icon name="external" className="size-4 text-pieride-muted" />
              </a>
            </li>
          ))}
        </ul>
      )}
      <a href={`${repository}/graphs/contributors`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-base font-semibold text-pieride-violet transition hover:gap-3">{t.allContributions}<Icon name="arrow" className="size-5" /></a>
    </div>
  );
}
