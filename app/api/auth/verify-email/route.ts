import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/email";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";

  if (!token) {
    return NextResponse.json(
      { error: "Missing verification token" },
      { status: 400 }
    );
  }

  const tokenHash = hashToken(token);
  const verifyToken = await prisma.verificationToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!verifyToken || verifyToken.used || verifyToken.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "This verification link is invalid or has expired. Please request a new one." },
      { status: 400 }
    );
  }

  if (verifyToken.user.emailVerified) {
    // Already verified — still mark consumed to clean up, and report success.
    await prisma.verificationToken.update({
      where: { id: verifyToken.id },
      data: { used: true },
    });
    return NextResponse.json({ ok: true, alreadyVerified: true });
  }

  await prisma.$transaction([
    prisma.verificationToken.update({
      where: { id: verifyToken.id },
      data: { used: true },
    }),
    prisma.verificationToken.updateMany({
      where: { userId: verifyToken.userId, used: false },
      data: { used: true },
    }),
    prisma.user.update({
      where: { id: verifyToken.userId },
      data: { emailVerified: new Date() },
    }),
  ]);

  return NextResponse.json({ ok: true });
}