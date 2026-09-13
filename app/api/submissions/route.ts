import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { submissionSchema } from "@/lib/validate";
import { splitOptions } from "@/lib/fields";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { slug, data } = parsed.data;

  const form = await prisma.form.findUnique({
    where: { slug },
    include: { fields: { orderBy: { order: "asc" } }, user: { select: { blocked: true } } },
  });

  if (!form || !form.published || form.user.blocked) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  for (const field of form.fields) {
    if (field.required) {
      const value = data[field.id];
      if (!value || (field.type === "checkbox" && value === "")) {
        return NextResponse.json(
          { error: `Please fill in "${field.label}"` },
          { status: 400 }
        );
      }
    }

    if (field.type === "select" || field.type === "radio") {
      const allowed = splitOptions(field.options);
      if (allowed.length > 0 && data[field.id] && !allowed.includes(data[field.id])) {
        return NextResponse.json({ error: `Invalid option for "${field.label}"` }, { status: 400 });
      }
    }

    if (field.type === "email" && data[field.id] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[field.id])) {
      return NextResponse.json({ error: `Invalid email for "${field.label}"` }, { status: 400 });
    }
  }

  const submission = await prisma.submission.create({
    data: {
      formId: form.id,
      data: Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== "")
      ),
    },
  });

  return NextResponse.json({ ok: true, id: submission.id }, { status: 201 });
}