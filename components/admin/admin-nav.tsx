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
  ShieldCheck,
  Users,
} from "lucide-react";
import { Permission, resolvePermissions } from "@/lib/permissions";

const MAIN = [
  { href: "/admin", label: "Home", icon: LayoutDashboard, match: (p: string) => p === "/admin", perm: null },
  { href: "/admin/users", label: "Users", icon: Users, match: (p: string) => p.startsWith("/admin/users"), perm: "users" as Permission },
  { href: "/admin/forms", label: "Forms", icon: ClipboardList, match: (p: string) => p.startsWith("/admin/forms"), perm: "forms" as Permission },
  { href: "/admin/blog", label: "Blog", icon: Newspaper, match: (p: string) => p.startsWith("/admin/blog"), perm: "blog" as Permission },
];

const SYSTEM = [
  { href: "/admin/messages", label: "Messages", icon: MessagesSquare, match: (p: string) => p.startsWith("/admin/messages"), perm: "messages" as Permission },
  { href: "/admin/admins", label: "Admins", icon: ShieldCheck, match: (p: string) => p.startsWith("/admin/admins"), perm: "admins" as Permission },
  { href: "/admin/settings", label: "Settings", icon: Settings, match: (p: string) => p.startsWith("/admin/settings"), perm: "settings" as Permission },
];

type NavItem = (typeof MAIN)[number];

function filterItems(items: NavItem[], owned: Permission[]) {
  return items.filter((item) => item.perm === null || owned.includes(item.perm));
}

function NavItem({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = item.match(pathname);
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
        active
          ? "bg-foreground text-surface shadow-sm dark:bg-foreground dark:text-background"
          : "text-muted hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-100/10"
      }`}
    >
      <item.icon className="h-4 w-4" /> {item.label}
    </Link>
  );
}

export default function AdminNav({ permissions }: { permissions: unknown }) {
  const owned = resolvePermissions(permissions as Permission[] | null | undefined);

  return (
    <nav className="space-y-5">
      <Link
        href="/"
        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-100/10"
      >
        <Home className="h-4 w-4" /> View website
      </Link>

      {filterItems(MAIN, owned).length > 0 && (
        <div>
          <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            Overview
          </p>
          <div className="space-y-1">
            {filterItems(MAIN, owned).map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        </div>
      )}

      {filterItems(SYSTEM, owned).length > 0 && (
        <div>
          <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            System
          </p>
          <div className="space-y-1">
            {filterItems(SYSTEM as NavItem[], owned).map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}