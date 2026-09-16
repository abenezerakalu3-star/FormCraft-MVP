"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Brain, Briefcase, ClipboardList, Loader2, Mail, MessageSquare } from "lucide-react";
import { FORM_TEMPLATES, FormTemplate } from "@/lib/templates";

const TEMPLATE_ICONS: Record<string, typeof MessageSquare> = {
  "customer-feedback": MessageSquare,
  "job-application": Briefcase,
  registration: ClipboardList,
  quiz: Brain,
  survey: BarChart3,
  "contact-form": Mail,
};

export default function NewFormPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState<string | null>(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("title");
    if (t) {
      const id = window.setTimeout(() => setTitle(t), 0);
      return () => window.clearTimeout(id);
    }
  }, []);

  async function create(form: { title: string; fields?: FormTemplate["fields"] }) {
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      router.push(`/dashboard/forms/${data.form.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await create({ title });
    } finally {
      setLoading(false);
    }
  }

  async function applyTemplate(t: FormTemplate) {
    setError("");
    setCreating(t.key);
    try {
      await create({ title: t.title, fields: t.fields });
    } finally {
      setCreating(null);
    }
  }

  return (
    <div className="mx-auto max-w-lg animate-fade-in">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight">Create a new form</h1>
        <p className="mt-1 text-sm text-muted">Name it and start shaping your questions.</p>
      </div>

      <form onSubmit={handleSubmit} className="card overflow-hidden animate-fade-up">
        <div className="h-1.5 bg-accent" />
        <div className="p-6">
          <label className="mb-1.5 block text-sm font-medium">Form name</label>
          <input
            autoFocus
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Customer Feedback"
            className="input-field"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-5 w-full disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start building"}
            {loading ? " Creating…" : " Create form and start building"}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
          or start from a template
        </p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {FORM_TEMPLATES.map((t) => {
            const Icon = TEMPLATE_ICONS[t.key] || MessageSquare;
            return (
              <button
                key={t.key}
                type="button"
                disabled={creating !== null}
                onClick={() => applyTemplate(t)}
                className="group flex items-start gap-2.5 rounded-xl border border-line bg-surface px-3.5 py-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {creating === t.key ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{t.label}</span>
                  <span className="mt-0.5 block text-xs text-muted">{t.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}