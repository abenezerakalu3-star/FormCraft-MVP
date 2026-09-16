import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function PUT(req: Request) {
  const user = await requireUser();

  const body = await req.json().catch(() => null);
  const completed = typeof body?.completed === "boolean" ? body.completed : true;

  await prisma.user.update({
    where: { id: user.id },
    data: { onboardingCompleted: completed },
  });

  return NextResponse.json({ ok: true });
}