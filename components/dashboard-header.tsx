"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Menu, Plus, UserRound, X } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "My forms", icon: ClipboardList },
  { href: "/dashboard/forms/new", label: "New form", icon: Plus },
  { href: "/dashboard/profile", label: "Profile", icon: UserRound },
] as const;

function isActive(href: string, pathname: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

export default function DashboardHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="hidden items-center gap-1 md:flex">
        {NAV.map((item) => {
          const active = isActive(item.href, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                active
                  ? "bg-foreground text-surface shadow-sm dark:bg-foreground dark:text-background"
                  : "text-muted hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-100/10"
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle navigation"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-foreground transition-colors hover:bg-gray-100 md:hidden dark:hover:bg-gray-100/10"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-16 z-40 border-b border-line bg-surface/95 px-4 py-3 shadow-lg backdrop-blur-md animate-fade-in md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              const active = isActive(item.href, pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-foreground text-surface dark:bg-foreground dark:text-background"
                      : "text-muted hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-100/10"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}