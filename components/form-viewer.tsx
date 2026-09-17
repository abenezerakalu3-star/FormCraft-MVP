"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Send, Sparkles } from "lucide-react";
import { splitOptions } from "@/lib/fields";
import Celebration from "@/components/celebration";
import FileUploadField from "@/components/file-upload-field";

interface FieldData {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options: string;
}

interface FormData {
  id: string;
  title: string;
  description: string;
  slug: string;
  published: boolean;
  fields: FieldData[];
}

export default function FormViewer({
  form,
  showBranding = true,
}: {
  form: FormData;
  showBranding?: boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const key = `fc:viewed:${form.id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      let visitorId = sessionStorage.getItem("fc:visitor");
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        sessionStorage.setItem("fc:visitor", visitorId);
      }
      navigator.sendBeacon(
        `/api/forms/${form.id}/view`,
        new Blob([JSON.stringify({ visitorId })], { type: "application/json" })
      );
      sessionStorage.setItem(key, "1");
    } catch {
      // view tracking is best-effort
    }
  }, [form.id]);

  function setField(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }));
  }

  const completed = form.fields.filter((f) => {
    const v = values[f.id];
    if (f.type === "checkbox") return v && v.split(",").length > 0;
    return Boolean(v);
  }).length;
  const progress = form.fields.length ? Math.round((completed / form.fields.length) * 100) : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: form.slug, data: values }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas px-4 py-12">
      {submitted && <Celebration />}
      <div className="mx-auto max-w-xl animate-fade-up">
        {submitted ? (
          <div className="card overflow-hidden text-center">
            <div className="h-1.5 bg-emerald-500" />
            <div className="p-12">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 animate-scale-in">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Response submitted</h1>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
                Thank you for your response — it has been recorded successfully.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-8 btn-secondary"
              >
                Submit another response
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="card mb-4 overflow-hidden">
              <div className="flex items-center justify-between px-6 pt-6">
                <h1 className="text-2xl font-bold tracking-tight">{form.title}</h1>
                {form.fields.length > 0 && (
                  <span className="chip bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    {Math.min(progress, 100)}% complete
                  </span>
                )}
              </div>
              {form.description && (
                <p className="px-6 pb-5 pt-1 text-sm leading-relaxed text-muted">
                  {form.description}
                </p>
              )}
              {/* Progress bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-100/10">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="px-6 py-3 text-xs text-gray-400">
                {completed} of {form.fields.length} questions answered
              </p>
            </div>

            {form.fields.map((field, i) => {
              const value = values[field.id] ?? "";
              return (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.06 * Math.min(i, 8), ease: "easeOut" }}
                  className="card mb-4 p-6"
                >
                  <label className="mb-2.5 block font-medium">
                    {field.label}
                    {field.required && <span className="ml-0.5 text-red-500">*</span>}
                  </label>

                  {field.type === "textarea" && (
                    <textarea
                      required={field.required}
                      value={value}
                      onChange={(e) => setField(field.id, e.target.value)}
                      rows={4}
                      placeholder="Type your answer…"
                      className="input-field resize-none"
                    />
                  )}

                  {field.type === "select" && (
                    <select
                      required={field.required}
                      value={value}
                      onChange={(e) => setField(field.id, e.target.value)}
                      className="input-field appearance-none"
                    >
                      <option value="">Select an option…</option>
                      {splitOptions(field.options).map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  )}

                  {(field.type === "radio" || field.type === "checkbox") && (
                    <div className="space-y-2">
                      {splitOptions(field.options).map((o) => {
                        const selected =
                          field.type === "checkbox"
                            ? (value || "").split(",").includes(o)
                            : value === o;
                        return (
                          <label
                            key={o}
                            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-150 cursor-pointer ${
                              selected
                                ? "border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                                : "border-line hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-100/5"
                            }`}
                          >
                            <input
                              type={field.type === "checkbox" ? "checkbox" : "radio"}
                              required={field.required && !value}
                              name={field.id}
                              checked={selected}
                              onChange={() => {
                                if (field.type === "checkbox") {
                                  const current = value ? value.split(",") : [];
                                  const next = selected
                                    ? current.filter((v) => v !== o)
                                    : [...current, o];
                                  setField(field.id, next.join(","));
                                } else {
                                  setField(field.id, o);
                                }
                              }}
                              className="h-4 w-4 accent-indigo-600"
                            />
                            {o}
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {field.type === "file" && (
                    <FileUploadField
                      required={field.required}
                      value={value}
                      onChange={(v) => setField(field.id, v ?? "")}
                    />
                  )}

                  {(field.type === "text" ||
                    field.type === "email" ||
                    field.type === "number" ||
                    field.type === "date") && (
                    <input
                      type={field.type === "date" ? "date" : field.type}
                      required={field.required}
                      value={value}
                      onChange={(e) => setField(field.id, e.target.value)}
                      placeholder={
                        field.type === "email"
                          ? "you@example.com"
                          : field.type === "number"
                            ? "0"
                            : "Your answer…"
                      }
                      className="input-field"
                    />
                  )}
                </motion.div>
              );
            })}

            {error && (
              <p className="mb-4 animate-fade-in rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex w-full items-center justify-center gap-2 !rounded-2xl !py-3.5 disabled:opacity-50"
            >
              {loading ? (
                "Submitting…"
              ) : progress >= 100 ? (
                <>
                  <Sparkles className="h-4 w-4" /> Submit form
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Submit
                </>
              )}
            </button>

            {showBranding && (
              <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
                Powered by <span className="font-semibold text-gray-500 dark:text-gray-400">Formitect</span>
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}