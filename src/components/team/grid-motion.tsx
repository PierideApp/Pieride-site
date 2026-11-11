"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect } from "react";
import { withBasePath } from "@/lib/site-path";
import { easeOutPapillon } from "@/lib/motion";

const images = ["/visuels/accueil.jpg", "/visuels/cours.jpg", "/visuels/notes.jpg", "/visuels/taches.jpg", "/visuels/personnalisation.jpg"];

export function GridMotion() {
  const pointer = useMotionValue(0.5);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    function onMove(event: PointerEvent) {
      if (event.pointerType === "mouse") pointer.set(event.clientX / window.innerWidth);
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointer, reduceMotion]);

  return (
    <motion.div aria-hidden initial={reduceMotion ? false : { opacity: 0, scale: 1.12 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.25, ease: easeOutPapillon }} className="absolute -inset-1/4 grid -rotate-12 grid-rows-4 gap-4 opacity-55">
      {Array.from({ length: 4 }, (_, row) => <GridRow key={row} row={row} pointer={pointer} />)}
    </motion.div>
  );
}

function GridRow({ row, pointer }: { row: number; pointer: MotionValue<number> }) {
  const direction = row % 2 ? -1 : 1;
  const target = useTransform(pointer, [0, 1], [-60 * direction, 60 * direction]);
  const x = useSpring(target, { stiffness: 32, damping: 18 });
  const rowImages = Array.from({ length: 7 }, (_, column) => images[(row * 3 + column) % images.length]);

  return (
    <motion.div style={{ x }} className="grid grid-cols-7 gap-4">
      {rowImages.map((src, index) => (
        <div key={`${row}-${index}`} className="relative aspect-video overflow-hidden rounded-2xl border-4 border-white/80 bg-pieride-violet shadow-xl shadow-black/30">
          <Image src={withBasePath(src)!} alt="" fill unoptimized sizes="(min-width: 1024px) 20vw, 40vw" className="object-cover" />
        </div>
      ))}
    </motion.div>
  );
}
