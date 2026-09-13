import { ShieldCheck } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";
import AdminNav from "@/components/admin/admin-nav";
import LogoutButton from "@/components/logout-button";
import ThemeToggle from "@/components/theme-toggle";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-canvas">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-surface/80 backdrop-blur-md lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-line px-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/25">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight">{settings.siteName} Admin</p>
            <p className="text-xs text-muted">Super admin console</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <AdminNav />
        </div>
        <div className="border-t border-line p-4">
          <div className="mb-2 flex items-center gap-2.5 px-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {(user.name || user.email || "?").slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold">{user.name || user.email}</p>
              <span className="chip bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                Super admin
              </span>
            </div>
          </div>
          <LogoutButton backTo="/login" />
        </div>
      </aside>

      {/* Main column */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line/70 bg-surface/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold">{settings.siteName} Admin</span>
          </div>
          <p className="hidden text-sm text-muted lg:block">
            Everything that runs {settings.siteName} — one console.
          </p>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LogoutButton backTo="/login" />
          </div>
        </header>

        {/* Mobile nav */}
        <div className="border-b border-line bg-surface/80 px-4 py-2 lg:hidden">
          <AdminNav />
        </div>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}