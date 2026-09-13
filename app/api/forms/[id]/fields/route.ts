import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { formFieldsSchema } from "@/lib/validate";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;

  const form = await prisma.form.findFirst({ where: { id, userId: user.id } });
  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = formFieldsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.field.deleteMany({ where: { formId: id } }),
    prisma.field.createMany({
      data: parsed.data.fields.map((f, i) => ({
        id: f.id,
        formId: id,
        label: f.label,
        type: f.type,
        required: f.required,
        options: f.options,
        order: i,
      })),
    }),
  ]);

  return NextResponse.json({ ok: true });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;

  const form = await prisma.form.findFirst({
    where: { id, userId: user.id },
    include: { fields: { orderBy: { order: "asc" } } },
  });
  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  return NextResponse.json({ form });
}