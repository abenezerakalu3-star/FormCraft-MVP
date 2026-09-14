import Link from "next/link";
import { SiteSettings } from "@/lib/settings";
import ThemeToggle from "@/components/theme-toggle";
import MobileMenu from "@/components/mobile-menu";
import SiteFooter from "@/components/site-footer";

export default function PublicShell({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-foreground">
      <header className="sticky top-0 z-40 border-b border-line/70 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-sm font-black text-surface dark:text-background">
              F
            </span>
            {settings.siteName}
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <Link href="/blog" className="transition-colors hover:text-foreground">
              Blog
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/register" className="btn-primary !py-2 text-sm">
                Start free
              </Link>
            </div>
          </nav>
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <MobileMenu
              items={[
                { href: "/", label: "Home" },
                { href: "/blog", label: "Blog" },
                { href: "/register", label: "Start free" },
              ]}
            />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
    </div>
  );
}