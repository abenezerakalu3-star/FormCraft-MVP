import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validate";
import { hashPassword } from "@/lib/passwords";
import { createSession } from "@/lib/auth";
import { hashToken, sendVerificationEmail } from "@/lib/email";
import { logSecurity } from "@/lib/logger";
import { randomBytes } from "crypto";

const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    logSecurity("register.duplicate", { email: normalizedEmail, ip });
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: { name: name.trim(), email: normalizedEmail, password: await hashPassword(password) },
  });

  const token = randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + VERIFY_TOKEN_TTL_MS),
    },
  });

  // Fire-and-forget: never block registration if email sending fails.
  sendVerificationEmail(user.email, token, user.name).catch((err) =>
    console.error("[register] Failed to send verification email:", err)
  );

  await createSession(user.id);
  logSecurity("register.success", { userId: user.id, ip });
  return NextResponse.json({ ok: true });
}