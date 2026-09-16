"use client";

import { useState } from "react";
import { MailCheck, RefreshCw } from "lucide-react";

export default function EmailVerificationBanner({
  emailVerified,
  email,
}: {
  emailVerified: Date | string | null;
  email: string;
}) {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  if (emailVerified) return null;

  async function resend() {
    setSending(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error || "Failed to resend.", error: true });
        return;
      }
      setMessage({ text: `Verification email sent to ${email}. Check your inbox.` });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-6 py-2.5 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2">
          <MailCheck className="h-4 w-4 shrink-0" />
          Verify your email to secure your account and keep your forms safe.
        </span>
        {message ? (
          <span className={message.error ? "font-medium text-red-600 dark:text-red-400" : "font-medium"}>
            {message.text}
          </span>
        ) : (
          <button
            onClick={resend}
            disabled={sending}
            className="inline-flex items-center gap-1.5 font-semibold underline underline-offset-2 hover:text-amber-900 disabled:opacity-50 dark:hover:text-amber-200"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${sending ? "animate-spin" : ""}`} />
            {sending ? "Sending…" : "Resend email"}
          </button>
        )}
      </div>
    </div>
  );
}