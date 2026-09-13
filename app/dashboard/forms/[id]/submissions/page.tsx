import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import CopyButton from "@/components/copy-button";
import ExportCsv from "@/components/export-csv";

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

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 animate-fade-up">
        <div>
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-black">
            ← Dashboard
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{form.title}</h1>
            <span
              className={`chip ${form.published ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-muted"}`}
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
              View live ↗
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
            value: total ? "100%" : "—",
            tone: "text-emerald-600",
          },
        ].map((s) => (
          <div key={s.label} className="card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            <p className="text-sm text-muted">{s.label}</p>
            <p className={`mt-1 text-3xl font-bold ${s.tone}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Share bar */}
      {form.published && (
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-sm animate-fade-up">
          <span className="chip bg-indigo-50 text-indigo-600">Share link</span>
          <code className="flex-1 truncate text-sm text-gray-600">
            {`${process.env.NEXT_PUBLIC_APP_URL || ""}/form/${form.slug}`.replace("http://", "")}
          </code>
          <CopyButton slug={form.slug} />
          <div className="h-5 w-px bg-line" />
          <ExportCsv
            title={form.title}
            fields={form.fields.map((f) => ({ id: f.id, label: f.label }))}
            rows={form.submissions.map((s) => ({
              id: s.id,
              createdAt: s.createdAt.toISOString(),
              data: s.data as Record<string, string>,
            }))}
          />
        </div>
      )}

      {/* Table */}
      {total === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
            📭
          </div>
          <h2 className="text-lg font-bold">No responses yet</h2>
          <p className="mt-1 max-w-sm text-sm text-muted">
            {form.published
              ? `Share your form link to start collecting responses.`
              : `Publish your form first to start collecting responses.`}
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-gray-500">
                    Submitted
                  </th>
                  {form.fields.map((field) => (
                    <th
                      key={field.id}
                      className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-gray-500"
                    >
                      {field.label}
                      {field.required && <span className="text-red-400"> *</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {form.submissions.map((submission) => (
                  <tr key={submission.id} className="transition-colors hover:bg-indigo-50/40">
                    <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                      {new Date(submission.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </td>
                    {form.fields.map((field) => {
                      const value = (submission.data as Record<string, string>)[field.id];
                      return (
                        <td key={field.id} className="px-5 py-4">
                          {field.type === "checkbox" && value ? (
                            <div className="flex flex-wrap gap-1">
                              {value.split(",").map((v) => (
                                <span
                                  key={v}
                                  className="chip bg-gray-100 text-gray-700"
                                >
                                  {v}
                                </span>
                              ))}
                            </div>
                          ) : value ? (
                            <span className="line-clamp-2">{value}</span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}