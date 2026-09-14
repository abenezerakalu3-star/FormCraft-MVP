import Link from "next/link";
import { AlertTriangle, Ban, Users } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminUsersList, { AdminUser } from "@/components/admin/admin-users-list";

export default async function AdminUsersPage() {
  await requirePermission("users");

  const [users, total, blocked] = await Promise.all([
    prisma.user.findMany({
      where: { role: "user" },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { forms: true } } },
    }),
    prisma.user.count({ where: { role: "user" } }),
    prisma.user.count({ where: { role: "user", blocked: true } }),
  ]);

  const warnedCount = users.filter((u) => (u.warnings as unknown as unknown[])?.length > 0).length;

  const serialized: AdminUser[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    createdAt: u.createdAt.toISOString(),
    blocked: u.blocked,
    warnings: (u.warnings as unknown as { message: string; by: string; at: string }[]) || [],
    formCount: u._count.forms,
  }));

  const stats = [
    { label: "Total users", value: total, icon: Users, tone: "text-indigo-600 dark:text-indigo-400" },
    { label: "Blocked", value: blocked, icon: Ban, tone: "text-red-600 dark:text-red-400" },
    { label: "Warned", value: warnedCount, icon: AlertTriangle, tone: "text-amber-600 dark:text-amber-400" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 animate-fade-up">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Link href="/admin" className="hover:text-foreground">Home</Link> / Users
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-muted">
            Every account on the platform — search, warn, or block.
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3 animate-fade-up">
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

      <AdminUsersList users={serialized} />

      <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-3 text-xs text-amber-700 dark:text-amber-400">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        Blocked users are logged out immediately and can no longer sign in. Warned users see the warning
        on their dashboard.
      </div>
    </div>
  );
}