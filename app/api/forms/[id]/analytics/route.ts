import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

const DAYS = 30;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;

  const form = await prisma.form.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });
  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const cutoff = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000);

  const [recentViews, recentSubmissions, totalViews, totalSubmissions] = await Promise.all([
    prisma.formView.findMany({
      where: { formId: id, createdAt: { gte: cutoff } },
      select: { createdAt: true },
    }),
    prisma.submission.findMany({
      where: { formId: id, createdAt: { gte: cutoff } },
      select: { createdAt: true },
    }),
    prisma.formView.count({ where: { formId: id } }),
    prisma.submission.count({ where: { formId: id } }),
  ]);

  const byDay = new Map<string, { views: number; submissions: number }>();
  for (let i = DAYS - 1; i >= 0; i--) {
    const day = new Date(cutoff.getTime() + i * 24 * 60 * 60 * 1000);
    byDay.set(day.toISOString().slice(0, 10), { views: 0, submissions: 0 });
  }

  for (const v of recentViews) {
    const key = v.createdAt.toISOString().slice(0, 10);
    const entry = byDay.get(key);
    if (entry) entry.views += 1;
  }
  for (const s of recentSubmissions) {
    const key = s.createdAt.toISOString().slice(0, 10);
    const entry = byDay.get(key);
    if (entry) entry.submissions += 1;
  }

  const daily = Array.from(byDay, ([date, counts]) => ({ date, ...counts }));
  const completionRate = totalViews ? Math.round((totalSubmissions / totalViews) * 100) : 0;

  return NextResponse.json({
    totals: { views: totalViews, submissions: totalSubmissions, completionRate },
    daily,
    pie: [
      { name: "Visited only", value: Math.max(totalViews - totalSubmissions, 0) },
      { name: "Submitted", value: totalSubmissions },
    ],
  });
}