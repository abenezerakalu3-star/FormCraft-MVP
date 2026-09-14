import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { createAdminSchema } from "@/lib/validate";
import { hashPassword } from "@/lib/passwords";

export async function POST(req: Request) {
  await requirePermission("admins");

  const body = await req.json().catch(() => null);
  const parsed = createAdminSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { name, email, password, permissions } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      password: await hashPassword(password),
      role: "admin",
      permissions,
    },
  });

  return NextResponse.json(
    { ok: true, id: user.id, email: user.email },
    { status: 201 }
  );
}