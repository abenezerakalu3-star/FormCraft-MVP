import Link from "next/link";
import { ShieldCheck, Users } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { resolvePermissions, PermissionJson } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import AdminAdminsManager, { AdminRecord } from "@/components/admin/admin-admins-manager";

export default async function AdminAdminsPage() {
  const admin = await requirePermission("admins");

  const [all, admins] = await Promise.all([
    prisma.user.count({ where: { role: "admin" } }),
    prisma.user.findMany({ where: { role: "admin" }, orderBy: { createdAt: "asc" } }),
  ]);

  const serialized: AdminRecord[] = admins.map((u) => ({
    id: u.id,
    name: u.name || "",
    email: u.email,
    permissions: resolvePermissions(u.permissions as PermissionJson),
    createdAt: u.createdAt.toISOString(),
  }));

  const stats = [
    { label: "Total admins", value: all, icon: Users, tone: "text-indigo-600 dark:text-indigo-400" },
    { label: "Your authority", value: "Full", icon: ShieldCheck, tone: "text-emerald-600 dark:text-emerald-400" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 animate-fade-up">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Link href="/admin" className="hover:text-foreground">Home</Link> / Admins
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Admins</h1>
          <p className="mt-1 text-sm text-muted">
            Create co-admins and grant them exactly the authorities they need.
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 animate-fade-up">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <p className={`text-2xl font-bold ${s.tone}`}>{s.value}</p>
              <p className="text-sm text-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <AdminAdminsManager admins={serialized} currentUserId={admin.id} />
    </div>
  );
}