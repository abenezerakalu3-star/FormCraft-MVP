"use client";

import { PartyPopper } from "lucide-react";

const BALLOONS = [
  { left: 6, delay: 0, duration: 2.3, size: 44, emoji: "🎈" },
  { left: 16, delay: 0.35, duration: 2.5, size: 36, emoji: "🎈" },
  { left: 27, delay: 0.1, duration: 2.7, size: 48, emoji: "🎈" },
  { left: 38, delay: 0.5, duration: 2.4, size: 34, emoji: "🎉" },
  { left: 49, delay: 0.2, duration: 2.6, size: 46, emoji: "🎈" },
  { left: 60, delay: 0.45, duration: 2.5, size: 36, emoji: "🎉" },
  { left: 70, delay: 0.15, duration: 2.8, size: 44, emoji: "🎈" },
  { left: 80, delay: 0.4, duration: 2.4, size: 50, emoji: "🎈" },
  { left: 90, delay: 0.05, duration: 2.6, size: 38, emoji: "🎉" },
];

const CONFETTI_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#0ea5e9",
  "#8b5cf6",
];
const CONFETTI = [
  { left: 8, delay: 0.1, duration: 2.1, w: 8, h: 12, color: 0 },
  { left: 18, delay: 0.5, duration: 2.4, w: 7, h: 10, color: 1 },
  { left: 29, delay: 0.3, duration: 2.2, w: 9, h: 9, color: 2 },
  { left: 41, delay: 0.8, duration: 2.5, w: 7, h: 11, color: 3 },
  { left: 52, delay: 0.2, duration: 2.3, w: 8, h: 9, color: 4 },
  { left: 63, delay: 0.6, duration: 2.6, w: 9, h: 12, color: 5 },
  { left: 74, delay: 0.35, duration: 2.2, w: 7, h: 10, color: 1 },
  { left: 85, delay: 0.7, duration: 2.4, w: 8, h: 9, color: 0 },
  { left: 94, delay: 0.15, duration: 2.5, w: 9, h: 11, color: 2 },
  { left: 12, delay: 0.9, duration: 2.3, w: 7, h: 9, color: 3 },
  { left: 46, delay: 1, duration: 2.2, w: 8, h: 12, color: 4 },
  { left: 69, delay: 0.55, duration: 2.5, w: 7, h: 10, color: 5 },
];

export default function Celebration() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {/* Balloons rising from the bottom */}
      {BALLOONS.map((b, i) => (
        <span
          key={`b-${i}`}
          className="absolute top-0"
          style={{
            left: `${b.left}%`,
            fontSize: b.size,
            lineHeight: 1,
            animation: `balloon-rise ${b.duration}s cubic-bezier(0.45, 0, 0.55, 1) ${b.delay}s both`,
            filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.15))",
          }}
        >
          {b.emoji}
        </span>
      ))}

      {/* Confetti falling from the top */}
      {CONFETTI.map((c, i) => (
        <span
          key={`c-${i}`}
          className="absolute top-0"
          style={{
            left: `${c.left}%`,
            width: c.w,
            height: c.h,
            borderRadius: 2,
            background: CONFETTI_COLORS[c.color],
            animation: `confetti-fall ${c.duration}s ease-in ${c.delay}s both`,
          }}
        />
      ))}

      {/* macOS-style notification toast */}
      <div
        className="fixed left-1/2 top-6 -translate-x-1/2"
        style={{ animation: "mac-notify 2.8s ease-out 0.25s both" }}
      >
        <div className="flex items-center gap-2.5 rounded-2xl bg-foreground/95 px-5 py-3 text-white shadow-2xl shadow-black/20 backdrop-blur dark:bg-surface/95 dark:text-foreground dark:shadow-black/50">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-500">
            <PartyPopper className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight">Response submitted!</p>
            <p className="text-xs text-muted">Thank you for your response 🎉</p>
          </div>
        </div>
      </div>

      {/* Center pop */}
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ animation: "pop-burst 2.8s ease-out 0.3s both" }}
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/15">
          <span className="text-5xl">🎉</span>
        </div>
      </div>
    </div>
  );
}