"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, Ban, Search, ShieldCheck, UserX } from "lucide-react";

export interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  blocked: boolean;
  warnings: { message: string; by: string; at: string }[];
  formCount: number;
}

export default function AdminUsersList({ users }: { users: AdminUser[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "warned" | "blocked">("all");
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const matchesQ =
        !q ||
        u.email.toLowerCase().includes(q) ||
        (u.name || "").toLowerCase().includes(q);
      const matchesS =
        status === "all" ||
        (status === "blocked" && u.blocked) ||
        (status === "warned" && !u.blocked && u.warnings.length > 0) ||
        (status === "active" && !u.blocked && u.warnings.length === 0);
      return matchesQ && matchesS;
    });
  }, [users, query, status]);

  async function act(user: AdminUser, action: "warn" | "block" | "unblock" | "clearWarnings") {
    if (action === "block" && !confirm(`Block ${user.email}? They will be logged out and cannot sign in.`)) return;
    if (action === "unblock" && !confirm(`Unblock ${user.email}?`)) return;
    const message = action === "warn" ? prompt("Reason for the warning:") ?? "" : "";
    if (action === "warn" && message.trim() === "") return;
    setBusy(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, message }),
      });
      if (!res.ok) alert("Action failed");
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  const statusTabs: [typeof status, string][] = [
    ["all", "All"],
    ["active", "Active"],
    ["warned", "Warned"],
    ["blocked", "Blocked"],
  ];

  return (
    <div className="card overflow-hidden animate-fade-up">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email…"
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
                    layoutId="users-status-pill"
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead className="bg-gray-50/80 dark:bg-gray-100/5">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500">User</th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500">Joined</th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500">Forms</th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
              <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-widest text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-muted">
                  No users match your search.
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-indigo-500/[0.03]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {(u.name || u.email || "?").slice(0, 1).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{u.name || "—"}</p>
                        <p className="truncate text-xs text-muted">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-gray-500">{u.formCount}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {u.blocked ? (
                        <span className="chip bg-red-500/10 text-red-600 dark:text-red-400">
                          <UserX className="h-3 w-3" /> Blocked
                        </span>
                      ) : u.warnings.length > 0 ? (
                        <span className="chip bg-amber-500/10 text-amber-700 dark:text-amber-400">
                          <AlertTriangle className="h-3 w-3" /> Warned ×{u.warnings.length}
                        </span>
                      ) : (
                        <span className="chip bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                          <ShieldCheck className="h-3 w-3" /> Active
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      {!u.blocked && (
                        <button
                          onClick={() => act(u, "warn")}
                          disabled={busy === u.id}
                          title="Send a warning"
                          className="rounded-lg border border-amber-200 px-2.5 py-1.5 text-xs font-semibold text-amber-600 transition-colors hover:bg-amber-50 disabled:opacity-50 dark:border-amber-500/40 dark:hover:bg-amber-500/10"
                        >
                          Warn
                        </button>
                      )}
                      {u.blocked ? (
                        <button
                          onClick={() => act(u, "unblock")}
                          disabled={busy === u.id}
                          className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-foreground disabled:opacity-50"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => act(u, "block")}
                          disabled={busy === u.id}
                          title="Block account"
                          className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-500/40 dark:hover:bg-red-500/10"
                        >
                          <Ban className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
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