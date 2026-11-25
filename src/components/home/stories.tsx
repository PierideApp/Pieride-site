"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { DesktopMonitor } from "@/components/home/desktop-monitor";
import { Icon } from "@/components/ui/icon";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/lib/routes";

type Story = Dictionary["home"]["stories"][number];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const STORY_HOLD_VIEWPORTS = 0.32;
const STORY_TRANSITION_VIEWPORTS = 1;

function totalScrollViewports(count: number) {
  return count * STORY_HOLD_VIEWPORTS + Math.max(0, count - 1) * STORY_TRANSITION_VIEWPORTS;
}

function storyPosition(progress: number, count: number) {
  if (count <= 1) return 0;

  let distance = clamp(progress, 0, 1) * totalScrollViewports(count);
  for (let index = 0; index < count; index += 1) {
    if (distance <= STORY_HOLD_VIEWPORTS) return index;
    distance -= STORY_HOLD_VIEWPORTS;

    if (index < count - 1) {
      if (distance <= STORY_TRANSITION_VIEWPORTS) {
        const transition = distance / STORY_TRANSITION_VIEWPORTS;
        return index + transition * transition * (3 - 2 * transition);
      }
      distance -= STORY_TRANSITION_VIEWPORTS;
    }
  }
  return count - 1;
}

function storyProgress(index: number, count: number) {
  const units = totalScrollViewports(count);
  return units === 0 ? 0 : (index * (STORY_HOLD_VIEWPORTS + STORY_TRANSITION_VIEWPORTS) + STORY_HOLD_VIEWPORTS / 2) / units;
}

