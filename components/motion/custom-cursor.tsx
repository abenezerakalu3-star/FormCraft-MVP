"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorState = "default" | "hover" | "card" | "input";

const SIZES: Record<CursorState, { ring: number; dot: number }> = {
  default: { ring: 36, dot: 6 },
  hover: { ring: 56, dot: 5 },
  input: { ring: 24, dot: 8 },
  card: { ring: 64, dot: 5 },
};

export default function CustomCursor() {
  const [hidden, setHidden] = useState(true);
  const [state, setState] = useState<CursorState>("default");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 300, damping: 26, mass: 0.7 });
  const ringY = useSpring(y, { stiffness: 300, damping: 26, mass: 0.7 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
      const target = e.target as Element | null;
      if (!target) {
        setState((p) => (p === "default" ? p : "default"));
        return;
      }
      const next: CursorState = target.closest("[data-cursor='card']")
        ? "card"
        : target.closest("input, select, textarea, label")
          ? "input"
          : target.closest("a, button, [role='button'], [data-cursor]")
            ? "hover"
            : "default";
      setState((prev) => (prev === next ? prev : next));
    };

    const leave = () => setHidden(true);

    window.addEventListener("mousemove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden="true">
      <motion.div style={{ x: ringX, y: ringY }} className="fixed left-0 top-0 mix-blend-difference">
        <motion.div
          initial={false}
          animate={{
            width: SIZES[state].ring,
            height: SIZES[state].ring,
            opacity: hidden ? 0 : 1,
          }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
        />
      </motion.div>
      <motion.div style={{ x, y }} className="fixed left-0 top-0 mix-blend-difference">
        <motion.div
          initial={false}
          animate={{
            width: SIZES[state].dot,
            height: SIZES[state].dot,
            opacity: hidden ? 0 : 1,
          }}
          transition={{ type: "spring", stiffness: 520, damping: 32 }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        />
      </motion.div>
    </div>
  );
}