import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { createFormSchema } from "@/lib/validate";
import { newSlug } from "@/lib/fields";

export async function POST(req: Request) {
  const user = await requireUser();
  const body = await req.json().catch(() => null);

  const parsed = createFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const form = await prisma.form.create({
    data: {
      userId: user.id,
      title: parsed.data.title,
      slug: newSlug(),
      fields: parsed.data.fields?.length
        ? {
            create: parsed.data.fields.map((field, order) => ({
              id: field.id,
              type: field.type,
              label: field.label,
              required: field.required,
              options: field.options,
              order,
            })),
          }
        : undefined,
    },
  });

  return NextResponse.json({ form }, { status: 201 });
}

export async function GET() {
  const user = await requireUser();
  const forms = await prisma.form.findMany({
    where: { userId: user.id },
    include: { _count: { select: { submissions: true, fields: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ forms });
}