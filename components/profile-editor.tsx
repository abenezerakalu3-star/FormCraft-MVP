"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Loader2, Lock, Save, Trash2, UserRound, X } from "lucide-react";

export default function ProfileEditor({
  user,
}: {
  user: { name: string | null; email: string };
}) {
  const router = useRouter();
  const [profile, setProfile] = useState({ name: user.name || "", email: user.email });
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [infoMsg, setInfoMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pwdMsg, setPwdMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Danger zone
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function deleteAccount() {
    setDeleteMsg(null);
    setDeleting(true);
    try {
      const res = await fetch("/api/user/account", { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setDeleteMsg({ ok: false, text: data?.error || "Failed to delete account" });
        return;
      }
      router.replace("/login");
    } finally {
      setDeleting(false);
    }
  }

  async function saveInfo(e: React.FormEvent) {
    e.preventDefault();
    setInfoMsg(null);
    setSavingInfo(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) {
        setInfoMsg({ ok: false, text: data.error || "Failed to save" });
        return;
      }
      setInfoMsg({ ok: true, text: "Profile updated" });
    } finally {
      setSavingInfo(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwdMsg(null);
    if (password.next !== password.confirm) {
      setPwdMsg({ ok: false, text: "New passwords do not match" });
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: password.current, newPassword: password.next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwdMsg({ ok: false, text: data.error || "Failed to change password" });
        return;
      }
      setPassword({ current: "", next: "", confirm: "" });
      setPwdMsg({ ok: true, text: "Password changed" });
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Personal info */}
      <form onSubmit={saveInfo} className="card p-6">
        <div className="mb-5 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <UserRound className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-bold tracking-tight">Personal info</h2>
            <p className="text-xs text-muted">Your name and login email.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="p-name">
              Name
            </label>
            <input
              id="p-name"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="input-field"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="p-email">
              Email
            </label>
            <input
              id="p-email"
              type="email"
              required
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {infoMsg && (
          <p
            className={`mt-4 animate-fade-in rounded-lg px-3.5 py-2.5 text-sm font-medium ${
              infoMsg.ok
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
            }`}
          >
            {infoMsg.ok && <CheckCircle2 className="mr-1.5 inline h-4 w-4" />}
            {infoMsg.text}
          </p>
        )}

        <button type="submit" disabled={savingInfo} className="btn-primary mt-5">
          {savingInfo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {savingInfo ? "Saving…" : "Save changes"}
        </button>
      </form>

      {/* Password */}
      <form onSubmit={savePassword} className="card p-6">
        <div className="mb-5 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Lock className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-bold tracking-tight">Password</h2>
            <p className="text-xs text-muted">Change your login password.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="p-current">
              Current password
            </label>
            <input
              id="p-current"
              type="password"
              required
              value={password.current}
              onChange={(e) => setPassword({ ...password, current: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="p-next">
                New password
              </label>
              <input
                id="p-next"
                type="password"
                required
                minLength={8}
                value={password.next}
                onChange={(e) => setPassword({ ...password, next: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="p-confirm">
                Confirm new password
              </label>
              <input
                id="p-confirm"
                type="password"
                required
                minLength={8}
                value={password.confirm}
                onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {pwdMsg && (
          <p
            className={`mt-4 animate-fade-in rounded-lg px-3.5 py-2.5 text-sm font-medium ${
              pwdMsg.ok
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
            }`}
          >
            {pwdMsg.ok && <CheckCircle2 className="mr-1.5 inline h-4 w-4" />}
            {pwdMsg.text}
          </p>
        )}

        <button type="submit" disabled={savingPassword} className="btn-primary mt-5">
          {savingPassword ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Lock className="h-4 w-4" />
          )}
          {savingPassword ? "Updating…" : "Change password"}
        </button>
      </form>

      {/* Danger zone */}
      <div className="card border-red-200 p-6 dark:border-red-500/30">
        <div className="mb-5 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-bold tracking-tight text-red-600 dark:text-red-400">Danger zone</h2>
            <p className="text-xs text-muted">Irreversible actions on your account.</p>
          </div>
        </div>

        <button
          onClick={() => {
            setTyped("");
            setDeleteMsg(null);
            setConfirmOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/40 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" /> Delete my account
        </button>

        {confirmOpen && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50/60 p-5 dark:border-red-500/30 dark:bg-red-500/5">
            <p className="text-sm font-semibold">This permanently deletes your account</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
              <li>All your forms, submissions, and views are removed.</li>
              <li>This cannot be undone.</li>
            </ul>
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium" htmlFor="del-confirm">
                Type <span className="font-bold">DELETE</span> to confirm
              </label>
              <input
                id="del-confirm"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                className="input-field"
                placeholder="DELETE"
                autoComplete="off"
              />
            </div>
            {deleteMsg && (
              <p className="mt-3 animate-fade-in rounded-lg px-3.5 py-2.5 text-sm font-medium text-red-600 dark:text-red-400">
                {deleteMsg.text}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={deleteAccount}
                disabled={typed !== "DELETE" || deleting}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {deleting ? "Deleting…" : "Delete account"}
              </button>
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground disabled:opacity-50"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}