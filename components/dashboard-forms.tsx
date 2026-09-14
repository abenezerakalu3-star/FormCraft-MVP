"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, Plus, Search, Trash2, ClipboardList } from "lucide-react";
import CopyButton from "@/components/copy-button";

export interface DashboardForm {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  _count: { submissions: number; fields: number; views: number };
}

const ACCENTS = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-cyan-500",
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

  return (
    <div className="animate-fade-in">
      {/* Toolbar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search forms…"
            className="input-field pl-9 sm:w-64"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-line bg-surface p-1 shadow-sm">
          {([
            ["all", "All"],
            ["live", "Live"],
            ["draft", "Drafts"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                filter === key
                  ? "bg-foreground text-surface shadow-sm dark:text-background"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-line bg-surface px-6 py-20 text-center animate-fade-in">
          {forms.length === 0 ? (
            <>
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
                <ClipboardList className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-bold">No forms yet</h2>
              <p className="mt-1 mb-6 max-w-sm text-sm text-muted">
                Create your first form and start collecting responses in minutes.
              </p>
              <Link href="/dashboard/forms/new" className="btn-primary">
                <Plus className="h-4 w-4" /> Create your first form
              </Link>
            </>
          ) : (
            <>
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-100/10">
                <Search className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-bold">No matches</h2>
              <p className="mt-1 text-sm text-muted">Try a different search term or filter.</p>
            </>
          )}
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((form, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <div
                key={form.id}
                className="group card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-900/5 animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`h-1.5 ${accent}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/dashboard/forms/${form.id}/overview`}
                      className="line-clamp-1 text-base font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                      title={`Open ${form.title}`}
                    >
                      {form.title}
                    </Link>
                    <span
                      className={`chip shrink-0 ${
                        form.published
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "bg-gray-100 text-muted dark:bg-gray-100/10"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${form.published ? "bg-emerald-500" : "bg-gray-300"}`}
                      />
                      {form.published ? "Live" : "Draft"}
                    </span>
                  </div>
                  <p className="mt-2 flex items-center gap-x-3 text-sm text-muted">
                    <span>{form._count.views} view{form._count.views === 1 ? "" : "s"}</span>
                    <span aria-hidden>·</span>
                    <span>
                      {form._count.submissions} response{form._count.submissions === 1 ? "" : "s"}
                    </span>
                    {form._count.fields > 0 && (
                      <>
                        <span aria-hidden>·</span>
                        <span>{form._count.fields} field{form._count.fields === 1 ? "" : "s"}</span>
                      </>
                    )}
                  </p>

                  {form._count.views > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted">Response rate</span>
                        <span className="font-semibold text-foreground">
                          {Math.round((form._count.submissions / form._count.views) * 100)}%
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-100/10">
                        <div
                          className="h-full rounded-full bg-accent transition-all duration-500"
                          style={{
                            width: `${Math.min(100, Math.round((form._count.submissions / form._count.views) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <p className="mt-3 text-xs text-gray-400">
                    Created{" "}
                    {new Date(form.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>

                  <div className="mt-4 flex items-center gap-1.5">
                    <Link
                      href={`/dashboard/forms/${form.id}/overview`}
                      title="Analytics & exports"
                      className="rounded-lg border border-line px-2.5 py-2 text-muted transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:hover:border-indigo-500/50"
                    >
                      <BarChart3 className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href={`/dashboard/forms/${form.id}`}
                      className="rounded-lg border border-line px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-indigo-300 hover:text-indigo-600 sm:flex-1 sm:text-center dark:hover:border-indigo-500/50"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/dashboard/forms/${form.id}/submissions`}
                      className="rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-surface transition-colors hover:bg-indigo-600 dark:text-background sm:flex-1 sm:text-center"
                    >
                      Responses
                    </Link>
                    {form.published && <CopyButton slug={form.slug} />}
                    <button
                      onClick={() => handleDelete(form.id, form.title)}
                      disabled={deleting === form.id}
                      title="Delete form"
                      className="rounded-lg border border-transparent px-2.5 py-2 text-red-500 transition-colors hover:border-red-200 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-500/10 dark:hover:border-red-500/40"
                    >
                      {deleting === form.id ? "…" : <Trash2 className="h-3.5 w-3.5" />}
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