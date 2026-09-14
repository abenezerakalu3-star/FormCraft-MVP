import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requirePermission("messages");
  const { id } = await params;

  const msg = await prisma.contactMessage.findUnique({ where: { id } });
  if (!msg) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  await prisma.contactMessage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}