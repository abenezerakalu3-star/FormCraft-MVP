import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import CopyButton from "@/components/copy-button";

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

  const submitUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/form/${form.slug}`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-black"
          >
            &larr; Dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-bold">{form.title}</h1>
          <p className="text-sm text-gray-500">
            {form.submissions.length} submission
            {form.submissions.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/forms/${form.id}`}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Edit form
          </Link>
          {form.published && (
            <a
              href={`/form/${form.slug}`}
              target="_blank"
              className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              View live
            </a>
          )}
        </div>
      </div>

      {form.published && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <span className="text-sm font-medium">Share link:</span>
          <code className="flex-1 truncate text-sm text-gray-600">
            {submitUrl || `/form/${form.slug}`}
          </code>
          <CopyButton slug={form.slug} />
        </div>
      )}

      {form.submissions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center text-sm text-gray-400">
          No responses yet. Share the form link to start collecting submissions.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">
                  Submitted
                </th>
                {form.fields.map((field) => (
                  <th
                    key={field.id}
                    className="px-4 py-3 text-left font-semibold text-gray-500"
                  >
                    {field.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {form.submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                    {new Date(submission.createdAt).toLocaleString()}
                  </td>
                  {form.fields.map((field) => {
                    const value = (submission.data as Record<string, string>)[field.id];
                    return (
                      <td key={field.id} className="px-4 py-3">
                        {field.type === "checkbox" && value
                          ? value.split(",").map((v) => (
                              <span
                                key={v}
                                className="mr-1 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-xs"
                              >
                                {v}
                              </span>
                            ))
                          : value || <span className="text-gray-300">—</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}