"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/auth-shell";
import GoogleButton from "@/components/google-button";
import PasswordInput from "@/components/password-input";

const OAUTH_ERRORS: Record<string, string> = {
  google_not_configured: "Google sign-up isn't configured yet. Please try signing up with your email.",
  oauth_denied: "Google sign-in was cancelled.",
  oauth_invalid_state: "Google sign-in session expired. Please try again.",
  oauth_failed: "Google sign-in failed. Please try again.",
  oauth_email_unverified: "Your Google account email isn't verified.",
  oauth_blocked: "This account has been suspended. Contact support.",
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("error");
    if (code && OAUTH_ERRORS[code]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(OAUTH_ERRORS[code]);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      const params = new URLSearchParams(window.location.search);
      const plan = params.get("plan");
      const interval = params.get("interval") === "year" ? "year" : "month";
      if (plan === "pro" || plan === "team") {
        router.push(`/dashboard/billing?plan=${plan}&interval=${interval}`);
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Start building forms in minutes">
      <GoogleButton label="Sign up with Google" />
      <div className="my-5 flex items-center gap-3 text-xs font-medium text-muted">
        <span className="h-px flex-1 bg-line" />
        or with email
        <span className="h-px flex-1 bg-line" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Ada Lovelace"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium" htmlFor="password">
            Password
          </label>
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
          {password.length > 0 && password.length < 8 && (
            <p className="mt-1.5 text-xs text-amber-600">
              {8 - password.length} more character{8 - password.length === 1 ? "" : "s"} for a strong password
            </p>
          )}
        </div>

        {error && (
          <p className="animate-fade-in rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-foreground underline underline-offset-4 hover:text-indigo-600">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}