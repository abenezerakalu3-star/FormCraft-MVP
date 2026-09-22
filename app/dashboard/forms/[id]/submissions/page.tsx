import { getAppUrl } from "@/lib/url";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Inbox } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { planLimitsFor } from "@/lib/entitlements";
import CopyButton from "@/components/copy-button";
import ExportCsv from "@/components/export-csv";
import SubmissionsTable from "@/components/submissions-table";

export default async function SubmissionsPage({
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
    },
  });

  if (!form) notFound();

  const total = form.submissions.length;
  /* eslint-disable react-hooks/purity */
  const lastWeek = form.submissions.filter(
    (s) => Date.now() - new Date(s.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
  ).length;
  /* eslint-enable react-hooks/purity */

  const totalViews = await prisma.formView.count({ where: { formId: id } });
  const completionRate = totalViews > 0 ? Math.round((total / totalViews) * 100) : 0;

  const canExport = planLimitsFor(user).exports;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 animate-fade-up">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-foreground dark:text-gray-400">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{form.title}</h1>
            <span
              className={`chip ${form.published ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-gray-100 text-muted dark:bg-gray-100/10"}`}
            >
              {form.published ? "Live" : "Draft"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/forms/${form.id}`} className="btn-secondary">
            Edit form
          </Link>
          {form.published && (
            <a
              href={`/form/${form.slug}`}
              target="_blank"
              className="btn-primary"
            >
              View live <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Total responses", value: total, tone: "text-foreground" },
          { label: "This week", value: lastWeek, tone: "text-indigo-600" },
          {
            label: "Completion rate",
            value: totalViews > 0 ? `${completionRate}%` : "—",
            tone: "text-emerald-600",
            sub: totalViews > 0 ? `${total} of ${totalViews} viewers` : undefined,
          },
        ].map((s) => (
          <div key={s.label} className="card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            <p className="text-sm text-muted">{s.label}</p>
            <p className={`mt-1 text-3xl font-bold ${s.tone}`}>{s.value}</p>
            {"sub" in s && s.sub && <p className="mt-1 text-xs text-muted">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Share bar */}
      {form.published && (
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-sm animate-fade-up">
          <span className="chip bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">Share link</span>
          <code className="flex-1 truncate text-sm text-gray-600">
            {`${getAppUrl()}/form/${form.slug}`.replace("http://", "")}
          </code>
          <CopyButton slug={form.slug} />
          <div className="h-5 w-px bg-line" />
          {canExport ? (
            <ExportCsv
              title={form.title}
              fields={form.fields.map((f) => ({ id: f.id, label: f.label }))}
              rows={form.submissions.map((s) => ({
                id: s.id,
                createdAt: s.createdAt.toISOString(),
                data: s.data as Record<string, string>,
              }))}
            />
          ) : (
            <Link
              href="/dashboard/billing"
              className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Upgrade to export
            </Link>
          )}
        </div>
      )}

      {/* Table */}
      {total === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed border-line bg-surface px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
            <Inbox className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-bold">No responses yet</h2>
          <p className="mt-1 max-w-sm text-sm text-muted">
            {form.published
              ? `Share your form link to start collecting responses.`
              : `Publish your form first to start collecting responses.`}
          </p>
        </div>
      ) : (
        <SubmissionsTable
          formId={form.id}
          formTitle={form.title}
          fields={form.fields.map((f) => ({
            id: f.id,
            label: f.label,
            type: f.type,
            required: f.required,
          }))}
          rows={form.submissions.map((s) => ({
            id: s.id,
            createdAt: s.createdAt.toISOString(),
            data: s.data as Record<string, string>,
          }))}
        />
      )}
    </div>
  );
}