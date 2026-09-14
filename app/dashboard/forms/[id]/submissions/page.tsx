import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, ExternalLink, FileText, Inbox } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { formatBytes, IMAGE_MIMES, parseFileValue } from "@/lib/files";
import CopyButton from "@/components/copy-button";
import ExportCsv from "@/components/export-csv";

function FileCell({ value }: { value: string }) {
  const file = parseFileValue(value);
  if (!file) return <span className="line-clamp-2">{value}</span>;

  const isImage = IMAGE_MIMES.includes(file.mime);
  const downloadHref = file.key
    ? `/api/files?key=${encodeURIComponent(file.key)}&name=${encodeURIComponent(file.name)}&download=1`
    : file.url;
  return (
    <div className="flex items-center gap-2.5">
      <a
        href={file.url}
        target="_blank"
        rel="noreferrer"
        className="group flex min-w-0 flex-1 items-center gap-2.5"
        title={`${file.name} (${formatBytes(file.size)})`}
      >
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={file.url}
            alt={file.name}
            className="h-9 w-9 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <FileText className="h-4 w-4" />
          </span>
        )}
        <span className="line-clamp-2 max-w-[11rem] text-indigo-600 group-hover:underline dark:text-indigo-400">
          {file.name}
        </span>
      </a>
      <a
        href={downloadHref}
        title={`Download ${file.name}`}
        className="shrink-0 rounded-lg border border-line px-2.5 py-2 text-muted transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:hover:border-indigo-500/50"
      >
        <Download className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

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
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-sm animate-fade-up">
          <span className="chip bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">Share link</span>
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
        <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-gray-50/80 dark:bg-gray-100/5">
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
              <tbody className="divide-y divide-line">
                {form.submissions.map((submission) => (
                  <tr key={submission.id} className="transition-colors hover:bg-indigo-500/5">
                    <td className="whitespace-nowrap px-5 py-4 text-gray-500 dark:text-gray-400">
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
                                  className="chip bg-gray-100 text-gray-700 dark:bg-gray-100/10 dark:text-gray-300"
                                >
                                  {v}
                                </span>
                              ))}
                            </div>
                          ) : field.type === "file" && value ? (
                            <FileCell value={value} />
                          ) : value ? (
                            <span className="line-clamp-2">{value}</span>
                          ) : (
                            <span className="text-gray-300 dark:text-gray-600">—</span>
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