import Link from "next/link";
import { requireUser } from "@/lib/auth";
import LogoutButton from "@/components/logout-button";
import ThemeToggle from "@/components/theme-toggle";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b border-line/70 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-xl font-bold tracking-tight"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-sm font-black text-surface dark:text-background">
                F
              </span>
              FormCraft
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-1.5 text-foreground transition-colors hover:bg-gray-100 dark:hover:bg-gray-100/10"
              >
                My forms
              </Link>
              <Link
                href="/dashboard/forms/new"
                className="rounded-lg px-3 py-1.5 transition-colors hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-100/10"
              >
                New form
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {(user.name || user.email || "?").slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden text-sm text-muted sm:block">
                {user.name || user.email}
              </span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}