import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validate";
import { verifyPassword } from "@/lib/passwords";
import { createSession } from "@/lib/auth";
import { logSecurity } from "@/lib/logger";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.password))) {
    logSecurity("login.failed", { email, ip });
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  if (user.blocked) {
    logSecurity("login.blocked", { userId: user.id, email, ip });
    return NextResponse.json({ error: "This account has been suspended. Contact support." }, { status: 403 });
  }

  await createSession(user.id);
  logSecurity("login.success", { userId: user.id, ip });
  return NextResponse.json({ ok: true, role: user.role });
}