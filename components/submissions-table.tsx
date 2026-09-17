"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, FileText, Search, Trash2 } from "lucide-react";
import { formatBytes, IMAGE_MIMES, parseFileValue } from "@/lib/files";

export interface SubmissionField {
  id: string;
  label: string;
  type: string;
  required: boolean;
}

export interface SubmissionRow {
  id: string;
  createdAt: string;
  data: Record<string, string>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

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
          <img src={file.url} alt={file.name} className="h-9 w-9 shrink-0 rounded-lg object-cover" />
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

export default function SubmissionsTable({
  formId,
  formTitle,
  fields,
  rows,
}: {
  formId: string;
  formTitle: string;
  fields: SubmissionField[];
  rows: SubmissionRow[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [clearing, setClearing] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows;

    if (q) {
      list = list.filter((row) => {
        if (formatDate(row.createdAt).toLowerCase().includes(q)) return true;
        return fields.some((field) =>
          (row.data[field.id] ?? "").toLowerCase().includes(q)
        );
      });
    }

    const sorted = [...list];
    if (sort === "newest" || sort === "oldest") {
      const dir = sort === "newest" ? -1 : 1;
      sorted.sort(
        (a, b) => dir * (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      );
    } else {
      const [fieldId, dir] = sort.split(":");
      const sign = dir === "desc" ? -1 : 1;
      sorted.sort((a, b) =>
        sign * (a.data[fieldId] ?? "").localeCompare(b.data[fieldId] ?? "", undefined, {
          sensitivity: "base",
          numeric: true,
        })
      );
    }
    return sorted;
  }, [rows, fields, query, sort]);

  async function clearAll() {
    if (
      !confirm(
        `Delete all ${rows.length} response${rows.length === 1 ? "" : "s"} for "${formTitle}"? This cannot be undone.`
      )
    )
      return;
    setClearing(true);
    try {
      const res = await fetch(`/api/forms/${formId}/submissions`, { method: "DELETE" });
      if (!res.ok) {
        alert("Failed to delete responses");
        return;
      }
      router.refresh();
    } finally {
      setClearing(false);
    }
  }

  return (
    <div className="mt-6">
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search responses…"
            className="input-field pl-9 sm:w-64"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input-field w-auto cursor-pointer"
          aria-label="Sort responses"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          {fields.map((field) => (
            <optgroup key={field.id} label={field.label}>
              <option value={`${field.id}:asc`}>{field.label}: A–Z</option>
              <option value={`${field.id}:desc`}>{field.label}: Z–A</option>
            </optgroup>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-muted">
            {query ? `${visible.length} of ${rows.length}` : `${rows.length} total`}
          </span>
          <button
            onClick={clearAll}
            disabled={clearing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3.5 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-500/40 dark:hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" /> {clearing ? "Clearing…" : "Clear all"}
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-line bg-surface px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-100/10">
            <Search className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-bold">No matching responses</h2>
          <p className="mt-1 text-sm text-muted">Try a different search term.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-gray-50/80 dark:bg-gray-100/5">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-gray-500">
                    Submitted
                  </th>
                  {fields.map((field) => (
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
                {visible.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-indigo-500/5">
                    <td className="whitespace-nowrap px-5 py-4 text-gray-500 dark:text-gray-400">
                      {formatDate(row.createdAt)}
                    </td>
                    {fields.map((field) => {
                      const value = row.data[field.id];
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
