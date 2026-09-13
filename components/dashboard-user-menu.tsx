"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, UserRound } from "lucide-react";

export default function DashboardUserMenu({
  name,
  email,
}: {
  name: string | null;
  email: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const display = name || email;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-2.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-100/10"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-600 dark:text-indigo-400">
          {display.slice(0, 1).toUpperCase()}
        </span>
        <span className="hidden max-w-[8rem] truncate text-sm font-medium md:block">{display}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-11 z-50 w-52 overflow-hidden rounded-xl border border-line bg-surface shadow-xl shadow-indigo-900/10 animate-fade-up"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-semibold">{display}</p>
            <p className="truncate text-xs text-muted">{email}</p>
          </div>
          <Link
            href="/dashboard/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 hover:text-indigo-600 dark:hover:bg-gray-100/10"
          >
            <UserRound className="h-4 w-4 text-muted" /> Profile
          </Link>
          <button
            role="menuitem"
            onClick={logout}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      )}
    </div>
  );
}