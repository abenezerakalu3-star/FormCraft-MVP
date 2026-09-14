"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";

interface MobileMenuItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  items: MobileMenuItem[];
  rightElement?: React.ReactNode;
}

export default function MobileMenu({ items, rightElement }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle navigation"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-foreground transition-colors hover:bg-gray-100 dark:hover:bg-gray-100/10"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-line bg-surface p-2 shadow-xl animate-scale-in">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-100/10"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-1 flex items-center gap-2 border-t border-line px-3.5 py-2.5">
            <ThemeToggle />
            {rightElement}
          </div>
        </div>
      )}
    </div>
  );
}