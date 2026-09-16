"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/auth-shell";
import PasswordInput from "@/components/password-input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    if (t) {
      const id = window.setTimeout(() => setToken(t), 0);
      return () => window.clearTimeout(id);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!token) {
      setError("This reset link is missing a token. Please request a new one.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <AuthShell title="Password updated" subtitle="Your password has been changed.">
        <div className="animate-fade-in rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-5 text-sm text-emerald-800">
          <p className="font-semibold">You&apos;re all set</p>
          <p className="mt-1 leading-relaxed">
            Your password has been reset. Log in with your new password to continue.
          </p>
        </div>
        <button
          onClick={() => {
            router.push("/login");
            router.refresh();
          }}
          className="btn-primary mt-5 w-full"
        >
          Go to login
        </button>
        <p className="mt-6 text-center text-sm text-muted">
          Want a fresh start?{" "}
          <Link href="/register" className="font-semibold text-foreground underline underline-offset-4 hover:text-indigo-600">
            Create an account
          </Link>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Set a new password" subtitle="Choose a strong password you'll remember.">
      {error && (
        <div className="mb-5 animate-fade-in rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          <div className="mt-2">
            <Link href="/forgot-password" className="font-semibold underline underline-offset-2">
              Request a new link
            </Link>
          </div>
        </div>
      )}

      {!token && !error ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          This link is missing its token. Please use the full link from your email or{" "}
          <Link href="/forgot-password" className="font-semibold underline underline-offset-2">
            request a new one
          </Link>
          .
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="password">
              New password
            </label>
            <PasswordInput
              id="password"
              value={password}
              onChange={setPassword}
              required
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}