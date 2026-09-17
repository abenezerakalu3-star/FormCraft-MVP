import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import FadeIn from "@/components/motion/fade-in";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import ThemeToggle from "@/components/theme-toggle";
import MobileMenu from "@/components/mobile-menu";
import LogoMark from "@/components/logo-mark";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `Blog — ${settings.siteName}`,
    description: `Articles, tips, and updates from ${settings.siteName}.`,
    alternates: { canonical: "/blog" },
    openGraph: {
      title: `Blog — ${settings.siteName}`,
      description: `Articles, tips, and updates from ${settings.siteName}.`,
      type: "website",
      siteName: settings.siteName,
      url: "/blog",
    },
  };
}

export default async function BlogPage() {
  const settings = await getSiteSettings();
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="min-h-screen bg-canvas text-foreground">
      <div className="border-b border-line/70 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <LogoMark />
            {settings.siteName}
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <Link href="/pricing" className="transition-colors hover:text-foreground">
              Pricing
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/register" className="btn-primary !py-2 text-sm">
                Start free
              </Link>
            </div>
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <MobileMenu
              items={[
                { href: "/", label: "Home" },
                { href: "/pricing", label: "Pricing" },
                { href: "/register", label: "Start free" },
              ]}
            />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <FadeIn>
          <div className="mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              <Newspaper className="h-3.5 w-3.5" /> Blog
            </span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">Latest articles</h1>
            <p className="mt-2 text-muted">Tips to build forms people actually finish.</p>
          </div>
        </FadeIn>

        {posts.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface p-10 text-center text-muted">
            No articles yet — check back soon.
          </p>
        ) : (
          <Stagger className="space-y-6">
            {posts.map((p) => (
              <StaggerItem key={p.id}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="group block rounded-2xl border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-900/5 dark:hover:border-indigo-500/40"
                >
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                    {p.author?.name && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-gray-300" />
                        <span>{p.author.name}</span>
                      </>
                    )}
                  </div>
                  <h2 className="mt-2 text-xl font-bold tracking-tight transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {p.title}
                  </h2>
                  {p.excerpt && <p className="mt-2 text-sm leading-relaxed text-muted">{p.excerpt}</p>}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </main>
    </div>
  );
}