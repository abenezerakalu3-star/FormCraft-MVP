import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { blogPostSchema } from "@/lib/validate";
import { slugify } from "@/lib/slugify";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const { id } = await params;

  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = blogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { title, excerpt, content, published } = parsed.data;
  const slug = parsed.data.slug?.trim() || slugify(title);
  if (slug !== post.slug) {
    const clash = await prisma.blogPost.findUnique({ where: { slug } });
    if (clash) {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
    }
  }

  const updated = await prisma.blogPost.update({
    where: { id },
    data: {
      title: title ?? post.title,
      slug,
      excerpt: excerpt ?? post.excerpt,
      content: content ?? post.content,
      published: published ?? post.published,
      authorId: post.authorId ?? admin.id,
    },
  });

  return NextResponse.json({ ok: true, post: updated });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}