export function Stories({ t, locale }: { t: Dictionary["home"]["stories"]; locale: Locale }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [staticLayout, setStaticLayout] = useState(false);
  const lastIndex = Math.max(0, t.length - 1);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useEffect(() => {
    const preferences = [
      window.matchMedia("(max-width: 767px)"),
      window.matchMedia("(max-height: 650px)"),
      window.matchMedia("(prefers-reduced-motion: reduce)"),
    ];
    const update = () => setStaticLayout(preferences.some((preference) => preference.matches));
    update();
    preferences.forEach((preference) => preference.addEventListener("change", update));
    return () => preferences.forEach((preference) => preference.removeEventListener("change", update));
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (staticLayout || lastIndex === 0) return;
    const nextIndex = clamp(Math.round(storyPosition(progress, t.length)), 0, lastIndex);
    setActiveIndex((current) => current === nextIndex ? current : nextIndex);
  });

  function goToStory(index: number) {
    const section = sectionRef.current;
    if (!section || lastIndex === 0) return;

    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const scrollDistance = Math.max(0, section.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: sectionTop + storyProgress(index, t.length) * scrollDistance,
      behavior: staticLayout ? "auto" : "smooth",
    });
  }

  return (
    <section
      ref={sectionRef}
      id="stories"
      aria-label={locale === "fr" ? "Découvrir Piéride" : "Discover Piéride"}
      className="story-carousel relative bg-pieride-night"
      style={{ height: `${(totalScrollViewports(t.length) + 1) * 100}svh` }}
    >
      <div className="story-carousel__pin sticky top-0 flex h-svh items-center overflow-hidden [perspective:1400px]">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-48 top-1/4 size-[34rem] rounded-full bg-pieride-violet/30 blur-[120px]" />
          <div className="absolute -right-48 bottom-0 size-[32rem] rounded-full bg-pieride-cyan/10 blur-[120px]" />
        </div>

        {t.map((story, index) => (
          <StorySlide
            key={story.number}
            story={story}
            index={index}
            count={t.length}
            active={staticLayout || activeIndex === index}
            staticLayout={staticLayout}
            locale={locale}
            progress={scrollYProgress}
          />
        ))}

        <nav
          aria-label={locale === "fr" ? "Étapes du carrousel" : "Carousel steps"}
          className="story-carousel__progress absolute right-5 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2 sm:right-7"
        >
          {t.map((story, index) => (
            <button
              key={story.number}
              type="button"
              aria-label={`${story.number} · ${story.eyebrow}`}
              aria-current={activeIndex === index ? "step" : undefined}
              aria-controls={`story-slide-${index}`}
              onClick={() => goToStory(index)}
              className="group grid min-h-9 min-w-8 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pieride-cyan"
            >
              <span
                aria-hidden
                className={`block rounded-full transition-[height,background-color,box-shadow] duration-300 ${activeIndex === index ? "h-8 w-1.5 bg-pieride-cyan shadow-[0_0_14px_rgba(139,234,255,0.8)]" : "h-5 w-1 bg-white/25 group-hover:bg-white/60"}`}
              />
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}

function StorySlide({
  story,
  index,
  count,
  active,
  staticLayout,
  locale,
  progress,
}: {
  story: Story;
  index: number;
  count: number;
  active: boolean;
  staticLayout: boolean;
  locale: Locale;
  progress: MotionValue<number>;
}) {
  const position = useTransform(progress, (value) => storyPosition(value, count));
  const x = useTransform(position, (value) => `${(index - value) * 100}%`);
  const opacity = useTransform(position, (value) => {
    const distance = Math.abs(index - value);
    return clamp(1 - distance * 0.68, 0.12, 1);
  });
  const scale = useTransform(position, (value) => {
    const distance = Math.abs(index - value);
    return clamp(1 - distance * 0.06, 0.86, 1);
  });
  const rotateY = useTransform(position, (value) => {
    const offset = index - value;
    return `${clamp(offset * -4, -8, 8)}deg`;
  });
  const zIndex = useTransform(position, (value) => {
    const distance = Math.abs(index - value);
    return Math.round(100 - distance);
  });

  return (
    <motion.article
      id={`story-slide-${index}`}
      aria-hidden={!staticLayout && !active}
      inert={!staticLayout && !active}
      style={{ x, opacity, scale, rotateY, zIndex }}
      className={`story-carousel__slide absolute inset-y-0 left-0 flex w-screen items-center px-[5vw] [transform-style:preserve-3d] ${active ? "" : "pointer-events-none"}`}
    >
      <div className="story-carousel__panel relative mx-auto grid w-full max-w-[1600px] items-center gap-4 overflow-hidden rounded-[2rem] border border-white/15 bg-linear-to-br from-pieride-surface via-[#19165d] to-pieride-night p-5 shadow-[0_35px_100px_-35px_rgba(0,0,0,0.8)] sm:gap-7 sm:p-8 md:h-[min(78svh,760px)] md:min-h-[480px] md:grid-cols-[0.82fr_1.18fr] md:gap-12 md:rounded-[2.25rem] md:p-10 lg:p-12">
        <div className="absolute -right-20 -top-24 size-64 rounded-full bg-pieride-violet-bright/20 blur-3xl" aria-hidden />
        <div className="relative z-10 min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-pieride-cyan sm:text-sm">{story.number} · {story.eyebrow}</p>
          <h2 className="mt-3 font-display text-[clamp(1.8rem,4.3vw,4.25rem)] font-extrabold leading-[1.04] tracking-[-0.055em] text-balance">
            {story.title}<br /><span className="text-pieride-lavender">{story.titleAccent}</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:mt-6 sm:text-base lg:text-lg">{story.description}</p>
          {story.href === "/contribuer" ? (
            <Link href={localizedPath(locale, story.href)} tabIndex={active ? 0 : -1} className="group mt-5 inline-flex items-center gap-2 text-sm font-bold text-pieride-cyan transition-colors hover:text-white sm:mt-7 sm:text-base">
              {story.link}<Icon name="arrow" className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : null}
        </div>

        <div className="story-carousel__visual relative z-10 min-w-0 md:pl-1">
          <DesktopMonitor src={story.image} alt={story.alt} sizes="(min-width: 1536px) 55vw, (min-width: 1024px) 58vw, 100vw" />
        </div>
      </div>
    </motion.article>
  );
}
