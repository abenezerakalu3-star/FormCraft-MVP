"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ClipboardList, FileText, Globe, Search } from "lucide-react";

export interface AdminForm {
  id: string;
  title: string;
  slug: string;
  ownerEmail: string;
  published: boolean;
  createdAt: string;
  submissions: number;
  views: number;
}

export default function AdminFormsList({ forms }: { forms: AdminForm[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "live" | "draft">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return forms.filter((f) => {
      const matchesQ =
        !q ||
        f.title.toLowerCase().includes(q) ||
        f.ownerEmail.toLowerCase().includes(q);
      const matchesS =
        status === "all" || (status === "live" && f.published) || (status === "draft" && !f.published);
      return matchesQ && matchesS;
    });
  }, [forms, query, status]);

  const statusTabs: [typeof status, string][] = [
    ["all", "All"],
    ["live", "Live"],
    ["draft", "Drafts"],
  ];

  return (
    <div className="card overflow-hidden animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or owner…"
            className="input-field pl-9 sm:w-72"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-line bg-canvas p-1">
          {statusTabs.map(([key, label]) => {
            const active = status === key;
            return (
              <button
                key={key}
                onClick={() => setStatus(key)}
                className={`relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active ? "text-surface dark:text-background" : "text-muted hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="forms-filter-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-foreground shadow-sm dark:bg-foreground"
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead className="bg-gray-50/80 dark:bg-gray-100/5">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500">Form</th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500">Owner</th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500">Responses</th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500">Views</th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-muted">
                  No forms match your search.
                </td>
              </tr>
            ) : (
              filtered.map((f) => (
                <tr key={f.id} className="transition-colors hover:bg-indigo-500/[0.03]">
                  <td className="px-5 py-4">
                    <Link
                      href={`/form/${f.slug}`}
                      target="_blank"
                      className="flex items-center gap-2 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <ClipboardList className="h-4 w-4 shrink-0 text-muted" />
                      <span className="line-clamp-1">{f.title}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-muted">{f.ownerEmail}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`chip ${
                        f.published
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "bg-gray-100 text-muted dark:bg-gray-100/10"
                      }`}
                    >
                      {f.published ? <Globe className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                      {f.published ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{f.submissions}</td>
                  <td className="px-5 py-4 text-gray-500">{f.views}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}