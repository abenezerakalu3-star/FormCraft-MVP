import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { updateProfileSchema } from "@/lib/validate";

export async function PATCH(req: Request) {
  const user = await requireUser();

  const body = await req.json().catch(() => null);
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { name, email } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail !== user.email) {
    const taken = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (taken) {
      return NextResponse.json({ error: "That email is already in use" }, { status: 409 });
    }
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name: name.trim(), email: normalizedEmail },
  });

  return NextResponse.json({ ok: true, user: { name: updated.name, email: updated.email } });
}