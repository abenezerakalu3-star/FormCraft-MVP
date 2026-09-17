import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { blogPostSchema } from "@/lib/validate";
import { slugify } from "@/lib/slugify";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const admin = await requirePermission("blog");
  const body = await req.json().catch(() => null);
  const parsed = blogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { title, excerpt, content, published } = parsed.data;
  const slug = parsed.data.slug?.trim() || slugify(title);

  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
  }

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt: excerpt || "",
      content,
      published: published ?? false,
      authorId: admin.id,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return NextResponse.json({ ok: true, post }, { status: 201 });
}