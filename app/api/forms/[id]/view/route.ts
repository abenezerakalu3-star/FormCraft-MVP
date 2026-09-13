import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const form = await prisma.form.findUnique({
    where: { id },
    select: { id: true, published: true },
  });

  if (!form || !form.published) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const visitorId: string | null = typeof body?.visitorId === "string" && body.visitorId ? body.visitorId : null;

  if (visitorId) {
    const recent = await prisma.formView.findFirst({
      where: { formId: id, visitorId },
      orderBy: { createdAt: "desc" },
    });
    if (recent && Date.now() - recent.createdAt.getTime() < 30 * 60 * 1000) {
      return NextResponse.json({ ok: true, deduped: true });
    }
  }

  const view = await prisma.formView.create({
    data: { formId: id, visitorId },
  });

  return NextResponse.json({ ok: true, id: view.id }, { status: 201 });
}