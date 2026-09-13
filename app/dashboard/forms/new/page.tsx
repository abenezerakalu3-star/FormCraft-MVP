"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Brain, Briefcase, ClipboardList, Mail, MessageSquare } from "lucide-react";

const templates = [
  { label: "Customer feedback", icon: MessageSquare },
  { label: "Job application", icon: Briefcase },
  { label: "Registration", icon: ClipboardList },
  { label: "Quiz", icon: Brain },
  { label: "Survey", icon: BarChart3 },
  { label: "Contact form", icon: Mail },
];

export default function NewFormPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      router.push(`/dashboard/forms/${data.form.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg animate-fade-in">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight">Create a new form</h1>
        <p className="mt-1 text-sm text-muted">Name it and start shaping your questions.</p>
      </div>

      <form onSubmit={handleSubmit} className="card overflow-hidden animate-fade-up">
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-sky-500" />
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
            {loading ? "Creating…" : "Create form and start building"}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
          Start with a template name
        </p>
        <div className="flex flex-wrap gap-2">
          {templates.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setTitle(t.label)}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2 text-sm font-medium shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md active:scale-[0.98]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <t.icon className="h-4 w-4" />
              </span>
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}