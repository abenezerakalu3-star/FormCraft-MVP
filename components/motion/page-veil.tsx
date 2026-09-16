"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";

export default function PageVeil() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const first = useRef(true);
  const opacity = useMotionValue(0);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduced) return;
    const controls = animate(opacity, [0, 0.4, 0.4, 0], {
      duration: 0.42,
      times: [0, 0.2, 0.45, 1],
      ease: ["easeIn", "easeOut", "easeOut"],
    });
    return () => controls.stop();
  }, [pathname, reduced, opacity]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] bg-canvas"
      style={{ opacity }}
      data-page-veil
    />
  );
}