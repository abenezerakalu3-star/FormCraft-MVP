import Link from "next/link";
import { requireUser } from "@/lib/auth";
import DashboardWarningBanner from "@/components/dashboard-warning-banner";
import DashboardHeader from "@/components/dashboard-header";
import DashboardUserMenu from "@/components/dashboard-user-menu";
import ThemeToggle from "@/components/theme-toggle";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const warnings =
    (user.warnings as unknown as { message: string; by: string; at: string }[] | null) || [];

  return (
    <div className="min-h-screen bg-canvas">
      {warnings.length > 0 && <DashboardWarningBanner message={warnings[warnings.length - 1].message} />}
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
              Formitect
            </Link>
            <DashboardHeader />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <DashboardUserMenu name={user.name} email={user.email} />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}