import Link from "next/link";
import { SiteSettings } from "@/lib/settings";
import ThemeToggle from "@/components/theme-toggle";
import MobileMenu from "@/components/mobile-menu";
import SiteFooter from "@/components/site-footer";
import LogoMark from "@/components/logo-mark";

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
            <LogoMark />
            {settings.siteName}
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
            <Link href="/" className="nav-link transition-colors hover:text-foreground">
              Home
            </Link>
            <Link href="/blog" className="nav-link transition-colors hover:text-foreground">
              Blog
            </Link>
            <Link href="/pricing" className="nav-link transition-colors hover:text-foreground">
              Pricing
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
                { href: "/pricing", label: "Pricing" },
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