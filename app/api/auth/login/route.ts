import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validate";
import { verifyPassword } from "@/lib/passwords";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.password))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  if (user.blocked) {
    return NextResponse.json({ error: "This account has been suspended. Contact support." }, { status: 403 });
  }

  await createSession(user.id);
  return NextResponse.json({ ok: true, role: user.role });
}