"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Home,
  LayoutDashboard,
  MessagesSquare,
  Newspaper,
  Settings,
  Users,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Home", icon: LayoutDashboard, match: (p: string) => p === "/admin" },
  { href: "/admin/users", label: "Users", icon: Users, match: (p: string) => p.startsWith("/admin/users") },
  { href: "/admin/forms", label: "Forms", icon: ClipboardList, match: (p: string) => p.startsWith("/admin/forms") },
  { href: "/admin/blog", label: "Blog", icon: Newspaper, match: (p: string) => p.startsWith("/admin/blog") },
  { href: "/admin/messages", label: "Messages", icon: MessagesSquare, match: (p: string) => p.startsWith("/admin/messages") },
  { href: "/admin/settings", label: "Settings", icon: Settings, match: (p: string) => p.startsWith("/admin/settings") },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      <Link
        href="/"
        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-100/10"
      >
        <Home className="h-4 w-4" /> View website
      </Link>
      {NAV.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
              active
                ? "bg-foreground text-surface shadow-sm dark:bg-foreground dark:text-background"
                : "text-muted hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-100/10"
            }`}
          >
            <item.icon className="h-4 w-4" /> {item.label}
          </Link>
        );
      })}
    </nav>
  );
}