import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS, resolvePermissions, requirePermission, Permission, PermissionJson } from "@/lib/auth";

async function othersWithAdminsAccess(excludedId: string) {
  const admins = await prisma.user.findMany({ where: { role: "admin", NOT: { id: excludedId } } });
  return admins.filter((a) => resolvePermissions(a.permissions as PermissionJson).includes("admins")).length;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requirePermission("admins");
  const { id } = await params;

  if (id === actor.id) {
    return NextResponse.json({ error: "You cannot change your own permissions" }, { status: 403 });
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target || target.role !== "admin") {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const raw: unknown = body?.permissions;
  if (!Array.isArray(raw) || raw.length === 0) {
    return NextResponse.json({ error: "Pick at least one authority" }, { status: 400 });
  }
  const permissions = raw.filter((p): p is Permission =>
    (PERMISSIONS as readonly string[]).includes(String(p))
  );
  if (permissions.length === 0) {
    return NextResponse.json({ error: "Invalid permission set" }, { status: 400 });
  }

  const targetOwned = resolvePermissions(target.permissions as PermissionJson);
  const nextHasAdmins = permissions.includes("admins");
  const targetHadAdmins = targetOwned.includes("admins");

  if (targetHadAdmins && !nextHasAdmins && (await othersWithAdminsAccess(id)) === 0) {
    return NextResponse.json(
      { error: "This is the last admin with manage-admins authority — can't remove it" },
      { status: 400 }
    );
  }

  await prisma.user.update({ where: { id }, data: { permissions } });
  return NextResponse.json({ ok: true, permissions });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requirePermission("admins");
  const { id } = await params;

  if (id === actor.id) {
    return NextResponse.json({ error: "You cannot remove your own admin access" }, { status: 403 });
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target || target.role !== "admin") {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  const targetOwned = resolvePermissions(target.permissions as PermissionJson);
  if (targetOwned.includes("admins") && (await othersWithAdminsAccess(id)) === 0) {
    return NextResponse.json(
      { error: "Cannot remove the last admin who can manage admins" },
      { status: 400 }
    );
  }

  await prisma.user.update({ where: { id }, data: { role: "user", permissions: [] } });
  return NextResponse.json({ ok: true });
}