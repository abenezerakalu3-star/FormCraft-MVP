import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();
  const forms = await prisma.form.findMany({
    where: { userId: user.id },
    include: { _count: { select: { submissions: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your forms</h1>
      </div>

      {forms.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <h2 className="mb-2 text-lg font-semibold">No forms yet</h2>
          <p className="mb-6 text-sm text-gray-500">
            Create your first form and start collecting submissions.
          </p>
          <Link
            href="/dashboard/forms/new"
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Create a form
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <div
              key={form.id}
              className="flex flex-col rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    form.published
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {form.published ? "Live" : "Draft"}
                </span>
              </div>
              <h3 className="mb-1 text-base font-semibold line-clamp-1">{form.title}</h3>
              <p className="mb-4 text-sm text-gray-500">
                {form._count.submissions} submission{form._count.submissions === 1 ? "" : "s"}
              </p>
              <div className="mt-auto flex items-center gap-2 text-sm">
                <Link
                  href={`/dashboard/forms/${form.id}`}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-center font-medium hover:bg-gray-50"
                >
                  Edit
                </Link>
                <Link
                  href={`/dashboard/forms/${form.id}/submissions`}
                  className="flex-1 rounded-lg bg-black px-3 py-2 text-center font-medium text-white hover:bg-gray-800"
                >
                  Responses
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}