import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { hashToken, sendVerificationEmail } from "@/lib/email";
import { randomBytes } from "crypto";

const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST() {
  const user = await requireUser();

  if (user.emailVerified) {
    return NextResponse.json({ error: "Your email is already verified." }, { status: 400 });
  }

  // Prevent abuse: only allow a resend if the previous token has expired (>5 min old).
  const latest = await prisma.verificationToken.findFirst({
    where: { userId: user.id, used: false },
    orderBy: { createdAt: "desc" },
  });
  if (latest && Date.now() - latest.createdAt.getTime() < 5 * 60 * 1000) {
    return NextResponse.json(
      { error: "A verification email was sent recently. Please check your inbox." },
      { status: 429 }
    );
  }

  await prisma.verificationToken.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  const token = randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + VERIFY_TOKEN_TTL_MS),
    },
  });

  try {
    await sendVerificationEmail(user.email, token, user.name);
  } catch (err) {
    console.error("[resend-verification] Failed to send verification email:", err);
    return NextResponse.json(
      { error: "Failed to send the verification email. Please try again later." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}