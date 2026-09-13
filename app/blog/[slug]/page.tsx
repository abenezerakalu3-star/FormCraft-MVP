import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({ where: { slug, published: true } }).catch(() => null);
  if (!post) return { title: "Not found" };
  return {
    title: `${post.title} — Blog`,
    description: post.excerpt || undefined,
    openGraph: { title: post.title, description: post.excerpt || undefined, type: "article" },
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

  return (
    <div className="min-h-screen bg-canvas text-foreground">
      <div className="border-b border-line/70 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-sm font-black text-surface dark:text-background">
              F
            </span>
            {settings.siteName}
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-muted">
            <Link href="/blog" className="transition-colors hover:text-foreground">
              Blog
            </Link>
            <Link href="/register" className="btn-primary !py-2 text-sm">
              Start free
            </Link>
          </nav>
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
        <div className="mt-8 space-y-5 text-[1.05rem] leading-relaxed">
          {post.content
            .split(/\n{2,}/)
            .map((p) => p.trim())
            .filter(Boolean)
            .map((p, i) => (
              <p key={i}>{p}</p>
            ))}
        </div>
      </article>
    </div>
  );
}