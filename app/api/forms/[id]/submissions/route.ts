import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;

  const form = await prisma.form.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });
  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const { count } = await prisma.submission.deleteMany({ where: { formId: id } });

  return NextResponse.json({ ok: true, deleted: count });
}
