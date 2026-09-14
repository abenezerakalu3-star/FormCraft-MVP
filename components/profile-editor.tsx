"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Lock, Save, UserRound } from "lucide-react";

export default function ProfileEditor({
  user,
}: {
  user: { name: string | null; email: string };
}) {
  const [profile, setProfile] = useState({ name: user.name || "", email: user.email });
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [infoMsg, setInfoMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pwdMsg, setPwdMsg] = useState<{ ok: boolean; text: string } | null>(null);

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
    </div>
  );
}