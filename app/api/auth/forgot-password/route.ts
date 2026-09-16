import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validate";
import { hashToken } from "@/lib/email";
import { randomBytes } from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return the same message to avoid leaking whether an email exists.
  if (!user) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // Invalidate any existing unused reset tokens for this user.
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  const token = randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });

  try {
    await sendPasswordResetEmail(user.email, token, user.name);
  } catch (err) {
    console.error("[forgot-password] Failed to send reset email:", err);
    return NextResponse.json(
      { error: "Failed to send the reset email. Please try again later." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}