import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validate";
import { hashToken } from "@/lib/email";
import { hashPassword } from "@/lib/passwords";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { token, password } = parsed.data;
  const tokenHash = hashToken(token);

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "This reset link is invalid or has expired. Please request a new one." },
      { status: 400 }
    );
  }

  // One-time use — mark consumed and invalidate any other outstanding tokens.
  await prisma.$transaction([
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    }),
    prisma.passwordResetToken.updateMany({
      where: { userId: resetToken.userId, used: false },
      data: { used: true },
    }),
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: await hashPassword(password) },
    }),
  ]);

  return NextResponse.json({ ok: true });
}