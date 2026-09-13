import Link from "next/link";
import { FileText, Globe, Inbox } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminFormsList, { AdminForm } from "@/components/admin/admin-forms-list";

export default async function AdminFormsPage() {
  await requireAdmin();

  const [forms, total, live] = await Promise.all([
    prisma.form.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { email: true } },
        _count: { select: { submissions: true, views: true } },
      },
    }),
    prisma.form.count(),
    prisma.form.count({ where: { published: true } }),
  ]);

  const serialized: AdminForm[] = forms.map((f) => ({
    id: f.id,
    title: f.title,
    slug: f.slug,
    ownerEmail: f.user.email,
    published: f.published,
    createdAt: f.createdAt.toISOString(),
    submissions: f._count.submissions,
    views: f._count.views,
  }));

  const responses = forms.reduce((n, f) => n + f._count.submissions, 0);

  const stats = [
    { label: "Total forms", value: total, icon: FileText, tone: "text-indigo-600 dark:text-indigo-400" },
    { label: "Live forms", value: live, icon: Globe, tone: "text-emerald-600 dark:text-emerald-400" },
    { label: "Drafts", value: total - live, icon: FileText, tone: "text-amber-600 dark:text-amber-400" },
    { label: "All responses", value: responses, icon: Inbox, tone: "text-sky-600 dark:text-sky-400" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 animate-fade-up">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Link href="/admin" className="hover:text-foreground">Home</Link> / Forms
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Forms</h1>
          <p className="mt-1 text-sm text-muted">
            Every form created on the platform — live and draft.
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4 animate-fade-up">
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

      <AdminFormsList forms={serialized} />
    </div>
  );
}