"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CopyButton from "@/components/copy-button";

export interface DashboardForm {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  _count: { submissions: number; fields: number };
}

const GRADIENTS = [
  "from-indigo-500 to-sky-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-violet-500 to-purple-500",
  "from-cyan-500 to-blue-500",
];

export default function DashboardForms({ forms }: { forms: DashboardForm[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "live" | "draft">("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return forms.filter((f) => {
      const matchesQ = f.title.toLowerCase().includes(query.trim().toLowerCase());
      const matchesF =
        filter === "all" ||
        (filter === "live" && f.published) ||
        (filter === "draft" && !f.published);
      return matchesQ && matchesF;
    });
  }, [forms, query, filter]);

  const totals = useMemo(
    () => ({
      forms: forms.length,
      submissions: forms.reduce((n, f) => n + f._count.submissions, 0),
      live: forms.filter((f) => f.published).length,
      drafts: forms.filter((f) => !f.published).length,
    }),
    [forms]
  );

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}" and all its submissions? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/forms/${id}`, { method: "DELETE" });
      if (!res.ok) alert("Failed to delete form");
      else router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  const stats = [
    { label: "Total forms", value: totals.forms, tone: "text-foreground" },
    { label: "Total responses", value: totals.submissions, tone: "text-indigo-600" },
    { label: "Live", value: totals.live, tone: "text-emerald-600" },
    { label: "Drafts", value: totals.drafts, tone: "text-muted" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-900/5`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <p className="text-sm text-muted">{s.label}</p>
            <p className={`mt-1 text-3xl font-bold ${s.tone}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            ⌕
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search forms…"
            className="input-field pl-9 sm:w-64"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-line bg-white p-1 shadow-sm">
          {([
            ["all", "All"],
            ["live", "Live"],
            ["draft", "Drafts"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                filter === key ? "bg-foreground text-white shadow-sm" : "text-muted hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-line bg-white px-6 py-20 text-center animate-fade-in">
          {forms.length === 0 ? (
            <>
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
                ✦
              </div>
              <h2 className="text-lg font-bold">No forms yet</h2>
              <p className="mt-1 mb-6 max-w-sm text-sm text-muted">
                Create your first form and start collecting responses in minutes.
              </p>
              <Link href="/dashboard/forms/new" className="btn-primary">
                Create your first form
              </Link>
            </>
          ) : (
            <>
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
                ⌕
              </div>
              <h2 className="text-lg font-bold">No matches</h2>
              <p className="mt-1 text-sm text-muted">Try a different search term or filter.</p>
            </>
          )}
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((form, i) => {
            const grad = GRADIENTS[i % GRADIENTS.length];
            return (
              <div
                key={form.id}
                className="group card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-900/5 animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`h-1.5 bg-gradient-to-r ${grad}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="line-clamp-1 text-base font-bold group-hover:text-indigo-600">
                      {form.title}
                    </h3>
                    <span
                      className={`chip shrink-0 ${
                        form.published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-muted"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${form.published ? "bg-emerald-500" : "bg-gray-300"}`} />
                      {form.published ? "Live" : "Draft"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {form._count.submissions} response{form._count.submissions === 1 ? "" : "s"}
                    {form._count.fields > 0 && (
                      <> · {form._count.fields} field{form._count.fields === 1 ? "" : "s"}</>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    Created {new Date(form.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </p>

                  <div className="mt-4 flex items-center gap-1.5">
                    <Link
                      href={`/dashboard/forms/${form.id}`}
                      className="rounded-lg border border-line px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-indigo-300 hover:text-indigo-600 sm:flex-1 sm:text-center"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/dashboard/forms/${form.id}/submissions`}
                      className="rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-600 sm:flex-1 sm:text-center"
                    >
                      Responses
                    </Link>
                    {form.published && <CopyButton slug={form.slug} />}
                    <button
                      onClick={() => handleDelete(form.id, form.title)}
                      disabled={deleting === form.id}
                      title="Delete form"
                      className="rounded-lg border border-transparent px-2.5 py-2 text-xs text-red-500 transition-colors hover:border-red-200 hover:bg-red-50 disabled:opacity-50"
                    >
                      {deleting === form.id ? "…" : "✕"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}