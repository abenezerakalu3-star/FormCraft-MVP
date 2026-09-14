import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const STATIC = ["", "/blog", "/contact", "/privacy", "/terms", "/login", "/register"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.blogPost
    .findMany({ where: { published: true }, select: { slug: true, updatedAt: true } })
    .catch(() => []);

  return [
    ...STATIC.map((p) => ({
      url: `${APP_URL}${p}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...posts.map((post) => ({
      url: `${APP_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}