"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { easeOutPapillon } from "@/lib/motion";

export function Reveal({ children, delay = 0, className = "", preserveTheme = false, surface = false }: { children: ReactNode; delay?: number; className?: string; preserveTheme?: boolean; surface?: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      data-theme-preserve={preserveTheme ? "true" : undefined}
      data-theme-surface={surface ? "true" : undefined}
      initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.985, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.65, delay, ease: easeOutPapillon }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
