import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Warning = { message: string; by: string; at: string };

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const { id } = await params;

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  if (target.role === "admin") {
    return NextResponse.json({ error: "Cannot moderate admin accounts" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const action: string | undefined = body?.action;
  const message: string =
    typeof body?.message === "string" ? body.message.slice(0, 500) : "";
  const by = admin.email || "super admin";

  switch (action) {
    case "warn": {
      const current = (target.warnings as unknown as Warning[]) || [];
      const warnings: Warning[] = [
        ...current,
        { message: message || "Warning from super admin", by, at: new Date().toISOString() },
      ];
      await prisma.user.update({
        where: { id },
        data: { warnings },
      });
      return NextResponse.json({ ok: true, warningCount: warnings.length });
    }
    case "clearWarnings":
      await prisma.user.update({ where: { id }, data: { warnings: [] } });
      return NextResponse.json({ ok: true, warningCount: 0 });
    case "block":
      await prisma.user.update({ where: { id }, data: { blocked: true } });
      return NextResponse.json({ ok: true, blocked: true });
    case "unblock":
      await prisma.user.update({ where: { id }, data: { blocked: false } });
      return NextResponse.json({ ok: true, blocked: false });
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}