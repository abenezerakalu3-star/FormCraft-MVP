"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { KeyRound, Loader2, ShieldMinus, ShieldPlus, UserPlus } from "lucide-react";
import { PERMISSIONS, PERMISSION_LABELS, Permission } from "@/lib/permissions";

export type AdminRecord = {
  id: string;
  name: string;
  email: string;
  permissions: string[];
  createdAt: string;
};

export default function AdminAdminsManager({
  admins,
  currentUserId,
}: {
  admins: AdminRecord[];
  currentUserId: string;
}) {
  const router = useRouter();
  const emptyForm = { name: "", email: "", password: "" };
  const [form, setForm] = useState(emptyForm);
  const [perms, setPerms] = useState<Permission[]>(["users", "forms"]);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function createAdmin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCreating(true);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, permissions: perms }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create admin");
        return;
      }
      setForm(emptyForm);
      setPerms(["users", "forms"]);
      router.refresh();
    } finally {
      setCreating(false);
    }
  }

  async function setPermissions(id: string, next: Permission[]) {
    setBusyId(id);
    const res = await fetch(`/api/admin/admins/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permissions: next }),
    });
    setBusyId(null);
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to update permissions");
      return;
    }
    router.refresh();
  }

  async function demote(id: string, name: string) {
    if (!window.confirm(`Remove admin access for ${name}? They will become a regular user.`)) {
      return;
    }
    setBusyId(id);
    const res = await fetch(`/api/admin/admins/${id}`, { method: "DELETE" });
    setBusyId(null);
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to remove admin");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Create */}
      <form onSubmit={createAdmin} className="card p-6">
        <div className="mb-5 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <UserPlus className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-bold tracking-tight">New admin</h2>
            <p className="text-xs text-muted">Create an account with admin access.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              placeholder="Ada Lovelace"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Temporary password <span className="font-normal text-muted">(min 8 chars)</span>
            </label>
            <input
              required
              type="text"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field"
              placeholder="Tell them this securely"
            />
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-medium">Authorities</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {PERMISSIONS.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() =>
                  setPerms((prev) =>
                    prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
                  )
                }
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors ${
                  perms.includes(p)
                    ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-500/50 dark:bg-indigo-500/15 dark:text-indigo-300"
                    : "border-line bg-surface text-muted hover:border-gray-300"
                }`}
              >
                <span
                  className={`h-4 w-4 shrink-0 rounded border ${
                    perms.includes(p) ? "border-indigo-500 bg-indigo-500" : "border-gray-300"
                  }`}
                >
                  {perms.includes(p) && (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-white">
                      <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.79 6.8-6.8a1 1 0 011.4 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                <span>
                  {PERMISSION_LABELS[p]}
                  <span className="mt-0.5 block text-xs text-muted">{p}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="mt-4 animate-fade-in rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}

        <button type="submit" disabled={creating || perms.length === 0} className="btn-primary mt-5">
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          {creating ? "Creating…" : "Create admin"}
        </button>
      </form>

      {/* List */}
      {admins.length === 0 ? (
        <div className="card flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <ShieldPlus className="h-7 w-7" />
          </span>
          <h3 className="font-semibold">No other admins</h3>
          <p className="max-w-xs text-sm text-muted">
            Create admins above and grant them exactly the authorities they need.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {admins.map((admin) => {
            const isSelf = admin.id === currentUserId;
            const owned = admin.permissions.filter((p) =>
              (PERMISSIONS as readonly string[]).includes(p)
            ) as Permission[];
            return (
              <div key={admin.id} className="card p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {(admin.name || admin.email).slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-semibold">
                      {admin.name || admin.email}
                      {isSelf && (
                        <span className="chip bg-gray-100 text-muted dark:bg-gray-100/10">You</span>
                      )}
                    </p>
                    <p className="truncate text-sm text-muted">{admin.email}</p>
                  </div>
                  <span className="text-xs text-muted">
                    Added{" "}
                    {new Date(admin.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted">
                    <ShieldPlus className="h-3.5 w-3.5" /> Authority
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PERMISSIONS.map((p) => {
                      const active = owned.includes(p);
                      return (
                        <button
                          key={p}
                          disabled={isSelf || busyId === admin.id}
                          onClick={() =>
                            setPermissions(
                              admin.id,
                              active ? owned.filter((x) => x !== p) : [...owned, p]
                            )
                          }
                          title={isSelf ? "You cannot change your own authorities" : `Toggle ${PERMISSION_LABELS[p]}`}
                          className={`chip transition-all disabled:cursor-not-allowed ${
                            active
                              ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                              : "bg-gray-100 text-muted dark:bg-gray-100/10"
                          } ${!isSelf ? "hover:ring-2 hover:ring-indigo-400/50" : ""}`}
                        >
                          {PERMISSION_LABELS[p]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {!isSelf && (
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
                    <p className="text-xs text-muted">
                      <KeyRound className="mr-1 inline h-3.5 w-3.5" />
                      Demoting keeps their account and data intact.
                    </p>
                    <button
                      onClick={() => demote(admin.id, admin.name || admin.email)}
                      disabled={busyId === admin.id}
                      className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-500/40 dark:hover:bg-red-500/10"
                    >
                      <ShieldMinus className="h-3.5 w-3.5" /> Remove admin access
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}