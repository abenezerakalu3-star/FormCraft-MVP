import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Inbox,
  Lock,
  Pencil,
  Table2,
  TrendingUp,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { planLimitsFor } from "@/lib/entitlements";
import CopyButton from "@/components/copy-button";
import ExportCsv from "@/components/export-csv";
import ExportExcel from "@/components/export-excel";
import ExportPdf from "@/components/export-pdf";
import FormAnalytics from "@/components/form-analytics";

export default async function FormOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const form = await prisma.form.findFirst({
    where: { id, userId: user.id },
    include: {
      fields: { orderBy: { order: "asc" } },
      submissions: { orderBy: { createdAt: "desc" } },
      _count: { select: { submissions: true, views: true } },
    },
  });

  if (!form) notFound();

  const totalViews = form._count.views;
  const totalSubs = form._count.submissions;
  const completionRate = totalViews ? Math.round((totalSubs / totalViews) * 100) : 0;

  const stats = [
    {
      label: "Total visitors",
      value: totalViews,
      tone: "text-indigo-600 dark:text-indigo-400",
      icon: Eye,
    },
    {
      label: "Total responses",
      value: totalSubs,
      tone: "text-emerald-600 dark:text-emerald-400",
      icon: Inbox,
    },
    {
      label: "Completion rate",
      value: totalViews ? `${completionRate}%` : "—",
      tone: "text-foreground",
      icon: TrendingUp,
    },
  ];

  const exportFields = form.fields.map((f) => ({ id: f.id, label: f.label }));
  const exportRows = form.submissions.map((s) => ({
    id: s.id,
    createdAt: s.createdAt.toISOString(),
    data: s.data as Record<string, string>,
  }));

  const canExport = planLimitsFor(user).exports;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 animate-fade-up">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-foreground dark:text-gray-400"
          >
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{form.title}</h1>
            <span
              className={`chip ${
                form.published
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-gray-100 text-muted dark:bg-gray-100/10"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${form.published ? "bg-emerald-500" : "bg-gray-300"}`}
              />
              {form.published ? "Live" : "Draft"}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            Created{" "}
            {form.createdAt.toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CopyButton slug={form.slug} />
          <Link href={`/dashboard/forms/${form.id}`} className="btn-secondary">
            <Pencil className="h-4 w-4" /> Edit form
          </Link>
          <Link href={`/dashboard/forms/${form.id}/submissions`} className="btn-primary">
            <Table2 className="h-4 w-4" /> View responses
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="card flex items-center gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-900/5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-muted">{s.label}</p>
              <p className={`mt-0.5 text-2xl font-bold ${s.tone}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics */}
      <div className="mt-6 rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="mb-5 text-base font-bold tracking-tight">Analytics</h2>
        <FormAnalytics formId={form.id} />
      </div>

      {/* Exports */}
      <div className="mt-6 rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="text-base font-bold tracking-tight">Export responses</h2>
        <p className="mt-1 mb-4 text-sm text-muted">
          Download all {form._count.submissions} response
          {form._count.submissions === 1 ? "" : "s"} as a file.
        </p>
        {form.submissions.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-gray-400">
            Nothing to export yet — responses will appear here once people submit your form.
          </p>
        ) : !canExport ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-line px-4 py-5">
            <p className="flex items-center gap-2 text-sm text-muted">
              <Lock className="h-4 w-4" />
              Exporting responses is available on the Pro and Team plans.
            </p>
            <Link href="/dashboard/billing" className="btn-primary">
              Upgrade
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <ExportCsv title={form.title} fields={exportFields} rows={exportRows} />
            <ExportExcel title={form.title} fields={exportFields} rows={exportRows} />
            <ExportPdf title={form.title} fields={exportFields} rows={exportRows} />
          </div>
        )}
      </div>
    </div>
  );
}