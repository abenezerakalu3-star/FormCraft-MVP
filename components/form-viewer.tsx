"use client";

import { useState } from "react";
import { splitOptions } from "@/lib/fields";

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

export default function FormViewer({ form }: { form: FormData }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function setField(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }));
  }

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
    <div className="min-h-screen bg-[#f8fafc] px-4 py-12">
      <div className="mx-auto max-w-xl">
        {submitted ? (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl">
              ✓
            </div>
            <h1 className="text-xl font-bold">Response submitted</h1>
            <p className="mt-2 text-sm text-gray-500">
              Thank you for your response. It has been recorded.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Submit another response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h1 className="text-2xl font-bold">{form.title}</h1>
              {form.description && (
                <p className="mt-1 text-sm text-gray-500">{form.description}</p>
              )}
            </div>

            {form.fields.map((field) => {
              const value = values[field.id];
              return (
                <div key={field.id} className="rounded-2xl border bg-white p-6 shadow-sm">
                  <label className="mb-2 block font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </label>

                  {field.type === "textarea" && (
                    <textarea
                      required={field.required}
                      value={value}
                      onChange={(e) => setField(field.id, e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                    />
                  )}

                  {field.type === "select" && (
                    <select
                      required={field.required}
                      value={value}
                      onChange={(e) => setField(field.id, e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                    >
                      <option value="">Select an option…</option>
                      {splitOptions(field.options).map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  )}

                  {(field.type === "radio" || field.type === "checkbox") &&
                    splitOptions(field.options).map((o) => {
                      const selected =
                        field.type === "checkbox"
                          ? (value || "").split(",").includes(o)
                          : value === o;
                      return (
                        <label key={o} className="mb-2 flex items-center gap-3 text-sm">
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
                            className="h-4 w-4"
                          />
                          {o}
                        </label>
                      );
                    })}

                  {(field.type === "text" ||
                    field.type === "email" ||
                    field.type === "number" ||
                    field.type === "date") && (
                    <input
                      type={field.type === "date" ? "date" : field.type}
                      required={field.required}
                      value={value}
                      onChange={(e) => setField(field.id, e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                    />
                  )}
                </div>
              );
            })}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Submitting…" : "Submit"}
            </button>

            <p className="text-center text-xs text-gray-400">Powered by FormCraft</p>
          </form>
        )}
      </div>
    </div>
  );
}