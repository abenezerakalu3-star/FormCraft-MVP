"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

export default function TiltCard({
  children,
  className,
  intensity = 5,
  spotlight = "rgba(99,102,241,0.10)",
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  spotlight?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const active = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [0, 1], [intensity, -intensity]), {
    stiffness: 220,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-intensity, intensity]), {
    stiffness: 220,
    damping: 24,
  });
  const glowX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(py, [0, 1], ["0%", "100%"]);
  const spotlightOpacity = useSpring(active, { stiffness: 200, damping: 26 });
  const bg = useTransform([glowX, glowY], (latest) => {
    const [gx, gy] = latest as [string, string];
    return `radial-gradient(240px circle at ${gx} ${gy}, ${spotlight}, transparent 62%)`;
  });

  function onMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    active.set(1);
  }

  function onMouseLeave() {
    px.set(0.5);
    py.set(0.5);
    active.set(0);
  }

  return (
    <div className={`relative ${className}`} style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group h-full w-full"
      >
        {children}
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: bg, opacity: spotlightOpacity }}
      />
    </div>
  );
}