import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, destroySession } from "@/lib/auth";

export async function DELETE() {
  const user = await requireUser();

  // Self-service deletion is disabled for admins — admins are managed and
  // removed through the admin panel, which enforces never deleting the last one.
  if (user.role === "admin") {
    return NextResponse.json(
      { error: "Admins cannot delete their own account. Remove yourself via the admin panel first." },
      { status: 403 }
    );
  }

  await prisma.user.delete({ where: { id: user.id } });
  await destroySession();

  return NextResponse.json({ ok: true });
}