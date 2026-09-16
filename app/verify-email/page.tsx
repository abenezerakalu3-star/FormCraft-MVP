"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/auth-shell";

type Status = "verifying" | "success" | "error";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      const id = window.setTimeout(() => {
        setStatus("error");
        setMessage("This verification link is missing its token. Please request a new one.");
      }, 0);
      return () => window.clearTimeout(id);
    }

    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setStatus("error");
          setMessage(data.error || "Verification failed. Please try again.");
          return;
        }
        setStatus("success");
        setMessage(
          data.alreadyVerified
            ? "Your email was already verified. You're all set."
            : "Your email has been verified. Welcome to Formitect!"
        );
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      });
  }, []);

  return (
    <AuthShell title="Verify your email" subtitle="Confirming your email address…">
      <div className="space-y-4">
        {status === "verifying" && (
          <div className="animate-pulse rounded-xl border border-line bg-surface px-4 py-5 text-sm text-muted">
            Verifying your email…
          </div>
        )}
        {status === "success" && (
          <div className="animate-fade-in rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-5 text-sm text-emerald-800">
            <p className="font-semibold">{message}</p>
          </div>
        )}
        {status === "error" && (
          <div className="animate-fade-in rounded-xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-700">
            {message}
            <div className="mt-2">
              <Link href="/forgot-password" className="font-semibold underline underline-offset-2">
                Request a new verification link
              </Link>
            </div>
          </div>
        )}

        {(status === "success" || status === "error") && (
          <>
            <Link href="/dashboard" className="btn-primary w-full text-center">
              Go to my dashboard
            </Link>
          </>
        )}
      </div>
    </AuthShell>
  );
}