import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import ThemeToggle from "@/components/theme-toggle";
import MobileMenu from "@/components/mobile-menu";
import LogoMark from "@/components/logo-mark";
import BlogContent from "@/components/blog-content";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost
    .findFirst({ where: { slug, published: true }, include: { author: { select: { name: true } } } })
    .catch(() => null);
  if (!post) return { title: "Not found" };
  const excerpt = post.excerpt || undefined;
  return {
    title: post.title,
    description: excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: excerpt,
      type: "article",
      url: `/blog/${slug}`,
      publishedTime: post.createdAt.toISOString(),
      authors: post.author?.name ? [post.author.name] : undefined,
    },
    twitter: { card: "summary_large_image", title: post.title, description: excerpt },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const settings = await getSiteSettings();
  const post = await prisma.blogPost.findFirst({
    where: { slug, published: true },
    include: { author: { select: { name: true } } },
  });

  if (!post) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    image: undefined,
    datePublished: post.createdAt.toISOString(),
    author: post.author?.name
      ? { "@type": "Person", name: post.author.name }
      : { "@type": "Organization", name: settings.siteName },
    publisher: { "@type": "Organization", name: settings.siteName },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };

  return (
    <div className="min-h-screen bg-canvas text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="border-b border-line/70 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <LogoMark />
            {settings.siteName}
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
            <Link href="/blog" className="transition-colors hover:text-foreground">
              Blog
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
                { href: "/blog", label: "Blog" },
                { href: "/pricing", label: "Pricing" },
                { href: "/register", label: "Start free" },
              ]}
            />
          </div>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All articles
        </Link>
        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight">{post.title}</h1>
        <p className="mt-4 text-sm text-muted">
          {new Date(post.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {post.author?.name && <span> · {post.author.name}</span>}
        </p>
        {post.excerpt && (
          <p className="mt-6 border-l-2 border-indigo-500/60 pl-4 text-lg italic text-muted">
            {post.excerpt}
          </p>
        )}
        <div className="mt-8">
          <BlogContent content={post.content} />
        </div>
      </article>
    </div>
  );
}