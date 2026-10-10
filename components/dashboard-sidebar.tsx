"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardList, CreditCard, Menu, Plus, UserRound, X, LogOut } from "lucide-react";
import LogoMark from "@/components/logo-mark";
import ThemeToggle from "@/components/theme-toggle";
import DashboardUserMenu from "@/components/dashboard-user-menu";

const NAV = [
  { href: "/dashboard", label: "My forms", icon: ClipboardList },
  { href: "/dashboard/forms/new", label: "New form", icon: Plus },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/profile", label: "Profile", icon: UserRound },
] as const;

function isActive(href: string, pathname: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

export default function DashboardSidebar({ name, email, children }: { name: string | null; email: string, children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const SidebarContent = () => (
    <>
      <div className="flex h-16 shrink-0 items-center px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xl font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <LogoMark />
          Formitect
        </Link>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
        <nav className="flex flex-1 flex-col gap-1.5">
          {NAV.map((item) => {
            const active = isActive(item.href, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "text-surface dark:text-background"
                    : "text-muted hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-100/10"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-foreground shadow-sm dark:bg-foreground"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 flex flex-col gap-1.5 border-t border-line pt-4">
          <div className="mb-2 px-3">
            <p className="truncate text-sm font-semibold">{name || email}</p>
            <p className="truncate text-xs text-muted">{email}</p>
          </div>
          
          <div className="flex items-center justify-between px-3 py-1">
            <span className="text-sm font-medium text-muted">Theme</span>
            <ThemeToggle />
          </div>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar & Header */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-surface/80 px-4 backdrop-blur-md md:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-foreground transition-colors hover:bg-gray-100 dark:hover:bg-gray-100/10"
            >
              <Menu className="h-4 w-4" />
            </button>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg font-bold tracking-tight"
            >
              <LogoMark />
              Formitect
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <DashboardUserMenu name={name} email={email} />
          </div>
        </header>

        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-surface md:hidden"
              >
                <div className="absolute right-4 top-4">
                  <button
                    onClick={() => setOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-muted hover:text-foreground dark:bg-gray-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
