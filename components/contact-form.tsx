"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [error, setError] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Something went wrong — please try again.");
        setState("idle");
        return;
      }
      setState("done");
    } catch {
      setError("Network error — please try again.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h2 className="mt-4 text-xl font-bold tracking-tight">Message sent</h2>
        <p className="mt-2 text-sm text-muted">
          Thanks {form.name.split(" ")[0]}! We&apos;ll get back to you at {form.email} within a few
          business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium" htmlFor="c-name">
            Name
          </label>
          <input
            id="c-name"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="input-field"
            placeholder="Ada Lovelace"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium" htmlFor="c-email">
            Email
          </label>
          <input
            id="c-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="input-field"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="c-subject">
          Subject <span className="text-muted">(optional)</span>
        </label>
        <input
          id="c-subject"
          value={form.subject}
          onChange={(e) => set("subject", e.target.value)}
          className="input-field"
          placeholder="What is this about?"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="c-message">
          Message
        </label>
        <textarea
          id="c-message"
          required
          rows={6}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          className="input-field resize-none"
          placeholder="Tell us what we can help with…"
        />
      </div>

      {error && (
        <p className="animate-fade-in rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      <button type="submit" disabled={state === "sending"} className="btn-primary w-full">
        {state === "sending" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {state === "sending" ? "Sending…" : "Send message"}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
        <Mail className="h-3.5 w-3.5" /> Your message goes straight to the team.
      </p>
    </form>
  );
}