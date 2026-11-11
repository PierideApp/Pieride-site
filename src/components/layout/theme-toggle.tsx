"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";

type Theme = "dark" | "light";

export function ThemeToggle({ toLight, toDark, className = "" }: { toLight: string; toDark: string; className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem("pieride-theme");
    const initial: Theme = saved === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = initial;
    setTheme(initial);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("pieride-theme", next);
    setTheme(next);
  }

  const label = theme === "dark" ? toLight : toDark;
  return (
    <button type="button" onClick={toggle} aria-label={label} title={label} aria-pressed={theme === "dark"} className={`grid size-9 shrink-0 place-items-center rounded-full text-pieride-muted transition hover:bg-pieride-violet/10 hover:text-pieride-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pieride-violet ${className}`}>
      <Icon name={theme === "dark" ? "sun" : "moon"} className="size-5 transition-transform duration-300" />
    </button>
  );
}
