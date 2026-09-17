import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { submissionSchema } from "@/lib/validate";
import { splitOptions } from "@/lib/fields";
import { parseFileValue } from "@/lib/files";
import { sendFirstSubmissionNotification, sendSubmissionNotification } from "@/lib/email";
import { isUnlimited, planLimitsFor } from "@/lib/entitlements";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { slug, data } = parsed.data;

  const form = await prisma.form.findUnique({
    where: { slug },
    include: {
      fields: { orderBy: { order: "asc" } },
      user: {
        select: {
          id: true,
          blocked: true,
          email: true,
          name: true,
          plan: true,
          planStatus: true,
          currentPeriodEnd: true,
        },
      },
    },
  });

  if (!form || !form.published || form.user.blocked) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const ownerLimits = planLimitsFor(form.user);
  if (!isUnlimited(ownerLimits.responsesPerMonth)) {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthlyCount = await prisma.submission.count({
      where: { form: { userId: form.user.id }, createdAt: { gte: monthStart } },
    });
    if (monthlyCount >= ownerLimits.responsesPerMonth) {
      return NextResponse.json(
        { error: "This form is not accepting responses right now." },
        { status: 429 }
      );
    }
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

    if (field.type === "file" && data[field.id]) {
      const file = parseFileValue(data[field.id]);
      if (
        !file ||
        !file.name ||
        typeof file.size !== "number" ||
        (!file.url.startsWith("/uploads/") && !file.url.startsWith("/api/files"))
      ) {
        return NextResponse.json({ error: `Invalid file for "${field.label}"` }, { status: 400 });
      }
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

  // Notify the owner (fire-and-forget, never block the response).
  const [count, viewCount] = await Promise.all([
    prisma.submission.count({ where: { formId: form.id } }),
    prisma.formView.count({ where: { formId: form.id } }),
  ]);

  if (count === 1) {
    // Milestone: the first person ever viewed and filled this form.
    sendFirstSubmissionNotification(form.user.email, form.user.name, form.title, viewCount).catch(
      (err) => console.error("[submissions] First-submission notification failed:", err)
    );
  } else if (form.notifyOnSubmission) {
    sendSubmissionNotification(form.user.email, form.user.name, form.title, count).catch(
      (err) => console.error("[submissions] Notification failed:", err)
    );
  }

  return NextResponse.json({ ok: true, id: submission.id }, { status: 201 });
}