"use client";

import { createContext, useContext, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

const ParallaxContext = createContext<{ x: MotionValue<number>; y: MotionValue<number> } | null>(
  null
);

export function PointerParallax({
  children,
  className,
  max = 14,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const x = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 60, damping: 20 });
  const y = useSpring(useTransform(my, [0, 1], [-max, max]), { stiffness: 60, damping: 20 });

  function onMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  function onMouseLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
      style={{
        x: useTransform(x, (v) => v * -0.2),
        y: useTransform(y, (v) => v * -0.2),
      }}
    >
      <ParallaxContext.Provider value={{ x, y }}>{children}</ParallaxContext.Provider>
    </motion.div>
  );
}

export function ParallaxLayer({
  children,
  depth = 1,
  className,
}: {
  children: React.ReactNode;
  depth?: number;
  className?: string;
}) {
  const ctx = useContext(ParallaxContext);
  const fallbackX = useMotionValue(0);
  const fallbackY = useMotionValue(0);
  const x = useTransform(ctx?.x ?? fallbackX, (v) => v * depth);
  const y = useTransform(ctx?.y ?? fallbackY, (v) => v * depth);

  if (!ctx) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div className={className} style={{ x, y }}>
      {children}
    </motion.div>
  );
}