"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  FolderKanban,
  Plus,
  CreditCard,
  UserRound,
  LayoutTemplate,
  Compass,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import LogoMark from "@/components/logo-mark";
import ThemeToggle from "@/components/theme-toggle";
import DashboardUserMenu from "@/components/dashboard-user-menu";

interface NavItem {
  href: string;
  label: string;
  icon: any;
  badge?: string;
  isExternal?: boolean;
}

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Workspace",
    items: [
      { href: "/dashboard", label: "My forms", icon: FolderKanban },
      { href: "/templates", label: "Templates", icon: LayoutTemplate },
    ],
  },
  {
    title: "Account & Preferences",
    items: [
      { href: "/dashboard/billing", label: "Billing & Plans", icon: CreditCard },
      { href: "/dashboard/profile", label: "Profile", icon: UserRound },
    ],
  },
  {
    title: "Resources",
    items: [
      { href: "/guide", label: "How it works", icon: Compass },
    ],
  },
];

function isActive(href: string, pathname: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

function getBreadcrumb(pathname: string) {
  if (pathname === "/dashboard") return "My forms";
  if (pathname.startsWith("/dashboard/forms/new")) return "New form";
  if (pathname.includes("/submissions")) return "Submissions";
  if (pathname.startsWith("/dashboard/forms/")) return "Edit form";
  if (pathname.startsWith("/dashboard/billing")) return "Billing & Plans";
  if (pathname.startsWith("/dashboard/profile")) return "Profile Settings";
  return "Overview";
}

interface SidebarContentProps {
  name: string | null;
  email: string;
  pathname: string;
  setMobileOpen?: (open: boolean) => void;
  logout: () => void;
}

function SidebarContent({ name, email, pathname, setMobileOpen, logout }: SidebarContentProps) {
  const closeMobile = () => setMobileOpen?.(false);
  const initial = (name || email || "U").trim().charAt(0).toUpperCase();

  return (
    <div className="flex h-full w-[260px] flex-col justify-between bg-surface/95 text-foreground backdrop-blur-xl">
      {/* Top Branding & Quick Action */}
      <div className="flex flex-col">
        {/* App Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line/50 px-5">
          <Link
            href="/dashboard"
            onClick={closeMobile}
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600 ring-1 ring-indigo-600/20 transition-transform group-hover:scale-105 dark:bg-indigo-500/20 dark:text-indigo-400 dark:ring-indigo-500/30">
              <LogoMark />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-foreground">
                Formitect
              </span>
              <span className="text-[10px] font-medium tracking-wide text-muted">
                WORKSPACE
              </span>
            </div>
          </Link>
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>

        {/* Primary CTA Button: Create Form */}
        <div className="px-3.5 pt-4 pb-2">
          <Link
            href="/dashboard/forms/new"
            onClick={closeMobile}
            className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-600/30 hover:brightness-105 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
            <span>Create new form</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </Link>
        </div>

        {/* Grouped Navigation Links */}
        <div className="flex flex-col gap-5 overflow-y-auto px-3 py-3">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="flex flex-col gap-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted/70">
                {group.title}
              </span>
              <div className="mt-0.5 flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href, pathname);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobile}
                      className={`group relative flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 ${
                        active
                          ? "bg-indigo-50/80 font-semibold text-indigo-600 shadow-xs dark:bg-indigo-500/15 dark:text-indigo-300"
                          : "text-muted hover:bg-canvas/80 hover:text-foreground dark:hover:bg-canvas/40"
                      }`}
                    >
                      <div className="relative z-10 flex items-center gap-2.5">
                        <Icon
                          className={`h-4 w-4 transition-colors ${
                            active
                              ? "text-indigo-600 dark:text-indigo-400"
                              : "text-muted/80 group-hover:text-foreground"
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      {active && (
                        <motion.div
                          layoutId="active-indicator"
                          className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Bottom Profile & Settings Card */}
      <div className="border-t border-line/50 p-3">
        <div className="rounded-2xl border border-line/60 bg-canvas/50 p-2.5 shadow-xs transition-colors hover:border-line dark:bg-canvas/30">
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/dashboard/profile"
              onClick={closeMobile}
              className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg transition-opacity hover:opacity-80"
            >
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-xs font-bold text-white shadow-xs">
                {initial}
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-surface bg-emerald-500" />
              </div>
              <div className="flex min-w-0 flex-col">
                <p className="truncate text-xs font-semibold text-foreground">
                  {name || "User"}
                </p>
                <p className="truncate text-[10px] text-muted">
                  {email}
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-1">
              <ThemeToggle />
              <button
                onClick={logout}
                title="Sign out"
                aria-label="Sign out"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-red-500/10 hover:text-red-600 dark:hover:bg-red-500/15 dark:hover:text-red-400"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardSidebar({
  name,
  email,
  children,
}: {
  name: string | null;
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const breadcrumb = getBreadcrumb(pathname);

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Desktop Sidebar (Smooth collapsible) */}
      <motion.aside
        initial={false}
        animate={{ width: desktopOpen ? 260 : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="hidden shrink-0 flex-col border-r border-line/60 bg-surface md:flex overflow-hidden whitespace-nowrap shadow-xs"
      >
        <SidebarContent
          name={name}
          email={email}
          pathname={pathname}
          logout={logout}
        />
      </motion.aside>

      {/* Main Content Area with Sleek Top Header */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line/40 bg-surface/80 px-4 md:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-line/70 bg-surface text-foreground shadow-xs transition-colors hover:bg-canvas md:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Desktop Gemini-style Sidebar Collapse Button */}
            <button
              onClick={() => setDesktopOpen(!desktopOpen)}
              title={desktopOpen ? "Collapse sidebar" : "Expand sidebar"}
              className="hidden h-9 w-9 items-center justify-center rounded-xl border border-line/60 bg-surface/70 text-muted shadow-xs transition-all hover:border-line hover:bg-surface hover:text-foreground active:scale-95 md:flex"
            >
              {desktopOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeftOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              )}
            </button>

            {/* Breadcrumb Navigation Indicator */}
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <span className="text-muted hidden sm:inline">Dashboard</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted/50 hidden sm:inline" />
              <span className="font-semibold text-foreground tracking-tight">
                {breadcrumb}
              </span>
            </div>
          </div>

          {/* Right Header Controls on Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <DashboardUserMenu name={name} email={email} />
          </div>
        </header>

        {/* Mobile Sidebar Overlay Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className="fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-line bg-surface shadow-2xl md:hidden"
              >
                <div className="absolute right-3.5 top-4 z-10">
                  <button
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close sidebar"
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-line/60 bg-surface text-muted transition-colors hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <SidebarContent
                  name={name}
                  email={email}
                  pathname={pathname}
                  setMobileOpen={setMobileOpen}
                  logout={logout}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
