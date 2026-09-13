import Link from "next/link";
import { Newspaper } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminBlogManager, { AdminBlogPost } from "@/components/admin/admin-blog-manager";

export default async function AdminBlogPage() {
  await requireAdmin();

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized: AdminBlogPost[] = posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: p.content,
    published: p.published,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="animate-fade-in">
      <div className="mb-6 animate-fade-up">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Link href="/admin" className="hover:text-foreground">Home</Link> / Blog
        </div>
        <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Newspaper className="h-6 w-6 text-indigo-500" /> Blog
        </h1>
        <p className="mt-1 text-sm text-muted">
          Publish articles on /blog for SEO and to keep visitors informed.
        </p>
      </div>

      <AdminBlogManager posts={serialized} />
    </div>
  );
}